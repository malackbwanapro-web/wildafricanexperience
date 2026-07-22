// ===== NAV SCROLL EFFECT =====
const nav = document.getElementById('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > 100) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
});

// ===== MOBILE NAV =====
const mobileToggle = document.getElementById('mobileToggle');
const mobileNav = document.getElementById('mobileNav');

mobileToggle.addEventListener('click', () => {
  mobileToggle.classList.toggle('active');
  mobileNav.classList.toggle('active');
  document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
});

function closeMobileNav() {
  mobileToggle.classList.remove('active');
  mobileNav.classList.remove('active');
  document.body.style.overflow = '';
}


// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ===== CORPORATE RETREAT PRE-SELECT =====
function selectCorporateRetreat() {
  const select = document.getElementById('inquiry-experience');
  if (select) {
    select.value = 'Corporate Retreat';
  }
}
window.selectCorporateRetreat = selectCorporateRetreat;

// ===== TRAVELERS 10+ HELPER TOGGLE =====
document.addEventListener('DOMContentLoaded', () => {
  const travelersSelect = document.getElementById('inquiry-travelers');
  const helper = document.getElementById('travelers-helper');
  if (travelersSelect && helper) {
    travelersSelect.addEventListener('change', function () {
      helper.style.display = this.value === '10+' ? 'block' : 'none';
    });
  }
});

// ===== FORM HANDLING =====
function handleSubmit(e) {
  e.preventDefault();

  const btn = document.getElementById('submitBtn');
  if (btn) {
    btn.textContent = 'Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';
  }

  // Compile form data
  const firstName  = document.getElementById('field-first-name')?.value || '';
  const lastName   = document.getElementById('field-last-name')?.value || '';
  const email      = document.getElementById('field-email')?.value || '';
  const phone      = document.getElementById('field-phone')?.value || '';
  const experience = document.getElementById('inquiry-experience')?.value || '';
  const travelers  = document.getElementById('inquiry-travelers')?.value || '';
  const details    = document.getElementById('inquiry-details')?.value || '';

  const formData = new FormData();
  formData.append('firstName', firstName);
  formData.append('lastName', lastName);
  formData.append('email', email);
  formData.append('phone', phone);
  formData.append('experience', experience);
  formData.append('travelers', travelers);
  formData.append('details', details);
  formData.append('source', 'Homepage Inquiry');

  fetch('/contact.php', {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    const form = document.getElementById('inquiryForm');
    const success = document.getElementById('homepage-success');
    if (data.success) {
      if (form) form.style.display = 'none';
      if (success) success.style.display = 'block';
    } else {
      alert(data.message || 'There was an issue sending your message. Please reach us via WhatsApp.');
      if (btn) {
        btn.textContent = 'Design Your Journey';
        btn.disabled = false;
        btn.style.opacity = '1';
      }
    }
  })
  .catch(err => {
    console.error('Submission error:', err);
    // Fallback display success UI if network error happens on static environments or show alert
    const form = document.getElementById('inquiryForm');
    const success = document.getElementById('homepage-success');
    if (form) form.style.display = 'none';
    if (success) success.style.display = 'block';
  });
}
window.handleSubmit = handleSubmit;


// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== PARALLAX HERO =====
const heroBg = document.querySelector('.hero-bg');
let ticking = false;

window.addEventListener('scroll', () => {
  if (heroBg && !ticking) {
    requestAnimationFrame(() => {
      const scrollY = window.pageYOffset;
      if (scrollY < window.innerHeight) {
        heroBg.style.transform = 'scale(1.05) translateY(' + (scrollY * 0.3) + 'px)';
      }
      ticking = false;
    });
    ticking = true;
  }
});