/* Centralized API Utility & Global Helper Functions for GlowCut Salon */

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Universal Fetch Wrapper
 */
async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem('glowcut_admin_token');
  const headers = options.headers || {};

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Don't set Content-Type if sending FormData (Multer upload)
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || 'Something went wrong. Please try again.';
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error(`[API Fetch Error] ${endpoint}:`, error.message);
    throw error;
  }
}

/**
 * Toast Notification System
 */
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconClass = type === 'success'
    ? 'fa-check-circle'
    : type === 'error'
    ? 'fa-exclamation-circle'
    : 'fa-info-circle';

  toast.innerHTML = `
    <i class="fa-solid ${iconClass}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/**
 * Specific API Service Calls
 */
const API = {
  // Services
  getServices: (category) => fetchAPI(`/services${category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : ''}`),
  getServiceById: (id) => fetchAPI(`/services/${id}`),

  // Stylists
  getStylists: () => fetchAPI('/stylists'),
  getStylistAvailability: (id, date) => fetchAPI(`/stylists/${id}/availability?date=${date}`),

  // Appointments
  bookAppointment: (data) => fetchAPI('/appointments', { method: 'POST', body: JSON.stringify(data) }),
  getAppointmentById: (id) => fetchAPI(`/appointments/${id}`),

  // Queue
  getQueueToday: () => fetchAPI('/queue/today'),
  lookupToken: (tokenNumber) => fetchAPI(`/queue/token/${tokenNumber}`),

  // Packages & Promos
  getPackages: (type) => fetchAPI(`/packages${type ? `?type=${type}` : ''}`),
  validatePromo: (code, orderValue) => fetchAPI('/promo/validate', { method: 'POST', body: JSON.stringify({ code, orderValue }) }),

  // Reviews
  getReviews: (params = '') => fetchAPI(`/reviews${params}`),
  getReviewSummary: () => fetchAPI('/reviews/summary'),
  submitReview: (data) => fetchAPI('/reviews', { method: 'POST', body: JSON.stringify(data) }),

  // AI Advisor
  analyzeHairstyle: (formData) => fetchAPI('/ai/hairstyle', { method: 'POST', body: formData }),

  // Gallery
  getGallery: (category) => fetchAPI(`/gallery${category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : ''}`),
  uploadCustomerGallery: (formData) => fetchAPI('/gallery', { method: 'POST', body: formData }),

  // Contact / Enquiry
  submitEnquiry: (data) => fetchAPI('/enquiry', { method: 'POST', body: JSON.stringify(data) }),

  // Admin APIs
  adminLogin: (credentials) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getAdminAnalytics: () => fetchAPI('/admin/analytics'),
  getAdminAppointments: (query = '') => fetchAPI(`/admin/appointments${query}`),
  advanceQueue: () => fetchAPI('/queue/advance', { method: 'PATCH' }),
  getPendingReviews: () => fetchAPI('/admin/reviews/pending'),
  approveReview: (id) => fetchAPI(`/admin/reviews/${id}/approve`, { method: 'PATCH' }),
  deleteReview: (id) => fetchAPI(`/admin/reviews/${id}`, { method: 'DELETE' }),
  getAdminEnquiries: () => fetchAPI('/admin/enquiries'),
  markEnquiryRead: (id) => fetchAPI(`/admin/enquiries/${id}/read`, { method: 'PATCH' }),
  deleteEnquiry: (id) => fetchAPI(`/admin/enquiries/${id}`, { method: 'DELETE' })
};

/**
 * Mobile Navbar Hamburger Toggle Setup
 */
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const closeBtn = document.querySelector('.close-drawer-btn');

  if (toggleBtn && drawer) {
    let overlay = document.querySelector('.drawer-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'drawer-overlay';
      document.body.appendChild(overlay);
    }

    const openDrawer = () => {
      drawer.classList.add('open');
      overlay.classList.add('active');
    };

    const closeDrawer = () => {
      drawer.classList.remove('open');
      overlay.classList.remove('active');
    };

    toggleBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);
  }

  // Sticky Navbar Scroll Effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }
});
