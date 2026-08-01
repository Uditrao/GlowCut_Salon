/* Home Page Specific JavaScript */

document.addEventListener('DOMContentLoaded', async () => {
  initHeroQueueWidget();
  initStatsCounter();
  initOfferCountdown();
  loadStylistsPreview();
  initInstaLightbox();
});

/**
 * Fetch and update live Queue widget in Hero
 */
async function initHeroQueueWidget() {
  const tokenEl = document.getElementById('widget-token-num');
  const waitEl = document.getElementById('widget-wait-val');
  const refreshBtn = document.getElementById('refresh-widget-btn');

  const updateWidget = async () => {
    try {
      if (refreshBtn) refreshBtn.classList.add('fa-spin');
      const res = await API.getQueueToday();
      
      if (res && res.data) {
        const currentToken = res.data.currentTokenBeingServed || 'None';
        const waitingCount = res.data.peopleWaitingCount || 0;
        const avgDuration = res.data.averageServiceDurationMinutes || 35;
        const estWait = waitingCount * avgDuration;

        if (tokenEl) tokenEl.textContent = currentToken;
        if (waitEl) waitEl.textContent = estWait > 0 ? `${estWait} mins` : 'No Wait';
      }
    } catch (err) {
      if (tokenEl) tokenEl.textContent = 'A-001';
      if (waitEl) waitEl.textContent = '15 mins';
    } finally {
      if (refreshBtn) setTimeout(() => refreshBtn.classList.remove('fa-spin'), 600);
    }
  };

  await updateWidget();

  if (refreshBtn) {
    refreshBtn.addEventListener('click', updateWidget);
  }

  // Poll every 30 seconds on homepage widget
  setInterval(updateWidget, 30000);
}

/**
 * Animated Numbers Counter
 */
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-number');
  let animated = false;

  const runCounter = () => {
    stats.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target') || '0');
      let current = 0;
      const step = Math.ceil(target / 40);

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          stat.textContent = target + (stat.getAttribute('data-suffix') || '');
          clearInterval(timer);
        } else {
          stat.textContent = current + (stat.getAttribute('data-suffix') || '');
        }
      }, 30);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      runCounter();
    }
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.stats-bar');
  if (statsSection) observer.observe(statsSection);
}

/**
 * Offer Countdown Timer
 */
function initOfferCountdown() {
  const daysEl = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minsEl = document.getElementById('timer-mins');

  // Hardcode target date 3 days from now
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 3);

  const updateTimer = () => {
    const now = new Date().getTime();
    const diff = targetDate.getTime() - now;

    if (diff <= 0) return;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
  };

  updateTimer();
  setInterval(updateTimer, 60000);
}

/**
 * Load Stylists Preview
 */
async function loadStylistsPreview() {
  const container = document.getElementById('stylists-preview-container');
  if (!container) return;

  try {
    const res = await API.getStylists();
    if (res && res.data && res.data.length > 0) {
      const stylists = res.data.slice(0, 4);
      container.innerHTML = stylists.map(st => `
        <div class="gc-card stylist-card gc-card-hover">
          <div class="stylist-img-wrapper">
            <img src="${st.photo || 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=400&q=80'}" alt="${st.name}">
          </div>
          <h4>${st.name}</h4>
          <p style="font-size: 0.85rem; color: var(--gc-primary); font-weight: 600;">${st.specializations ? st.specializations.slice(0, 2).join(', ') : 'Stylist'}</p>
          <div class="star-rating mb-4">
            <i class="fa-solid fa-star"></i>
            <span>${st.rating || '4.9'}</span>
          </div>
          <a href="book.html?stylist=${st._id}" class="btn-gc-outline btn-sm" style="width: 100%;">Book Session</a>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('Error loading stylists preview:', err);
  }
}

/**
 * Simple Lightbox for Instagram Grid
 */
function initInstaLightbox() {
  const items = document.querySelectorAll('.insta-item img');
  items.forEach(img => {
    img.addEventListener('click', () => {
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.inset = '0';
      modal.style.backgroundColor = 'rgba(0,0,0,0.85)';
      modal.style.zIndex = '3000';
      modal.style.display = 'flex';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.cursor = 'pointer';

      const fullImg = document.createElement('img');
      fullImg.src = img.src;
      fullImg.style.maxWidth = '90%';
      fullImg.style.maxHeight = '85vh';
      fullImg.style.borderRadius = '12px';
      fullImg.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5)';

      modal.appendChild(fullImg);
      document.body.appendChild(modal);

      modal.addEventListener('click', () => modal.remove());
    });
  });
}
