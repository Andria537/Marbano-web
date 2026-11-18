/* Marbano — site interactions */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Preloader ---------- */
  var preloader = document.getElementById('preloader');
  window.addEventListener('load', function () {
    setTimeout(function () { preloader && preloader.classList.add('loaded'); }, 400);
  });
  // Fallback in case 'load' already fired
  setTimeout(function () { preloader && preloader.classList.add('loaded'); }, 2500);

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

  /* ---------- Hero slider ---------- */
  var slides = document.querySelectorAll('.slide');
  var dotsContainer = document.getElementById('dotsContainer');
  var current = 0;
  var slideTimer;

  if (slides.length && dotsContainer) {
    slides.forEach(function (_, i) {
      var dot = document.createElement('span');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', function () { goToSlide(i); resetTimer(); });
      dotsContainer.appendChild(dot);
    });
  }

  function showSlide(index) {
    slides.forEach(function (s, i) { s.classList.toggle('active', i === index); });
    if (dotsContainer) {
      dotsContainer.querySelectorAll('.dot').forEach(function (d, i) {
        d.classList.toggle('active', i === index);
      });
    }
  }

  function goToSlide(index) {
    current = (index + slides.length) % slides.length;
    showSlide(current);
  }

  window.changeSlide = function (dir) {
    goToSlide(current + dir);
    resetTimer();
  };

  function resetTimer() {
    clearInterval(slideTimer);
    slideTimer = setInterval(function () { goToSlide(current + 1); }, 6000);
  }
  if (slides.length) resetTimer();

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

  /* ---------- Owl carousel (gallery) ---------- */
  if (window.jQuery && jQuery.fn.owlCarousel) {
    jQuery('.image-carousel').owlCarousel({
      loop: true,
      margin: 0,
      nav: true,
      dots: true,
      autoplay: true,
      autoplayTimeout: 4500,
      autoplayHoverPause: true,
      responsive: {
        0: { items: 1 },
        600: { items: 2 },
        1000: { items: 3 }
      }
    });
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
    var saved = 'en';
    try { saved = localStorage.getItem('marbano-lang') || 'en'; } catch (e) {}
    applyLang(saved);
  }
});