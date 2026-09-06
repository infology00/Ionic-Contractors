/* ------------------------------------------------------------------
   Shared building blocks. Every page composes from these so the
   card / button / section language stays identical site-wide.
------------------------------------------------------------------- */

import { site, addressLine, capabilities } from './site.mjs';

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* Plain text for structured data: drop markup, decode the few entities
   the copy actually uses, collapse whitespace. */
export const stripTags = (s = '') =>
  String(s)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&mdash;/g, '—').replace(/&rsquo;/g, '’').replace(/&eacute;/g, 'é')
    .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/* FAQPage structured data built from the same array that renders the
   accordion, so the markup and the schema can never drift apart. */
export function faqLD(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: stripTags(item.q),
      acceptedAnswer: { '@type': 'Answer', text: stripTags(item.a) },
    })),
  };
}

const attr = (s = '') => esc(s).replace(/'/g, '&#39;');

/* ==================================================================
   ICONS — inline so there is no sprite request and they inherit
   currentColor. 1.5px strokes to match the type weight.
================================================================== */
const svg = (body, size = 20, viewBox = '0 0 24 24') =>
  `<svg width="${size}" height="${size}" viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;

export const icons = {
  arrow: (s = 16) => svg('<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>', s),
  check: (s = 16) => svg('<path d="m4 12.5 5 5L20 6.5"/>', s),
  plus: (s = 12) => svg('<path d="M12 5v14"/><path d="M5 12h14"/>', s),
  phone: (s = 18) => svg('<path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5L16 12l4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3Z"/>', s),
  mail: (s = 18) => svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6 8.5-6"/>', s),
  pin: (s = 18) => svg('<path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>', s),
  alert: (s = 14) => svg('<path d="M12 8v5"/><path d="M12 16.5h.01"/><circle cx="12" cy="12" r="9"/>', s),
  info: (s = 16) => svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 7.5h.01"/>', s),
  copy: (s = 13) => svg('<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>', s),
  download: (s = 16) => svg('<path d="M12 4v11"/><path d="m7.5 10.5 4.5 4.5 4.5-4.5"/><path d="M4.5 19h15"/>', s),
  lock: (s = 16) => svg('<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V7a3.5 3.5 0 0 1 7 0v3.5"/>', s),
  scroll: (s = 14) => svg('<path d="M12 5v13"/><path d="m7.5 13.5 4.5 4.5 4.5-4.5"/>', s),

  /* Capability marks */
  construction: (s = 22) => svg('<path d="M3 20h18"/><path d="M6 20V9.5l6-4 6 4V20"/><path d="M10 20v-5h4v5"/><path d="M12 5.5V3"/>', s),
  tree: (s = 22) => svg('<path d="M12 21v-4"/><path d="M12 3 6.5 11h3L5 17h14l-4.5-6h3L12 3Z"/>', s),
  wrench: (s = 22) => svg('<path d="M15.5 4.5a4.5 4.5 0 0 0-5.9 5.7l-5.3 5.3a2 2 0 0 0 2.8 2.8l5.3-5.3a4.5 4.5 0 0 0 5.7-5.9L15.7 9 13 8.3l-.7-2.7 3.2-1.1Z"/>', s),
  spray: (s = 22) => svg('<rect x="6" y="9" width="8" height="12" rx="2"/><path d="M8.5 9V5.5h3V9"/><path d="M16.5 5h.01"/><path d="M19 7.5h.01"/><path d="M16.5 10h.01"/><path d="M19 12.5h.01"/>', s),
  route: (s = 22) => svg('<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6h5a3.5 3.5 0 0 1 0 7h-3a3.5 3.5 0 0 0 0 7h5"/>', s),
  compass: (s = 22) => svg('<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>', s),

  handshake: (s = 22) => svg('<path d="m11 17 1.5 1.5a1.8 1.8 0 0 0 2.6-2.5"/><path d="M3 11.5 7 7.5l3.5 1 3-1 4 4"/><path d="m8.5 14.5 2.5 2.5"/><path d="M17.5 12.5 21 9"/><path d="M3 9.5 6.5 13"/>', s),
  shield: (s = 22) => svg('<path d="M12 3.5 5 6.2v5.4c0 4.3 2.9 7.7 7 8.9 4.1-1.2 7-4.6 7-8.9V6.2L12 3.5Z"/><path d="m9 12 2 2 4-4"/>', s),
  doc: (s = 22) => svg('<path d="M14 3.5H7.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8l-4.5-4.5Z"/><path d="M14 3.5V8h4.5"/><path d="M9 13h6"/><path d="M9 16.5h4"/>', s),
  building: (s = 22) => svg('<path d="M4 20h16"/><path d="M6 20V4.5h8V20"/><path d="M14 9h4v11"/><path d="M8.5 8h3"/><path d="M8.5 11.5h3"/><path d="M8.5 15h3"/>', s),
  users: (s = 22) => svg('<circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M16 5.5a3 3 0 0 1 0 5.8"/><path d="M17.5 14.5a5.5 5.5 0 0 1 3 4.5"/>', s),
  clock: (s = 22) => svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 1.8"/>', s),
};

/* ==================================================================
   BRAND MARK
   A geometric monogram built for the site. This is Ionic's own
   wordmark lockup — it deliberately does NOT stand in for the
   official SDVOSB certification seal, which is supplied separately.
================================================================== */
export function brandMark(size = 36) {
  return `<svg class="brand__mark" width="${size}" height="${size}" viewBox="0 0 44 44" fill="none" aria-hidden="true" focusable="false">
    <rect x="1" y="1" width="42" height="42" rx="5" stroke="currentColor" stroke-opacity=".26" stroke-width="1.2"/>
    <path d="M22 6.5 34.5 13v18L22 37.5 9.5 31V13L22 6.5Z" stroke="var(--c-accent)" stroke-width="1.3" stroke-linejoin="round"/>
    <path d="M22 13.5v17" stroke="var(--c-accent-bright)" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M16.5 13.5h11M16.5 30.5h11" stroke="var(--c-accent-bright)" stroke-width="2.2" stroke-linecap="round"/>
  </svg>`;
}

/* SDVOSB seal slot. Official artwork is supplied by the client, so
   this renders a clearly-labelled placeholder rather than inventing
   a certification mark. */
export function sealSlot({ compact = false } = {}) {
  return `<div class="seal-slot${compact ? ' seal-slot--compact' : ''}">
    <div class="seal-slot__ring" aria-hidden="true">
      ${icons.shield(compact ? 20 : 26)}
    </div>
    <div class="seal-slot__text">
      <span class="seal-slot__title">SDVOSB</span>
      <span class="seal-slot__sub">Service-Disabled Veteran-Owned Small Business</span>
      <span class="seal-slot__cert">SBA VetCert · Verified</span>
    </div>
    ${needsInput('Official seal artwork', { small: true })}
  </div>`;
}

/* ==================================================================
   "NEEDS INPUT" FLAGS
   Content the client still owes. Never silently invented.
================================================================== */
export function needsInput(label = 'Needs input', { small = false } = {}) {
  return `<span class="needs-input${small ? ' needs-input--sm' : ''}">${icons.alert(12)}<span>Needs input${label ? ` · ${esc(label)}` : ''}</span></span>`;
}

export function needsInputNote(title, body) {
  return `<p class="needs-input-note"><strong>${icons.alert(12)} Needs input · ${esc(title)}</strong>${body}</p>`;
}

/* ==================================================================
   BUTTONS / LINKS
================================================================== */
export function btn(href, label, { variant = 'primary', arrow = true, sm = false, attrs = '' } = {}) {
  const cls = ['btn', `btn--${variant}`, sm ? 'btn--sm' : ''].filter(Boolean).join(' ');
  const tail = arrow ? `<span class="btn__arrow">${icons.arrow(15)}</span>` : '';
  return `<a class="${cls}" href="${attr(href)}"${attrs ? ' ' + attrs : ''}>${esc(label)}${tail}</a>`;
}

export function btnRow(...buttons) {
  return `<div class="btn-row">${buttons.filter(Boolean).join('')}</div>`;
}

/* The two site-wide primary actions, used in every CTA position. */
export const ctaPrimary = (variant = 'primary') =>
  btn('/capability-statement/', 'Request Capability Statement', { variant });
export const ctaSecondary = (variant = 'secondary') =>
  btn('/teaming/#teaming-form', 'Start a Teaming Conversation', { variant });

/* ==================================================================
   SECTION HEADS
================================================================== */
export function sectionHead({ eyebrow, title, lead, center = false, level = 2, id }) {
  return `<div class="section-head${center ? ' section-head--center' : ''} reveal">
    ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
    <h${level}${id ? ` id="${attr(id)}"` : ''} class="display t-3xl">${title}</h${level}>
    ${lead ? `<p class="lead">${lead}</p>` : ''}
  </div>`;
}

/* ==================================================================
   CARDS
================================================================== */
export function capabilityCard(cap, { linkTo = '/capabilities/', index = 0 } = {}) {
  const naics = cap.naicsPending
    ? `<span class="naics-chip">NAICS pending</span>`
    : cap.naics.map((n) => `<span class="naics-chip">${n}</span>`).join('');

  return `<article class="card card--link${cap.primary ? ' card--feature' : ''} reveal" style="--reveal-delay:${index * 60}ms">
    <span class="card__icon">${icons[cap.icon] ? icons[cap.icon]() : icons.building()}</span>
    <h3 class="card__title"><a class="card__link" href="${attr(linkTo)}#${attr(cap.id)}">${esc(cap.name)}</a></h3>
    ${cap.primary ? '<p class="badge badge--accent" style="align-self:flex-start">Primary capability</p>' : ''}
    <p class="card__body">${esc(cap.blurb)}</p>
    <div class="naics-cell" aria-label="NAICS codes">${naics}</div>
    <span class="card__more">View capability ${icons.arrow(13)}</span>
  </article>`;
}

export function pathCard({ label, title, body, points = [], href, cta, green = false }) {
  return `<article class="path-card${green ? ' path-card--green' : ''} reveal">
    <p class="path-card__label">${esc(label)}</p>
    <h3 class="display t-2xl">${esc(title)}</h3>
    <p class="card__body">${esc(body)}</p>
    ${points.length ? `<ul class="check-list">${points.map((p) => `<li>${icons.check(15)}<span>${esc(p)}</span></li>`).join('')}</ul>` : ''}
    <div style="margin-top:auto;padding-top:var(--s-5)">${btn(href, cta, { variant: 'secondary' })}</div>
  </article>`;
}

export function statTile({ value, label, note, mono = false }) {
  return `<div class="stat reveal">
    <span class="stat__value">${mono ? `<span class="code">${esc(value)}</span>` : esc(value)}</span>
    <span class="stat__label">${esc(label)}</span>
    ${note ? `<span class="stat__note">${esc(note)}</span>` : ''}
  </div>`;
}

/* ==================================================================
   TRUST / REGISTRATION BAR
================================================================== */
export function trustBar() {
  const items = [
    { label: 'SDVOSB Certified', detail: 'SBA VetCert', check: true },
    { label: 'SAM.gov Registered', detail: 'Active registration', check: true },
    { label: 'UEI', detail: site.ids.uei, code: true },
    { label: 'CAGE Code', detail: site.ids.cage, code: true },
  ];

  return `<div class="trustbar">
    <div class="wrap trustbar__inner">
      <div class="trustbar__seal">${sealSlot({ compact: true })}</div>
      <div class="trustbar__items">
        ${items.map((i) => `<div class="trust-item">
          <span class="trust-item__label">${i.check ? `<span class="trust-check">${icons.check(14)}</span>` : ''}${esc(i.label)}</span>
          <span class="trust-item__detail${i.code ? ' trust-item__detail--code' : ''}">${esc(i.detail)}</span>
        </div>`).join('')}
      </div>
    </div>
  </div>`;
}

/* ==================================================================
   ACCORDION
================================================================== */
export function accordion(items, { idPrefix = 'acc' } = {}) {
  return `<div class="accordion">
    ${items.map((item, i) => {
      const id = `${idPrefix}-${i}`;
      /* Ships expanded so the content is readable with JS disabled;
         app.js collapses all but the first on load. */
      const open = i === 0;
      return `<div class="accordion__item">
        <h3>
          <button class="accordion__trigger" type="button"
                  data-accordion-trigger
                  id="${id}-trigger"
                  aria-expanded="${open ? 'true' : 'false'}"
                  aria-controls="${id}-panel">
            <span class="accordion__num">${String(i + 1).padStart(2, '0')}</span>
            <span class="accordion__title">${esc(item.q)}</span>
            <span class="accordion__icon">${icons.plus(12)}</span>
          </button>
        </h3>
        <div class="accordion__panel" id="${id}-panel" role="region" aria-labelledby="${id}-trigger">
          <div class="accordion__panel-inner">${item.a}</div>
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

/* ==================================================================
   CTA BAND — closing call to action, identical on every page
================================================================== */
export function ctaBand({
  title = 'Let&rsquo;s talk about your requirement.',
  lead = '',
} = {}) {
  return `<section class="cta-band" aria-labelledby="cta-band-title">
    <div class="wrap cta-band__inner">
      <div class="reveal">
        <p class="eyebrow">Next step</p>
        <h2 id="cta-band-title" class="display t-3xl">${title}</h2>
        ${lead ? `<p class="lead" style="margin-top:var(--s-4)">${lead}</p>` : ''}
        <div style="margin-top:var(--s-7)">
          ${btnRow(ctaPrimary(), ctaSecondary())}
        </div>
      </div>
      <div class="cta-band__aside reveal">
        <p class="mono" style="color:var(--c-text-3)">Direct contact</p>
        <a class="cta-band__contact" href="${site.phoneHref}">${icons.phone(18)}<span>${site.phone}</span></a>
        <a class="cta-band__contact" href="mailto:${site.email}">${icons.mail(18)}<span>${site.email}</span></a>
        <p style="font-size:var(--t-xs);color:var(--c-text-3);display:flex;gap:var(--s-2);align-items:flex-start;margin-top:var(--s-2)">
          ${icons.pin(14)}<span>${esc(addressLine)}</span>
        </p>
      </div>
    </div>
  </section>`;
}

/* ==================================================================
   PAGE HERO (inner pages)
================================================================== */
export function pageHero({ eyebrow, title, lead, crumbs = [], actions = '' }) {
  return `<header class="page-hero">
    <div class="wrap page-hero__inner">
      ${crumbs.length ? `<nav aria-label="Breadcrumb"><ol class="crumbs">
        <li><a href="/">Home</a></li>
        ${crumbs.map((c, i) => `<li aria-hidden="true">/</li><li>${
          i === crumbs.length - 1
            ? `<span aria-current="page">${esc(c.label)}</span>`
            : `<a href="${attr(c.href)}">${esc(c.label)}</a>`
        }</li>`).join('')}
      </ol></nav>` : ''}
      ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
      <h1 class="display">${title}</h1>
      ${lead ? `<p class="lead">${lead}</p>` : ''}
      ${actions ? `<div style="margin-top:var(--s-7)">${actions}</div>` : ''}
    </div>
  </header>`;
}

/* ==================================================================
   FORM FIELDS
================================================================== */
let fieldSeq = 0;

function fieldShell({ id, label, required, optionalNote, hint, control, full }) {
  const hintId = hint ? `${id}-hint` : '';
  return `<div class="field${full ? ' field--full' : ''}">
    <label class="field__label" for="${id}">
      ${esc(label)}
      ${required ? '<span class="field__req" aria-hidden="true">*</span>' : ''}
      ${optionalNote ? `<span class="field__optional">${esc(optionalNote)}</span>` : ''}
    </label>
    ${control(hintId)}
    ${hint ? `<span class="field__hint" id="${hintId}">${esc(hint)}</span>` : ''}
    <span class="field__error" id="${id}-error" data-error-for="${id}">
      ${icons.alert(13)}<span data-error-text></span>
    </span>
  </div>`;
}

export function textField({ name, label, type = 'text', required = false, placeholder = '', hint = '', autocomplete, full = false, optionalNote = '' }) {
  const id = `f-${name}-${++fieldSeq}`;
  return fieldShell({
    id, label, required, hint, full, optionalNote,
    control: (hintId) => `<input class="input" type="${type}" id="${id}" name="${attr(name)}"
      data-label="${attr(label)}"
      ${required ? 'required' : ''}
      ${placeholder ? `placeholder="${attr(placeholder)}"` : ''}
      ${autocomplete ? `autocomplete="${attr(autocomplete)}"` : ''}
      ${hintId ? `aria-describedby="${hintId}" data-describedby-base="${hintId}"` : ''}>`,
  });
}

export function selectField({ name, label, options, required = false, hint = '', full = false, placeholder = 'Select one…' }) {
  const id = `f-${name}-${++fieldSeq}`;
  return fieldShell({
    id, label, required, hint, full,
    control: (hintId) => `<select class="select" id="${id}" name="${attr(name)}"
      data-label="${attr(label)}"
      ${required ? 'required' : ''}
      ${hintId ? `aria-describedby="${hintId}" data-describedby-base="${hintId}"` : ''}>
      <option value="">${esc(placeholder)}</option>
      ${options.map((o) => `<option value="${attr(o)}">${esc(o)}</option>`).join('')}
    </select>`,
  });
}

export function textareaField({ name, label, required = false, rows = 5, placeholder = '', hint = '', full = true }) {
  const id = `f-${name}-${++fieldSeq}`;
  return fieldShell({
    id, label, required, hint, full,
    control: (hintId) => `<textarea class="textarea" id="${id}" name="${attr(name)}" rows="${rows}"
      data-label="${attr(label)}"
      ${required ? 'required' : ''}
      ${placeholder ? `placeholder="${attr(placeholder)}"` : ''}
      ${hintId ? `aria-describedby="${hintId}" data-describedby-base="${hintId}"` : ''}></textarea>`,
  });
}

export function fileField({ name, label, hint = '', accept = '.pdf,.doc,.docx,.jpg,.png', full = true }) {
  const id = `f-${name}-${++fieldSeq}`;
  return fieldShell({
    id, label, required: false, hint, full,
    control: (hintId) => `<input class="file-input" type="file" id="${id}" name="${attr(name)}"
      data-label="${attr(label)}" accept="${attr(accept)}"
      ${hintId ? `aria-describedby="${hintId}" data-describedby-base="${hintId}"` : ''}>`,
  });
}

export function checkboxGroup({ name, legend, options, hint = '' }) {
  return `<fieldset class="fieldset">
    <legend class="fieldset__legend">${esc(legend)}</legend>
    ${hint ? `<span class="field__hint">${esc(hint)}</span>` : ''}
    <div class="checks">
      ${options.map((o, i) => `<label class="check">
        <input type="checkbox" name="${attr(name)}" value="${attr(o)}" data-label="${attr(legend)}">
        <span>${esc(o)}</span>
      </label>`).join('')}
    </div>
  </fieldset>`;
}

/* ------------------------------------------------------------------
   The form shell. Notes on the fallback path:
   - `action` is a real mailto so a JS-disabled submit still reaches
     an inbox rather than doing nothing.
   - app.js intercepts, validates, and composes a cleaner message.
   - `data-endpoint` is left empty until a CRM endpoint is wired up in
     the dev working session; setting it switches the form to POST.
------------------------------------------------------------------- */
export function formShell({ id, leadType, subject, children, submitLabel = 'Send', note = '', fallbackNote = '' }) {
  return `<form class="form" id="${attr(id)}"
        data-form
        data-lead-type="${attr(leadType)}"
        data-subject="${attr(subject)}"
        data-to="${site.email}"
        data-endpoint=""
        method="post"
        enctype="text/plain"
        action="mailto:${site.email}?subject=${encodeURIComponent(subject)}"
        novalidate>
    <noscript>
      <span class="noscript-note">JavaScript is turned off, so this form cannot check your entries before sending.
      Submitting will open your email application instead — or write to
      <a href="mailto:${site.email}">${site.email}</a> or call
      <a href="${site.phoneHref}">${site.phone}</a>.</span>
    </noscript>

    <p class="hp" aria-hidden="true">
      <label for="${attr(id)}-company-url">Leave this field empty</label>
      <input id="${attr(id)}-company-url" type="text" name="company_url" tabindex="-1" autocomplete="off" data-hp>
    </p>

    ${children}

    <div class="form__status" data-form-status role="status" aria-live="polite" tabindex="-1">
      ${icons.info(16)}<span data-status-text></span>
    </div>

    <div class="form__foot">
      <button class="btn btn--primary" type="submit">${esc(submitLabel)}<span class="btn__arrow">${icons.arrow(15)}</span></button>
      ${note ? `<p class="form__note">${note}</p>` : ''}
    </div>

    <p class="form-fallback">${icons.info(15)}<span>${
      fallbackNote ||
      `No CRM endpoint is connected yet, so submissions are handed to your email application pre-filled and addressed to <a href="mailto:${site.email}">${site.email}</a>. Routing is scheduled for the dev working session.`
    }</span></p>
  </form>`;
}

/* ==================================================================
   CAPABILITY MATRIX  (the table COs scan)
================================================================== */
export function capabilityMatrix() {
  return `<div class="table-scroll">
    <table class="table">
      <caption>Capability lines mapped to NAICS, with the delivery route Ionic pursues for each.</caption>
      <thead>
        <tr>
          <th scope="col">Capability line</th>
          <th scope="col">NAICS code(s)</th>
          <th scope="col">Prime or team</th>
        </tr>
      </thead>
      <tbody>
        ${capabilities.map((c) => `<tr${c.primary ? ' data-primary="true"' : ''}>
          <th scope="row">${esc(c.name)}${c.primary ? ' <span class="badge badge--accent">Primary</span>' : ''}</th>
          <td><div class="naics-cell">${
            c.naicsPending
              ? `<span class="naics-chip">Confirm NAICS</span>`
              : c.naics.map((n) => `<span class="naics-chip">${n}</span>`).join('')
          }</div></td>
          <td>${c.primary ? 'Prime &middot; self-perform' : 'Prime or team'}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}
