import { site, naicsList, pscList, capabilities, addressLine } from '../site.mjs';
import {
  pageHero, sectionHead, ctaBand, icons, btn, btnRow, ctaPrimary, capStatementBtn,
  formShell, textField, selectField, textareaField, esc, accordion, faqLD,
} from '../components.mjs';

/* Feeds both the rendered accordion and the FAQPage schema. */
const faqs = [
  {
    q: 'Is Ionic’s SDVOSB status verifiable?',
    a: `<p>Yes. Ionic is certified through the SBA&rsquo;s VetCert program and registered in SAM.gov under UEI <span class="code">${site.ids.uei}</span> and CAGE <span class="code">${site.ids.cage}</span>. Written confirmation is available on request.</p>`,
  },
  {
    q: 'Can Ionic take a sole-source award?',
    a: '<p>Yes, where the requirement qualifies. Ionic is eligible for SDVOSB set-aside and sole-source awards, and for small-business awards under applicable NAICS size standards.</p>',
  },
  {
    q: 'Does Ionic work for state and local agencies too?',
    a: '<p>Yes. The same capability lines, certifications, and documentation support state, county, and municipal procurements. See <a href="/state-local/">State &amp; local</a>.</p>',
  },
  {
    q: 'How quickly does Ionic respond?',
    a: '<p>Promptly, usually the same business day for agency and teaming inquiries.</p>',
  },
];

const lineFor = (code) => capabilities.find((c) => c.naics.includes(code))?.short || '';

const idCard = (label, value, note, { copy = true, text = false } = {}) => `<div class="id-card reveal">
  <span class="id-card__label">${esc(label)}</span>
  <span class="id-card__value${text ? ' id-card__value--text' : ''}">${esc(value)}</span>
  ${note ? `<span class="id-card__note">${esc(note)}</span>` : ''}
  ${copy ? `<button class="copy-btn" type="button" data-copy="${esc(value)}">
    ${icons.copy(13)}<span data-copy-label>Copy</span>
    <span class="sr-only">${esc(label)}</span>
  </button>` : ''}
</div>`;

const bidForm = formShell({
  id: 'invite-to-bid',
  leadType: 'contracting_officer',
  subject: 'Invitation to bid: Ionic Contractors',
  submitLabel: 'Send invitation',
  note: 'Routed as a contracting-officer inquiry. We respond promptly, usually the same business day.',
  children: `
    <div class="form__grid form__grid--2">
      ${textField({ name: 'agency', label: 'Agency or activity', required: true, placeholder: 'e.g. Department of Veterans Affairs', autocomplete: 'organization' })}
      ${textField({ name: 'solicitation', label: 'Solicitation number', required: true, placeholder: 'e.g. 36C24625R0012' })}
      ${textField({ name: 'naics', label: 'NAICS code', placeholder: 'e.g. 236220', hint: 'The code the requirement is being solicited under.' })}
      ${textField({ name: 'due_date', label: 'Response due date', type: 'date' })}
      ${textField({ name: 'poc_name', label: 'Point of contact', required: true, placeholder: 'Full name', autocomplete: 'name' })}
      ${textField({ name: 'poc_email', label: 'Contact email', type: 'email', required: true, placeholder: 'name@agency.gov', autocomplete: 'email' })}
      ${textField({ name: 'poc_phone', label: 'Contact phone', type: 'tel', placeholder: '000-000-0000', autocomplete: 'tel', optionalNote: 'optional' })}
      ${selectField({ name: 'set_aside', label: 'Set-aside type', options: ['SDVOSB set-aside', 'SDVOSB sole source', 'Small business set-aside', 'Full and open', 'Not yet determined'] })}
      ${textareaField({ name: 'scope', label: 'Scope summary', rows: 4, placeholder: 'A short description of the requirement.', full: true })}
    </div>`,
});

const codeList = (list, { lines = false } = {}) => `<div class="naics-list reveal">
  ${list.map((n) => `<div class="naics-row"${n.primary ? ' data-primary="true"' : ''}>
    <span class="naics-row__code">${n.code}</span>
    <span class="naics-row__title">${esc(n.title)}${n.primary ? ' <span class="badge badge--accent">Primary</span>' : ''}${
      lines && lineFor(n.code) ? `<span class="naics-row__line">${esc(lineFor(n.code))}</span>` : ''}</span>
  </div>`).join('')}
</div>`;

