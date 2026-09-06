import { site, capabilities, addressLine } from '../site.mjs';
import {
  icons, btn, btnRow, ctaPrimary, ctaSecondary, sectionHead, trustBar,
  capabilityCard, pathCard, ctaBand, sealSlot, statTile, esc,
} from '../components.mjs';

/* ------------------------------------------------------------------
   FILM STAGE
   `beats` are copy blocks that travel through Z-space over the
   scrubbing footage. Windows overlap so each one cross-fades into
   the next rather than cutting.
------------------------------------------------------------------- */
function filmStage({ id, scene, label, trackVh, eager = false, poster, alt, beats, sideScrim = false }) {
  return `<section class="stage" id="${id}" data-stage data-eager="${eager}"
           style="--track-vh:${trackVh}; --poster-fallback:url('/assets/video/${scene}-poster.jpg')"
           aria-label="${esc(label)}">
    <div class="stage__track" data-track>
      <div class="stage__sticky">

        <div class="stage__scene">
          <img class="stage__media stage__poster"
               src="/assets/video/${scene}-poster.jpg"
               alt="${esc(alt)}"
               width="1280" height="720"
               ${eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'}>
          <!-- No src in markup: app.js picks the 1280 or 768 encode by
               viewport so phones never pull the desktop file. -->
          <video class="stage__media stage__video"
                 data-video
                 data-src-desktop="/assets/video/${scene}-1280.mp4"
                 data-src-mobile="/assets/video/${scene}-768.mp4"
                 poster="/assets/video/${scene}-poster.jpg"
                 width="1280" height="720"
                 muted playsinline preload="${eager ? 'auto' : 'none'}"
                 aria-hidden="true" tabindex="-1"></video>
          <div class="stage__grade${sideScrim ? ' stage__grade--side' : ''}"></div>
          <div class="stage__depth" aria-hidden="true"></div>
        </div>

        <div class="stage__layers">
          <!-- The opening beat ships at rest and fully opaque, so the
               stage is correct before the first animation frame runs
               (slow JS, a backgrounded tab, rAF delayed). JS takes
               over these same custom properties from there. -->
          ${beats.map((b, i) => `<div class="stage__beat"
                data-beat
                data-beat-start="${b.start}"
                data-beat-end="${b.end}"
                data-active="${i === 0 ? 'true' : 'false'}"
                style="--par-x:${b.parX || 16}px;--par-y:${b.parY || 10}px;--bo:${i === 0 ? 1 : 0};--bz:${i === 0 ? 0 : -320};--by:${i === 0 ? 0 : 52};--bs:${i === 0 ? 1 : 0.93};--bblur:${i === 0 ? 0 : 8}">
            <div class="wrap"><div class="beat__body">${b.html}</div></div>
          </div>`).join('')}
        </div>

        <div class="stage__hud" aria-hidden="true">
          <div class="hud">
            <span class="hud__scene">${esc(label)}</span>
            <span class="hud__rail"><span class="hud__fill"></span></span>
            <span class="hud__pct" data-hud-pct>0%</span>
          </div>
        </div>

        <p class="stage__cue" data-anim-loop aria-hidden="true">
          <span class="stage__cue-track"></span>
          <span>Scroll</span>
        </p>

      </div>
    </div>
  </section>`;
}

/* ================================================================== */

const heroBeats = [
  {
    start: 0, end: 0.40, parX: 18, parY: 12,
    html: `
      <p class="eyebrow">Service-Disabled Veteran-Owned Small Business</p>
      <h1 class="beat__title t-hero">Your SDVOSB Partner for Federal Construction &amp; Services</h1>
      <p class="beat__sub">Ionic Contractors LLC is a Service-Disabled Veteran-Owned Small Business delivering general construction and broad support services to federal, state, and local agencies &mdash; ready to perform as prime or team with primes to meet set-aside goals.</p>
      <div class="beat__actions">
        ${btnRow(ctaPrimary(), ctaSecondary())}
      </div>
      <div class="mt-7">${sealSlot()}</div>`,
  },
  {
    start: 0.23, end: 0.75, parX: 22, parY: 14,
    html: `
      <p class="eyebrow">Why an SDVOSB partner</p>
      <h2 class="beat__title t-4xl">A certified vehicle both sides of the table need.</h2>
      <p class="beat__sub">Contracting officers use SDVOSB set-asides to meet federal goals; primes need SDVOSB partners to satisfy subcontracting plans. Ionic gives both a certified, registered, ready-to-perform vehicle &mdash; with a general-construction core and the flexibility to support a wide range of requirements.</p>`,
  },
  {
    start: 0.58, end: 1, parX: 14, parY: 10,
    html: `
      <p class="eyebrow">Capability, general-construction led</p>
      <h2 class="beat__title t-4xl">Built around construction. Extended by service.</h2>
      <ul class="mt-5" style="display:grid;gap:var(--s-1);max-width:34rem">
        ${capabilities.map((c, i) => `<li style="display:grid;grid-template-columns:auto 1fr auto;gap:var(--s-4);align-items:baseline;padding-block:var(--s-2);border-bottom:1px solid var(--c-line-mid)">
          <span class="mono" style="color:var(--c-accent)">${String(i + 1).padStart(2, '0')}</span>
          <span style="font-size:var(--t-md);${c.primary ? 'color:var(--c-accent-bright);font-weight:600' : ''}">${esc(c.short)}</span>
          <span class="mono" style="color:var(--c-text-3)">${c.naicsPending ? 'TBC' : c.naics[0]}</span>
        </li>`).join('')}
      </ul>
      <div class="beat__actions">${btn('/capabilities/', 'View all capabilities', { variant: 'secondary' })}</div>`,
  },
];

