/* ==================================================================
   IONIC CONTRACTORS — site behavior
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
     HOME SCROLL SEQUENCE: "From contract to keys"
     One project followed from paperwork to handover, then the proof.
     One timeline, 0-100 units = 0-100% of the pinned scroll.
       0-10  Contract    10-28 Mobilize    28-58 Execute
       58-72 Close out   72-86 Footprint   86-96 Proof   96-100 Resolve

     Performance model: the artwork is three stacked SVG layers that
     share one 1000 x 640 coordinate system.
       site  document, site plan, honeycomb   (small; repaints early)
       map   the ~1,000-cell US silhouette    (rasterized once, then
                                               only moved/faded)
       net   hubs, partner lines, title block (small; repaints late)
     Every camera move is a CSS transform on a whole layer, which the
     GPU composites without repainting anything.
  ================================================================ */
  function initSequence() {
    var seq = $('[data-seq]');
    if (!seq || !motionOK()) return;

    var pin = $('[data-seq-pin]', seq);
    var layer = function (n) { return $('[data-layer="' + n + '"]', seq); };
    var siteL = layer('site'), planL = layer('plan'), mapL = layer('map'), netL = layer('net');
    var netSvg = $('[data-seq-svg]', seq);
    var g = function (name) { return $('[data-g="' + name + '"]', seq); };
    var nums = function (attr) { return netSvg.getAttribute(attr).split(/[ ,]/).map(Number); };
    var nc = nums('data-nc');
    var tbRows = nums('data-tb-rows');
    var tbC = nums('data-tb-center');

    var doc = g('doc'), plan = g('plan'), grid = g('grid'), foot = g('foot'), annot = g('annot');
    var markers = g('markers'), outline = g('outline');
    var honey = g('honey'), core = $('[data-core]', seq), ions = $$('[data-ion]', seq), dusk = g('dusk'), net = g('net'), proof = g('proof'), plock = g('plock');
    var gridLines = $$('line', grid);
    var markerEls = $$('[data-marker]', markers);
    var litCells = $$('.seq-ion__lit', honey);
    var tbRowsEls = $$('[data-prow]', proof);
    var netLines = $$('.seq-net__line', net);
    var netNodes = $$('.seq-net__node', net);
    var hub = function (id) { return $('[data-hub="' + id + '"]', net); };

    var order = ['open', 'mobilize', 'execute', 'closeout', 'footprint', 'proof', 'resolve'];
    var B = {};
    order.forEach(function (n) { B[n] = $('[data-beat="' + n + '"]', seq); });
    var caps = $$('[data-cap]', seq);
    var proofs = $$('[data-proof]', B.proof);
    var rail = $$('[data-rail]', seq);
    var logo = $('.seq__logo', seq);
    var resolveText = $$('.seq__resolve-line, .seq__cta', seq);
    var mobile = window.matchMedia('(max-width: 55.999rem)');

    /* Decode the resolve logo up front so the last beat never waits on it. */
    if (logo) { logo.loading = 'eager'; if (logo.decode) logo.decode().catch(function () {}); }

    /* Artboard point -> pixel position inside an untransformed layer
       (viewBox "meet" math, so a layer's live transform never leaks in). */
    function toLayer(x, y) {
      var vb = netSvg.viewBox.baseVal, Lw = netL.offsetWidth, Lh = netL.offsetHeight;
      var k = Math.min(Lw / vb.width, Lh / vb.height);
      return { x: (Lw - vb.width * k) / 2 + (x - vb.x) * k, y: (Lh - vb.height * k) / 2 + (y - vb.y) * k };
    }
    var wide = !mobile.matches;
    var OPEN_ZOOM = wide ? 2.05 : 1.55;      /* close on the RFP          */
    var SITE_ZOOM = wide ? 1.45 : 1.3;       /* site plan, honeycomb, bldg */
    var PROOF_ZOOM = wide ? 1.32 : 1;        /* title block               */
    var END_SCALE = 0.04;
    /* Camera that frames one piece of art so it fills the artwork column:
       its edges sit on the column edges, so the gap from the copy and the
       gap to the window edge both equal the page gutter. Measured in
       artboard units (getBBox, before any tween runs) and mapped with the
       viewBox math, so the result never depends on a layer's current
       transform. Phones keep the fixed zooms. */
    var VB = netSvg.viewBox.baseVal;
    var boxes = {};
    function measure(key, el) { if (el) boxes[key] = el.getBBox(); }
    function frame(key, fallback, fill) {
      var bb = boxes[key];
      if (!wide || !bb) return { scale: fallback, x: 0, y: 0 };
      var Lw = netL.offsetWidth, Lh = netL.offsetHeight;
      var beats = $('.seq__beats', seq);
      var side = beats ? beats.getBoundingClientRect().left : 0;      /* page gutter */
      var k = Math.min(Lw / VB.width, Lh / VB.height);
      var ox = (Lw - VB.width * k) / 2, oy = (Lh - VB.height * k) / 2;
      var w = bb.width * k, h = bb.height * k;
      var ax = ox + (bb.x - VB.x + bb.width / 2) * k, ay = oy + (bb.y - VB.y + bb.height / 2) * k;
      var sc = Math.min((Lw - 2 * side) / w, (Lh * (fill || 0.8)) / h);
      return { scale: sc, x: -sc * (ax - Lw / 2), y: -sc * (ay - Lh / 2) };
    }
    function cam(key, fallback, fill) {
      return {
        scale: function () { return frame(key, fallback, fill).scale; },
        x: function () { return frame(key, fallback, fill).x; },
        y: function () { return frame(key, fallback, fill).y; }
      };
    }
    measure('doc', $('.seq-doc__sheet', doc));
    measure('honey', honey);
    measure('proof', $('.seq-tb__frame', proof));
    measure('map', $('.seq-us', mapL));
    /* The map and its network share one camera (map + net layers). */
    function mapCam() { return frame('map', 1, 0.78); }
    function centre() { return { x: netL.offsetWidth / 2, y: netL.offsetHeight / 2 }; }
    /* Where North Carolina lands on screen once the map camera settles */
    function ncOnScreen() {
      var m = mapCam(), c = centre(), n = toLayer(nc[0], nc[1]);
      return { x: c.x + m.scale * (n.x - c.x) + m.x, y: c.y + m.scale * (n.y - c.y) + m.y };
    }
    /* The finished site shrinks onto that spot, at map scale */
    function siteShift(axis) {
      var c = centre(), b = toLayer(500, 320), n = ncOnScreen();
      return n[axis] - c[axis] - END_SCALE * mapCam().scale * (b[axis] - c[axis]);
    }
    /* The map starts 1.6x closer, held still on North Carolina */
    function mapFrom(axis) {
      var c = centre(), n = toLayer(nc[0], nc[1]), t = ncOnScreen();
      return t[axis] - c[axis] - 1.6 * mapCam().scale * (n[axis] - c[axis]);
    }

    /* ---- Intro: the solicitation arrives (plays on load) ----------- */
    gsap.set([siteL, planL], Object.assign({ transformOrigin: '50% 50%' }, frame('doc', OPEN_ZOOM, 0.8)));
    /* The RFP lands on its stack, its text sets in line by line, and a
       highlighter swipe marks the set-aside clause. */
    var docLines = $('.seq-doc__mono, .seq-doc__mono-mark, .seq-doc__head, .seq-doc__meta, .seq-doc__rule, .seq-doc__h:not(.seq-doc__h--flag), .seq-doc__line, .seq-doc__table, .seq-doc__sign, .seq-doc__caption', doc);
    var flagBox = $$('.seq-doc__swipe, .seq-doc__swipe-edge', doc), flagLines = $$('.seq-doc__flag-line, .seq-doc__h--flag', doc);
    gsap.fromTo($$('.seq-doc__shadow, .seq-doc__back', doc), { opacity: 0, y: 14 }, { opacity: function (i, el) { return el.classList.contains('seq-doc__back--2') ? 0.8 : el.classList.contains('seq-doc__back') ? 0.55 : 1; }, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08 });
    gsap.fromTo($('.seq-doc__sheet', doc), { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 0.15 });
    gsap.fromTo(docLines, { scaleX: 0, opacity: 0, transformOrigin: '0% 50%' }, { scaleX: 1, opacity: 1, duration: 0.6, ease: 'expo.out', stagger: 0.025, delay: 0.4 });
    gsap.fromTo(flagLines, { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.06, delay: 1.1 });
    gsap.fromTo(flagBox, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.9, ease: 'power3.inOut', delay: 1.35 });
    gsap.from($$('.seq__kicker, .seq__sub', B.open), { y: 16, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.1, delay: 0.35 });

    var tl = gsap.timeline({ defaults: { ease: 'none' } });
    var inBeat = function (el, at) { tl.fromTo(el, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 3.5, ease: 'power3.out' }, at); };
    var outBeat = function (el, at) { tl.to(el, { opacity: 0, y: -32, duration: 2.5, ease: 'power2.in' }, at); };

    /* 0-10 CONTRACT */
    outBeat(B.open, 7);

    /* 10-28 MOBILIZE: the paper opens into a technical site plan */
    tl.to([docLines, flagBox, flagLines], { opacity: 0, duration: 1.6 }, 8.5);
    tl.to(doc, { scale: 1.12, opacity: 0, svgOrigin: '500 300', duration: 3, ease: 'power2.inOut' }, 9);
    tl.fromTo([siteL, planL], cam('doc', OPEN_ZOOM, 0.8), Object.assign({ duration: 5, ease: 'power3.inOut', immediateRender: false }, cam('honey', SITE_ZOOM, 0.9)), 8.5);
    tl.set(plan, { opacity: 1 }, 10);
    tl.fromTo(gridLines, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.6, stagger: 0.05, ease: 'power2.inOut' }, 10.2);
    /* The honeycomb outline draws, then its hatch fills in */
    tl.fromTo($('.seq-plan__foot', foot), { strokeDashoffset: 1, fillOpacity: 0 }, { strokeDashoffset: 0, fillOpacity: 1, duration: 2.6, ease: 'power2.inOut' }, 13);
    tl.fromTo($('.seq-plan__hatch', foot), { opacity: 0 }, { opacity: 1, duration: 1.6 }, 14.6);
    tl.fromTo(annot, { opacity: 0 }, { opacity: 1, duration: 2 }, 14.5);
    inBeat(B.mobilize, 12);
    tl.set(markers, { opacity: 1 }, 18);
    tl.fromTo(markerEls, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.8, stagger: 0.6, ease: 'back.out(2.2)' }, 18);

    /* 28-58 EXECUTE: each capability floats in as a charged ion and
       bonds into a honeycomb around the Ionic mark; the honeycomb then
       holds as the finished deliverable for close out. */
    outBeat(B.mobilize, 26);
    tl.to(markers, { opacity: 0, duration: 2.5 }, 27);
    tl.to(annot, { opacity: 0, duration: 2 }, 27);
    /* The blueprint steps aside fully (no repaint cost under the ions) */
    tl.to(planL, { autoAlpha: 0, duration: 2.5 }, 28);
    tl.fromTo(netL, { opacity: 0.001 }, { opacity: 1, duration: 1 }, 29);
    inBeat(B.execute, 29.5);
    tl.set(honey, { opacity: 1 }, 30);
    tl.fromTo(core, { scale: 0.6, opacity: 0, svgOrigin: '500 320' }, { scale: 1, opacity: 1, duration: 2, ease: 'back.out(1.8)' }, 30.5);
    var halo = $('.seq-ion__halo', honey);
    if (halo) tl.fromTo(halo, { opacity: 0, scale: 1.25, svgOrigin: '500 320' }, { opacity: 1, scale: 1, duration: 2.4, ease: 'power3.out' }, 31);
    ions.forEach(function (ion, i) {
      var at = 33 + i * 3.2;
      var x = +ion.getAttribute('data-x') - 500, y = +ion.getAttribute('data-y') - 320;
      var charge = $('.seq-ion__charge', ion), orbit = $('.seq-ion__orbit', ion);
      /* Start far out along the cell's own bearing, drifting and turned */
      var jx = (i % 2 ? 1 : -1) * 60, jy = (i % 3 - 1) * 50;
      tl.fromTo(ion, { x: x * 1.4 + jx, y: y * 1.4 + jy, rotation: (i % 2 ? 40 : -40), scale: 0.55, opacity: 0, transformOrigin: '50% 50%' },
        { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 2.4, ease: 'power3.out' }, at);
      tl.fromTo(charge, { opacity: 0 }, { opacity: 1, duration: 0.4 }, at);
      tl.to(charge, { opacity: 0, duration: 0.8 }, at + 2.6);
      tl.fromTo(orbit, { opacity: 0, rotation: -24, transformOrigin: '50% 50%' }, { opacity: 1, rotation: 96, duration: 2.4, ease: 'power2.out' }, at);
      tl.to(orbit, { opacity: 0, duration: 0.7 }, at + 2.3);
    });
    /* 58-72 CLOSE OUT: one orange trace around the honeycomb, then each
       cell lights up as it is handed over */
    outBeat(B.execute, 57);
    tl.set(outline, { opacity: 1 }, 59);
    tl.fromTo(outline, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 5, ease: 'power1.inOut' }, 59);
    inBeat(B.closeout, 60);
    tl.to(outline, { opacity: 0, duration: 2 }, 64.5);
    tl.fromTo(dusk, { opacity: 0 }, { opacity: 1, duration: 3.5 }, 64.5);
    tl.fromTo(litCells, { opacity: 0 }, { opacity: 1, duration: 1, stagger: 0.45, ease: 'power2.out' }, 65.2);

    /* 72-86 FOOTPRINT: pull back; the site shrinks onto North Carolina */
    outBeat(B.closeout, 70.5);
    tl.to(siteL, {
      scale: function () { return END_SCALE * mapCam().scale; },
      x: function () { return siteShift('x'); },
      y: function () { return siteShift('y'); },
      duration: 6.5, ease: 'power3.inOut'
    }, 72);
    tl.to(siteL, { opacity: 0, duration: 1.5 }, 77);
    tl.fromTo(mapL, { opacity: 0.001, scale: function () { return 1.6 * mapCam().scale; }, x: function () { return mapFrom('x'); }, y: function () { return mapFrom('y'); }, transformOrigin: '50% 50%' },
      { opacity: 1, scale: function () { return mapCam().scale; }, x: function () { return mapCam().x; }, y: function () { return mapCam().y; }, duration: 6.5, ease: 'power3.inOut' }, 72);
    tl.set(netL, { scale: function () { return mapCam().scale; }, x: function () { return mapCam().x; }, y: function () { return mapCam().y; }, transformOrigin: '50% 50%' }, 72);
    tl.fromTo(net, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 76);
    inBeat(B.footprint, 74);
    ['nc', 'tx', 'fl'].forEach(function (id, i) {
      var h = hub(id);
      if (!h) return;
      var at = 77 + i * 2;
      tl.fromTo($('.seq-hub__dot', h), { scale: 0.4, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, duration: 1.2, ease: 'back.out(3)' }, at);
      tl.fromTo($('.seq-hub__pulse', h), { attr: { r: 8 }, opacity: 0.95 }, { attr: { r: 46 }, opacity: 0, duration: 2.4, ease: 'power2.out' }, at);
    });
    tl.fromTo(netLines, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.4, stagger: 0.18, ease: 'power1.inOut' }, 81.5);
    tl.fromTo(netNodes, { scale: 0.4, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, duration: 1, stagger: 0.18 }, 82);
    tl.fromTo($$('[data-loc]', B.footprint), { opacity: 0.3 }, { opacity: 1, duration: 1.1, stagger: 2 }, 76.5);
    tl.fromTo($$('.seq__sectors li', B.footprint), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.9, ease: 'power3.out' }, 82);

    /* 86-96 PROOF: the title block; each credential is checked off */
    outBeat(B.footprint, 85.5);
    tl.to(mapL, { opacity: 0.001, duration: 2.5 }, 86);
    tl.to(net, { opacity: 0, duration: 2 }, 86);
    tl.set(proof, { opacity: 1 }, 86.5);
    tl.fromTo(netL, { scale: function () { return mapCam().scale; }, x: function () { return mapCam().x; }, y: function () { return mapCam().y; }, transformOrigin: '50% 50%' }, Object.assign({ duration: 3, ease: 'power3.inOut' }, cam('proof', PROOF_ZOOM, 0.62)), 86);
    tl.fromTo($('.seq-tb__frame', proof), { strokeDashoffset: 1, fillOpacity: 0 }, { strokeDashoffset: 0, fillOpacity: 1, duration: 1.4, ease: 'power2.inOut' }, 86.5);
    tl.fromTo($('.seq-tb__head', proof), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 87.2);
    tl.fromTo(tbRowsEls, { opacity: 0 }, { opacity: 0.4, duration: 0.8, stagger: 0.08 }, 87.2);
    inBeat(B.proof, 87);
    tbRowsEls.forEach(function (row, i) {
      var at = 88 + i * 1;
      tl.to(plock, { y: tbRows[i] - tbRows[0], opacity: 1, duration: i ? 0.45 : 0.01, ease: 'power2.inOut' }, at);
      tl.to(row, { opacity: 1, duration: 0.4 }, at + 0.3);
      tl.to($('.seq-tb__check', row), { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out' }, at + 0.35);
    });
    tl.to(plock, { opacity: 0, duration: 0.8 }, 95.2);

    /* 96-100 RESOLVE: the title block gives way to the real logo */
    outBeat(B.proof, 95);
    tl.to(proof, { scale: 0.92, opacity: 0, svgOrigin: tbC[0] + ' ' + tbC[1], duration: 1.6, ease: 'power2.in' }, 95.5);
    tl.to(B.resolve, { opacity: 1, duration: 2 }, 96.5);
    if (logo) tl.fromTo(logo, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 2, ease: 'expo.out' }, 97);
    tl.fromTo(resolveText, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, stagger: 0.4, ease: 'power3.out' }, 98);
    tl.to({}, { duration: 0.6 }, 99.9);

    /* ---- UI state that follows the playhead ------------------------ */
    var bounds = [10, 28, 58, 72, 86, 96, 101];
    var lastBeat = -1, lastCap = -2, lastProof = -2;
    function mark(list, idx) {
      list.forEach(function (li, i) {
        li.setAttribute('data-on', i === idx ? 'true' : 'false');
        li.setAttribute('data-done', i < idx ? 'true' : 'false');
      });
    }
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
      var ci = P < 33 ? -1 : P >= 52 ? caps.length : clamp(Math.floor((P - 33) / 3.2), 0, caps.length - 1);
      if (ci !== lastCap) { mark(caps, ci); lastCap = ci; }
      var pi = P < 88 ? -1 : P >= 95.2 ? proofs.length : clamp(Math.floor(P - 88), 0, proofs.length - 1);
      if (pi !== lastProof) { mark(proofs, pi); lastProof = pi; }
    }
    sync(0);

    var st = ST.create({
      trigger: seq,
      pin: pin,
      start: 'top top',
      end: function () { return '+=' + Math.round(window.innerHeight * (mobile.matches ? 3.8 : 5.2)); },
      scrub: 0.35,
      animation: tl,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: function (self) { sync(self.progress); }
    });

    /* Keyboard users tabbing to a control inside a not-yet-visible beat
       are scrolled to where that beat is on screen. */
    var atFor = { open: 0, mobilize: 0.2, execute: 0.45, closeout: 0.67, footprint: 0.8, proof: 0.93, resolve: 0.995 };
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

  /* If the user flips the reduced-motion switch, reload the behavior
     contract rather than leaving a half-animated page behind. */
  reduceMotion.addEventListener('change', function () { window.location.reload(); });
})();
