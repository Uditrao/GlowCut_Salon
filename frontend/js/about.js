/* About Us Page JavaScript */

document.addEventListener('DOMContentLoaded', async () => {
  await loadTeamStylists();
});

async function loadTeamStylists() {
  const container = document.getElementById('about-team-grid');
  if (!container) return;

  try {
    const res = await API.getStylists();
    if (res && res.data && res.data.length > 0) {
      renderStylistsList(res.data);
    }
  } catch (err) {
    console.warn('Backend API offline. Using fallback stylist list.', err);
    const mockStylists = [
      { _id: 'stylist_1', name: 'Vikram Mehta', experienceYears: 8, specializations: ['Hair Specialist', 'Keratin Art'], bio: 'Senior master barber with 8+ years experience styling international celebs.', rating: 4.9, photo: '' },
      { _id: 'stylist_2', name: 'Priya Sharma', experienceYears: 6, specializations: ['Skin Expert', 'Bridal Glow'], bio: 'Certified aesthetician expert in organic facials and chemical peels.', rating: 4.8, photo: '' },
      { _id: 'stylist_3', name: 'Rohan Gupta', experienceYears: 5, specializations: ['Nail Artist', 'Gel Art'], bio: 'Lead nail technician specializing in acrylic extensions and custom nail art.', rating: 4.9, photo: '' }
    ];
    renderStylistsList(mockStylists);
  }
}

function renderStylistsList(stylists) {
  const container = document.getElementById('about-team-grid');
  container.innerHTML = stylists.map(st => `
    <div class="col-md-6 col-lg-4">
      <div class="gc-card team-card gc-card-hover h-100 d-flex flex-column justify-content-between text-center bg-white">
        <div>
          <img src="${st.photo || 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=400&q=80'}" class="team-img rounded-circle border-3 border border-warning mx-auto mb-3" style="width: 140px; height: 140px; object-fit: cover;" alt="${st.name}">
          <h3 class="h4 mb-1">${st.name}</h3>
          <span class="badge-gc-gold mb-2">${st.experienceYears || 5}+ Years Experience</span>
          <p class="text-xs text-gc-primary fw-bold my-1">
            ${st.specializations ? st.specializations.join(' • ') : 'Senior Stylist'}
          </p>
          <p class="text-muted text-sm italic mt-2">
            "${st.bio || 'Passionate beauty expert committed to client transformation.'}"
          </p>
        </div>
        <div class="mt-3 border-top pt-3">
          <div class="gc-stars mb-2 fs-5">
            <i class="fa-solid fa-star"></i>
            <span class="text-dark fw-bold text-sm ms-1">${st.rating || 4.8} / 5.0</span>
          </div>
          <a href="book.html?stylist=${st._id}" class="btn-gc-outline btn-sm w-100 py-1 text-center justify-content-center">Book Session</a>
        </div>
      </div>
    </div>
  `).join('');
}
