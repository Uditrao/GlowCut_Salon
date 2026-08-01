/* Services & Pricing Page JavaScript */

let allServices = [];
let currentCategory = 'All';
let sortAsc = true;

document.addEventListener('DOMContentLoaded', async () => {
  // Check hash in URL (e.g., #skin)
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const categoryMap = {
      hair: 'Hair',
      skin: 'Skin',
      nails: 'Nails',
      makeup: 'Makeup',
      spa: 'Spa',
      mens: "Men's"
    };
    if (categoryMap[hash.toLowerCase()]) {
      currentCategory = categoryMap[hash.toLowerCase()];
    }
  }

  initTabButtons();
  await loadServices();
  initTableSorting();
});

function initTabButtons() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    if (tab.getAttribute('data-category') === currentCategory) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }

    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.getAttribute('data-category');
      renderServicesGrid();
      renderPricingTable();
    });
  });
}

async function loadServices() {
  const container = document.getElementById('services-grid');
  if (!container) return;

  // Render skeleton loaders
  container.innerHTML = Array(6).fill(0).map(() => `
    <div class="col-md-4 col-sm-6">
      <div class="gc-card gc-skeleton" style="height: 220px;"></div>
    </div>
  `).join('');

  try {
    const res = await API.getServices();
    if (res && res.data) {
      allServices = res.data;
      renderServicesGrid();
      renderPricingTable();
    }
  } catch (err) {
    container.innerHTML = `<div class="col-12 text-center text-danger py-5">Failed to load services. Please check back soon.</div>`;
  }
}

function renderServicesGrid() {
  const container = document.getElementById('services-grid');
  if (!container) return;

  const filtered = currentCategory === 'All'
    ? allServices
    : allServices.filter(s => s.category === currentCategory);

  if (filtered.length === 0) {
    container.innerHTML = `<div class="col-12 text-center text-muted py-5">No services found in this category.</div>`;
    return;
  }

  container.innerHTML = filtered.map(svc => `
    <div class="col-md-4 col-sm-6">
      <div class="gc-card gc-card-hover h-100 d-flex flex-column justify-content-between">
        <div>
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="badge-gc-gold">${svc.category}</span>
            <div class="text-muted text-xs"><i class="fa-regular fa-clock"></i> ${svc.durationMinutes} mins</div>
          </div>
          <h3 class="h4 mb-2">${svc.name}</h3>
          <p class="text-muted text-sm mb-4">${svc.description || 'Professional styling & care.'}</p>
        </div>
        <div>
          <div class="d-flex justify-content-between align-items-center">
            <div class="fs-4 fw-bold text-gc-primary">₹${svc.price}</div>
            <a href="book.html?service=${svc._id}" class="btn-gc-primary btn-sm">Book Service</a>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderPricingTable() {
  const tbody = document.getElementById('pricing-table-body');
  if (!tbody) return;

  const filtered = currentCategory === 'All'
    ? allServices
    : allServices.filter(s => s.category === currentCategory);

  tbody.innerHTML = filtered.map(svc => `
    <tr>
      <td><span class="badge-gc-primary">${svc.category}</span></td>
      <td class="fw-bold text-dark">${svc.name}</td>
      <td>${svc.durationMinutes} mins</td>
      <td class="fw-bold text-gc-primary">₹${svc.price}</td>
      <td><a href="book.html?service=${svc._id}" class="btn-gc-outline btn-sm py-1 px-3">Book</a></td>
    </tr>
  `).join('');
}

function initTableSorting() {
  const thList = document.querySelectorAll('.pricing-table th[data-sort]');
  thList.forEach(th => {
    th.addEventListener('click', () => {
      const field = th.getAttribute('data-sort');
      sortAsc = !sortAsc;

      allServices.sort((a, b) => {
        let valA = a[field];
        let valB = b[field];

        if (typeof valA === 'string') {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortAsc ? valA - valB : valB - valA;
      });

      renderPricingTable();
    });
  });
}
