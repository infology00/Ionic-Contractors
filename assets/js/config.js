/* =============================================================================
   Ionic Contractors — launch configuration
   -----------------------------------------------------------------------------
   Set these two values during the dev working session. Both are intentionally
   empty so nothing fires against a placeholder property and no lead is silently
   dropped into a dead endpoint.
   ============================================================================= */

/* Google Analytics 4 measurement ID, e.g. 'G-XXXXXXXXXX'.
   Leave empty and no analytics script is loaded at all. */
window.IONIC_GA4_ID = '';

/* Lead-capture endpoint (CRM webhook or form service URL).
   Receives a multipart POST with every field plus:
     lead_type   co | teaming | subcontractor | capability | contact
     lead_label  human-readable version of lead_type
     source_page absolute URL of the submitting page
   Route on lead_type so CO inquiries, teaming leads and subcontractor
   registrations land in separate queues.
   Leave empty and forms fall back to an email hand-off. */
window.IONIC_FORM_ENDPOINT = '';

/* Ambient hero motif — the "LIGHTEST ACCENT" 3D decision.
   false (default): pure-CSS ambient treatment only. No canvas, no motion,
   no JS cost, nothing for a Section 508 audit to flag. This is the
   recommended ship state.
   true: enables the slow decorative wireframe field in assets/js/hero-motif.js,
   which still refuses to run under reduced-motion, on mobile, or on low-end
   devices. Flip only if the 508 review is comfortable with it. */
window.IONIC_HERO_MOTIF = false;

/* ---------------------------------------------------------------------------
   GA4 loader — no-ops until a measurement ID is present.
   --------------------------------------------------------------------------- */
(function () {
  'use strict';
  var id = window.IONIC_GA4_ID;
  if (!id) return;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', id, { anonymize_ip: true });
})();
