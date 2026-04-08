// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

// ===== HAMBURGER =====
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');
const hamburgerBars = hamburger?.querySelectorAll('span') ?? [];

const syncMenuIcon = (open) => {
  if (hamburgerBars.length < 3) return;
  hamburgerBars[0].style.transform = open ? 'translateY(7px) rotate(45deg)' : '';
  hamburgerBars[1].style.opacity = open ? '0' : '1';
  hamburgerBars[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
};

hamburger?.addEventListener('click', toggleMenu);
hamburger?.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') toggleMenu(); });

function toggleMenu() {
  const open = navLinks.classList.toggle('open');
  syncMenuIcon(open);
}

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    syncMenuIcon(false);
  });
});

// ===== TYPING ANIMATION =====
const typingEl = document.getElementById('typingText');
const phrases = [
  'Building scalable backends.',
  'Crafting elegant UIs.',
  'Exploring AI & ML.',
  'Solving hard problems.',
  'Distributed systems nerd.'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  const current = phrases[phraseIndex];

  if (!isDeleting) {
    typingEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    typingEl.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(type, 400);
      return;
    }
  }
  setTimeout(type, isDeleting ? 48 : 72);
}

// Start typing after hero animation
setTimeout(type, 1200);

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== ACTIVE NAV LINK =====
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--primary)' : '';
      });
    }
  });
}, { threshold: 0.45 });

sections.forEach(s => sectionObserver.observe(s));

// ===== CONTACT FORM =====
const form       = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

const setStatus = (msg, color) => {
  if (!formStatus) return;
  formStatus.textContent = msg;
  formStatus.style.color = color;
};

form?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn      = form.querySelector('.btn-send');
  const origHTML = btn.innerHTML;
  const endpoint = form.dataset.formEndpoint?.trim();

  if (!endpoint) { setStatus('Form endpoint missing.', '#ff6b6b'); return; }

  btn.disabled  = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  setStatus('Sending…', 'var(--text-low)');

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) throw new Error();
    btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
    btn.style.background = 'linear-gradient(135deg,#6ee7b7,#059669)';
    setStatus('Message sent — I\'ll get back to you soon!', '#6ee7b7');
    form.reset();
  } catch {
    btn.innerHTML = origHTML;
    setStatus('Something went wrong. Try emailing directly.', '#ff6b6b');
  } finally {
    btn.disabled = false;
    setTimeout(() => {
      btn.innerHTML = origHTML;
      btn.style.background = '';
    }, 3500);
  }
});

// ===== FOOTER YEAR =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
