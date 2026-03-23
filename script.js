/* ── script.js ── Priyanshu Singh Portfolio ─────────────────────────── */

/* ─── CURSOR GLOW ─────────────────────────────────────────────────────── */
const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

/* ─── NAVBAR SCROLL ───────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ─── HAMBURGER MENU ──────────────────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
// Close on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ─── TYPEWRITER ──────────────────────────────────────────────────────── */
const phrases = [
  'AI & Machine Learning Developer',
  'B.Tech Student at LPU',
  'Data Science Enthusiast',
  'Python Developer',
  'Problem Solver',
];
let phraseIdx = 0, charIdx = 0, isDeleting = false;
const typeEl = document.getElementById('typewriter');

function type() {
  const current = phrases[phraseIdx];
  if (isDeleting) {
    typeEl.textContent = current.slice(0, --charIdx);
  } else {
    typeEl.textContent = current.slice(0, ++charIdx);
  }

  let delay = isDeleting ? 50 : 100;

  if (!isDeleting && charIdx === current.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx  = (phraseIdx + 1) % phrases.length;
    delay = 400;
  }
  setTimeout(type, delay);
}
type();

/* ─── PARTICLE CANVAS ─────────────────────────────────────────────────── */
const canvas  = document.getElementById('particleCanvas');
const ctx     = canvas.getContext('2d');
let particles = [];

function resize() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(true); }
  reset(init = false) {
    this.x  = Math.random() * canvas.width;
    this.y  = init ? Math.random() * canvas.height : canvas.height + 10;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = -(Math.random() * 0.5 + 0.2);
    this.r  = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.y < -10) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(108,99,255,${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function animParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animParticles);
}
animParticles();

/* ─── SCROLL REVEAL ───────────────────────────────────────────────────── */
const revealEls = document.querySelectorAll(
  '.glass-card, .section-header, .projects-cta, .about-text, .about-card'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.12 }
);
revealEls.forEach(el => observer.observe(el));

/* ─── STAGGERED CHILDREN REVEAL ──────────────────────────────────────── */
function staggerReveal(containerSel, itemSel, baseDelay = 0) {
  const items = document.querySelectorAll(`${containerSel} ${itemSel}`);
  items.forEach((item, i) => {
    item.style.transitionDelay = `${baseDelay + i * 80}ms`;
  });
}
staggerReveal('.projects-grid', '.project-card');
staggerReveal('.skill-category', '.skill-tag', 50);
staggerReveal('.certs-grid', '.cert-card');
staggerReveal('.training-grid', '.training-card');

/* ─── ACTIVE NAV HIGHLIGHT ────────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ─── SMOOTH STATS COUNTER ────────────────────────────────────────────── */
function animateCounter(el, target, isPlus = false) {
  let current = 0;
  const increment = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current = Math.min(current + increment, target);
    el.textContent = current + (isPlus ? '+' : '');
    if (current >= target) clearInterval(timer);
  }, 30);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(el => {
        const raw = el.textContent;
        const num = parseInt(raw);
        const isPlus = raw.includes('+');
        if (!isNaN(num)) animateCounter(el, num, isPlus);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.about-stats').forEach(el => statsObserver.observe(el));

/* ─── SKILLS FILTER ────────────────────────────────────────────────────── */
const filterBtns = document.querySelectorAll('#skillsFilter .filter-btn');
const skillCards = document.querySelectorAll('#skillsGrid .skill-category');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    skillCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ─── CONTACT FORM ────────────────────────────────────────────────────── */
function handleContactForm(e) {
  e.preventDefault();
  const name    = document.getElementById('form-name').value.trim();
  const email   = document.getElementById('form-email').value.trim();
  const subject = document.getElementById('form-subject').value.trim() || 'Portfolio Contact';
  const msg     = document.getElementById('form-msg').value.trim();
  const status  = document.getElementById('form-status');
  const btn     = document.getElementById('form-submit');

  if (!name || !email || !msg) {
    status.textContent = 'Please fill in all required fields.';
    status.className = 'form-note error';
    return;
  }

  const body = `Name: ${name}%0AEmail: ${email}%0A%0A${msg}`;
  const mailtoUrl = `mailto:priyanshu3303@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
  window.location.href = mailtoUrl;

  btn.textContent = 'Opening email client… ✅';
  btn.disabled = true;
  status.textContent = 'Your default email app will open with the message pre-filled.';
  status.className = 'form-note success';

  setTimeout(() => {
    btn.textContent = 'Send Message ✉️';
    btn.disabled = false;
    status.textContent = '';
    status.className = 'form-note';
    e.target.reset();
  }, 4000);
}

console.log('%c👋 Hi! This portfolio was built with pure HTML/CSS/JS.', 'color:#6c63ff;font-size:14px;font-weight:bold;');
console.log('%c🔗 GitHub: https://github.com/PriyanshuSingh44', 'color:#00d4ff;font-size:12px;');
