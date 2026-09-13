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

    // Fetch languages breakdown for all repos in parallel
    const reposWithLangs = await Promise.all(filteredRepos.map(async repo => {
      try {
        if (repo.languages_url) {
          const langRes = await fetch(repo.languages_url, { headers: { 'Accept': 'application/vnd.github+json' } });
          if (langRes.ok) {
            const langData = await langRes.json();
            const topLangs = Object.keys(langData).slice(0, 4);
            if (topLangs.length > 0) return { ...repo, topLanguages: topLangs };
          }
        }
      } catch (e) {
        console.warn('Error al obtener lenguajes para', repo.name, e);
      }
      return { ...repo, topLanguages: repo.language ? [repo.language] : ['Software'] };
    }));

    // Render cards dynamically with full language badges breakdown
    projectsGrid.innerHTML = reposWithLangs.map(repo => {
      const status = getStatusInfo(repo);
      const category = getCategory(repo);
      const langInfo = getLangInfo(repo.language || (repo.topLanguages && repo.topLanguages[0]));
      const title = formatRepoName(repo.name);
      const description = repo.description || `Proyecto de ${repo.language || (repo.topLanguages && repo.topLanguages.join(', ')) || 'desarrollo'} publicado en GitHub. Arquitectura limpia y código modular.`;
      const pushedDateStr = formatDate(repo.pushed_at || repo.updated_at);
      const demoUrl = repo.homepage && repo.homepage.trim() !== '' ? repo.homepage : repo.html_url;
      const stars = repo.stargazers_count || 0;

      const repoRawUrl = `https://raw.githubusercontent.com/${GITHUB_USER}/${repo.name}/${repo.default_branch || 'main'}/`;
      const initialImgUrl = `${repoRawUrl}imagenes/preview.png`;

      const hasHomepage = repo.homepage && repo.homepage.trim() !== '';

      const allTags = [...new Set([...(repo.topLanguages || []), ...(repo.topics || [])])].slice(0, 5);

      return `
        <article class="project-card reveal visible" data-category="${category}">
          <div class="project-img ${langInfo.bg}">
            <div class="status-badge ${status.class}">
              ${status.icon}
              <span>${status.label}</span>
            </div>
            <img src="${initialImgUrl}" alt="${title}" loading="lazy" class="repo-preview-img" data-repo-raw="${repoRawUrl}" onerror="tryNextPreviewImg(this)">
            <div class="repo-header-art">
              ${langInfo.icon}
            </div>
            <div class="project-overlay">
              <div class="project-links">
                <button type="button" class="project-link btn-open-gallery" data-repo="${repo.name}" data-branch="${repo.default_branch || 'main'}" data-title="${title}" aria-label="Ver capturas del proyecto" title="Ver Capturas / Galería"><i class="bx bx-show"></i></button>
                ${hasHomepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="Ver sitio web en vivo" title="Ver Demo en Vivo (Sitio Hospedado)"><i class="bx bx-link-external"></i></a>` : ''}
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="Ver código en GitHub" title="Ver Código en GitHub"><i class="bx bxl-github"></i></a>
              </div>
            </div>
          </div>
          <div class="project-info">
            <div class="project-tags">
              ${allTags.map(tag => `<span class="tag" data-lang="${tag}">${tag}</span>`).join('')}
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

    // Re-bind filter events, touch events and gallery clicks
    bindProjectFilters();
    bindTouchEvents();
    bindGalleryButtons();

  } catch (err) {
    console.warn('Error al cargar repositorios de GitHub:', err);
    bindProjectFilters();
  }
})();

