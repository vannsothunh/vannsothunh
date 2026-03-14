// ─── Theme: apply before paint to avoid flash ───────────────────────────────
(function () {
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);
  else root.setAttribute('data-theme', 'dark');
})();

window.addEventListener('DOMContentLoaded', () => {

  // ── Year ──────────────────────────────────────────────────────────────────
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Mobile nav toggle ─────────────────────────────────────────────────────
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Theme toggle ──────────────────────────────────────────────────────────
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  // ── Card entrance animation (GPU-composited) ──────────────────────────────
  const animCards = document.querySelectorAll('[data-animate]');
  if (animCards.length) {
    animCards.forEach(el => {
      el.style.willChange  = 'opacity, transform';
      el.style.opacity     = '0';
      el.style.transform   = 'translate3d(0, 16px, 0)';
      el.style.transition  = 'opacity .55s cubic-bezier(.4,0,.2,1), transform .55s cubic-bezier(.4,0,.2,1)';
    });

    const cardObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translate3d(0,0,0)';
          cardObserver.unobserve(entry.target);
        }
      }
    }, { threshold: 0.15 });

    animCards.forEach(el => cardObserver.observe(el));
  }

  // ── Active nav — 120 fps rAF scroll tracker ────────────────────────────────
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  if (!navLinks.length) return;

  const sections = Array.from(navLinks).map(link => ({
    link,
    el: document.getElementById(link.dataset.section)
  })).filter(s => s.el);

  let ticking    = false;
  let lastActive = null;

  function setActive(link) {
    if (link === lastActive) return;
    if (lastActive) lastActive.classList.remove('active');
    link.classList.add('active');
    lastActive = link;
  }

  function updateActive() {
    const trigger = window.scrollY + window.innerHeight * 0.3;
    let best = sections[0];
    for (const s of sections) {
      if (s.el.offsetTop <= trigger) best = s;
    }
    setActive(best.link);
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateActive);
      ticking = true;
    }
  }, { passive: true });

  updateActive();

  // ── Smooth scroll with header offset compensation ─────────────────────────
  const HEADER_H = document.querySelector('.site-header')?.offsetHeight ?? 64;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_H - 8;
      window.scrollTo({ top, behavior: 'smooth' });
      if (menu) { menu.classList.remove('open'); toggle?.setAttribute('aria-expanded','false'); }
    });
  });

});
