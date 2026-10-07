/* ==================================================================
   IONIC CONTRACTORS — site behaviour
   ------------------------------------------------------------------
   Everything here is an enhancement. With this file removed the site
   still renders all of its content, all links work, and forms fall
   back to a plain mailto: submission.

   Motion runs on GSAP + ScrollTrigger (self-hosted), with Lenis for
   smooth wheel scrolling. Both are driven from one gsap.ticker so the
   scroll position ScrollTrigger reads is always the one Lenis painted.
================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var gsap = window.gsap;
  var ST = window.ScrollTrigger;

  /* No GSAP (blocked, failed to load) -> drop to the static layout the
     CSS already provides for reduced motion. Nothing is ever hidden. */
  if (!gsap || !ST) {
    root.classList.remove('motion-ok');
    root.setAttribute('data-motion', 'reduced');
  } else {
    gsap.registerPlugin(ST);
  }

  var motionOK = function () { return !reduceMotion.matches && root.classList.contains('motion-ok'); };
  var clamp = function (v, min, max) { return v < min ? min : v > max ? max : v; };
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var headerOffset = function () {
    var bar = $('.bar');
    return (bar ? bar.offsetHeight : 80) + 16;
  };

  /* ================================================================
     LENIS — smooth wheel scrolling, synced to ScrollTrigger.
     Light lerp, and timelines below use short scrub values, so the two
     smoothings never stack into a floaty, laggy feel.
  ================================================================ */
  var lenis = null;

  function initLenis() {
    if (!window.Lenis || !motionOK()) return;
    lenis = new window.Lenis({
      lerp: 0.14,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
      anchors: false
    });
    lenis.on('scroll', ST.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  function scrollToY(y, done) {
    if (lenis) lenis.scrollTo(y, { onComplete: done });
    else { window.scrollTo({ top: y, behavior: motionOK() ? 'smooth' : 'auto' }); if (done) setTimeout(done, 400); }
  }

  /* In-page anchors land below the fixed bar, and focus moves with
     them so keyboard users are not stranded. */
  function initAnchors() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest && e.target.closest('a[href*="#"]');
      if (!link) return;
      var url = new URL(link.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash || url.hash.length < 2) return;
      var target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      var y = target.getBoundingClientRect().top + window.scrollY - headerOffset();
      scrollToY(y, function () {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
      history.replaceState(null, '', url.hash);
    });
  }

  /* ================================================================
     HEADER — utility bar tucks away on scroll; progress line.
     Driven by ScrollTrigger (no raw scroll listener) and written only
     as a transform, so it never triggers layout.
  ================================================================ */
  function initHeader() {
    var header = $('[data-header]');
    if (!header) return;
    var bar = $('[data-progress]');
    var last = null;
    var update = function (y, progress) {
      var scrolled = y > 40;
      if (scrolled !== last) {
        header.setAttribute('data-scrolled', scrolled ? 'true' : 'false');
        last = scrolled;
      }
      if (bar) bar.style.transform = 'scaleX(' + progress.toFixed(4) + ')';
    };
    if (ST) {
      ST.create({
        start: 0,
        end: 'max',
        onUpdate: function (self) { update(self.scroll(), self.progress); },
        onRefresh: function (self) { update(self.scroll(), self.progress); }
      });
    } else {
      /* No GSAP: a passive listener is the only option left. */
      var fallback = function () {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        update(window.scrollY, max > 0 ? clamp(window.scrollY / max, 0, 1) : 0);
      };
      fallback();
      window.addEventListener('scroll', fallback, { passive: true });
    }
  }

  /* ================================================================
     MARKETS DROPDOWN — hover/focus opens via CSS; the chevron button
     gives keyboard and touch users an explicit toggle.
  ================================================================ */
  function initMenus() {
    $$('[data-menu]').forEach(function (item) {
      var toggle = $('[data-menu-toggle]', item);
      if (!toggle) return;
      var set = function (open) {
        item.setAttribute('data-open', open ? 'true' : 'false');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      };
      toggle.addEventListener('click', function () { set(item.getAttribute('data-open') !== 'true'); });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { set(false); toggle.focus(); }
      });
      item.addEventListener('focusout', function (e) {
        if (!item.contains(e.relatedTarget)) set(false);
      });
      item.addEventListener('mouseleave', function () { set(false); });
    });
  }

  /* ================================================================
     MOBILE DRAWER — real off-canvas nav with a focus trap
  ================================================================ */
  function initDrawer() {
    var btn = $('[data-menu-btn]');
    var drawer = $('[data-drawer]');
    if (!btn || !drawer) return;

    var closeBtn = $('[data-drawer-close]', drawer);
    var lastFocus = null;

    function focusables() {
      return $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', drawer)
        .filter(function (el) { return el.offsetParent !== null; });
    }

    function open() {
      lastFocus = document.activeElement;
      drawer.setAttribute('data-open', 'true');
      drawer.removeAttribute('aria-hidden');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
      var first = focusables()[0];
      if (first) first.focus();
      document.addEventListener('keydown', onKey);
    }

    function close() {
      drawer.setAttribute('data-open', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (lenis) lenis.start();
      document.removeEventListener('keydown', onKey);
      var back = (lastFocus && lastFocus.isConnected && lastFocus !== document.body) ? lastFocus : btn;
      back.focus();
    }

    function onKey(e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      var items = focusables();
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    btn.addEventListener('click', function () {
      drawer.getAttribute('data-open') === 'true' ? close() : open();
    });
    if (closeBtn) closeBtn.addEventListener('click', close);
    drawer.addEventListener('click', function (e) { if (e.target.closest('a[href]')) close(); });
    window.matchMedia('(min-width: 62rem)').addEventListener('change', function (e) {
      if (e.matches && drawer.getAttribute('data-open') === 'true') close();
    });
  }

  /* ================================================================
     ACCORDION
  ================================================================ */
  function initAccordions() {
    $$('[data-accordion-trigger]').forEach(function (trigger) {
      var panel = document.getElementById(trigger.getAttribute('aria-controls'));
      if (!panel) return;

      /* JS owns the closed state from here; the markup ships open so
         the content is readable without JS. */
      var startOpen = trigger.getAttribute('aria-expanded') === 'true';
      panel.style.height = startOpen ? 'auto' : '0px';
      if (!startOpen) panel.setAttribute('hidden', '');
      panel.style.transition = motionOK() ? 'height 380ms cubic-bezier(0.22,0.61,0.36,1)' : 'none';

      function onSettled(fn) {
        var done = false;
        var finish = function () {
          if (done) return;
          done = true;
          panel.removeEventListener('transitionend', finish);
          window.clearTimeout(timer);
          fn();
          if (ST) ST.refresh();   // page height changed: re-measure triggers
        };
        var timer = window.setTimeout(finish, motionOK() ? 460 : 0);
        if (motionOK()) panel.addEventListener('transitionend', finish);
        else finish();
      }

      trigger.addEventListener('click', function () {
        var isOpen = trigger.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
          panel.style.height = panel.scrollHeight + 'px';
          requestAnimationFrame(function () { panel.style.height = '0px'; });
          trigger.setAttribute('aria-expanded', 'false');
          onSettled(function () { panel.setAttribute('hidden', ''); });
        } else {
          panel.removeAttribute('hidden');
          panel.style.height = panel.scrollHeight + 'px';
          trigger.setAttribute('aria-expanded', 'true');
          onSettled(function () { panel.style.height = 'auto'; });
        }
      });
    });
  }

  /* ================================================================
     SPLIT HEADLINES — words rise out of a padded mask.
     Walks text nodes only, so <br>, <em> and entities survive and the
     words stay in reading order. Once a word lands, its mask is
     released (overflow: visible) so nothing can stay clipped.
  ================================================================ */
  function splitWords(el) {
    if (el.getAttribute('data-split-done')) return $$('.split-word > span', el);
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var parts = child.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var outer = document.createElement('span');
            outer.className = 'split-word';
            var inner = document.createElement('span');
            inner.textContent = part;
            outer.appendChild(inner);
            frag.appendChild(outer);
          });
          child.parentNode.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          walk(child);
        }
      });
    })(el);
    el.setAttribute('data-split-done', 'true');
    return $$('.split-word > span', el);
  }

  function initSplits() {
    if (!motionOK()) return;
    $$('[data-split]').forEach(function (el) {
      var words = splitWords(el);
      gsap.set(words, { yPercent: 110 });
      el.style.visibility = 'visible';
      el.style.animation = 'none';
      var immediate = el.closest('.page-hero') || el.closest('[data-beat="open"]');
      var tween = {
        yPercent: 0,
        duration: 0.8,
        ease: 'expo.out',
        stagger: 0.035,
        delay: immediate ? 0.1 : 0,
        onComplete: function () {
          $$('.split-word', el).forEach(function (w) { w.classList.add('is-done'); });
        }
      };
      if (!immediate) tween.scrollTrigger = { trigger: el, start: 'top 92%', once: true };
      gsap.to(words, tween);
    });
  }

  /* ================================================================
     REVEALS — batched and triggered early, so content is already in
     place by the time it is read. Short distance, short duration.
  ================================================================ */
  function initReveal() {
    var items = $$('.reveal');
    if (!items.length) return;
    if (!motionOK()) {
      items.forEach(function (el) { el.setAttribute('data-shown', 'true'); });
      return;
    }
    ST.batch(items, {
      start: 'top 96%',
      once: true,
      onEnter: function (batch) {
        batch.forEach(function (el, i) {
          if (!el.style.getPropertyValue('--reveal-delay')) el.style.setProperty('--reveal-delay', (i * 60) + 'ms');
          el.setAttribute('data-shown', 'true');
        });
      }
    });
    requestAnimationFrame(function () {
      items.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.setAttribute('data-shown', 'true');
      });
    });
  }

  /* ================================================================
     PAGE HERO — the hex lattice drifts slower than the page (depth),
     transform only.
  ================================================================ */
  function initPageHero() {
    if (!motionOK()) return;
    var hero = $('.page-hero');
    if (!hero) return;
    var lat = $('.page-hero__lattice', hero);
    if (lat) gsap.to(lat, { yPercent: 14, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.from($$('.crumbs, .lead, [data-hero-inner] > div', hero), {
      y: 16, opacity: 0, duration: 0.7, ease: 'expo.out', stagger: 0.06, delay: 0.2
    });
  }

  /* ================================================================
     MARQUEE — one continuous loop whose speed follows scroll velocity.
     The velocity is eased on the shared ticker (one write per frame),
     instead of spawning new tweens on every scroll event.
  ================================================================ */
  function initMarquees() {
    if (!motionOK()) return;
    $$('[data-marquee]').forEach(function (m) {
      var track = $('.marquee__track', m);
      m.setAttribute('data-gsap', 'true');
      var loop = gsap.to(track, { xPercent: -50, ease: 'none', duration: 42, repeat: -1 });
      var target = 1, current = 1, active = false;
      ST.create({
        trigger: m,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: function (self) { active = self.isActive; active ? loop.play() : loop.pause(); },
        onUpdate: function (self) {
          var v = self.getVelocity();
          target = (v < 0 ? -1 : 1) * (1 + clamp(Math.abs(v) / 300, 0, 4));
        }
      });
      gsap.ticker.add(function () {
        if (!active) return;
        target += ((target > 0 ? 1 : -1) - target) * 0.04;   // settle back to cruising speed
        current += (target - current) * 0.12;
        loop.timeScale(current);
      });
    });
  }

  /* ================================================================
     DELIVERY — cards stack as you scroll (desktop)
  ================================================================ */
  function initStacks() {
    if (!motionOK()) return;
    var mm = gsap.matchMedia();
    mm.add('(min-width: 52rem)', function () {
      $$('[data-stack]').forEach(function (stack) {
        var cards = $$('.delivery__card', stack);
        var section = stack.closest('.section');
        if (section) section.style.contentVisibility = 'visible';
        cards.forEach(function (card, i) {
          card.style.position = 'sticky';
          card.style.top = 'calc(var(--bar-h) + ' + (1.5 + i * 1.25) + 'rem)';
          if (i === cards.length - 1) return;
          gsap.to(card, {
            scale: 0.94 - (cards.length - 2 - i) * 0.02,
            '--dim': 0.7,
            ease: 'none',
            scrollTrigger: {
              trigger: cards[i + 1],
              start: 'top bottom-=10%',
              end: 'top top+=' + Math.round(headerOffset() + 40),
              scrub: true
            }
          });
        });
        return function () {
          cards.forEach(function (c) { c.style.position = ''; c.style.top = ''; });
        };
      });
    });
    /* Mobile: a simple rise-in per card */
    mm.add('(max-width: 51.999rem)', function () {
      $$('.delivery__card').forEach(function (card) {
        gsap.from(card, { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 92%', once: true } });
      });
    });
  }

  /* ================================================================
     COUNTERS
  ================================================================ */
  function initCounters() {
    if (!motionOK()) return;
    $$('[data-count]').forEach(function (el) {
      var to = parseInt(el.getAttribute('data-count'), 10) || 0;
      var obj = { v: 0 };
      el.textContent = '0';
      gsap.to(obj, {
        v: to, duration: 1.4, ease: 'power2.out',
        onUpdate: function () { el.textContent = String(Math.round(obj.v)); },
        scrollTrigger: { trigger: el, start: 'top 92%', once: true }
      });
    });
  }

  /* ================================================================
     HOME SCROLL SEQUENCE — Mobilize / Execute / Close Out
     One timeline, 0–100 units = 0–100% of the pinned scroll.
       0–10  Open        10–30 Mobilize     30–60 Execute
       60–75 Close out   75–92 Footprint    92–100 Resolve

     Performance model: the artwork is three stacked SVG layers that
     share one 1000 x 640 coordinate system.
       site  grid, markers, building, outline  (small; repaints in 1–4)
       map   the ~1,000-cell US silhouette     (rasterised once, then
                                                only moved/faded)
       net   hubs, partner lines, resolve ring (small; repaints in 5–6)
     Every camera move is a CSS transform on a whole layer, which the
     GPU composites without repainting anything.
  ================================================================ */
  function initSequence() {
    var seq = $('[data-seq]');
    if (!seq || !motionOK()) return;

    var pin = $('[data-seq-pin]', seq);
    var layer = function (n) { return $('[data-layer="' + n + '"]', seq); };
    var siteL = layer('site'), mapL = layer('map'), netL = layer('net');
    var netSvg = $('[data-seq-svg]', seq);
    var g = function (name) { return $('[data-g="' + name + '"]', seq); };
    var nc = netSvg.getAttribute('data-nc').split(' ').map(Number);
    var rowsY = netSvg.getAttribute('data-rows').split(',').map(Number);

    var open = g('open'), grid = g('grid'), markers = g('markers'), building = g('building');
    var outline = g('outline'), callout = g('callout'), net = g('net'), ring = g('ring');
    var openEdge = $('.seq-open__edge', open), openGlow = $('.seq-open__glow', open);
    var cells = $$('polygon', grid);
    var markerEls = $$('[data-marker]', markers);
    var rows = $$('[data-row]', building);
    var ringCells = $$('polygon', ring);
    var netLines = $$('.seq-net__line', net);
    var netNodes = $$('.seq-net__node', net);
    var hub = function (id) { return $('[data-hub="' + id + '"]', net); };

    var beat = function (name) { return $('[data-beat="' + name + '"]', seq); };
    var B = {
      open: beat('open'), mobilize: beat('mobilize'), execute: beat('execute'),
      closeout: beat('closeout'), footprint: beat('footprint'), resolve: beat('resolve')
    };
    var order = ['open', 'mobilize', 'execute', 'closeout', 'footprint', 'resolve'];
    var caps = $$('[data-cap]', seq);
    var rail = $$('[data-rail]', seq);
    var logo = $('.seq__logo', seq);
    var resolveText = $$('.seq__resolve-line, .seq__cta', seq);
    var mobile = window.matchMedia('(max-width: 55.999rem)');

    /* Decode the resolve logo up front so the last beat never waits on it. */
    if (logo) { logo.loading = 'eager'; if (logo.decode) logo.decode().catch(function () {}); }

    /* Artboard point -> pixel position inside an untransformed layer.
       The net layer is never scaled, so its CTM is the reference. */
    function toLayer(x, y) {
      var m = netSvg.getScreenCTM();
      var r = netL.getBoundingClientRect();
      if (!m) return { x: 0, y: 0 };
      return { x: m.a * x + m.c * y + m.e - r.left, y: m.b * x + m.d * y + m.f - r.top };
    }
    var SITE_ZOOM = 1.45;
    var END_SCALE = 0.04;

    /* Where the site layer must move so the building lands on NC. */
    function siteShift(axis) {
      var r = netL.getBoundingClientRect();
      var c = { x: r.width / 2, y: r.height / 2 };
      var b = toLayer(500, 400);
      var n = toLayer(nc[0], nc[1]);
      return n[axis] - c[axis] - END_SCALE * (b[axis] - c[axis]);
    }
    function ncOrigin() { var n = toLayer(nc[0], nc[1]); return n.x + 'px ' + n.y + 'px'; }

    /* ---- Intro (plays on load, not scroll-bound) ------------------- */
    gsap.set(siteL, { scale: SITE_ZOOM, transformOrigin: '50% 50%' });
    gsap.fromTo(openEdge, { strokeDasharray: 1, strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 1.6, ease: 'power3.inOut', delay: 0.15 });
    gsap.fromTo(openGlow, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out', delay: 0.9 });
    gsap.from($$('.seq__kicker, .seq__sub', B.open), { y: 16, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.1, delay: 0.35 });

    var ringOffsets = ringCells.map(function (c) {
      var bb = c.getBBox();
      return { x: 500 - (bb.x + bb.width / 2), y: 320 - (bb.y + bb.height / 2) };
    });

    var tl = gsap.timeline({ defaults: { ease: 'none' } });
    var inBeat = function (el, at) { tl.fromTo(el, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 4, ease: 'power3.out' }, at); };
    var outBeat = function (el, at) { tl.to(el, { opacity: 0, y: -32, duration: 3, ease: 'power2.in' }, at); };

    /* 0–10 OPEN */
    outBeat(B.open, 7);

    /* 10–30 MOBILIZE: the cell becomes the centre of a site grid */
    tl.to(open, { scale: 24 / 70, svgOrigin: '500 320', duration: 6, ease: 'power3.inOut' }, 9);
    tl.to(openEdge, { stroke: '#8A8C94', duration: 4 }, 10);
    tl.to(openGlow, { opacity: 0, duration: 3 }, 9);
    tl.set(grid, { opacity: 1 }, 10);
    tl.fromTo(cells, { scale: 0.6, opacity: 0, transformOrigin: '50% 50%' }, {
      scale: 1, opacity: 1, duration: 3, ease: 'power3.out',
      stagger: function (i, el) { return (+el.getAttribute('data-ring') - 1) * 2 + (i % 5) * 0.1; }
    }, 11);
    inBeat(B.mobilize, 12);
    tl.set(markers, { opacity: 1 }, 20);
    tl.fromTo(markerEls, { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 2.2, stagger: 0.9, ease: 'back.out(2.2)' }, 20);

    /* 30–60 EXECUTE: ground tilts, facade extrudes row by row */
    outBeat(B.mobilize, 28);
    tl.to(markers, { opacity: 0, duration: 3 }, 29);
    tl.to(open, { opacity: 0, duration: 3 }, 29);
    tl.to(grid, { y: 180, scaleY: 0.3, svgOrigin: '500 320', duration: 6, ease: 'power3.inOut' }, 30);
    inBeat(B.execute, 32);
    tl.set(building, { opacity: 1 }, 34);
    tl.set(callout, { opacity: 1, y: rowsY[0] }, 34);
    rows.forEach(function (row, r) {
      var at = 35 + r * 5;
      tl.fromTo(row, { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 2.6, ease: 'power3.out' }, at);
      tl.fromTo($$('polygon', row), { fillOpacity: 0 }, { fillOpacity: 1, duration: 1.6, stagger: 0.08 }, at + 1.2);
      if (r > 0) tl.to(callout, { y: rowsY[r], duration: 1.2, ease: 'power2.inOut' }, at + 1.4);
    });

    /* 60–75 CLOSE OUT: one orange trace around the finished building */
    outBeat(B.execute, 59);
    tl.to(callout, { opacity: 0, duration: 2 }, 60);
    tl.set(outline, { opacity: 1 }, 61);
    tl.fromTo(outline, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 7, ease: 'power1.inOut' }, 61);
    inBeat(B.closeout, 62);
    tl.to(outline, { stroke: '#8A8C94', duration: 2.5 }, 69.5);

    /* 75–92 FOOTPRINT: the camera pulls back; the site shrinks onto NC */
    outBeat(B.closeout, 73.5);
    tl.to(siteL, {
      scale: END_SCALE,
      x: function () { return siteShift('x'); },
      y: function () { return siteShift('y'); },
      duration: 6.5, ease: 'power3.inOut'
    }, 75);
    tl.to(siteL, { opacity: 0, duration: 1.5 }, 80);
    tl.fromTo(mapL, { opacity: 0.001, scale: 1.6, transformOrigin: ncOrigin },
      { opacity: 1, scale: 1, duration: 6.5, ease: 'power3.inOut' }, 75);
    tl.fromTo(netL, { opacity: 0.001 }, { opacity: 1, duration: 0.5 }, 79);
    inBeat(B.footprint, 77);
    ['nc', 'tx', 'fl'].forEach(function (id, i) {
      var h = hub(id);
      if (!h) return;
      var at = 80 + i * 2;
      tl.fromTo($('.seq-hub__dot', h), { scale: 0.4, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, duration: 1.2, ease: 'back.out(3)' }, at);
      tl.fromTo($('.seq-hub__pulse', h), { attr: { r: 8 }, opacity: 0.95 }, { attr: { r: 46 }, opacity: 0, duration: 2.6, ease: 'power2.out' }, at);
    });
    tl.fromTo(netLines, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.6, stagger: 0.2, ease: 'power1.inOut' }, 85);
    tl.fromTo(netNodes, { scale: 0.4, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, duration: 1, stagger: 0.2 }, 86);
    tl.fromTo($$('[data-loc]', B.footprint), { opacity: 0.3 }, { opacity: 1, duration: 1.2, stagger: 2 }, 79.5);
    tl.fromTo($$('.seq__sectors li', B.footprint), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1.4, stagger: 1.1, ease: 'power3.out' }, 85.5);

    /* 92–100 RESOLVE: hex cells collapse into the real logo */
    outBeat(B.footprint, 91);
    tl.to(mapL, { opacity: 0.001, duration: 3 }, 91.5);
    tl.to(net, { opacity: 0, duration: 2.5 }, 91.5);
    tl.set(ring, { opacity: 1 }, 92);
    tl.fromTo(ringCells, { scale: 0.5, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, duration: 1.4, stagger: 0.07, ease: 'back.out(1.8)' }, 92);
    tl.to(ringCells, {
      x: function (i) { return ringOffsets[i].x; },
      y: function (i) { return ringOffsets[i].y; },
      scale: 0.15, opacity: 0, duration: 2.8, stagger: 0.04, ease: 'power3.in'
    }, 94);
    tl.to(B.resolve, { opacity: 1, duration: 2.4 }, 95.5);
    if (logo) tl.fromTo(logo, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.6, ease: 'expo.out' }, 96);
    tl.fromTo(resolveText, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 1.8, stagger: 0.5, ease: 'power3.out' }, 97.2);
    tl.to({}, { duration: 1 }, 99.9);

    /* ---- UI state that follows the playhead ------------------------ */
    var bounds = [10, 30, 60, 75, 92, 101];
    var lastBeat = -1, lastCap = -2;
    function sync(p) {
      var P = p * 100;
      var b = 0;
      while (P >= bounds[b] && b < bounds.length - 1) b++;
      if (b !== lastBeat) {
        order.forEach(function (name, i) { if (B[name]) B[name].setAttribute('data-active', i === b ? 'true' : 'false'); });
        rail.forEach(function (li) { li.setAttribute('data-on', +li.getAttribute('data-rail') === b ? 'true' : 'false'); });
        seq.setAttribute('data-light', b === order.length - 1 ? 'true' : 'false');
        lastBeat = b;
      }
      var ci = P < 35 ? -1 : P >= 60 ? caps.length : clamp(Math.floor((P - 35) / 5), 0, caps.length - 1);
      if (ci !== lastCap) {
        caps.forEach(function (li, i) {
          li.setAttribute('data-on', i === ci ? 'true' : 'false');
          li.setAttribute('data-done', i < ci ? 'true' : 'false');
        });
        lastCap = ci;
      }
    }
    sync(0);

    var st = ST.create({
      trigger: seq,
      pin: pin,
      start: 'top top',
      end: function () { return '+=' + Math.round(window.innerHeight * (mobile.matches ? 3.2 : 4.4)); },
      scrub: 0.35,
      animation: tl,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: function (self) { sync(self.progress); }
    });

    /* Keyboard users tabbing to a control inside a not-yet-visible beat
       are scrolled to where that beat is on screen. */
    var atFor = { open: 0, mobilize: 0.2, execute: 0.45, closeout: 0.68, footprint: 0.86, resolve: 0.995 };
    seq.addEventListener('focusin', function (e) {
      var el = e.target.closest('[data-beat]');
      if (!el) return;
      var at = atFor[el.getAttribute('data-beat')];
      if (at == null) return;
      var y = st.start + (st.end - st.start) * at;
      if (Math.abs(window.scrollY - y) > 40) scrollToY(y);
    });
  }

  /* ================================================================
     IDLE LOOPS — pause CSS loops off-screen / in hidden tabs
  ================================================================ */
  function initAnimationIdling() {
    var loops = $$('[data-anim-loop]');
    if (!loops.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { entry.target.setAttribute('data-anim-idle', entry.isIntersecting ? 'false' : 'true'); });
    });
    loops.forEach(function (el) { io.observe(el); });
  }

  /* ================================================================
     COPY-TO-CLIPBOARD (UEI / CAGE — the values COs paste into forms)
  ================================================================ */
  function initCopy() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('[data-copy]');
      if (!btn) return;
      var value = btn.getAttribute('data-copy');
      var label = btn.querySelector('[data-copy-label]');
      var reset = function () {
        btn.setAttribute('data-copied', 'false');
        if (label) label.textContent = 'Copy';
      };
      var okState = function () {
        btn.setAttribute('data-copied', 'true');
        if (label) label.textContent = 'Copied';
        window.setTimeout(reset, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(okState).catch(function () {});
      }
    });
  }

  /* ================================================================
     FORMS
     Client-side validation with inline errors, plus a real fallback:
     with no backend endpoint configured the submission is handed to
     the visitor's mail client, pre-filled. Nothing silently no-ops.
  ================================================================ */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  function fieldWrap(el) { return el.closest('.field') || el.parentElement; }

  function setError(el, message) {
    var wrap = fieldWrap(el);
    if (!wrap) return;
    wrap.setAttribute('data-invalid', 'true');
    el.setAttribute('aria-invalid', 'true');
    var box = wrap.querySelector('[data-error-for]');
    if (box) {
      var text = box.querySelector('[data-error-text]');
      if (text) text.textContent = message;
      el.setAttribute('aria-describedby',
        (box.id + ' ' + (el.getAttribute('data-describedby-base') || '')).trim());
    }
  }

  function clearError(el) {
    var wrap = fieldWrap(el);
    if (!wrap) return;
    wrap.removeAttribute('data-invalid');
    el.removeAttribute('aria-invalid');
    var base = el.getAttribute('data-describedby-base');
    if (base) el.setAttribute('aria-describedby', base);
    else el.removeAttribute('aria-describedby');
  }

  function validateField(el) {
    var value = (el.value || '').trim();
    var label = el.getAttribute('data-label') || 'This field';

    if (el.hasAttribute('required') && !value) {
      setError(el, label + ' is required.');
      return false;
    }
    if (value && el.type === 'email' && !EMAIL_RE.test(value)) {
      setError(el, 'Enter a valid email address, e.g. name@agency.gov.');
      return false;
    }
    if (value && el.type === 'tel' && value.replace(/[^0-9]/g, '').length < 10) {
      setError(el, 'Enter a phone number including area code.');
      return false;
    }
    clearError(el);
    return true;
  }

  function initForms() {
    $$('[data-form]').forEach(function (form) {
      var status = form.querySelector('[data-form-status]');
      var fields = $$('.input, .select, .textarea', form);
      var attempted = false;

      fields.forEach(function (el) {
        el.addEventListener('blur', function () { if (attempted) validateField(el); });
        el.addEventListener('input', function () { if (attempted && fieldWrap(el).getAttribute('data-invalid') === 'true') validateField(el); });
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        attempted = true;

        /* Honeypot: a filled hidden field means a bot. Pretend success. */
        var hp = form.querySelector('[data-hp]');
        if (hp && hp.value) return;

        var firstBad = null;
        fields.forEach(function (el) {
          if (!validateField(el) && !firstBad) firstBad = el;
        });

        if (firstBad) {
          if (status) {
            status.setAttribute('data-state', 'error');
            var n = form.querySelectorAll('.field[data-invalid="true"]').length;
            status.querySelector('[data-status-text]').textContent =
              n === 1 ? 'One field needs attention before this can be sent.'
                      : n + ' fields need attention before this can be sent.';
          }
          firstBad.focus();
          return;
        }

        if (status) status.removeAttribute('data-state');
        submitForm(form, status);
      });
    });
  }

  function submitForm(form, status) {
    var leadType = form.getAttribute('data-lead-type') || 'general';
    var subject = form.getAttribute('data-subject') || 'Website inquiry';
    var to = form.getAttribute('data-to') || 'service@ionic.contractors';
    var endpoint = form.getAttribute('data-endpoint');

    /* Analytics hook — split agency vs teaming vs subcontractor leads.
       Fires into the dataLayer whether or not GA4 is configured yet. */
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'lead_submit', lead_type: leadType, form_id: form.id || null });

    var lines = [];
    var files = [];
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || el.hasAttribute('data-hp')) return;
      if (el.type === 'file') {
        if (el.files && el.files.length) {
          files.push((el.getAttribute('data-label') || el.name) + ': ' + el.files[0].name);
        }
        return;
      }
      if (el.type === 'checkbox' && !el.checked) return;
      var value = (el.value || '').trim();
      if (!value) return;
      lines.push((el.getAttribute('data-label') || el.name) + ': ' + value);
    });

    if (files.length) {
      lines.push('');
      lines.push('Files selected (please attach to this email before sending):');
      files.forEach(function (f) { lines.push('  - ' + f); });
    }

    var body = lines.join('\n');

    if (endpoint) {
      var data = new FormData(form);
      data.append('lead_type', leadType);
      fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error('bad status'); return r; })
        .then(function () { showSuccess(form, status, null); })
        .catch(function () { mailtoFallback(form, status, to, subject, body); });
      return;
    }

    mailtoFallback(form, status, to, subject, body);
  }

  function mailtoFallback(form, status, to, subject, body) {
    var href = 'mailto:' + to +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
    showSuccess(form, status, href);
    window.setTimeout(function () { window.location.href = href; }, 250);
  }

  function showSuccess(form, status, mailHref) {
    if (!status) return;
    status.setAttribute('data-state', 'success');
    var text = status.querySelector('[data-status-text]');
    if (!text) return;
    if (mailHref) {
      text.innerHTML = 'Your details are ready to send. Your email application should open with the message ' +
        'pre-filled; press send to deliver it. If nothing opened, ' +
        '<a href="' + mailHref + '">click here to open it manually</a> or email ' +
        '<a href="mailto:service@ionic.contractors">service@ionic.contractors</a> directly.';
    } else {
      text.textContent = 'Thank you. Your inquiry has been received. We respond to agency, owner, and teaming inquiries promptly, usually the same business day.';
      form.reset();
    }
    status.focus && status.focus();
  }

  /* ================================================================
     BOOT
  ================================================================ */
  function boot() {
    initLenis();
    initAnchors();
    initHeader();
    initMenus();
    initDrawer();
    initAccordions();
    initCopy();
    initForms();
    initAnimationIdling();

    if (motionOK()) {
      initSequence();
      initSplits();
      initReveal();
      initPageHero();
      initMarquees();
      initStacks();
      initCounters();
      /* Fonts and late images change layout: re-measure once settled. */
      window.addEventListener('load', function () { ST.refresh(); });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
    } else {
      initReveal();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  /* If the user flips the reduced-motion switch, reload the behaviour
     contract rather than leaving a half-animated page behind. */
  reduceMotion.addEventListener('change', function () { window.location.reload(); });
})();