// Helper to generate candidate image URLs with interleaved folder and extension priorities
function generateImageCandidates(repoRawUrl, isGallery = false) {
  const folders = ['imagenes/', 'Imagenes/', 'images/', 'Images/'];
  const exts = ['.webp', '.png', '.jpg', '.jpeg'];
  const candidates = [];

  const addInterleaved = (fileNames) => {
    fileNames.forEach(name => {
      exts.forEach(ext => {
        folders.forEach(folder => {
          candidates.push(`${repoRawUrl}${folder}${name}${ext}`);
        });
      });
    });
  };

  // Cover / Image 1 candidates
  addInterleaved(['preview1', 'preview', '1', 'imagen1', 'imagen', 'image1', 'image', 'foto1', 'foto']);

  if (isGallery) {
    // Images 2 through 10 candidates
    for (let i = 2; i <= 10; i++) {
      addInterleaved([`preview${i}`, `${i}`, `imagen${i}`, `image${i}`, `foto${i}`]);
    }
  }

  return candidates;
}

// Intelligent Fallback chain for repo cover image
function tryNextPreviewImg(img) {
  const repoRawUrl = img.getAttribute('data-repo-raw');

  if (!img._candidatePaths) {
    img._candidatePaths = generateImageCandidates(repoRawUrl, false);
    img._candidateIdx = 0;
  }

  const idx = img._candidateIdx || 0;
  if (idx < img._candidatePaths.length) {
    img._candidateIdx = idx + 1;
    img.src = img._candidatePaths[idx];
  } else {
    img.style.display = 'none';
    if (img.nextElementSibling && img.nextElementSibling.classList.contains('repo-header-art')) {
      img.nextElementSibling.style.display = 'flex';
    }
  }
}

/* ---- Lightbox Gallery Controller ---- */
let currentGalleryImages = [];
let currentGalleryIndex = 0;

function bindGalleryButtons() {
  const galleryBtns = document.querySelectorAll('.btn-open-gallery');
  galleryBtns.forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const repoName = btn.getAttribute('data-repo');
      const branch = btn.getAttribute('data-branch');
      const title = btn.getAttribute('data-title');
      openGalleryForRepo(repoName, branch, title);
    };
  });
}