const body = `
${pageHero({
  crumbs: [{ href: '/federal-contracting/', label: 'Federal Contracting' }],
  eyebrow: 'For contracting officers',
  title: 'How to work with Ionic.',
  lead: 'Every identifier you need to solicit, evaluate, and award, in one place and ready to paste into your file.',
  actions: btnRow(ctaPrimary(), btn('#invite-to-bid', 'Invite Ionic to bid', { variant: 'secondary', arrow: false })),
})}

<section class="section" aria-labelledby="registrations">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Certifications & registrations',
      title: 'Certifications and registrations',
      lead: 'Current, verifiable, and available in writing on request.',
      id: 'registrations',
    })}

    <div class="grid grid--2" style="margin-bottom:var(--s-6)">
      <article class="card reveal">
        <span class="card__icon">${icons.shield()}</span>
        <h3 class="card__title">SDVOSB: SBA VetCert certified</h3>
        <p class="card__body">Certified as a Service-Disabled Veteran-Owned Small Business through the SBA&rsquo;s VetCert program.</p>
      </article>
      <article class="card reveal" style="--reveal-delay:70ms">
        <span class="card__icon">${icons.check(22)}</span>
        <h3 class="card__title">SAM.gov: active registration</h3>
        <p class="card__body">Registered and active in the System for Award Management, with representations and certifications on file.</p>
      </article>
    </div>

    <div class="id-grid">
      ${idCard('Unique Entity ID (UEI)', site.ids.uei, 'As registered in SAM.gov')}
      ${idCard('CAGE code', site.ids.cage, 'Commercial and Government Entity code')}
      ${idCard('Entity name', site.name, 'As registered in SAM.gov', { text: true })}
      ${idCard('Headquarters', addressLine, 'Field offices in Texas and Florida', { copy: false, text: true })}
    </div>
  </div>
</section>

<section class="section section--flush-top" aria-labelledby="naics-title">
  <div class="wrap split">
    <div>
      ${sectionHead({
        eyebrow: 'NAICS codes',
        title: 'NAICS codes',
        lead: 'General construction (236220) is the primary code. Each code is shown with the capability line it supports.',
        id: 'naics-title',
      })}
      ${codeList(naicsList, { lines: true })}
    </div>
    <div>
      ${sectionHead({
        eyebrow: 'Product service codes',
        title: 'PSC codes',
        lead: 'The Product Service Codes Ionic pursues on federal requirements.',
        id: 'psc-title',
      })}
      ${codeList(pscList)}
    </div>
  </div>
</section>

<section class="section theme-gray" aria-labelledby="set-aside">
  <div class="wrap split">
    <div>
      ${sectionHead({
        eyebrow: 'Set-aside eligibility',
        title: 'Set-aside eligibility',
        id: 'set-aside',
      })}
      <div class="prose reveal">
        <p>Ionic is eligible for SDVOSB set-aside and sole-source awards, and is eligible for small-business awards under applicable NAICS size standards.</p>
      </div>
      <ul class="check-list mt-6 reveal">
        <li>${icons.check(15)}<span>SDVOSB set-aside awards</span></li>
        <li>${icons.check(15)}<span>SDVOSB sole-source awards</span></li>
        <li>${icons.check(15)}<span>Small-business awards under applicable NAICS size standards</span></li>
      </ul>
    </div>

    <div>
      ${sectionHead({
        eyebrow: 'How to solicit or award',
        title: 'How to solicit or award to Ionic',
        lead: 'Contracting officers can download our capability statement, invite Ionic to bid, or reach out directly to discuss a requirement.',
      })}
      <div class="steps">
        <div class="step reveal">
          <span class="step__num" aria-hidden="true"></span>
          <div>
            <h3 class="step__title">Get the capability statement</h3>
            <p class="step__body">Capability detail, NAICS and PSC codes, locations, and the principals&rsquo; operator experience, in one document for the file.</p>
            <p class="mt-3">${capStatementBtn('secondary', { sm: true })}</p>
          </div>
        </div>
        <div class="step reveal">
          <span class="step__num" aria-hidden="true"></span>
          <div>
            <h3 class="step__title">Invite Ionic to bid</h3>
            <p class="step__body">Send the agency, solicitation number, NAICS, due date, and point of contact using the form below.</p>
            <p class="mt-3">${btn('#invite-to-bid', 'Invite Ionic to bid', { variant: 'secondary', sm: true, arrow: false })}</p>
          </div>
        </div>
        <div class="step reveal">
          <span class="step__num" aria-hidden="true"></span>
          <div>
            <h3 class="step__title">Or call and describe the requirement</h3>
            <p class="step__body">Reach us at <a href="${site.phoneHref}">${site.phone}</a> or <a href="mailto:${site.email}">${site.email}</a>.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="bid-form-title">
  <div class="wrap wrap--narrow">
    <div class="form-panel reveal">
      <div class="form-panel__head">
        <p class="eyebrow">Invite Ionic to bid</p>
        <h2 id="bid-form-title" class="display t-2xl">Send us the solicitation</h2>
        <p>Give us the essentials and we will confirm receipt, check the fit against our NAICS and capacity, and come back with a straight answer.</p>
      </div>
      ${bidForm}
    </div>
  </div>
</section>

<section class="section section--flush-top" aria-labelledby="co-faq">
  <div class="wrap wrap--narrow">
    ${sectionHead({ eyebrow: 'Common questions', title: 'For the contracting file', id: 'co-faq' })}
    <div class="reveal">${accordion(faqs, { idPrefix: 'co' })}</div>
  </div>
</section>

${ctaBand({
  title: 'Everything you need to award is on this page.',
  lead: 'If something is missing from your file, ask and we will send it.',
})}
`;

export default {
  url: '/federal-contracting/',
  title: 'Federal SDVOSB Contracting: UEI, CAGE & NAICS',
  description:
    'Solicit or award to Ionic Contractors: SBA VetCert SDVOSB, active SAM.gov, UEI SUF6ZF8U5RA8, CAGE 9KDA3, NAICS and PSC codes, set-aside eligibility.',
  crumbs: [{ href: '/federal-contracting/', label: 'Federal Contracting' }],
  extraLD: [faqLD(faqs)],
  body,
};
