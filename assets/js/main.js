/* =============================================================================
   Ionic Contractors — site behaviour
   Progressive enhancement only: every page works with JS disabled.
   ============================================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------------
     Mobile navigation
     Keyboard accessible: Escape closes, focus returns to the toggle.
     --------------------------------------------------------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');

  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      toggle.querySelector('.nav-toggle__label').textContent = open ? 'Close' : 'Menu';
    };

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      setOpen(false);
    });

    // Reset state when resizing up to the desktop breakpoint.
    var mq = window.matchMedia('(min-width: 961px)');
    var onChange = function () { if (mq.matches) setOpen(false); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* ---------------------------------------------------------------------------
     Footer year
     --------------------------------------------------------------------------- */
  var year = document.querySelector('[data-current-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------------------------------------------------------------------------
     Analytics helpers (GA4)
     window.IONIC_GA4_ID is set in analytics.js. Until a real measurement ID is
     configured, nothing loads and nothing is sent.
     --------------------------------------------------------------------------- */
  window.ionicTrack = function (name, params) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params || {});
    }
  };

  // Click-to-call / click-to-email conversion signals.
  document.addEventListener('click', function (e) {
    var link = e.target.closest ? e.target.closest('a[href^="tel:"], a[href^="mailto:"]') : null;
    if (!link) return;
    var isPhone = link.getAttribute('href').indexOf('tel:') === 0;
    window.ionicTrack(isPhone ? 'click_to_call' : 'click_to_email', {
      link_url: link.getAttribute('href'),
      page_path: window.location.pathname
    });
  });
})();
