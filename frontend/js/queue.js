/* Live Queue Status Page JavaScript */

let pollingInterval = null;

document.addEventListener('DOMContentLoaded', async () => {
  await fetchAndUpdateQueue();
  initTokenLookup();
  startQueuePolling();
});

async function fetchAndUpdateQueue() {
  const syncIcon = document.getElementById('sync-icon');
  if (syncIcon) syncIcon.classList.add('fa-spin');

  try {
    const res = await API.getQueueToday();
    if (res && res.data) {
      renderNowServingCard(res.data);
      renderQueueStats(res.data);
      renderQueueTable(res.data.queueList || []);
    }
  } catch (err) {
    console.warn('Backend API offline. Displaying fallback queue simulation.', err);
    // Simulating dynamic floor queue
    const mockData = {
      currentTokenBeingServed: 'A-005',
      peopleWaitingCount: 3,
      averageServiceDurationMinutes: 25,
      totalTokensIssued: 8,
      queueList: [
        { tokenNumber: 'A-005', customerName: 'Sanjana Malhotra', serviceName: 'Signature Layer Cut', stylistName: 'Vikram Mehta', timeSlot: '11:00 AM', status: 'in-progress' },
        { tokenNumber: 'A-006', customerName: 'Rahul Sharma', serviceName: 'Argan Hair Spa', stylistName: 'Vikram Mehta', timeSlot: '11:30 AM', status: 'confirmed' },
        { tokenNumber: 'A-007', customerName: 'Aman Varma', serviceName: 'Men’s Beard Grooming', stylistName: 'Rohan Gupta', timeSlot: '12:00 PM', status: 'confirmed' },
        { tokenNumber: 'A-008', customerName: 'Neha Sen', serviceName: 'O3+ Brightening Facial', stylistName: 'Priya Sharma', timeSlot: '12:30 PM', status: 'confirmed' }
      ]
    };
    renderNowServingCard(mockData);
    renderQueueStats(mockData);
    renderQueueTable(mockData.queueList);
  } finally {
    if (syncIcon) setTimeout(() => syncIcon.classList.remove('fa-spin'), 500);
  }
}

function renderNowServingCard(data) {
  const tokenEl = document.getElementById('now-serving-token');
  const detailsEl = document.getElementById('now-serving-details');

  if (tokenEl) {
    tokenEl.textContent = data.currentTokenBeingServed || 'None Serving';
  }

  if (detailsEl) {
    if (data.currentTokenBeingServed && data.queueList.length > 0) {
      const current = data.queueList.find(q => q.tokenNumber === data.currentTokenBeingServed);
      if (current) {
        detailsEl.textContent = `Performing: ${current.serviceName} with ${current.stylistName}`;
      } else {
        detailsEl.textContent = 'Salon floor active. Next token calling soon.';
      }
    } else {
      detailsEl.textContent = 'Queue is clear. Book online or walk in for instant seating!';
    }
  }
}

function renderQueueStats(data) {
  const waitingCountEl = document.getElementById('stat-waiting-count');
  const estWaitEl = document.getElementById('stat-est-wait');
  const totalIssuedEl = document.getElementById('stat-total-issued');

  if (waitingCountEl) waitingCountEl.textContent = data.peopleWaitingCount || 0;
  if (estWaitEl) {
    const totalEst = (data.peopleWaitingCount || 0) * (data.averageServiceDurationMinutes || 35);
    estWaitEl.textContent = totalEst > 0 ? `${totalEst} mins` : 'No Wait';
  }
  if (totalIssuedEl) totalIssuedEl.textContent = data.totalTokensIssued || 0;
}

function renderQueueTable(list) {
  const tbody = document.getElementById('queue-table-body');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No active tokens in queue today.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(item => {
    let badgeHtml = '';

    if (item.status === 'in-progress') {
      badgeHtml = '<span class="badge bg-success py-1 px-3">In Progress</span>';
    } else if (item.status === 'confirmed') {
      badgeHtml = '<span class="badge-gc-gold py-1 px-3">Waiting</span>';
    } else if (item.status === 'completed') {
      badgeHtml = '<span class="badge bg-secondary py-1 px-3">Done</span>';
    } else {
      badgeHtml = `<span class="badge bg-info py-1 px-3">${item.status}</span>`;
    }

    return `
      <tr class="${item.status === 'in-progress' ? 'table-warningServing' : ''}">
        <td class="fw-bold text-gc-primary font-monospace fs-5">${item.tokenNumber}</td>
        <td>${item.customerName}</td>
        <td>${item.serviceName}</td>
        <td>${item.stylistName}</td>
        <td>${item.timeSlot}</td>
        <td>${badgeHtml}</td>
      </tr>
    `;
  }).join('');
}

function initTokenLookup() {
  const form = document.getElementById('lookup-form');
  const resultContainer = document.getElementById('lookup-result');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const tokenInput = document.getElementById('lookup-token-input').value.trim();

      if (!tokenInput) {
        showToast('Please enter your Token Number (e.g. A-007)', 'error');
        return;
      }

      try {
        const res = await API.lookupToken(tokenInput);
        if (res && res.data) {
          showLookupResult(res.data);
        }
      } catch (err) {
        console.warn('Backend API offline. Searching offline fallback queue simulation.');
        // Lookup simulation
        const mockConfirmation = {
          tokenNumber: tokenInput.toUpperCase(),
          status: tokenInput.toUpperCase() === 'A-005' ? 'in-progress' : 'confirmed',
          positionInQueue: 2,
          peopleAhead: 1,
          estimatedWaitMinutes: 30
        };
        showLookupResult(mockConfirmation);
      }
    });
  }
}

function showLookupResult(data) {
  const resultContainer = document.getElementById('lookup-result');
  let message = '';
  let alertClass = 'alert-info';

  if (data.status === 'in-progress') {
    alertClass = 'alert-success';
    message = `🎉 Token <strong>${data.tokenNumber}</strong> is currently <strong>IN PROGRESS</strong>! Please enter the styling station.`;
  } else if (data.status === 'completed') {
    alertClass = 'alert-secondary';
    message = `✅ Token <strong>${data.tokenNumber}</strong> service is completed. Thank you for visiting!`;
  } else if (data.positionInQueue > 0) {
    alertClass = 'alert-warning';
    message = `📍 Token <strong>${data.tokenNumber}</strong>: You are <strong>#${data.positionInQueue}</strong> in queue (${data.peopleAhead} people ahead). Estimated wait: <strong>~${data.estimatedWaitMinutes} mins</strong>.`;
  } else {
    message = `Token <strong>${data.tokenNumber}</strong> booking status: ${data.status}`;
  }

  resultContainer.innerHTML = `
    <div class="alert ${alertClass} text-center py-3 m-0 shadow-sm">
      ${message}
    </div>
  `;
}

function startQueuePolling() {
  // Automatic polling every 10 seconds as specified in blueprint
  pollingInterval = setInterval(fetchAndUpdateQueue, 10000);
}
