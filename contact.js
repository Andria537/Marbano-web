/* Marbano — Contact page interactions */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Header scroll state ---------- */
  var header = document.querySelector('.site-header');
  var backToTop = document.getElementById('mkdf-back-to-top');
  window.addEventListener('scroll', function () {
    var scrolled = window.scrollY > 40;
    if (header) header.classList.toggle('scrolled', scrolled);
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 500);
  });

  if (backToTop) {
    backToTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Hamburger / mobile menu ---------- */
  window.toggleMenu = function (el) {
    el.classList.toggle('open');
    var menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('open');
  };

  document.querySelectorAll('#mobileMenu a').forEach(function (a) {
    a.addEventListener('click', function () {
      var burger = document.querySelector('.hamburger');
      var menu = document.getElementById('mobileMenu');
      if (burger) burger.classList.remove('open');
      if (menu) menu.classList.remove('open');
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Simple language switcher ---------- */
  var langButtons = document.querySelectorAll('[data-set-lang]');
  function applyLang(lang) {
    document.documentElement.setAttribute('lang', lang);
    document.querySelectorAll('[data-lang-' + lang + ']').forEach(function (el) {
      el.textContent = el.getAttribute('data-lang-' + lang);
    });
    langButtons.forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-set-lang') === lang);
    });
    try { localStorage.setItem('marbano-lang', lang); } catch (e) {}
  }
  langButtons.forEach(function (btn) {
    btn.addEventListener('click', function () { applyLang(btn.getAttribute('data-set-lang')); });
  });
  if (langButtons.length) {
    var saved = 'ka';
    try { saved = localStorage.getItem('marbano-lang') || 'ka'; } catch (e) {}
    applyLang(saved);
  }

  /* ---------- Contact form UX: disable button + show a sending state ---------- */
  var form = document.querySelector('.contact-form form') || document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function () {
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.dataset.originalText = btn.textContent;
        btn.textContent = 'SENDING…';
        btn.disabled = true;
      }
    });
  }
});