/* ------------------------------------------------------------------
   Shared building blocks. Every page composes from these so the
   card / button / section language stays identical site-wide.
------------------------------------------------------------------- */

import {
  site, addressLine, intents, capabilityGroups, capsIn, capabilities, capStatement, markets, delivery,
  differentiators, bonding, principals, leadershipReady, projects, locations,
} from './site.mjs';
import { PHOSPHOR } from './icons.mjs';
import { blueprintArt } from './drawing.mjs';

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
   currentColor.
================================================================== */
const icon = (name) => (s = 20) =>
  `<svg width="${s}" height="${s}" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false">${PHOSPHOR[name]}</svg>`;

export const icons = Object.fromEntries(Object.keys(PHOSPHOR).map((k) => [k, icon(k)]));

/* Blueprint drawing: the site-wide motif, shared with the home
   sequence. Inner-page heroes get it on a faint drafting grid. */
export const lattice = () => `<div class="page-hero__lattice" aria-hidden="true">${blueprintArt('page-hero__art')}</div>`;

/* ==================================================================
   LOGO — always the supplied files, never redrawn or recoloured.
     color   full-color horizontal lockup (light backgrounds)
     white   reversed one-color lockup (dark backgrounds)
     stacked full-color stacked lockup
================================================================== */
const LOGOS = {
  color:   { base: 'logo-color',   widths: [320, 480, 960], ratio: 960 / 329 },
  white:   { base: 'logo-white',   widths: [320, 640],      ratio: 640 / 219 },
  stacked: { base: 'logo-stacked', widths: [240, 480],      ratio: 480 / 441 },
};

