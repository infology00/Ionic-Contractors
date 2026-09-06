import { site, options } from '../site.mjs';
import {
  pageHero, sectionHead, ctaBand, icons, btn,
  formShell, textField, selectField, needsInput, needsInputNote, esc,
} from '../components.mjs';

/* Four fields only, per the brief — the gate must stay low-friction. */
const gateForm = formShell({
  id: 'capability-statement-form',
  leadType: 'capability_statement',
  subject: 'Capability statement request — Ionic Contractors LLC',
  submitLabel: 'Request Capability Statement',
  note: 'Four fields. We send the document straight back and route your details to our team.',
  fallbackNote: `The capability statement PDF has not been supplied yet, and no CRM endpoint is connected. Your request is handed to your email application pre-filled and addressed to <a href="mailto:${site.email}">${site.email}</a>; we will reply with the document. Automatic delivery is scheduled for the dev working session.`,
  children: `
    <div class="form__grid form__grid--2">
      ${selectField({ name: 'who', label: 'Who you are', options: options.audience, required: true })}
      ${selectField({ name: 'seeking', label: "What you're looking for", options: options.seeking, required: true })}
      ${textField({ name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email', placeholder: 'name@agency.gov' })}
      ${textField({ name: 'phone', label: 'Phone number', type: 'tel', required: true, autocomplete: 'tel', placeholder: '000-000-0000' })}
    </div>`,
});

const contents = [
  'Company overview, entity structure and SDVOSB status',
  'Certifications, registrations, UEI and CAGE identifiers',
  'Capability lines mapped to NAICS codes',
  'Principals&rsquo; operator experience and past performance',
  'Differentiators and points of contact',
];

const body = `
${pageHero({
  crumbs: [{ href: '/capability-statement/', label: 'Capability Statement' }],
  eyebrow: 'Gated download',
  title: 'Request the Ionic<br>capability statement.',
  lead: 'The document contracting officers and proposal teams ask for — capability detail, registrations, NAICS mapping, and the principals&rsquo; operator experience. Four fields and it is on its way.',
})}

<section class="section" aria-labelledby="gate-title">
  <div class="wrap">
    <div class="gate">
      <div class="gate__doc reveal">
        <div class="gate__sheet">
          <div class="gate__sheet-inner">
            <span style="color:var(--c-accent)">${icons.doc(34)}</span>
            <span class="mono" style="color:var(--c-text-2);letter-spacing:.18em">Capability Statement</span>
            <span class="gate__locked">${icons.lock(14)} Gated document</span>
            ${needsInput('PDF not yet supplied')}
          </div>
        </div>

        <div class="gate__contents">
          <p class="mono" style="color:var(--c-text-3);letter-spacing:.16em">What it contains</p>
          ${contents.map((c) => `<p class="gate__content-row">${icons.check(14)}<span>${c}</span></p>`).join('')}
        </div>

        ${needsInputNote(
          'Capability Statement PDF',
          'The client is supplying this document. Until it is uploaded, requests are answered by email rather than an automatic download. This document &mdash; not the public site &mdash; is where the principals&rsquo; operator experience and past performance appear.'
        )}
      </div>

      <div>
        <div class="form-panel">
          <div class="form-panel__head">
            <p class="eyebrow">Quick qualifying form</p>
            <h2 id="gate-title" class="display t-2xl">Four fields, then the document</h2>
            <p>We ask who you are and what you need so the right person follows up &mdash; nothing more.</p>
          </div>
          ${gateForm}
        </div>

        <div class="card mt-6 reveal">
          <h3 class="card__title t-lg">Prefer to skip the form?</h3>
          <p class="card__body">Email <a href="mailto:${site.email}" style="color:var(--c-accent-bright)">${site.email}</a> or call <a href="${site.phoneHref}" style="color:var(--c-accent-bright)">${site.phone}</a> and ask for the capability statement. We respond promptly, usually the same business day.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section section--flush-top" aria-labelledby="meanwhile">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'In the meantime',
      title: 'Everything public is already on the site.',
      lead: 'Registrations, identifiers, NAICS mapping and capability detail are published openly. The capability statement adds the principals&rsquo; experience and the detail you would attach to a file.',
      id: 'meanwhile',
      center: true,
    })}
    <div class="grid grid--3">
      <article class="card card--link reveal">
        <span class="card__icon">${icons.shield()}</span>
        <h3 class="card__title"><a class="card__link" href="/federal-contracting/">Certifications &amp; identifiers</a></h3>
        <p class="card__body">SDVOSB, SAM, UEI ${site.ids.uei}, CAGE ${site.ids.cage}, and set-aside eligibility.</p>
        <span class="card__more">Federal contracting ${icons.arrow(13)}</span>
      </article>
      <article class="card card--link reveal" style="--reveal-delay:60ms">
        <span class="card__icon">${icons.construction()}</span>
        <h3 class="card__title"><a class="card__link" href="/capabilities/">Capability matrix</a></h3>
        <p class="card__body">Every capability line mapped to NAICS, with the delivery route for each.</p>
        <span class="card__more">Capabilities ${icons.arrow(13)}</span>
      </article>
      <article class="card card--link reveal" style="--reveal-delay:120ms">
        <span class="card__icon">${icons.handshake()}</span>
        <h3 class="card__title"><a class="card__link" href="/teaming/">Teaming vehicles</a></h3>
        <p class="card__body">Subcontracting, joint ventures and mentor-prot&eacute;g&eacute; arrangements.</p>
        <span class="card__more">Teaming ${icons.arrow(13)}</span>
      </article>
    </div>
  </div>
</section>

${ctaBand({
  title: 'Need it today?',
  lead: 'Call and ask. We would rather get the document into your hands than have you wait on a form.',
})}
`;

export default {
  url: '/capability-statement/',
  title: 'Request the Ionic Contractors Capability Statement',
  description:
    'Request the Ionic Contractors LLC capability statement — SDVOSB certification, SAM registration, UEI and CAGE identifiers, NAICS-mapped capability lines, and principals’ operator experience. Four-field request form.',
  crumbs: [{ href: '/capability-statement/', label: 'Capability Statement' }],
  body,
};