const boardBeats = [
  {
    start: 0, end: 0.55, parX: 18, parY: 12,
    html: `
      <p class="eyebrow">Two ways to work with us</p>
      <h2 class="beat__title t-4xl">Award it to us, or add us to your team.</h2>
      <p class="beat__sub">Ionic is set up for both routes from day one &mdash; a compliant set-aside vehicle for contracting officers, and a documentation-ready subcontractor, JV or mentor-prot&eacute;g&eacute; partner for primes.</p>`,
  },
  {
    start: 0.38, end: 1, parX: 22, parY: 14,
    html: `
      <p class="eyebrow">Ready to perform</p>
      <h2 class="beat__title t-4xl">Certified, registered, and quick to respond.</h2>
      <p class="beat__sub">We come to the table with the registrations and documentation you need to move &mdash; and we answer agency and teaming enquiries promptly, usually the same business day.</p>
      <div class="beat__actions">${btnRow(
        btn('/federal-contracting/', 'For contracting officers', { variant: 'primary' }),
        btn('/teaming/', 'For prime contractors', { variant: 'secondary' })
      )}</div>`,
  },
];

/* ================================================================== */

const body = `
<div class="preloader" data-preloader role="status" aria-live="polite">
  <div class="preloader__inner">
    <span class="preloader__mark">${icons.shield(56)}</span>
    <span class="preloader__word">Ionic Contractors</span>
    <span class="preloader__rail"><span class="preloader__fill" data-preloader-fill></span></span>
    <span class="sr-only">Loading</span>
  </div>
</div>

${filmStage({
  id: 'film-hero',
  scene: 'scene-01',
  label: 'Scene 01 — Capability',
  trackVh: 340,
  eager: true,
  sideScrim: true,
  alt: 'A senior Ionic Contractors executive walking through the firm’s corporate corridor, past framed registrations and capability signage.',
  beats: heroBeats,
})}

${trustBar()}

<section class="section" aria-labelledby="capability-snapshot">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Capability snapshot',
      title: 'General construction at the core,<br>with the services around it.',
      lead: 'Six capability lines, led by general construction. We perform directly where we can and team where a requirement calls for added capacity.',
      id: 'capability-snapshot',
    })}
    <div class="grid grid--3">
      ${capabilities.map((c, i) => capabilityCard(c, { index: i })).join('')}
    </div>
    <div class="mt-8">${btn('/capabilities/', 'See the full capability matrix', { variant: 'secondary' })}</div>
  </div>
</section>

<div class="marquee" data-anim-loop aria-hidden="true">
  <div class="marquee__track">
    ${Array(2).fill(0).map(() => capabilities.map((c) => `<span class="marquee__item">${esc(c.short)}</span>`).join('')).join('')}
  </div>
</div>

${filmStage({
  id: 'film-board',
  scene: 'scene-02',
  label: 'Scene 02 — Partnership',
  trackVh: 260,
  eager: false,
  alt: 'An Ionic Contractors executive briefing a boardroom of prime-contractor representatives, with project and services footage on the wall display behind them.',
  beats: boardBeats,
})}

<section class="section" aria-labelledby="dual-path">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Choose your route',
      title: 'Two ways to work with Ionic',
      lead: 'Whichever side of the requirement you are on, the path to a contract is short.',
      id: 'dual-path',
      center: true,
    })}
    <div class="grid grid--2">
      ${pathCard({
        label: 'For contracting officers',
        title: 'A compliant SDVOSB set-aside vehicle',
        body: 'Easy to solicit and award. Ionic is SDVOSB certified through SBA VetCert, actively registered in SAM.gov, and eligible for set-aside and sole-source awards under applicable NAICS size standards.',
        points: [
          'Verifiable certification and registration identifiers',
          'Set-aside and sole-source eligible',
          'Documentation ready for a fast award',
        ],
        href: '/federal-contracting/',
        cta: 'How to solicit or award',
      })}
      ${pathCard({
        green: true,
        label: 'For prime contractors',
        title: 'A teaming partner that helps you meet SDVOSB goals',
        body: 'Add a certified SDVOSB to your team and get the work done. Ionic teams as a subcontractor, joint-venture partner, or mentor-protégé participant, with general-construction self-performance capability.',
        points: [
          'SDVOSB goal credit for subcontracting plans',
          'Self-performs general construction',
          'Subcontract, JV or mentor-protégé',
        ],
        href: '/teaming/',
        cta: 'Start a teaming conversation',
      })}
    </div>
  </div>
</section>

<section class="section section--tight" aria-labelledby="at-a-glance">
  <div class="wrap">
    <h2 id="at-a-glance" class="sr-only">Ionic Contractors at a glance</h2>
    <div class="grid grid--4">
      ${statTile({ value: site.ids.uei, label: 'Unique Entity ID', note: 'SAM.gov registered', mono: true })}
      ${statTile({ value: site.ids.cage, label: 'CAGE code', note: 'Assigned and active', mono: true })}
      ${statTile({ value: '6', label: 'Capability lines', note: 'General construction led' })}
      ${statTile({ value: 'Same day', label: 'Typical response', note: 'Agency and teaming enquiries' })}
    </div>
  </div>
</section>

${ctaBand({
  lead: 'Send us the requirement, the solicitation number, or just the scope you are trying to cover. We will come back with what Ionic can carry and how quickly.',
})}
`;

export default {
  url: '/',
  title: 'SDVOSB Federal Construction & Services Contractor',
  description:
    'Ionic Contractors LLC is an SDVOSB federal contractor delivering general construction, facilities maintenance, grounds and support services. Ready to perform as prime or team with primes on set-aside goals. UEI SUF6ZF8U5RA8 · CAGE 9KDA3.',
  body,
};
