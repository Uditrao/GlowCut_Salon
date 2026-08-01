/* Admin Panel JavaScript */

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  initLoginForm();
  initLogout();
  initAdminTabs();
});

function checkAuth() {
  const token = localStorage.getItem('glowcut_admin_token');
  const loginBox = document.getElementById('admin-login-wrapper');
  const dashboard = document.getElementById('admin-dashboard-wrapper');
  const nav = document.getElementById('admin-nav');

  if (token) {
    if (loginBox) loginBox.style.display = 'none';
    if (dashboard) dashboard.style.display = 'block';
    if (nav) nav.style.display = 'flex';
    loadDashboardData();
  } else {
    if (loginBox) loginBox.style.display = 'block';
    if (dashboard) dashboard.style.display = 'none';
    if (nav) nav.style.display = 'none';
  }
}

function initLoginForm() {
  const form = document.getElementById('admin-login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value;

    try {
      const res = await API.adminLogin({ email, password });
      if (res && res.token) {
        localStorage.setItem('glowcut_admin_token', res.token);
        showToast('Welcome Admin! Login successful.', 'success');
        checkAuth();
      }
    } catch (err) {
      showToast(err.message || 'Invalid admin credentials.', 'error');
    }
  });
}

function initLogout() {
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('glowcut_admin_token');
      showToast('Logged out successfully.', 'info');
      checkAuth();
    });
  }
}

function initAdminTabs() {
  const tabs = document.querySelectorAll('.admin-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-tab');
      document.querySelectorAll('.admin-tab-content').forEach(c => c.style.display = 'none');
      const targetEl = document.getElementById(`tab-content-${target}`);
      if (targetEl) targetEl.style.display = 'block';
    });
  });
}

async function loadDashboardData() {
  await Promise.all([
    loadAnalyticsMetrics(),
    loadQueueManager(),
    loadAdminAppointments(),
    loadPendingReviews(),
    loadEnquiriesInbox()
  ]);
}

async function loadAnalyticsMetrics() {
  try {
    const res = await API.getAdminAnalytics();
    if (res && res.data) {
      const d = res.data;
      document.getElementById('m-revenue-today').textContent = `₹${d.revenueToday || 0}`;
      document.getElementById('m-queue-len').textContent = d.queueLength || 0;
      document.getElementById('m-bookings-today').textContent = d.bookingsToday || 0;
      document.getElementById('m-avg-rating').textContent = `${d.averageRating || 4.8} ★`;
    }
  } catch (err) {
    console.error('Error loading analytics:', err);
  }
}

async function loadQueueManager() {
  const tokenEl = document.getElementById('admin-now-serving-token');
  const advanceBtn = document.getElementById('btn-advance-queue');

  try {
    const res = await API.getQueueToday();
    if (res && res.data) {
      if (tokenEl) tokenEl.textContent = res.data.currentTokenBeingServed || 'None Serving';
    }
  } catch (err) {
    console.error('Error loading queue manager:', err);
  }

  if (advanceBtn) {
    advanceBtn.onclick = async () => {
      try {
        const res = await API.advanceQueue();
        if (res && res.success) {
          showToast(res.message, 'success');
          loadDashboardData();
        }
      } catch (err) {
        showToast(err.message, 'error');
      }
    };
  }
}

async function loadAdminAppointments() {
  const tbody = document.getElementById('admin-appointments-tbody');
  if (!tbody) return;

  try {
    const res = await API.getAdminAppointments();
    if (res && res.data) {
      tbody.innerHTML = res.data.map(a => `
        <tr>
          <td><strong style="color: var(--color-primary);">${a.tokenNumber}</strong></td>
          <td>${a.customerName}<br><small style="color: #777;">${a.customerPhone}</small></td>
          <td>${a.serviceId ? a.serviceId.name : 'Service'}</td>
          <td>${a.stylistId ? a.stylistId.name : 'Stylist'}</td>
          <td>${a.date} at ${a.timeSlot}</td>
          <td>₹${a.finalPrice}</td>
          <td><span class="badge ${a.status === 'completed' ? 'badge-success' : 'badge-gold'}">${a.status}</span></td>
        </tr>
      `).join('');
    }
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7">Failed to load appointments.</td></tr>`;
  }
}

async function loadPendingReviews() {
  const tbody = document.getElementById('admin-reviews-tbody');
  if (!tbody) return;

  try {
    const res = await API.getPendingReviews();
    if (res && res.data) {
      if (res.data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #777;">No pending reviews awaiting approval.</td></tr>`;
        return;
      }

      tbody.innerHTML = res.data.map(r => `
        <tr>
          <td><strong>${r.customerName}</strong></td>
          <td>${r.rating} ★</td>
          <td>${r.comment}</td>
          <td>${r.serviceAvailed}</td>
          <td>
            <button class="btn btn-primary btn-sm" onclick="approveRev('${r._id}')">Approve</button>
            <button class="btn btn-outline btn-sm" onclick="deleteRev('${r._id}')">Reject</button>
          </td>
        </tr>
      `).join('');
    }
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5">Failed to load pending reviews.</td></tr>`;
  }
}

async function approveRev(id) {
  try {
    const res = await API.approveReview(id);
    if (res && res.success) {
      showToast('Review approved!', 'success');
      loadDashboardData();
    }
  } catch (err) { showToast(err.message, 'error'); }
}

async function deleteRev(id) {
  try {
    const res = await API.deleteReview(id);
    if (res && res.success) {
      showToast('Review deleted.', 'info');
      loadDashboardData();
    }
  } catch (err) { showToast(err.message, 'error'); }
}

async function loadEnquiriesInbox() {
  const tbody = document.getElementById('admin-enquiries-tbody');
  if (!tbody) return;

  try {
    const res = await API.getAdminEnquiries();
    if (res && res.data) {
      if (res.data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #777;">No enquiry messages in inbox.</td></tr>`;
        return;
      }

      tbody.innerHTML = res.data.map(e => `
        <tr style="${!e.isRead ? 'font-weight: 600; background: #FFFDF0;' : ''}">
          <td>${e.name}<br><small>${e.email}</small></td>
          <td>${e.subject}</td>
          <td>${e.message}</td>
          <td>${new Date(e.createdAt).toLocaleDateString()}</td>
          <td>
            ${!e.isRead ? `<button class="btn btn-gold btn-sm" onclick="markRead('${e._id}')">Mark Read</button>` : '<span class="badge badge-success">Read</span>'}
            <button class="btn btn-outline btn-sm" onclick="delEnq('${e._id}')"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
      `).join('');
    }
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5">Failed to load enquiries.</td></tr>`;
  }
}

async function markRead(id) {
  try {
    const res = await API.markEnquiryRead(id);
    if (res && res.success) {
      showToast('Enquiry marked as read.', 'success');
      loadDashboardData();
    }
  } catch (err) { showToast(err.message, 'error'); }
}

async function delEnq(id) {
  try {
    const res = await API.deleteEnquiry(id);
    if (res && res.success) {
      showToast('Enquiry deleted.', 'info');
      loadDashboardData();
    }
  } catch (err) { showToast(err.message, 'error'); }
}
