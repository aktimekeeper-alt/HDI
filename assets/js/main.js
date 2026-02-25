/* ============================================================
   HYPERION DEFENSE INDUSTRIES — MAIN JAVASCRIPT
   ============================================================ */

'use strict';

// ─── STARFIELD CANVAS ──────────────────────────────────────────────────────
(function () {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  let rafId;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function makeStar() {
    return {
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      r:       Math.random() * 1.4 + 0.25,
      opacity: Math.random() * 0.65 + 0.15,
      speed:   Math.random() * 0.12 + 0.015,
      phase:   Math.random() * Math.PI * 2,
    };
  }

  function initStars() {
    stars = [];
    const n = Math.min(Math.floor((canvas.width * canvas.height) / 3800), 380);
    for (let i = 0; i < n; i++) stars.push(makeStar());
  }

  function drawFrame(ts) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = ts / 1000;

    for (const s of stars) {
      const alpha = s.opacity * (0.55 + 0.45 * Math.sin(s.phase + t * 1.4));

      // Core
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(195, 220, 255, ${alpha})`;
      ctx.fill();

      // Soft halo for brighter stars
      if (s.r > 1.1) {
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3.5);
        g.addColorStop(0, `rgba(140, 195, 255, ${alpha * 0.28})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }

      s.y += s.speed;
      if (s.y > canvas.height + 2) {
        s.y = -2;
        s.x = Math.random() * canvas.width;
      }
    }

    rafId = requestAnimationFrame(drawFrame);
  }

  function init() {
    resize();
    initStars();
    rafId = requestAnimationFrame(drawFrame);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(rafId);
      init();
    }, 200);
  });

  init();
}());


// ─── NAVBAR SCROLL STATE ────────────────────────────────────────────────────
(function () {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  function update() {
    nav.classList.toggle('scrolled', window.scrollY > 48);
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}());


// ─── ACTIVE NAV LINK (intersection) ────────────────────────────────────────
(function () {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[href^="#"], .nav-link[href*="index.html#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      navLinks.forEach(a => {
        const href = a.getAttribute('href') || '';
        a.classList.toggle('active', href === `#${id}` || href.endsWith(`#${id}`));
      });
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
}());


// ─── MOBILE MENU ────────────────────────────────────────────────────────────
(function () {
  const btn     = document.querySelector('.hamburger');
  const overlay = document.querySelector('.nav-mobile-overlay');
  if (!btn || !overlay) return;

  function close() {
    btn.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => {
    const open = overlay.classList.toggle('active');
    btn.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  overlay.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}());


// ─── SCROLL REVEAL (intersection observer) ──────────────────────────────────
(function () {
  const targets = document.querySelectorAll(
    '[data-animate], .pillar-card, .ops-card, .value-card'
  );
  if (!targets.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
}());


// ─── CONTACT FORM ────────────────────────────────────────────────────────────
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-check"></i> Transmission Sent';
    btn.style.background = 'linear-gradient(135deg, #00b87a, #006644)';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3500);
  });
}());


// ─── SMOOTH SCROLL FOR ANCHOR LINKS ─────────────────────────────────────────
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}());
