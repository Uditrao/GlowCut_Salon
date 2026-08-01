/* Appointment Booking Wizard JavaScript */

const state = {
  step: 1,
  services: [],
  stylists: [],
  selectedService: null,
  selectedStylist: 'any',
  selectedDate: '',
  selectedSlot: '',
  appliedPromo: null,
  discountAmount: 0,
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  notes: ''
};

document.addEventListener('DOMContentLoaded', async () => {
  // Set default date to today or tomorrow if past 7 PM
  const now = new Date();
  if (now.getHours() >= 19) {
    now.setDate(now.getDate() + 1);
  }
  // Skip Monday
  if (now.getDay() === 1) {
    now.setDate(now.getDate() + 1);
  }
  state.selectedDate = now.toISOString().split('T')[0];

  await loadInitialData();
  parseURLParams();
  renderStep();
  updateSummaryPanel();
  initEventListeners();
});

async function loadInitialData() {
  try {
    const [svcRes, stRes] = await Promise.all([
      API.getServices(),
      API.getStylists()
    ]);
    if (svcRes && svcRes.data) state.services = svcRes.data;
    if (stRes && stRes.data) state.stylists = stRes.data;
  } catch (err) {
    console.warn('Backend API offline. Using high-quality offline fallback data.', err);
    state.services = [
      { _id: 'haircut_1', name: 'Signature Layer Cut', category: 'Hair', durationMinutes: 30, price: 299, description: 'Premium haircut with shampoo wash.' },
      { _id: 'facial_1', name: 'O3+ Brightening Facial', category: 'Skin', durationMinutes: 45, price: 899, description: 'Anti-tan & glow skin treatment.' },
      { _id: 'nails_1', name: 'Gel Polish & Extension', category: 'Nails', durationMinutes: 60, price: 999, description: 'Deluxe manicure & nail art.' },
      { _id: 'makeup_1', name: 'Party HD Makeup', category: 'Makeup', durationMinutes: 45, price: 1499, description: 'HD camera-ready makeup look.' },
      { _id: 'spa_1', name: 'Argan Hair Spa', category: 'Spa', durationMinutes: 45, price: 699, description: 'Deep scalp nourishment & steam.' },
      { _id: 'mens_1', name: 'Men’s Beard Grooming', category: "Men's", durationMinutes: 30, price: 199, description: 'Beard trim & hot towel shave.' }
    ];
    state.stylists = [
      { _id: 'stylist_1', name: 'Vikram Mehta', specializations: ['Hair Specialist', 'Keratin Art'], rating: 4.9, photo: '' },
      { _id: 'stylist_2', name: 'Priya Sharma', specializations: ['Skin Expert', 'Bridal Glow'], rating: 4.8, photo: '' },
      { _id: 'stylist_3', name: 'Rohan Gupta', specializations: ['Nail Artist', 'Gel Art'], rating: 4.9, photo: '' }
    ];
  }
}

function parseURLParams() {
  const params = new URLSearchParams(window.location.search);
  const serviceId = params.get('service');
  const stylistId = params.get('stylist');
  const promoCode = params.get('promo');

  if (serviceId && state.services.length > 0) {
    const found = state.services.find(s => s._id === serviceId);
    if (found) state.selectedService = found;
  }
  if (stylistId) {
    state.selectedStylist = stylistId;
  }
  if (promoCode) {
    validateAndApplyPromo(promoCode);
  }
}

function renderStep() {
  // Update Indicators
  for (let i = 1; i <= 4; i++) {
    const ind = document.getElementById(`step-ind-${i}`);
    if (ind) {
      ind.classList.remove('active', 'completed');
      if (i < state.step) ind.classList.add('completed');
      if (i === state.step) ind.classList.add('active');
    }

    const stepView = document.getElementById(`step-view-${i}`);
    if (stepView) {
      stepView.style.display = (i === state.step) ? 'block' : 'none';
    }
  }

  if (state.step === 1) renderStep1Services();
  if (state.step === 2) renderStep2StylistAndDate();
  if (state.step === 3) renderStep3Details();
}

/**
 * STEP 1 — Choose Service
 */