export function logoImg(variant = 'color', { cls = '', width = 152, sizes, alt = 'Ionic Contractors', eager = false } = {}) {
  const L = LOGOS[variant];
  const height = Math.round(width / L.ratio);
  const srcset = L.widths.map((w) => `/assets/img/brand/${L.base}-${w}.webp ${w}w`).join(', ');
  const src = `/assets/img/brand/${L.base}-${L.widths[1] || L.widths[0]}.webp`;
  return `<img class="${cls}" src="${src}" srcset="${srcset}" sizes="${attr(sizes || `${width}px`)}" width="${width}" height="${height}" alt="${attr(alt)}"${
    eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;
}

/* ==================================================================
   BUTTONS / LINKS
================================================================== */
export function btn(href, label, { variant = 'primary', arrow = true, sm = false, attrs = '', icon = null } = {}) {
  const cls = ['btn', `btn--${variant}`, sm ? 'btn--sm' : ''].filter(Boolean).join(' ');
  const tail = icon ? `<span class="btn__arrow">${icon}</span>` : arrow ? `<span class="btn__arrow">${icons.arrow(15)}</span>` : '';
  return `<a class="${cls}" href="${attr(href)}"${attrs ? ' ' + attrs : ''}>${esc(label)}${tail}</a>`;
}

export function btnRow(...buttons) {
  return `<div class="btn-row">${buttons.filter(Boolean).join('')}</div>`;
}

/* Capability statement: a direct PDF download once the file is in
   place; until then the capability-statement page. */
export const capStatementBtn = (variant = 'primary', { sm = false, label } = {}) =>
  btn(capStatement.href, label || (capStatement.available ? 'Download capability statement' : 'Get the capability statement'), {
    variant, sm,
    attrs: capStatement.available ? 'download' : '',
    icon: capStatement.available ? icons.download(15) : null,
  });

/* The two site-wide actions, used in every CTA position. */
export const ctaPrimary = (variant = 'primary') => capStatementBtn(variant);
export const ctaSecondary = (variant = 'secondary') => btn('/contact/', 'Talk to our team', { variant });

/* ==================================================================
   SECTION HEADS
   Pass plain text (with a literal "&") for the eyebrow — it is escaped
   here exactly once.
================================================================== */
export function sectionHead({ eyebrow, title, lead, center = false, level = 2, id }) {
  return `<div class="section-head${center ? ' section-head--center' : ''}">
    <h${level}${id ? ` id="${attr(id)}"` : ''} class="display t-3xl" data-split>${title}</h${level}>
    ${lead ? `<p class="lead reveal">${lead}</p>` : ''}
  </div>`;
}

/* ==================================================================
   CARDS
================================================================== */
export function capabilityCard(cap, { linkTo = '/capabilities/', index = 0, level = 3, feature = true } = {}) {
  const naics = cap.naics.map((n) => `<span class="naics-chip">${n}</span>`).join('');
  return `<article class="card card--link${feature && cap.primary ? ' card--feature' : ''} reveal" style="--reveal-delay:${index * 70}ms">
    <span class="card__icon">${icons[cap.icon] ? icons[cap.icon]() : icons.building()}</span>
    <h${level} class="card__title"><a class="card__link" href="${attr(linkTo)}#${attr(cap.id)}">${esc(cap.name)}</a></h${level}>
    <p class="card__body">${esc(cap.blurb)}</p>
    <div class="naics-cell" aria-label="NAICS codes">${naics}</div>
    <span class="card__more">View capability ${icons.arrow(13)}</span>
  </article>`;
}

/* The two lines of business, each with its own cards. `card` renders
   one capability (it receives the capability and its index). */
export function capabilityGroupsBlock(card) {
  return `<div class="cap-groups">
    ${capabilityGroups.map((g, gi) => `<div class="cap-group" id="${attr(g.id)}">
      <div class="cap-group__head reveal">
        <span class="cap-group__num">${String(gi + 1).padStart(2, '0')}</span>
        <h3 class="cap-group__title">${esc(g.name)}</h3>
        <p class="cap-group__blurb">${esc(g.blurb)}</p>
      </div>
      <div class="grid grid--3">${capsIn(g.id).map((c, i) => card(c, i)).join('')}</div>
    </div>`).join('')}
  </div>`;
}

export function pathCard({ label, title, body, points = [], href, cta }) {
  return `<article class="path-card reveal">
    <p class="path-card__label">${esc(label)}</p>
    <h3 class="display t-2xl">${esc(title)}</h3>
    <p class="card__body">${esc(body)}</p>
    ${points.length ? `<ul class="check-list">${points.map((p) => `<li>${icons.check(15)}<span>${esc(p)}</span></li>`).join('')}</ul>` : ''}
    ${href ? `<div style="margin-top:auto;padding-top:var(--s-5)">${btn(href, cta, { variant: 'secondary' })}</div>` : ''}
  </article>`;
}

export function statTile({ value, label, note, mono = false, count = null }) {
  const v = mono ? `<span class="code">${esc(value)}</span>` : esc(value);
  return `<div class="stat reveal">
    <span class="stat__value"${count != null ? ` data-count="${count}"` : ''}>${v}</span>
    <span class="stat__label">${esc(label)}</span>
    ${note ? `<span class="stat__note">${esc(note)}</span>` : ''}
  </div>`;
}

/* ==================================================================
   TRUST / REGISTRATION BAR — SDVOSB, SAM, UEI, CAGE
================================================================== */
export function trustBar() {
  const items = [
    { label: 'SAM.gov Registered', detail: 'Active registration', check: true },
    { label: 'UEI', detail: site.ids.uei, code: true },
    { label: 'CAGE Code', detail: site.ids.cage, code: true },
    { label: 'Primary NAICS', detail: '236220', code: true },
  ];

  return `<div class="trustbar">
    <div class="wrap trustbar__inner">
      <div class="trustbar__seal">
        <img src="/assets/img/brand/mark-160.webp" width="36" height="40" alt="" loading="lazy" decoding="async">
        <span class="trustbar__seal-text"><strong>SDVOSB CERTIFIED</strong><span>SBA VetCert · Service-Disabled Veteran-Owned</span></span>
      </div>
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
   DIFFERENTIATORS — veteran-owned · mobilization · network · safety
   (+ bonding capacity once supplied)
================================================================== */
export function differentiatorsStrip() {
  const list = bonding ? [...differentiators, { id: 'bonding', icon: 'shield', ...bonding }] : differentiators;
  return `<div class="diffs" style="--diff-count:${list.length}">
    ${list.map((d, i) => `<div class="diff reveal" style="--reveal-delay:${i * 80}ms">
      <span class="diff__icon">${icons[d.icon](28)}</span>
      <div><h3 class="diff__title">${esc(d.title)}</h3><p class="diff__body">${esc(d.body)}</p></div>
    </div>`).join('')}
  </div>`;
}

/* ==================================================================
   MARKETS — Federal · State & local · Private, in that order
================================================================== */
export function marketGrid({ headingLevel = 3 } = {}) {
  return `<div class="market-grid">
    ${markets.map((m, i) => `<article class="market reveal" style="--reveal-delay:${i * 80}ms">
      <span class="market__num">${String(i + 1).padStart(2, '0')}</span>
      <h${headingLevel} class="market__title"><a class="card__link" href="${attr(m.href)}">${esc(m.title)}</a></h${headingLevel}>
      <p class="market__body">${esc(m.blurb)}</p>
      <span class="market__go" aria-hidden="true">${icons.arrow(18)}</span>
    </article>`).join('')}
  </div>`;
}

/* ==================================================================
   DELIVERY APPROACH — Mobilize / Execute / Close out
================================================================== */
export function deliveryCards() {
  return `<div class="delivery" data-stack>
    ${delivery.map((d, i) => `<article class="delivery__card" id="${attr(d.id)}">
      <div class="delivery__label">
        <span class="delivery__step" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <span class="delivery__name">${esc(d.label)}</span>
      </div>
      <div>
        <h3 class="delivery__title">${esc(d.title)}</h3>
        <p class="delivery__body">${esc(d.body)}</p>
      </div>
    </article>`).join('')}
  </div>`;
}

/* ==================================================================
   LOCATIONS
================================================================== */
export function locationsGrid() {
  return `<div class="locations">
    ${locations.map((l) => `<div class="location reveal">
      <p class="location__role">${esc(l.role)}</p>
      <p class="location__name">${esc(l.label)}</p>
      ${l.primary ? `<p class="location__note">${esc(addressLine)}</p>` : ''}
    </div>`).join('')}
    <div class="location reveal">
      <p class="location__role">Partner network</p>
      <p class="location__name">Multi-state</p>
      <p class="location__note">Vetted trade partners for nationwide mobilization.</p>
    </div>
  </div>`;
}

/* ==================================================================
   LEADERSHIP — renders only when both principals are complete
================================================================== */
export function leadershipSection() {
  return `<section class="section section--flush-top" id="leadership" aria-labelledby="leadership-title"${leadershipReady ? '' : ' hidden'}>
    <div class="wrap">
      ${sectionHead({ eyebrow: 'Leadership', title: 'The people behind the work', id: 'leadership-title' })}
      <div class="people">
        ${principals.map((p) => `<article class="person reveal">
          <p class="person__role">${esc(p.role)}${p.veteran ? ' · Service-disabled veteran' : ''}</p>
          <h3 class="person__name">${esc(p.name || '')}</h3>
          <p class="person__bio">${esc(p.bio || '')}</p>
        </article>`).join('')}
      </div>
    </div>
  </section>`;
}

/* ==================================================================
   PROJECT CARDS — component built now, hidden until projects exist
================================================================== */
export function projectCard(p) {
  return `<article class="project card--link reveal">
    ${p.image ? `<img class="project__media" src="${attr(p.image)}" width="800" height="500" alt="${attr(p.alt || p.title)}" loading="lazy" decoding="async">` : '<div class="project__media" aria-hidden="true"></div>'}
    <div class="project__body">
      <p class="project__meta">${esc(p.agency || '')}${p.location ? ` · ${esc(p.location)}` : ''}</p>
      <h3 class="project__title">${esc(p.title)}</h3>
    </div>
  </article>`;
}

export function projectsSection({ title = 'Recent work', id = 'projects' } = {}) {
  return `<section class="section" id="${attr(id)}" aria-labelledby="${attr(id)}-title"${projects.length ? '' : ' hidden'}>
    <div class="wrap">
      ${sectionHead({ eyebrow: 'Projects', title, id: `${id}-title` })}
      <div class="projects">${projects.map(projectCard).join('')}</div>
    </div>
  </section>`;
}

/* ==================================================================
   MARQUEE — capability lines (decorative; the same lines are in the
   page as real text elsewhere)
================================================================== */
export function marquee() {
  const set = (hidden) => capabilities.map((c) => `<span class="marquee__item"${hidden ? ' aria-hidden="true"' : ''}>${esc(c.short)}</span>`).join('');
  return `<div class="marquee" data-marquee data-anim-loop aria-hidden="true">
    <div class="marquee__track">${set(false)}${set(true)}</div>
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
  title = 'Have a requirement? Talk to us directly.',
  lead = 'Send the solicitation, the scope, or the question. A principal answers, usually the same business day.',
  action = 'partner',
} = {}) {
  const act = action && intents[action];
  return `<section class="cta-band theme-dark" aria-labelledby="cta-band-title">
    <div class="wrap cta-band__inner">
      <div>
        <h2 id="cta-band-title" class="display t-3xl" data-split>${title}</h2>
        ${lead ? `<p class="lead reveal" style="margin-top:var(--s-4)">${lead}</p>` : ''}
        ${act ? `<div class="reveal" style="margin-top:var(--s-7)">${btn(act.href, act.label, { variant: 'primary' })}</div>` : ''}
      </div>
      <div class="cta-band__aside reveal">
        <p class="mono" style="color:var(--c-text-3)">Direct contact</p>
        <a class="cta-band__contact" href="${site.phoneHref}">${icons.phone(18)}<span>${site.phone}</span></a>
        <a class="cta-band__contact" href="mailto:${site.email}">${icons.mail(18)}<span>${site.email}</span></a>
        <p style="font-size:var(--t-xs);color:var(--c-text-3);display:flex;gap:var(--s-2);align-items:flex-start;margin-top:var(--s-2)">
          ${icons.pin(14)}<span>Headquarters: ${esc(addressLine)}</span>
        </p>
      </div>
    </div>
  </section>`;
}

/* ==================================================================
   PAGE HERO (inner pages)
================================================================== */
export function pageHero({ eyebrow, title, lead, crumbs = [], actions = '' }) {
  return `<header class="page-hero theme-dark">
    ${lattice()}
    <div class="wrap page-hero__inner" data-hero-inner>
      ${crumbs.length ? `<nav aria-label="Breadcrumb"><ol class="crumbs">
        <li><a href="/">Home</a></li>
        ${crumbs.map((c, i) => `<li aria-hidden="true">/</li><li>${
          i === crumbs.length - 1
            ? `<span aria-current="page">${esc(c.label)}</span>`
            : `<a href="${attr(c.href)}">${esc(c.label)}</a>`
        }</li>`).join('')}
      </ol></nav>` : ''}
      ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
      <h1 class="display" data-split>${title}</h1>
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
      ${options.map((o) => `<label class="check">
        <input type="checkbox" name="${attr(name)}" value="${attr(o)}" data-label="${attr(legend)}">
        <span>${esc(o)}</span>
      </label>`).join('')}
    </div>
  </fieldset>`;
}

/* ------------------------------------------------------------------
   The form shell.
   - `action` is a real mailto so a JS-disabled submit still reaches
     an inbox rather than doing nothing.
   - app.js intercepts, validates, and composes a cleaner message.
   - `data-endpoint` is empty until the backend phase; setting it
     switches the form to POST.
   - The honeypot is hidden from people AND from assistive tech.
------------------------------------------------------------------- */
export function formShell({ id, leadType, subject, children, submitLabel = 'Send', note = '' }) {
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
      Submitting will open your email application instead, or write to
      <a href="mailto:${site.email}">${site.email}</a> or call
      <a href="${site.phoneHref}">${site.phone}</a>.</span>
    </noscript>

    <p class="hp" aria-hidden="true">
      <label for="${attr(id)}-company-url">Leave this field empty</label>
      <input id="${attr(id)}-company-url" type="text" name="company_url" tabindex="-1" autocomplete="off" aria-hidden="true" data-hp>
    </p>

    ${children}

    <div class="form__status" data-form-status role="status" aria-live="polite" tabindex="-1">
      ${icons.info(16)}<span data-status-text></span>
    </div>

    <div class="form__foot">
      <button class="btn btn--primary" type="submit">${esc(submitLabel)}<span class="btn__arrow">${icons.arrow(15)}</span></button>
      ${note ? `<p class="form__note">${note}</p>` : ''}
    </div>
  </form>`;
}

/* ==================================================================
   CAPABILITY MATRIX  (the table COs scan)
================================================================== */
export function capabilityMatrix() {
  return `<div class="table-scroll reveal">
    <table class="table">
      <caption>Ionic capability lines mapped to NAICS codes.</caption>
      <thead>
        <tr>
          <th scope="col">Capability line</th>
          <th scope="col">NAICS code(s)</th>
        </tr>
      </thead>
      <tbody>
        ${capabilityGroups.map((g) => `<tr class="table__group"><th scope="rowgroup" colspan="2">${esc(g.name)}</th></tr>
        ${capsIn(g.id).map((c) => `<tr${c.primary ? ' data-primary="true"' : ''}>
          <th scope="row">${esc(c.name)}${c.primary ? ' <span class="badge badge--accent">Primary</span>' : ''}</th>
          <td><div class="naics-cell">${c.naics.map((n) => `<span class="naics-chip">${n}</span>`).join('')}</div></td>
        </tr>`).join('')}`).join('')}
      </tbody>
    </table>
  </div>`;
}
