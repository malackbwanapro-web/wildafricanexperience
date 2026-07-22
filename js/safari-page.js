// =============================================
// SAFARI PAGE — JavaScript
// =============================================

// ---- Booking Drawer Toggle ----
function toggleBookingForm(packageId) {
  const drawer = document.getElementById('drawer-' + packageId);
  const btn = document.getElementById('book-btn-' + packageId);
  if (!drawer || !btn) return;

  const isOpen = drawer.classList.contains('open');

  // Close all other drawers first (instantly to avoid layout shifts during scroll)
  document.querySelectorAll('.booking-drawer').forEach(d => {
    if (d !== drawer && d.classList.contains('open')) {
      d.style.transition = 'none';
      d.classList.remove('open');
      d.offsetHeight; // Force reflow
      d.style.transition = '';
    }
  });
  document.querySelectorAll('.pkg-book-btn').forEach(b => {
    if (b !== btn) {
      b.classList.remove('open');
      b.querySelector('.btn-label').textContent = 'Book Now';
    }
  });

  if (!isOpen) {
    drawer.classList.add('open');
    btn.classList.add('open');
    btn.querySelector('.btn-label').textContent = 'Close';
    
    // Smooth scroll to the top of the drawer with offset for sticky header
    setTimeout(() => {
      const headerOffset = 100; // 80px header + 20px padding
      const elementPosition = drawer.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }, 150);
  } else {
    drawer.classList.remove('open');
    btn.classList.remove('open');
    btn.querySelector('.btn-label').textContent = 'Book Now';
  }
}

// Bind to window object for reliable execution from inline onclick handlers
window.toggleBookingForm = toggleBookingForm;

// ---- Booking Form Submit ----
document.querySelectorAll('.booking-form').forEach(form => {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const card = this.closest('.booking-form-card');
    const formEl = card.querySelector('.booking-form-body');
    const success = card.querySelector('.booking-success');
    const submitBtn = this.querySelector('button[type="submit"]');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    // Determine package name from card
    const pkgTitle = card.querySelector('.pkg-title, h2, h3')?.textContent?.trim() || 'Safari Package';

    // Compile fields
    const nameVal  = this.querySelector('input[name="name"], input[id*="name"]')?.value || '';
    const emailVal = this.querySelector('input[type="email"]')?.value || '';
    const phoneVal = this.querySelector('input[type="tel"]')?.value || '';
    const guestsVal = this.querySelector('select[name="guests"], select[name="travelers"], select[id*="guests"]')?.value || '';
    const datesVal  = this.querySelector('input[name="dates"], input[id*="dates"]')?.value || '';
    const notesVal  = this.querySelector('textarea')?.value || '';

    // Split name into first and last
    const nameParts = nameVal.trim().split(' ');
    const firstName = nameParts[0] || nameVal;
    const lastName  = nameParts.slice(1).join(' ') || '—';

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', emailVal);
    formData.append('phone', phoneVal);
    formData.append('experience', pkgTitle);
    formData.append('travelers', guestsVal);
    formData.append('details', `Dates: ${datesVal || 'Flexible'}\nNotes: ${notesVal || 'None'}`);
    formData.append('source', 'Package Drawer Form — ' + pkgTitle);

    fetch('/contact.php', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        if (formEl) formEl.style.display = 'none';
        if (success) success.classList.add('visible');
      } else {
        alert(data.message || 'There was an issue sending your booking request. Please reach us via WhatsApp.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Request Reservation';
        }
      }
    })
    .catch(err => {
      console.error('Submission error:', err);
      if (formEl) formEl.style.display = 'none';
      if (success) success.classList.add('visible');
    });
  });
});



// ---- Gallery Lightbox ----
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');

function openLightbox(src, caption) {
  lightboxImg.src = src;
  lightboxCaption.textContent = caption || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  // Clear src after transition to avoid flash
  setTimeout(() => { lightboxImg.src = ''; }, 400);
}

if (lightbox) {
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });
}

// ---- Sticky CTA Bar ----
const stickyCta = document.getElementById('sticky-cta-bar');
if (stickyCta) {
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      stickyCta.classList.add('visible');
      document.body.classList.add('sticky-bar-active');
    } else {
      stickyCta.classList.remove('visible');
      document.body.classList.remove('sticky-bar-active');
    }
  }, { passive: true });
}

// ---- Package Anchor Nav Active State ----
const pkgSections = document.querySelectorAll('.package-section[id]');
const pkgNavPills = document.querySelectorAll('.pkg-nav-pill');
const anchorNav = document.getElementById('pkg-anchor-nav');

if (pkgSections.length && pkgNavPills.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        pkgNavPills.forEach(pill => {
          pill.classList.toggle('active', pill.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.3 });

  pkgSections.forEach(sec => observer.observe(sec));
}

if (anchorNav) {
  window.addEventListener('scroll', () => {
    anchorNav.classList.toggle('elevated', window.scrollY > 50);
  }, { passive: true });
}

// ---- Scroll Reveal — Sections ----
const safariRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

// Standard reveal elements
document.querySelectorAll('.reveal').forEach(el => safariRevealObserver.observe(el));
