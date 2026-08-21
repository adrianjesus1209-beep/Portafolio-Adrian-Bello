/* =============================================
   PORTFOLIO JAVASCRIPT
   ============================================= */

/* ---- Calculate Dynamic Stats (Experience & Techs) ---- */
(function calculateDynamicStats() {
  // 1. Dynamic Experience calculation from university start year (2022)
  const START_YEAR = 2022;
  const currentYear = new Date().getFullYear();
  const expYears = Math.max(1, currentYear - START_YEAR); // e.g., 2026 - 2022 = 4

  // Update Experience elements in DOM
  const statExp = document.getElementById('stat-exp');
  if (statExp) statExp.setAttribute('data-target', expYears);

  const heroExpBadge = document.getElementById('hero-exp-badge');
  if (heroExpBadge) heroExpBadge.textContent = `${expYears}+ Años Exp.`;

  const aboutExpNum = document.getElementById('about-exp-num');
  if (aboutExpNum) aboutExpNum.textContent = `${expYears}+`;

  const aboutExpText = document.getElementById('about-exp-text');
  if (aboutExpText) aboutExpText.textContent = `${expYears} años`;

  // 2. Dynamic Technology Count (counts all tech badges listed in the skills section)
  document.addEventListener('DOMContentLoaded', () => {
    const techBadges = document.querySelectorAll('.tech-badge');
    const techCount = techBadges.length > 0 ? techBadges.length : 15;

    const statTechs = document.getElementById('stat-techs');
    if (statTechs) {
      statTechs.setAttribute('data-target', techCount);
      if (statTechs.dataset.counted) {
        statTechs.dataset.counted = '';
        animateCounter(statTechs);
      }
    }

    const heroTechBadge = document.getElementById('hero-tech-badge');
    if (heroTechBadge) heroTechBadge.textContent = `${techCount}+ Tecnologías`;
  });
})();

/* ---- GitHub Stats: fetch real repo count ---- */
(async function fetchGitHubStats() {
  const GITHUB_USER = 'adrianjesus1209-beep';
  const FALLBACK_REPOS = 10;

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}`, {
      headers: { 'Accept': 'application/vnd.github+json' }
    });

    if (!res.ok) throw new Error('GitHub API error');

    const data = await res.json();
    const repoCount = data.public_repos ?? FALLBACK_REPOS;

    // 1. Update the stat counter target in the About section
    const repoStatEl = document.getElementById('stat-repos');
    if (repoStatEl) {
      repoStatEl.setAttribute('data-target', repoCount);
      if (repoStatEl.dataset.counted) {
        repoStatEl.dataset.counted = '';
        animateCounter(repoStatEl);
      }
    }

    // 2. Update the floating badge text in the Hero section
    const heroBadge = document.querySelector('.badge-tl span');
    if (heroBadge) {
      heroBadge.textContent = `${repoCount}+ Proyectos`;
    }

  } catch (err) {
    console.warn('No se pudo obtener el conteo de repos de GitHub:', err);
    const heroBadge = document.querySelector('.badge-tl span');
    if (heroBadge) heroBadge.textContent = `${FALLBACK_REPOS}+ Proyectos`;
    const repoStatEl = document.getElementById('stat-repos');
    if (repoStatEl) repoStatEl.setAttribute('data-target', FALLBACK_REPOS);
  }
})();

/* ---- Navbar scroll effect ---- */
const header = document.getElementById('header');
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Scrolled glass navbar
  if (scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  // Back to top visibility
  if (scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }

  // Active nav link on scroll
  updateActiveNav();
});

/* ---- Active nav on scroll ---- */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 150;

  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const navLink = document.querySelector(`.nav-link[href="#${id}"]`);

    if (navLink) {
      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        navLink.classList.add('active');
      }
    }
  });
}

/* ---- Mobile hamburger menu ---- */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu when a nav link or hire button is clicked
document.querySelectorAll('.nav-link, .btn-hire').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ---- Typed text animation ---- */
const typedEl = document.getElementById('typed-text');
const phrases = [
  'Full Stack Developer',
  'UI/UX Designer',
  'React Specialist',
  'Problem Solver',
  'Tech Enthusiast',
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimeout;

function typeWriter() {
  const currentPhrase = phrases[phraseIndex];
  const displayText = isDeleting
    ? currentPhrase.slice(0, charIndex - 1)
    : currentPhrase.slice(0, charIndex + 1);

  typedEl.textContent = displayText;

  if (!isDeleting) {
    charIndex++;
    if (charIndex > currentPhrase.length) {
      isDeleting = true;
      typingTimeout = setTimeout(typeWriter, 1800);
      return;
    }
  } else {
    charIndex--;
    if (charIndex < 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      charIndex = 0;
      typingTimeout = setTimeout(typeWriter, 400);
      return;
    }
  }

  const speed = isDeleting ? 60 : 100;
  typingTimeout = setTimeout(typeWriter, speed);
}

typeWriter();

/* ---- Particle canvas ---- */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');

  let particles = [];
  let animFrameId;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  resize();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x     = Math.random() * canvas.width;
      this.y     = Math.random() * canvas.height;
      this.size  = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width ||
          this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 168, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  function createParticles() {
    const count = Math.floor((canvas.width * canvas.height) / 12000);
    particles = Array.from({ length: Math.min(count, 80) }, () => new Particle());
  }

  createParticles();

  function connectParticles() {
    const maxDist = 120;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.2;
          ctx.strokeStyle = `rgba(0, 168, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    animFrameId = requestAnimationFrame(animate);
  }

  animate();
})();

/* ---- Scroll reveal ---- */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ---- Counter animation ---- */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 1500;
  const step = target / (duration / 16);
  let current = 0;

  const update = () => {
    current += step;
    if (current < target) {
      el.textContent = Math.floor(current);
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  };

  update();
}

const counterEls = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

counterEls.forEach(el => counterObserver.observe(el));

/* ---- Skill bars animation ---- */
const skillBars = document.querySelectorAll('.skill-bar-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const width = bar.getAttribute('data-width');
      bar.style.width = width + '%';
      skillObserver.unobserve(bar);
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => skillObserver.observe(bar));

/* ---- Project filter ---- */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const show = filter === 'all' || category === filter;

      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

      if (show) {
        card.style.display = '';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = '';
        }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 400);
      }
    });
  });
});


/* ---- Copy Email to Clipboard & Show Toast Modal before redirecting ---- */
const EMAIL_ADDRESS = 'adrianjesus1209@gmail.com';
const toastModal = document.getElementById('toast-modal');
let toastTimeout;

function showToast(message) {
  const toastMsg = document.getElementById('toast-message');
  if (toastMsg) toastMsg.textContent = message;

  if (toastModal) {
    toastModal.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastModal.classList.remove('show');
    }, 2800);
  }
}

// Select all email links in hero and contact section
document.querySelectorAll('a[id="contact-email"], a[id="contact-email-block"], a[id="contact-email-icon"], a[id="social-email"]').forEach(emailBtn => {
  emailBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const redirectUrl = emailBtn.getAttribute('href');

    // 1. Copy email address to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(EMAIL_ADDRESS);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = EMAIL_ADDRESS;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    // 2. Show toast modal notification
    showToast('¡Correo copiado! Redirigiendo...');

    // 3. Delay redirect slightly (1.5 seconds) so the user can read the modal first
    setTimeout(() => {
      window.open(redirectUrl, '_blank');
    }, 1500);
  });
});