function renderStep1Services() {
  const grid = document.getElementById('step1-services-grid');
  if (!grid) return;

  grid.innerHTML = state.services.map(svc => `
    <div class="selectable-card ${state.selectedService && state.selectedService._id === svc._id ? 'selected' : ''}" data-service-id="${svc._id}">
      <div class="fw-bold fs-6 text-dark">${svc.name}</div>
      <div class="text-xs text-muted my-1">${svc.category} • ${svc.durationMinutes} mins</div>
      <div class="fw-bold text-gc-primary">₹${svc.price}</div>
    </div>
  `).join('');

  grid.querySelectorAll('.selectable-card').forEach(card => {
    card.addEventListener('click', () => {
      const sId = card.getAttribute('data-service-id');
      state.selectedService = state.services.find(s => s._id === sId);
      renderStep1Services();
      updateSummaryPanel();
    });
  });
}

/**
 * STEP 2 — Choose Stylist, Date & Time Slots
 */
async function renderStep2StylistAndDate() {
  const stylistGrid = document.getElementById('step2-stylist-grid');
  const dateInput = document.getElementById('booking-date-input');

  if (dateInput) {
    dateInput.value = state.selectedDate;
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  // Render Stylists
  if (stylistGrid) {
    const anyOption = `
      <div class="selectable-card ${state.selectedStylist === 'any' ? 'selected' : ''}" data-stylist-id="any">
        <div class="fw-bold text-dark">Any Available Stylist</div>
        <div class="text-xs text-muted mt-1">Auto-assigns earliest free slot</div>
      </div>
    `;

    const stylistCards = state.stylists.map(st => `
      <div class="selectable-card ${state.selectedStylist === st._id ? 'selected' : ''}" data-stylist-id="${st._id}">
        <div class="fw-bold text-dark">${st.name}</div>
        <div class="text-xs text-gc-primary my-1">${st.specializations ? st.specializations[0] : 'Stylist'}</div>
        <div class="text-xs text-muted">★ ${st.rating || 4.8}</div>
      </div>
    `).join('');

    stylistGrid.innerHTML = anyOption + stylistCards;

    stylistGrid.querySelectorAll('.selectable-card').forEach(card => {
      card.addEventListener('click', async () => {
        state.selectedStylist = card.getAttribute('data-stylist-id');
        state.selectedSlot = ''; // Reset slot when stylist changes
        renderStep2StylistAndDate();
        updateSummaryPanel();
      });
    });
  }

  // Load Slot Availability
  await loadSlots();
}

async function loadSlots() {
  const slotsGrid = document.getElementById('time-slots-grid');
  if (!slotsGrid || !state.selectedDate) return;

  slotsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--gc-text-muted);">Loading time slots...</div>';

  try {
    const res = await API.getStylistAvailability(state.selectedStylist, state.selectedDate);
    if (res && res.data) {
      renderSlotsList(res.data);
    }
  } catch (err) {
    console.warn('Backend API offline. Using fallback time slots.', err);
    const mockSlots = [
      { time: '10:00 AM', available: true },
      { time: '10:30 AM', available: false },
      { time: '11:00 AM', available: true },
      { time: '11:30 AM', available: true },
      { time: '12:00 PM', available: true },
      { time: '12:30 PM', available: false },
      { time: '01:00 PM', available: true },
      { time: '01:30 PM', available: true },
      { time: '02:00 PM', available: true },
      { time: '02:30 PM', available: true },
      { time: '03:00 PM', available: true },
      { time: '03:30 PM', available: true },
      { time: '04:00 PM', available: true },
      { time: '04:30 PM', available: true },
      { time: '05:00 PM', available: true },
      { time: '05:30 PM', available: true }
    ];
    renderSlotsList(mockSlots);
  }
}

function renderSlotsList(slots) {
  const slotsGrid = document.getElementById('time-slots-grid');
  slotsGrid.innerHTML = slots.map(slot => `
    <div class="slot-pill ${!slot.available ? 'booked' : ''} ${state.selectedSlot === slot.time ? 'selected' : ''}" data-slot-time="${slot.time}">
      ${slot.time}
    </div>
  `).join('');

  slotsGrid.querySelectorAll('.slot-pill:not(.booked)').forEach(pill => {
    pill.addEventListener('click', () => {
      slotsGrid.querySelectorAll('.slot-pill').forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      state.selectedSlot = pill.getAttribute('data-slot-time');
      updateSummaryPanel();
    });
  });
}

