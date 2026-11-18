/* Marbano — Shop page interactions */

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
    }, { threshold: 0.1 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Language switcher ---------- */
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

  /* ---------- Favorites ---------- */
  function getFavorites() {
    try { return JSON.parse(localStorage.getItem('marbano-favorites') || '[]'); }
    catch (e) { return []; }
  }
  function saveFavorites(list) {
    try { localStorage.setItem('marbano-favorites', JSON.stringify(list)); } catch (e) {}
  }
  var favorites = getFavorites();
  document.querySelectorAll('.fav-heart').forEach(function (el) {
    if (favorites.indexOf(el.getAttribute('data-id')) !== -1) el.classList.add('active');
  });

  window.toggleFavorite = function (el) {
    var id = el.getAttribute('data-id');
    var list = getFavorites();
    var idx = list.indexOf(id);
    if (idx === -1) { list.push(id); el.classList.add('active'); }
    else { list.splice(idx, 1); el.classList.remove('active'); }
    saveFavorites(list);
  };

  document.querySelectorAll('.fav-heart').forEach(function (el) {
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.toggleFavorite(el); }
    });
  });

  /* ---------- Description expand / collapse ---------- */
  window.toggleDesc = function (btn) {
    var wrap = btn.previousElementSibling;
    if (!wrap || !wrap.classList.contains('wine-desc')) return;
    var expanded = wrap.classList.toggle('expanded');
    btn.textContent = expanded ? 'Read less' : 'Read more';
  };

  /* ---------- Filter bar ---------- */
  var filterButtons = document.querySelectorAll('.filter-bar button');
  var cards = document.querySelectorAll('.wine-card');
  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      cards.forEach(function (card) {
        var match = filter === 'all' ||
          card.getAttribute('data-color') === filter ||
          card.getAttribute('data-method') === filter;
        card.hidden = !match;
      });
    });
  });
});