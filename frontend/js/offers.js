/* Offers & Packages Page JavaScript */

document.addEventListener('DOMContentLoaded', async () => {
  await loadComboPackages();
  await loadMembershipPlans();
  initPromoValidator();
  initCopyButtons();
});

async function loadComboPackages() {
  const container = document.getElementById('combos-container');
  if (!container) return;

  try {
    const res = await API.getPackages('combo');
    if (res && res.data && res.data.length > 0) {
      container.innerHTML = res.data.map(pkg => `
        <div class="col-lg-6">
          <div class="gc-card combo-card gc-card-hover h-100 d-flex flex-column justify-content-between position-relative ${pkg.badge === 'Popular' ? 'border-primary' : ''}">
            ${pkg.badge ? `<span class="badge-gc-gold position-absolute" style="top: 16px; right: 16px;">${pkg.badge}</span>` : ''}
            <div>
              <h3 class="h4 mb-2">${pkg.name}</h3>
              <p class="text-muted text-sm">${pkg.description || ''}</p>
              <ul class="includes-list my-3">
                ${pkg.includedServices ? pkg.includedServices.map(s => `<li class="text-sm mb-1 text-dark"><i class="fa-solid fa-check text-success me-2"></i> ${s}</li>`).join('') : ''}
              </ul>
            </div>
            <div class="border-top pt-3 mt-3 d-flex justify-content-between align-items-center">
              <div>
                <span class="text-decoration-line-through text-muted text-xs">₹${pkg.originalPrice}</span>
                <div class="fs-4 fw-bold text-gc-primary">₹${pkg.discountedPrice}</div>
              </div>
              <a href="book.html?package=${pkg._id}" class="btn-gc-primary btn-sm">Book Combo</a>
            </div>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('Error loading combos:', err);
  }
}

async function loadMembershipPlans() {
  const container = document.getElementById('memberships-container');
  if (!container) return;

  try {
    const res = await API.getPackages('membership');
    if (res && res.data && res.data.length > 0) {
      container.innerHTML = res.data.map(plan => `
        <div class="col-md-4 col-sm-6">
          <div class="gc-card membership-card gc-card-hover text-center h-100 d-flex flex-column justify-content-between ${plan.name.includes('Gold') ? 'border-warning shadow' : ''}" style="${plan.name.includes('Gold') ? 'background-color: #FFFDF7;' : ''}">
            <div>
              ${plan.badge ? `<span class="badge-gc-gold mb-3">${plan.badge}</span>` : ''}
              <h3 class="h4 mb-2">${plan.name}</h3>
              <div class="fs-2 fw-bold text-gc-primary my-3">₹${plan.discountedPrice}<span class="text-muted fs-6 fw-normal">/month</span></div>
              <ul class="includes-list text-start my-4 list-unstyled">
                ${plan.includedServices ? plan.includedServices.map(b => `<li class="text-sm mb-2 text-dark"><i class="fa-solid fa-circle-check text-gc-gold me-2"></i> ${b}</li>`).join('') : ''}
              </ul>
            </div>
            <a href="book.html?membership=${plan._id}" class="btn-gc-primary btn-sm w-100 ${plan.name.includes('Gold') ? 'btn-gc-gold' : 'btn-gc-primary'}" style="width: 100%;">Select ${plan.name}</a>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('Error loading memberships:', err);
  }
}

function initPromoValidator() {
  const form = document.getElementById('promo-validator-form');
  const resultDiv = document.getElementById('promo-result');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const code = document.getElementById('validate-code-input').value.trim();
      const val = document.getElementById('validate-order-val').value || 500;

      if (!code) {
        showToast('Please enter a promo code', 'error');
        return;
      }

      try {
        const res = await API.validatePromo(code, val);
        if (res && res.valid) {
          resultDiv.innerHTML = `
            <div class="alert alert-success d-flex align-items-center justify-content-center gap-2 py-3">
              <i class="fa-solid fa-circle-check"></i> <span>Code ${res.code} Applied! You save ₹${res.discountAmount}. Final Price: ₹${res.finalPrice}</span>
            </div>
          `;
          showToast(`Promo ${res.code} is valid!`, 'success');
        }
      } catch (err) {
        resultDiv.innerHTML = `
          <div class="alert alert-danger d-flex align-items-center justify-content-center gap-2 py-3">
            <i class="fa-solid fa-circle-xmark"></i> <span>${err.message}</span>
          </div>
        `;
        showToast(err.message, 'error');
      }
    });
  }
}

function initCopyButtons() {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('copy-promo-btn') || e.target.closest('.copy-promo-btn')) {
      const btn = e.target.classList.contains('copy-promo-btn') ? e.target : e.target.closest('.copy-promo-btn');
      const code = btn.getAttribute('data-code');
      if (code) {
        navigator.clipboard.writeText(code);
        showToast(`Promo Code ${code} copied to clipboard!`, 'info');
      }
    }
  });
}
