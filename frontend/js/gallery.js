/* Photo Gallery Page JavaScript */

let allGalleryItems = [];
let activeCategory = 'All';

document.addEventListener('DOMContentLoaded', async () => {
  initCategoryPills();
  await loadGalleryItems();
  initBeforeAfterSliders();
  initUploadForm();
});

function initCategoryPills() {
  const pills = document.querySelectorAll('.gallery-filter-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-category');
      renderGalleryGrid();
    });
  });
}

async function loadGalleryItems() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  grid.innerHTML = Array(6).fill(0).map(() => `
    <div class="col-md-6 col-lg-4">
      <div class="gc-card gc-skeleton" style="height: 250px;"></div>
    </div>
  `).join('');

  try {
    const res = await API.getGallery();
    if (res && res.data) {
      allGalleryItems = res.data;
      renderGalleryGrid();
    }
  } catch (err) {
    console.warn('Backend API offline. Using fallback gallery items.', err);
    allGalleryItems = [
      { imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80', caption: 'Classic Gold Balayage', category: 'Hair Colour', stylistName: 'Vikram Mehta' },
      { imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80', caption: 'Textured Modern Bob Cut', category: 'Haircuts', stylistName: 'Vikram Mehta' },
      { imageUrl: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=600&q=80', caption: 'Glossy Chrome Nails', category: 'Nails', stylistName: 'Rohan Gupta' },
      { imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=600&q=80', caption: 'Caramel Balayage Highlights', category: 'Hair Colour', stylistName: 'Vikram Mehta' },
      { imageUrl: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=600&q=80', caption: 'Bridal HD Airbrush Pack', category: 'Bridal', stylistName: 'Priya Sharma' },
      { imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80', caption: 'Luxury Ambience Lounge', category: 'Salon Interior', stylistName: 'Management' }
    ];
    renderGalleryGrid();
  }
}

function renderGalleryGrid() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  const filtered = activeCategory === 'All'
    ? allGalleryItems
    : allGalleryItems.filter(item => item.category === activeCategory);

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="col-12 text-center text-muted py-5">No gallery items in this category yet.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <div class="col-md-6 col-lg-4">
      <div class="gallery-card gc-card p-0 overflow-hidden position-relative" data-img="${item.imageUrl}" data-caption="${item.caption || ''}" data-stylist="${item.stylistName || ''}">
        <img src="${item.imageUrl}" alt="${item.caption || 'Salon Transformation'}" class="w-100 object-fit-cover" style="height: 250px;">
        <div class="gallery-card-overlay">
          <span class="badge-gc-gold mb-2">${item.category}</span>
          <h4 class="text-white h5 m-0">${item.caption || 'Hair & Beauty Craft'}</h4>
          <p class="text-white-50 text-xs mt-1 mb-0">By ${item.stylistName || 'GlowCut Stylist'}</p>
        </div>
      </div>
    </div>
  `).join('');

  // Attach Lightbox event to cards
  grid.querySelectorAll('.gallery-card').forEach(card => {
    card.addEventListener('click', () => {
      const src = card.getAttribute('data-img');
      const caption = card.getAttribute('data-caption');
      const stylist = card.getAttribute('data-stylist');
      openLightbox(src, caption, stylist);
    });
  });
}

function openLightbox(src, caption, stylist) {
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.inset = '0';
  modal.style.backgroundColor = 'rgba(0,0,0,0.95)';
  modal.style.zIndex = '3000';
  modal.style.display = 'flex';
  modal.style.flexDirection = 'column';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.padding = '20px';
  modal.style.cursor = 'pointer';

  modal.innerHTML = `
    <div style="position: relative; max-width: 900px; text-align: center;" onclick="event.stopPropagation()">
      <button id="close-lightbox" style="position: absolute; top: -45px; right: 0; background: none; border: none; color: #fff; font-size: 2.5rem; cursor: pointer;">&times;</button>
      <img src="${src}" style="max-width: 100%; max-height: 75vh; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
      <h3 style="color: #fff; margin-top: 16px;">${caption}</h3>
      <p style="color: var(--gc-accent); margin-top: 4px;">Stylist: ${stylist}</p>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener('click', () => modal.remove());
  const closeBtn = modal.querySelector('#close-lightbox');
  if (closeBtn) closeBtn.addEventListener('click', () => modal.remove());
}

/**
 * Before & After Drag Slider Interaction
 */
function initBeforeAfterSliders() {
  const containers = document.querySelectorAll('.ba-slider-container');
  containers.forEach(container => {
    const beforeImg = container.querySelector('.ba-img-before');
    const handle = container.querySelector('.ba-handle');

    if (!beforeImg || !handle) return;

    let isDragging = false;

    const updateSliderPosition = (clientX) => {
      const rect = container.getBoundingClientRect();
      let x = clientX - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      const percentage = (x / rect.width) * 100;

      beforeImg.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    };

    handle.addEventListener('mousedown', () => isDragging = true);
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mousemove', (e) => {
      if (isDragging) updateSliderPosition(e.clientX);
    });

    // Touch support
    handle.addEventListener('touchstart', () => isDragging = true);
    window.addEventListener('touchend', () => isDragging = false);
    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches[0]) updateSliderPosition(e.touches[0].clientX);
    });
  });
}

function initUploadForm() {
  const form = document.getElementById('user-gallery-upload-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('user-photo-file');
    if (!fileInput || !fileInput.files[0]) {
      showToast('Please select an image photo file to upload.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    formData.append('caption', document.getElementById('user-photo-caption').value.trim() || 'Customer Look');
    formData.append('category', document.getElementById('user-photo-category').value);
    formData.append('stylistName', document.getElementById('user-photo-stylist').value.trim() || 'GlowCut Stylist');

    try {
      const res = await API.uploadCustomerGallery(formData);
      if (res && res.success) {
        showToast('Photo submitted! It will appear in gallery once reviewed by admin.', 'success');
        form.reset();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}
