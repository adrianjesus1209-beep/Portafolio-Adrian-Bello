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

/* ---- GitHub Repositories Loader & Dynamic Projects Grid ---- */
(async function fetchAndRenderGitHubProjects() {
  const GITHUB_USER = 'adrianjesus1209-beep';
  const projectsGrid = document.getElementById('projects-grid');
  if (!projectsGrid) return;

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=pushed&per_page=30`, {
      headers: { 'Accept': 'application/vnd.github+json' }
    });

    if (!res.ok) throw new Error(`GitHub API Error: ${res.status}`);

    const repos = await res.json();
    
    // Filter out profile repository and forks if needed
    const filteredRepos = repos.filter(repo => repo.name !== GITHUB_USER && !repo.fork);

    if (filteredRepos.length === 0) return;

    // Helper: Calculate status based on last pushed_at date and flags
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const oneHundredEightyDaysAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

    const getStatusInfo = (repo) => {
      if (repo.archived) {
        return { label: 'Archivado', class: 'archived', icon: '<i class="bx bx-archive"></i>' };
      }
      const pushedDate = new Date(repo.pushed_at || repo.updated_at);
      if (pushedDate >= thirtyDaysAgo) {
        return { label: 'En desarrollo', class: 'in-dev', icon: '<span class="status-dot"></span>' };
      } else if (pushedDate >= oneHundredEightyDaysAgo) {
        return { label: 'Activo', class: 'active', icon: '<i class="bx bx-check-circle"></i>' };
      } else {
        return { label: 'Completado', class: 'active', icon: '<i class="bx bx-check-double"></i>' };
      }
    };

    // Helper: Determine category (web, app, other)
    const getCategory = (repo) => {
      const lang = (repo.language || '').toLowerCase();
      const name = repo.name.toLowerCase();
      const topics = (repo.topics || []).join(' ').toLowerCase();

      if (lang === 'kotlin' || lang === 'java' || lang === 'swift' || name.includes('app') || name.includes('reproductor') || topics.includes('android') || topics.includes('mobile')) {
        return 'app';
      }
      if (lang === 'javascript' || lang === 'typescript' || lang === 'php' || lang === 'html' || lang === 'css' || lang === 'vue' || lang === 'blade') {
        return 'web';
      }
      return 'other';
    };

    // Helper: Language Icon & Gradient class
    const getLangInfo = (language) => {
      const lang = (language || '').toLowerCase();
      switch(lang) {
        case 'kotlin':
          return { bg: 'lang-bg-kotlin', icon: '<i class="devicon-kotlin-plain"></i>' };
        case 'javascript':
          return { bg: 'lang-bg-javascript', icon: '<i class="fa-brands fa-js"></i>' };
        case 'php':
          return { bg: 'lang-bg-php', icon: '<i class="fa-brands fa-php"></i>' };
        case 'python':
          return { bg: 'lang-bg-python', icon: '<i class="fa-brands fa-python"></i>' };
        case 'html':
          return { bg: 'lang-bg-html', icon: '<i class="fa-brands fa-html5"></i>' };
        case 'css':
          return { bg: 'lang-bg-css', icon: '<i class="fa-brands fa-css3-alt"></i>' };
        case 'java':
          return { bg: 'lang-bg-java', icon: '<i class="fa-brands fa-java"></i>' };
        default:
          return { bg: 'lang-bg-default', icon: '<i class="bx bx-code-alt"></i>' };
      }
    };

    // Helper: Format Repo Name nicely
    const formatRepoName = (name) => {
      return name
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
    };

    // Helper: Format Date
    const formatDate = (dateString) => {
      const d = new Date(dateString);
      return d.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
    };

    // Render cards dynamically
    projectsGrid.innerHTML = filteredRepos.map(repo => {
      const status = getStatusInfo(repo);
      const category = getCategory(repo);
      const langInfo = getLangInfo(repo.language);
      const title = formatRepoName(repo.name);
      const description = repo.description || `Proyecto de ${repo.language || 'desarrollo'} publicado en GitHub. Arquitectura limpia y código modular.`;
      const primaryTag = repo.language || 'Software';
      const pushedDateStr = formatDate(repo.pushed_at || repo.updated_at);
      const demoUrl = repo.homepage && repo.homepage.trim() !== '' ? repo.homepage : repo.html_url;
      const stars = repo.stargazers_count || 0;

      return `
        <article class="project-card reveal visible" data-category="${category}">
          <div class="project-img ${langInfo.bg}">
            <div class="status-badge ${status.class}">
              ${status.icon}
              <span>${status.label}</span>
            </div>
            <div class="repo-header-art">
              ${langInfo.icon}
            </div>
            <div class="project-overlay">
              <div class="project-links">
                <a href="${demoUrl}" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="Ver demo o repositorio" title="${repo.homepage ? 'Ver Demo en Vivo' : 'Ver Repositorio'}"><i class="bx ${repo.homepage ? 'bx-link-external' : 'bx-show'}"></i></a>
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="Ver código en GitHub" title="Ver Código en GitHub"><i class="bx bxl-github"></i></a>
              </div>
            </div>
          </div>
          <div class="project-info">
            <div class="project-tags">
              <span class="tag">${primaryTag}</span>
              ${repo.topics ? repo.topics.slice(0, 2).map(t => `<span class="tag">${t}</span>`).join('') : ''}
            </div>
            <h3>${title}</h3>
            <p>${description}</p>
            <div class="repo-meta">
              <span class="repo-meta-item" title="Estrellas"><i class="bx bx-star"></i> ${stars}</span>
              <span class="repo-meta-item" title="Última actualización"><i class="bx bx-time"></i> ${pushedDateStr}</span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Re-bind filter events and touch events for dynamically injected cards
    bindProjectFilters();
    bindTouchEvents();

  } catch (err) {
    console.warn('Error al cargar repositorios de GitHub:', err);
    bindProjectFilters();
  }
})();

function bindProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.onclick = () => {
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
    };
  });
}

function bindTouchEvents() {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('touchstart', (e) => {
      if (!e.target.closest('.project-link')) {
        const isActive = card.classList.contains('touch-active');
        cards.forEach(c => c.classList.remove('touch-active'));
        if (!isActive) {
          card.classList.add('touch-active');
        }
      }
    }, { passive: true });
  });
}


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

/* ---- Interactive 3D Parallax Tilt for Hero Circle ---- */
document.addEventListener('DOMContentLoaded', () => {
  const homeImage = document.querySelector('.home-image');
  const imageWrapper = document.querySelector('.image-wrapper');

  if (homeImage && imageWrapper) {
    homeImage.addEventListener('mousemove', (e) => {
      const rect = homeImage.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const tiltX = (y / (rect.height / 2)) * -12;
      const tiltY = (x / (rect.width / 2)) * 12;

      imageWrapper.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    });

    homeImage.addEventListener('mouseleave', () => {
      imageWrapper.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
    });
  }
});

