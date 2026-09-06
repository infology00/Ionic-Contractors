/* ==================================================================
   IONIC CONTRACTORS — site behaviour
   ------------------------------------------------------------------
   Everything here is an enhancement. With this file removed the site
   still renders all of its content, all links work, and forms fall
   back to a plain mailto: submission.
================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Cross-fade ramp length, in stage-progress units. Beat windows in
     the page templates are spaced so each fade-out overlaps the next
     fade-in by exactly this much. */
  var FADE = 0.17;

  var clamp = function (v, min, max) { return v < min ? min : v > max ? max : v; };
  var lerp = function (a, b, t) { return a + (b - a) * t; };

  /* Normalised 0..1 progress of `v` inside [a, b]. */
  function range(v, a, b) { return clamp((v - a) / (b - a || 1), 0, 1); }

  /* Smootherstep — used to ease beat transitions without a library. */
  function ease(t) { return t * t * t * (t * (t * 6 - 15) + 10); }

  var motionOK = function () { return !reduceMotion.matches; };

  /* ================================================================
     rAF ticker — one loop drives Lenis, the film scrub and parallax.

     The loop parks itself when nothing is moving. A permanently
     running rAF keeps a laptop fan on and a phone battery draining
     for a page that is sitting still, so each ticker reports whether
     it still needs frames and the loop stops when they all say no.
     Any input wakes it again.
  ================================================================ */
  var tickers = [];
  var rafId = null;
  var idleCountdown = 0;

  function addTicker(fn) { tickers.push(fn); wake(); }

  /* Keep running for `frames` more frames, and restart if parked. */
  function wake(frames) {
    idleCountdown = Math.max(idleCountdown, frames || 40);
    if (rafId === null) rafId = requestAnimationFrame(frame);
  }

  function frame(time) {
    var busy = false;
    for (var i = 0; i < tickers.length; i++) {
      if (tickers[i](time)) busy = true;
    }
    if (busy) idleCountdown = Math.max(idleCountdown, 8);
    idleCountdown--;
    if (idleCountdown <= 0) { rafId = null; return; }   // park
    rafId = requestAnimationFrame(frame);
  }

  /* Anything that can change what is on screen wakes the loop. */
  ['scroll', 'wheel', 'touchmove', 'touchstart', 'keydown', 'resize', 'orientationchange']
    .forEach(function (evt) {
      window.addEventListener(evt, function () { wake(); }, { passive: true });
    });

  /* ================================================================
     LENIS — subtle smooth scrolling
     Deliberately light: enough to take the edge off wheel steps and
     to make the film scrub feel continuous, not enough to feel like
     the page is sliding around on its own.
  ================================================================ */
  var lenis = null;

  function initLenis() {
    if (!window.Lenis || !motionOK()) return;
    /* Touch devices keep their native momentum — smoothing there
       fights the platform and hurts more than it helps. */
    lenis = new window.Lenis({
      lerp: 0.11,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
      anchors: false
    });

    addTicker(function (time) {
      lenis.raf(time);
      return !!lenis.isScrolling;
    });

    /* In-page anchors go through Lenis so they land smoothly, but
       focus is still moved so keyboard users are not stranded. */
    document.addEventListener('click', function (e) {
      var link = e.target.closest && e.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, {
        offset: -(parseFloat(getComputedStyle(root).getPropertyValue('--header-h')) || 80) - 16,
        onComplete: function () {
          if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      });
    });
  }

  /* ================================================================
     HEADER — solid background once the hero film is behind us
  ================================================================ */
  function initHeader() {
    var header = document.querySelector('[data-header]');
    if (!header) return;
    var last = null;
    var update = function () {
      var scrolled = window.scrollY > 24;
      if (scrolled !== last) {
        header.setAttribute('data-scrolled', scrolled ? 'true' : 'false');
        last = scrolled;
      }
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ================================================================
     MOBILE DRAWER — real off-canvas nav with a focus trap
  ================================================================ */
  function initDrawer() {
    var btn = document.querySelector('[data-menu-btn]');
    var drawer = document.querySelector('[data-drawer]');
    if (!btn || !drawer) return;

    var closeBtn = drawer.querySelector('[data-drawer-close]');
    var lastFocus = null;

    function focusables() {
      return Array.prototype.filter.call(
        drawer.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
        function (el) { return el.offsetParent !== null; }
      );
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
      /* Return focus where it came from; if that is no longer a real
         target, put it on the toggle so the tab order never resets to
         the top of the document. */
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

    /* Following a link inside the drawer should close it */
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a[href]')) close();
    });

    /* Escaping to desktop width must not leave the page scroll-locked */
    window.matchMedia('(min-width: 76rem)').addEventListener('change', function (e) {
      if (e.matches && drawer.getAttribute('data-open') === 'true') close();
    });
  }

  /* ================================================================
     ACCORDION
  ================================================================ */
  function initAccordions() {
    var triggers = document.querySelectorAll('[data-accordion-trigger]');
    Array.prototype.forEach.call(triggers, function (trigger) {
      var panel = document.getElementById(trigger.getAttribute('aria-controls'));
      if (!panel) return;

      /* JS owns the closed state from here; the markup ships open so
         the content is readable without JS. */
      var startOpen = trigger.getAttribute('aria-expanded') === 'true';
      panel.style.height = startOpen ? 'auto' : '0px';
      if (!startOpen) panel.setAttribute('hidden', '');
      panel.style.transition = motionOK() ? 'height 380ms cubic-bezier(0.22,0.61,0.36,1)' : 'none';

      /* Run `fn` when the height transition ends — or on a timer if it
         never fires (reduced motion, a background tab, a browser that
         skips a zero-length transition). Without the fallback a
         collapsed panel can stay in the tab order and the a11y tree
         while looking shut. */
      function onSettled(fn) {
        var done = false;
        var finish = function () {
          if (done) return;
          done = true;
          panel.removeEventListener('transitionend', finish);
          window.clearTimeout(timer);
          fn();
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
     SCROLL REVEAL
  ================================================================ */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (!motionOK() || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(items, function (el) { el.setAttribute('data-shown', 'true'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute('data-shown', 'true');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  }

  /* ================================================================
     FILM STAGE — scroll-scrubbed video with 3D copy beats
  ================================================================ */
  function initStage(stage) {
    var track = stage.querySelector('[data-track]');
    var video = stage.querySelector('[data-video]');
    var beats = Array.prototype.slice.call(stage.querySelectorAll('[data-beat]'));
    var hudFill = stage.querySelector('[data-hud-pct]');
    var cue = stage.querySelector('[data-anim-loop].stage__cue');
    var cueIdle = null;
    if (!track) return null;

    var progress = 0;          // eased progress actually rendered
    var targetProgress = 0;    // raw progress from scroll position
    var scrubTime = 0;         // eased video time
    var ready = false;

    /* ---- Video readiness ---------------------------------------- */
    function prepareVideo() {
      if (!video) return;
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');

      var markReady = function () {
        if (ready) return;
        ready = true;
        video.setAttribute('data-ready', 'true');
        stage.setAttribute('data-video-ready', 'true');
      };

      /* Some engines will not decode a frame until playback has been
         kicked once. Play-then-pause forces the first decode without
         ever being audible or visibly playing. */
      var kick = function () {
        var p = video.play();
        if (p && p.then) p.then(function () { video.pause(); markReady(); }).catch(markReady);
        else { video.pause(); markReady(); }
      };

      if (video.readyState >= 2) kick();
      else video.addEventListener('loadeddata', kick, { once: true });
      video.addEventListener('error', function () { stage.setAttribute('data-video-error', 'true'); });
    }

    /* Lazily attach the source for stages further down the page. */
    var lazySrc = video && video.getAttribute('data-src-desktop');
    function attachSource() {
      if (!video) return;
      /* The eager stage already carries a src in the markup so the
         browser can start buffering during HTML parse; only the lazy
         stages need one attached here. */
      if (!video.getAttribute('src')) {
        var small = video.getAttribute('data-src-mobile');
        var useSmall = window.matchMedia('(max-width: 47.999rem)').matches;
        video.src = (useSmall && small) ? small : lazySrc;
        video.load();
      }
      prepareVideo();
    }

    if (video) {
      if (stage.getAttribute('data-eager') === 'true') attachSource();
      else if ('IntersectionObserver' in window) {
        var srcIO = new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting) { attachSource(); srcIO.disconnect(); }
        }, { rootMargin: '150% 0px' });
        srcIO.observe(stage);
      } else attachSource();
    }

    /* ---- Beat windows -------------------------------------------- */
    /* Tracks each beat's active state so the first render always applies. */
    var beatActive = beats.map(function () { return null; });

    var windows = beats.map(function (beat, i) {
      var start = parseFloat(beat.getAttribute('data-beat-start'));
      var end = parseFloat(beat.getAttribute('data-beat-end'));
      if (isNaN(start) || isNaN(end)) {
        start = i / beats.length;
        end = (i + 1) / beats.length;
      }
      return { start: start, end: end };
    });

    function renderBeats(p) {
      for (var i = 0; i < beats.length; i++) {
        var beat = beats[i];
        var w = windows[i];
        var span = w.end - w.start;
        /* A constant ramp length is what makes the cross-fades line up:
           each beat's fade-out occupies exactly the window the next
           beat's fade-in does, so the stage is never blank. */
        var fade = Math.min(FADE, span * 0.5);

        /* A beat that opens the stage is already at rest when the page
           loads — it must not fade up from nothing at scroll top. A
           beat that closes it stays put rather than fading to nothing
           just as the stage releases. */
        var enter = w.start <= 0.0001 ? 1 : ease(range(p, w.start, w.start + fade));
        var exit = w.end >= 0.9999 ? 0 : ease(range(p, w.end - fade, w.end));
        var alpha = clamp(Math.min(enter, 1 - exit), 0, 1);

        /* Depth: arrive from far away, settle at rest, then pass the
           camera on the way out. Entry and exit never overlap, so the
           two halves simply sum. */
        var z = lerp(-320, 0, enter) + lerp(0, 240, exit);
        var y = lerp(52, 0, enter) + lerp(0, -52, exit);
        var scale = lerp(0.93, 1, enter) * lerp(1, 1.06, exit);
        var blur = (1 - enter) * 8 + exit * 6;

        beat.style.setProperty('--bo', alpha.toFixed(3));
        beat.style.setProperty('--bz', z.toFixed(1));
        beat.style.setProperty('--by', y.toFixed(1));
        beat.style.setProperty('--bs', scale.toFixed(3));
        beat.style.setProperty('--bblur', blur.toFixed(2));

        /* Compared against JS-held state, not the markup attribute, so
           the very first pass always applies — otherwise the beats
           that ship as data-active="false" would never actually be
           made inert, leaving invisible CTAs in the tab order. */
        var active = alpha > 0.55;
        if (active !== beatActive[i]) {
          beatActive[i] = active;
          beat.setAttribute('data-active', active ? 'true' : 'false');
          /* Keeps off-screen CTAs out of the tab order and out of the
             accessibility tree while they are faded out. */
          if ('inert' in beat) beat.inert = !active;
          else if (active) beat.removeAttribute('aria-hidden');
          else beat.setAttribute('aria-hidden', 'true');
        }
      }
    }

    function measure() {
      var rect = track.getBoundingClientRect();
      var distance = track.offsetHeight - window.innerHeight;
      if (distance <= 0) return 0;
      return clamp(-rect.top / distance, 0, 1);
    }

    function tick() {
      targetProgress = measure();
      /* A touch of easing on top of Lenis keeps the film from
         stepping when a trackpad delivers big scroll jumps. */
      progress = lerp(progress, targetProgress, 0.16);
      if (Math.abs(progress - targetProgress) < 0.0004) progress = targetProgress;

      stage.style.setProperty('--p', progress.toFixed(4));
      renderBeats(progress);

      if (hudFill) {
        var pct = Math.round(progress * 100);
        if (hudFill.textContent !== pct + '%') hudFill.textContent = pct + '%';
      }

      /* The scroll cue is invisible past a sliver of progress; stop
         animating it there rather than looping behind opacity 0. */
      if (cue) {
        var hide = progress > 0.02;
        if (hide !== cueIdle) { cue.setAttribute('data-anim-idle', hide ? 'true' : 'false'); cueIdle = hide; }
      }

      var busy = Math.abs(progress - targetProgress) > 0.0002;

      if (ready && video && video.duration) {
        var want = progress * video.duration * 0.995;
        scrubTime = lerp(scrubTime, want, 0.22);
        /* Only seek when the delta is worth a frame, and never while a
           previous seek is still resolving — that is what makes
           scrubbing stutter. */
        if (!video.seeking && Math.abs(video.currentTime - scrubTime) > 1 / 48) {
          try { video.currentTime = scrubTime; } catch (err) { /* seek raced a reload */ }
          busy = true;
        }
        if (Math.abs(scrubTime - want) > 1 / 48) busy = true;
      }

      return busy;
    }

    /* Render once, synchronously, at init. The stage is then correct —
       including `inert` on the beats that are faded out — without
       waiting for an animation frame that may be delayed or, in a
       background tab, may not arrive at all. */
    progress = targetProgress = measure();
    stage.style.setProperty('--p', progress.toFixed(4));
    renderBeats(progress);

    return { tick: tick, stage: stage };
  }

  function initStages() {
    var stages = document.querySelectorAll('[data-stage]');
    if (!stages.length) return;

    if (!motionOK()) return;   // static poster treatment, handled in CSS

    var instances = [];
    Array.prototype.forEach.call(stages, function (stage) {
      var inst = initStage(stage);
      if (inst) instances.push(inst);
    });
    if (!instances.length) return;

    addTicker(function () {
      var busy = false;
      for (var i = 0; i < instances.length; i++) {
        if (instances[i].tick()) busy = true;
      }
      return busy;
    });

    /* A video that finishes buffering after the loop has parked still
       needs one pass to paint its first scrubbed frame. */
    document.addEventListener('loadeddata', function () { wake(); }, true);
  }

  /* ================================================================
     LOOPING ANIMATIONS — pause them when they are not being watched
  ================================================================ */
  function initAnimationIdling() {
    var loops = document.querySelectorAll('[data-anim-loop]');
    if (!loops.length) return;

    var setIdle = function (el, idle) {
      var next = idle ? 'true' : 'false';
      if (el.getAttribute('data-anim-idle') !== next) el.setAttribute('data-anim-idle', next);
    };

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) { setIdle(entry.target, !entry.isIntersecting); });
      }, { rootMargin: '10% 0px' });
      Array.prototype.forEach.call(loops, function (el) { io.observe(el); });
    }

    /* Nothing should keep animating in a background tab. */
    document.addEventListener('visibilitychange', function () {
      Array.prototype.forEach.call(loops, function (el) {
        if (document.hidden) setIdle(el, true);
      });
      if (!document.hidden) wake();
    });
  }

  /* ================================================================
     POINTER PARALLAX — a few pixels of depth, pointer only
  ================================================================ */
  function initParallax() {
    if (!motionOK()) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var targetX = 0, targetY = 0, x = 0, y = 0;

    window.addEventListener('pointermove', function (e) {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;
      wake();
    }, { passive: true });

    addTicker(function () {
      x = lerp(x, targetX, 0.07);
      y = lerp(y, targetY, 0.07);
      root.style.setProperty('--px', x.toFixed(4));
      root.style.setProperty('--py', y.toFixed(4));
      return Math.abs(x - targetX) > 0.0015 || Math.abs(y - targetY) > 0.0015;
    });
  }

  /* ================================================================
     PRELOADER
     Only present on pages with an eager film stage. It waits on real
     buffering, reports real progress, and always lets go.
  ================================================================ */
  function initPreloader() {
    var pre = document.querySelector('[data-preloader]');
    if (!pre) return;

    /* Reduced motion gets no film to wait on, and the preloader is
       hidden by CSS there. Without this it would still lock the page
       scroll behind an invisible overlay. */
    if (!motionOK()) { pre.remove(); return; }

    var fill = pre.querySelector('[data-preloader-fill]');
    var video = document.querySelector('[data-stage][data-eager="true"] [data-video]');
    var done = false;
    var pct = 0;

    function finish() {
      if (done) return;
      done = true;
      pre.setAttribute('data-done', 'true');
      if (fill) fill.style.inlineSize = '100%';
      document.body.style.overflow = '';
      if (lenis) lenis.start();
      /* Hand focus to the top of the page so keyboard order is sane */
      window.setTimeout(function () { pre.remove(); }, 700);
    }

    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();

    /* Report whatever the browser will tell us; creep forward so the
       bar never looks frozen on a slow connection. */
    var creep = window.setInterval(function () {
      var real = 0;
      if (video && video.buffered && video.buffered.length && video.duration) {
        real = (video.buffered.end(video.buffered.length - 1) / video.duration) * 100;
      }
      pct = Math.max(pct + 3, real);
      pct = Math.min(pct, 96);
      if (fill) fill.style.inlineSize = pct + '%';
    }, 120);

    function ok() { window.clearInterval(creep); finish(); }

    if (video) {
      if (video.readyState >= 3) ok();
      else {
        video.addEventListener('canplaythrough', ok, { once: true });
        video.addEventListener('error', ok, { once: true });
      }
    }
    window.addEventListener('load', function () { window.setTimeout(ok, 400); });
    /* Hard ceiling — the page must never be held hostage by a stall. */
    window.setTimeout(ok, 4500);
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
    var forms = document.querySelectorAll('[data-form]');
    Array.prototype.forEach.call(forms, function (form) {
      var status = form.querySelector('[data-form-status]');
      var fields = Array.prototype.slice.call(form.querySelectorAll('.input, .select, .textarea'));
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
    var subject = form.getAttribute('data-subject') || 'Website enquiry';
    var to = form.getAttribute('data-to') || 'service@ionic.contractors';
    var endpoint = form.getAttribute('data-endpoint');

    /* Analytics hook — split CO vs teaming vs subcontractor leads.
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

    /* If a real endpoint is ever wired up, it takes over from here. */
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
        'pre-filled — press send to deliver it. If nothing opened, ' +
        '<a href="' + mailHref + '">click here to open it manually</a> or email ' +
        '<a href="mailto:service@ionic.contractors">service@ionic.contractors</a> directly.';
    } else {
      text.textContent = 'Thank you — your enquiry has been received. We respond to agency and teaming enquiries promptly, usually the same business day.';
      form.reset();
    }
    status.focus && status.focus();
  }

  /* ================================================================
     BOOT
  ================================================================ */
  function boot() {
    initLenis();
    initHeader();
    initDrawer();
    initAccordions();
    initReveal();
    initStages();
    initAnimationIdling();
    initParallax();
    initCopy();
    initForms();
    initPreloader();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  /* If the user flips the reduced-motion switch, reload the behaviour
     contract rather than leaving a half-animated page behind. */
  reduceMotion.addEventListener('change', function () { window.location.reload(); });
})();