async function openGalleryForRepo(repoName, branch, repoTitle) {
  const GITHUB_USER = 'adrianjesus1209-beep';
  const defaultBranch = branch || 'main';
  const repoRawUrl = `https://raw.githubusercontent.com/${GITHUB_USER}/${repoName}/${defaultBranch}/`;

  const candidateUrls = generateImageCandidates(repoRawUrl, true);

  showToast('Buscando capturas del proyecto...');

  // Probe image existence in parallel
  const probeImage = (url) => new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => resolve(null);
    img.src = url;
  });

  const results = await Promise.all(candidateUrls.map(probeImage));
  const validImages = results.filter(url => url !== null);

  if (validImages.length === 0) {
    showToast('Aún no hay capturas agregadas en /imagenes');
    return;
  }

  currentGalleryImages = [...new Set(validImages)];
  currentGalleryIndex = 0;

  const galleryModal = document.getElementById('gallery-modal');
  const galleryTitle = document.getElementById('gallery-title');

  if (galleryTitle) galleryTitle.textContent = repoTitle;

  renderGalleryState();

  if (galleryModal) {
    galleryModal.classList.add('show');
    galleryModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function renderGalleryState() {
  const galleryImg = document.getElementById('gallery-img');
  const galleryCounter = document.getElementById('gallery-counter');
  const thumbnailsContainer = document.getElementById('gallery-thumbnails');

  if (galleryImg && currentGalleryImages.length > 0) {
    galleryImg.style.opacity = '0';
    galleryImg.src = currentGalleryImages[currentGalleryIndex];
    setTimeout(() => { galleryImg.style.opacity = '1'; }, 50);
  }

  if (galleryCounter) {
    galleryCounter.textContent = `${currentGalleryIndex + 1} / ${currentGalleryImages.length}`;
  }

  if (thumbnailsContainer) {
    thumbnailsContainer.innerHTML = currentGalleryImages.map((url, idx) => `
      <div class="gallery-thumb ${idx === currentGalleryIndex ? 'active' : ''}" onclick="selectGalleryIndex(${idx})">
        <img src="${url}" alt="Thumbnail ${idx + 1}">
      </div>
    `).join('');
  }
}

function selectGalleryIndex(index) {
  if (index >= 0 && index < currentGalleryImages.length) {
    currentGalleryIndex = index;
    renderGalleryState();
  }
}

function closeGalleryModal() {
  const galleryModal = document.getElementById('gallery-modal');
  if (galleryModal) {
    galleryModal.classList.remove('show');
    galleryModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

// Global modal navigation listeners
document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('gallery-close');
  const overlay = document.getElementById('gallery-overlay');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');

  if (closeBtn) closeBtn.onclick = closeGalleryModal;
  if (overlay) overlay.onclick = closeGalleryModal;

  if (prevBtn) prevBtn.onclick = () => {
    if (currentGalleryImages.length === 0) return;
    currentGalleryIndex = (currentGalleryIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
    renderGalleryState();
  };

  if (nextBtn) nextBtn.onclick = () => {
    if (currentGalleryImages.length === 0) return;
    currentGalleryIndex = (currentGalleryIndex + 1) % currentGalleryImages.length;
    renderGalleryState();
  };

  document.addEventListener('keydown', (e) => {
    const galleryModal = document.getElementById('gallery-modal');
    if (galleryModal && galleryModal.classList.contains('show')) {
      if (e.key === 'Escape') closeGalleryModal();
      if (e.key === 'ArrowLeft') {
        if (currentGalleryImages.length === 0) return;
        currentGalleryIndex = (currentGalleryIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
        renderGalleryState();
      }
      if (e.key === 'ArrowRight') {
        if (currentGalleryImages.length === 0) return;
        currentGalleryIndex = (currentGalleryIndex + 1) % currentGalleryImages.length;
        renderGalleryState();
      }
    }
  });
});

let isProjectsExpanded = false;
const INITIAL_PROJECT_LIMIT = 12;

function applyProjectFiltersAndLimits() {
  const activeBtn = document.querySelector('.filter-btn.active');
  const currentFilter = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
  const allCards = Array.from(document.querySelectorAll('.project-card'));

  const matchingCards = allCards.filter(card => {
    const category = card.getAttribute('data-category');
    return currentFilter === 'all' || category === currentFilter;
  });

  const toggleBtn = document.getElementById('btn-toggle-projects');
  const toggleText = document.getElementById('toggle-projects-text');
  const toggleIcon = document.getElementById('toggle-projects-icon');

  // Hide non-matching cards immediately
  allCards.forEach(card => {
    if (!matchingCards.includes(card)) {
      card.style.display = 'none';
      card.style.opacity = '0';
    }
  });

  if (matchingCards.length > INITIAL_PROJECT_LIMIT) {
    if (toggleBtn) toggleBtn.style.display = 'inline-flex';

    matchingCards.forEach((card, index) => {
      if (!isProjectsExpanded && index >= INITIAL_PROJECT_LIMIT) {
        card.style.display = 'none';
        card.style.opacity = '0';
      } else {
        card.style.display = '';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = '';
        }, 10);
      }
    });

    if (toggleText && toggleIcon) {
      if (isProjectsExpanded) {
        toggleText.textContent = 'Ver menos';
        toggleIcon.className = 'bx bx-chevron-up';
      } else {
        const remaining = matchingCards.length - INITIAL_PROJECT_LIMIT;
        toggleText.textContent = `Ver más proyectos (${remaining} más)`;
        toggleIcon.className = 'bx bx-chevron-down';
      }
    }
  } else {
    if (toggleBtn) toggleBtn.style.display = 'none';
    matchingCards.forEach(card => {
      card.style.display = '';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = '';
      }, 10);
    });
  }
}

function bindProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.onclick = () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyProjectFiltersAndLimits();
    };
  });

  const toggleBtn = document.getElementById('btn-toggle-projects');
  if (toggleBtn) {
    toggleBtn.onclick = () => {
      isProjectsExpanded = !isProjectsExpanded;
      applyProjectFiltersAndLimits();

      if (!isProjectsExpanded) {
        const projectsSec = document.getElementById('projects');
        if (projectsSec) {
          projectsSec.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
  }

  applyProjectFiltersAndLimits();
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

