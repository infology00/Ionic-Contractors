/* =============================================================================
   Ionic Contractors — optional ambient hero motif
   -----------------------------------------------------------------------------
   OFF BY DEFAULT. The shipping default for this site is the pure-CSS ambient
   treatment on .hero (gradient + masked grid): 0 KB of JS, no canvas, no
   motion, nothing for a Section 508 audit to catch.

   If the 508 review is comfortable with a subtle moving motif, set
       window.IONIC_HERO_MOTIF = true;
   in config.js. Guard rails, all deliberate:

     · prefers-reduced-motion: reduce  -> never runs (CSS also hides the canvas)
     · viewport under 900px            -> never runs (mobile ceiling)
     · <= 4 logical cores or <= 4 GB   -> never runs (low-end devices)
     · canvas is aria-hidden + inert   -> invisible to assistive tech
     · position:absolute inside .hero  -> cannot cause layout shift (zero CLS)
     · pauses when the tab is hidden   -> no background CPU burn
     · carries zero information        -> purely decorative, safe to drop

   ~2 KB, no dependencies, no WebGL.
   ============================================================================= */
(function () {
  'use strict';

  if (window.IONIC_HERO_MOTIF !== true) return;

  var hero = document.querySelector('.hero');
  if (!hero) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(max-width: 899px)').matches) return;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return;
  if (navigator.deviceMemory && navigator.deviceMemory <= 4) return;

  var canvas = document.createElement('canvas');
  canvas.className = 'hero__motif';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.setAttribute('role', 'presentation');
  hero.insertBefore(canvas, hero.firstChild);

  var ctx = canvas.getContext('2d');
  if (!ctx) { canvas.remove(); return; }

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var w = 0, h = 0, nodes = [], raf = null;

  function resize() {
    var rect = hero.getBoundingClientRect();
    w = rect.width; h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var count = Math.min(52, Math.round((w * h) / 26000));
    nodes = [];
    for (var i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.09,   // deliberately slow drift
        vy: (Math.random() - 0.5) * 0.09,
        r: 1 + Math.random() * 1.4
      });
    }
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0) n.x = w; else if (n.x > w) n.x = 0;
      if (n.y < 0) n.y = h; else if (n.y > h) n.y = 0;

      for (var j = i + 1; j < nodes.length; j++) {
        var m = nodes[j];
        var dx = n.x - m.x, dy = n.y - m.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < 21000) {
          ctx.strokeStyle = 'rgba(150, 190, 225, ' + (0.16 * (1 - d2 / 21000)).toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(m.x, m.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = 'rgba(217, 164, 65, 0.32)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    raf = window.requestAnimationFrame(frame);
  }

  function start() { if (raf === null) raf = window.requestAnimationFrame(frame); }
  function stop() { if (raf !== null) { window.cancelAnimationFrame(raf); raf = null; } }

  resize();
  start();

  var resizeTimer;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      if (window.matchMedia('(max-width: 899px)').matches) { stop(); canvas.remove(); return; }
      resize();
    }, 200);
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });
})();
