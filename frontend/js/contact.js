/* Contact Page JavaScript */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initContactFaqs();
});

function initContactForm() {
  const form = document.getElementById('contact-enquiry-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('enq-name').value.trim();
    const email = document.getElementById('enq-email').value.trim();
    const phone = document.getElementById('enq-phone').value.trim();
    const subject = document.getElementById('enq-subject').value;
    const message = document.getElementById('enq-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill all required fields.', 'error');
      return;
    }

    if (message.length < 10) {
      showToast('Message must be at least 10 characters long.', 'error');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    }

    try {
      const res = await API.submitEnquiry({ name, email, phone, subject, message });
      if (res && res.success) {
        showToast(res.message || "Your message has been sent! We'll reply within 24 hours.", 'success');
        form.reset();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
      }
    }
  });
}

function initContactFaqs() {
  const headers = document.querySelectorAll('.contact-faq-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      item.classList.toggle('active');
    });
  });
}