/**
 * STEP 3 — Customer Details & Form Sync
 */
function renderStep3Details() {
  const nameIn = document.getElementById('cust-name');
  const phoneIn = document.getElementById('cust-phone');
  const emailIn = document.getElementById('cust-email');
  const notesIn = document.getElementById('cust-notes');

  if (nameIn) nameIn.value = state.customerName;
  if (phoneIn) phoneIn.value = state.customerPhone;
  if (emailIn) emailIn.value = state.customerEmail;
  if (notesIn) notesIn.value = state.notes;
}

/**
 * Promo Code Validator inside Booking Form
 */
async function validateAndApplyPromo(code) {
  if (!state.selectedService) return;

  try {
    const res = await API.validatePromo(code, state.selectedService.price);
    if (res && res.valid) {
      state.appliedPromo = res.code;
      state.discountAmount = res.discountAmount;
      showToast(`Promo ${res.code} applied! You saved ₹${res.discountAmount}`, 'success');
      updateSummaryPanel();
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}

/**
 * Real-time Sidebar Booking Summary Panel
 */
function updateSummaryPanel() {
  const svcName = document.getElementById('sum-svc-name');
  const svcPrice = document.getElementById('sum-svc-price');
  const stName = document.getElementById('sum-st-name');
  const dateVal = document.getElementById('sum-date-val');
  const slotVal = document.getElementById('sum-slot-val');
  const promoRow = document.getElementById('sum-promo-row');
  const promoDisc = document.getElementById('sum-promo-disc');
  const totalVal = document.getElementById('sum-total-val');

  if (svcName) svcName.textContent = state.selectedService ? state.selectedService.name : 'None selected';
  if (svcPrice) svcPrice.textContent = state.selectedService ? `₹${state.selectedService.price}` : '₹0';

  if (stName) {
    if (state.selectedStylist === 'any') {
      stName.textContent = 'Any Available Stylist';
    } else {
      const st = state.stylists.find(s => s._id === state.selectedStylist);
      stName.textContent = st ? st.name : 'Selected Stylist';
    }
  }

  if (dateVal) dateVal.textContent = state.selectedDate || 'Not selected';
  if (slotVal) slotVal.textContent = state.selectedSlot || 'Not selected';

  if (state.discountAmount > 0) {
    if (promoRow) promoRow.style.display = 'flex';
    if (promoDisc) promoDisc.textContent = `-₹${state.discountAmount}`;
  } else {
    if (promoRow) promoRow.style.display = 'none';
  }

  const base = state.selectedService ? state.selectedService.price : 0;
  const final = Math.max(0, base - state.discountAmount);
  if (totalVal) totalVal.textContent = `₹${final}`;
}

/**
 * Event Listeners & Wizard Navigation
 */
function initEventListeners() {
  // Step 1 Next
  const btnStep1Next = document.getElementById('btn-step1-next');
  if (btnStep1Next) {
    btnStep1Next.addEventListener('click', () => {
      if (!state.selectedService) {
        showToast('Please select a service before proceeding.', 'error');
        return;
      }
      state.step = 2;
      renderStep();
    });
  }

  // Step 2 Back & Next
  const btnStep2Back = document.getElementById('btn-step2-back');
  const btnStep2Next = document.getElementById('btn-step2-next');

  if (btnStep2Back) {
    btnStep2Back.addEventListener('click', () => {
      state.step = 1;
      renderStep();
    });
  }

  if (btnStep2Next) {
    btnStep2Next.addEventListener('click', () => {
      if (!state.selectedSlot) {
        showToast('Please pick an available time slot for your appointment.', 'error');
        return;
      }
      state.step = 3;
      renderStep();
    });
  }

  // Date Change Listener
  const dateInput = document.getElementById('booking-date-input');
  if (dateInput) {
    dateInput.addEventListener('change', async (e) => {
      state.selectedDate = e.target.value;
      state.selectedSlot = '';
      await loadSlots();
      updateSummaryPanel();
    });
  }

  // Step 3 Back & Final Submit
  const btnStep3Back = document.getElementById('btn-step3-back');
  const formStep3 = document.getElementById('step3-form');
  const applyPromoBtn = document.getElementById('btn-apply-promo');

  if (btnStep3Back) {
    btnStep3Back.addEventListener('click', () => {
      state.step = 2;
      renderStep();
    });
  }

  if (applyPromoBtn) {
    applyPromoBtn.addEventListener('click', () => {
      const codeInput = document.getElementById('booking-promo-code');
      if (codeInput && codeInput.value.trim()) {
        validateAndApplyPromo(codeInput.value.trim());
      }
    });
  }

  if (formStep3) {
    formStep3.addEventListener('submit', async (e) => {
      e.preventDefault();

      state.customerName = document.getElementById('cust-name').value.trim();
      state.customerPhone = document.getElementById('cust-phone').value.trim();
      state.customerEmail = document.getElementById('cust-email').value.trim();
      state.notes = document.getElementById('cust-notes').value.trim();

      if (!state.customerName || !state.customerPhone) {
        showToast('Please enter your full name and 10-digit phone number.', 'error');
        return;
      }

      const submitBtn = document.getElementById('btn-submit-booking');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Issuing Token...';
      }

      try {
        const payload = {
          customerName: state.customerName,
          customerPhone: state.customerPhone,
          customerEmail: state.customerEmail,
          serviceId: state.selectedService._id,
          stylistId: state.selectedStylist,
          date: state.selectedDate,
          timeSlot: state.selectedSlot,
          promoCode: state.appliedPromo,
          notes: state.notes
        };

        const res = await API.bookAppointment(payload);
        if (res && res.success && res.data) {
          state.step = 4;
          renderStep4Confirmation(res.data);
          showToast('Appointment Booked Successfully!', 'success');
        }
      } catch (err) {
        console.warn('Backend API offline. Completing offline fallback booking.', err);
        state.step = 4;
        const mockConfirmation = {
          tokenNumber: 'A-' + String(Math.floor(100 + Math.random() * 900)),
          customerName: state.customerName,
          customerPhone: state.customerPhone,
          serviceId: { name: state.selectedService.name },
          stylistId: { name: state.selectedStylist === 'any' ? 'Any Stylist' : (state.stylists.find(s => s._id === state.selectedStylist)?.name || 'GlowCut Stylist') },
          date: state.selectedDate,
          timeSlot: state.selectedSlot,
          finalPrice: Math.max(0, state.selectedService.price - state.discountAmount)
        };
        renderStep4Confirmation(mockConfirmation);
        showToast('Appointment Booked (Offline Fallback)!', 'success');
      }
    });
  }
}

/**
 * STEP 4 — Confirmation Ticket Display
 */
function renderStep4Confirmation(data) {
  const tokenNumEl = document.getElementById('ticket-token-number');
  const detailsEl = document.getElementById('ticket-details');

  if (tokenNumEl) tokenNumEl.textContent = data.tokenNumber || 'A-001';
  if (detailsEl) {
    detailsEl.innerHTML = `
      <div class="row mb-2">
        <div class="col-4 text-muted text-sm">Customer:</div>
        <div class="col-8 fw-bold text-dark">${data.customerName} (${data.customerPhone})</div>
      </div>
      <div class="row mb-2">
        <div class="col-4 text-muted text-sm">Service:</div>
        <div class="col-8 fw-bold text-dark">${data.serviceId ? data.serviceId.name : 'Salon Service'}</div>
      </div>
      <div class="row mb-2">
        <div class="col-4 text-muted text-sm">Stylist:</div>
        <div class="col-8 fw-bold text-dark">${data.stylistId ? data.stylistId.name : 'GlowCut Stylist'}</div>
      </div>
      <div class="row mb-2">
        <div class="col-4 text-muted text-sm">Date & Slot:</div>
        <div class="col-8 fw-bold text-dark">${data.date} at ${data.timeSlot}</div>
      </div>
      <div class="row">
        <div class="col-4 text-muted text-sm">To Pay at Salon:</div>
        <div class="col-8 fw-bold text-gc-primary fs-5">₹${data.finalPrice}</div>
      </div>
    `;
  }
}
