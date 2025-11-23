// Theme toggle with localStorage persistence
(function() {
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);
  else root.removeAttribute('data-theme');
})();

window.addEventListener('DOMContentLoaded', () => {
  // Update year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Theme toggle
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  // Animate in cards when visible
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.opacity = '1';
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.2 });

  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.transform = 'translateY(12px)';
    el.style.opacity = '0';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    observer.observe(el);
  });
});
