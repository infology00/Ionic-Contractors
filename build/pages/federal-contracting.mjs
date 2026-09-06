import { site, naicsList, options } from '../site.mjs';
import {
  pageHero, sectionHead, ctaBand, icons, btn, btnRow, ctaPrimary,
  formShell, textField, selectField, textareaField, esc, accordion, faqLD,
} from '../components.mjs';

/* Feeds both the rendered accordion and the FAQPage schema. */
const faqs = [
  {
    q: 'Is Ionic’s SDVOSB status verifiable?',
    a: `<p>Yes. Ionic is certified through the SBA&rsquo;s VetCert programme and registered in SAM.gov under UEI <span class="code">${site.ids.uei}</span> and CAGE <span class="code">${site.ids.cage}</span>. Written confirmation is available on request.</p>`,
  },
  {
    q: 'What is Ionic’s past performance record?',
    a: '<p>Ionic is early in its company past-performance record and presents that honestly. What we bring to a file is a verifiable set-aside vehicle, real capability to perform or team, and the principals&rsquo; operator track record &mdash; which is set out in the capability statement.</p>',
  },
  {
    q: 'Can Ionic take a sole-source award?',
    a: '<p>Yes, where the requirement qualifies. Ionic is eligible for SDVOSB set-aside and sole-source awards, and as a small business under applicable NAICS size standards.</p>',
  },
  {
    q: 'How quickly does Ionic respond?',
    a: '<p>Promptly &mdash; usually the same business day for agency and teaming enquiries.</p>',
  },
];

const idCard = (label, value, note) => `<div class="id-card reveal">
  <span class="id-card__label">${esc(label)}</span>
  <span class="id-card__value">${esc(value)}</span>
  ${note ? `<span class="id-card__note">${esc(note)}</span>` : ''}
  <button class="copy-btn" type="button" data-copy="${esc(value)}">
    ${icons.copy(13)}<span data-copy-label>Copy</span>
    <span class="sr-only">${esc(label)}</span>
  </button>
</div>`;

const bidForm = formShell({
  id: 'invite-to-bid',
  leadType: 'contracting_officer',
  subject: 'Invitation to bid — Ionic Contractors LLC',
  submitLabel: 'Send invitation',
  note: 'Routed as a contracting-officer enquiry. We respond promptly, usually the same business day.',
  children: `
    <div class="form__grid form__grid--2">
      ${textField({ name: 'agency', label: 'Agency or activity', required: true, placeholder: 'e.g. Department of Veterans Affairs', autocomplete: 'organization' })}
      ${textField({ name: 'solicitation', label: 'Solicitation number', required: true, placeholder: 'e.g. 36C24625R0012' })}
      ${textField({ name: 'naics', label: 'NAICS code', placeholder: 'e.g. 236220', hint: 'The code the requirement is being solicited under.' })}
      ${textField({ name: 'due_date', label: 'Response due date', type: 'date' })}
      ${textField({ name: 'poc_name', label: 'Point of contact', required: true, placeholder: 'Full name', autocomplete: 'name' })}
      ${textField({ name: 'poc_email', label: 'Contact email', type: 'email', required: true, placeholder: 'name@agency.gov', autocomplete: 'email' })}
      ${textField({ name: 'poc_phone', label: 'Contact phone', type: 'tel', placeholder: '000-000-0000', autocomplete: 'tel' })}
      ${selectField({ name: 'set_aside', label: 'Set-aside type', options: ['SDVOSB set-aside', 'SDVOSB sole source', 'Small business set-aside', 'Full and open', 'Not yet determined'] })}
      ${textareaField({ name: 'scope', label: 'Scope summary', rows: 4, placeholder: 'A short description of the requirement.', full: true })}
    </div>`,
});

const body = `
${pageHero({
  crumbs: [{ href: '/federal-contracting/', label: 'Federal Contracting' }],
  eyebrow: 'For contracting officers',
  title: 'How to work with Ionic.',
  lead: 'Every identifier you need to solicit, evaluate, and award &mdash; in one place, ready to paste into your file.',
  actions: btnRow(ctaPrimary(), btn('#invite-to-bid', 'Invite Ionic to Bid', { variant: 'secondary', arrow: false })),
})}

<section class="section" aria-labelledby="registrations">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Certifications &amp; registrations',
      title: 'Certifications &amp; Registrations',
      lead: 'Current, verifiable, and available in writing on request.',
      id: 'registrations',
    })}

    <div class="grid grid--2" style="margin-bottom:var(--s-6)">
      <article class="card reveal">
        <span class="card__icon">${icons.shield()}</span>
        <h3 class="card__title">SDVOSB &mdash; SBA VetCert certified</h3>
        <p class="card__body">Certified as a Service-Disabled Veteran-Owned Small Business through the SBA&rsquo;s VetCert programme.</p>
      </article>
      <article class="card reveal" style="--reveal-delay:60ms">
        <span class="card__icon">${icons.check(22)}</span>
        <h3 class="card__title">SAM.gov &mdash; active registration</h3>
        <p class="card__body">Registered and active in the System for Award Management, with representations and certifications on file.</p>
      </article>
    </div>

    <div class="id-grid">
      ${idCard('Unique Entity ID (UEI)', site.ids.uei, 'As registered in SAM.gov')}
      ${idCard('CAGE Code', site.ids.cage, 'Commercial and Government Entity code')}
      ${idCard('Entity name', 'Ionic Contractors LLC', 'North Carolina limited liability company')}
      ${idCard('Registered office', '7432 Wiggins Mill Rd, Lucama, NC 27851', 'Place of performance varies by requirement')}
    </div>
  </div>
</section>

<section class="section section--flush-top" aria-labelledby="naics-title">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'NAICS codes',
      title: 'NAICS Codes',
      lead: 'General construction is the primary code. Supporting service codes follow.',
      id: 'naics-title',
    })}

    <div class="naics-list reveal">
      ${naicsList.map((n) => `<div class="naics-row"${n.primary ? ' data-primary="true"' : ''}>
        <span class="naics-row__code">${n.code}</span>
        <span class="naics-row__title">${esc(n.title)}${n.primary ? ' <span class="badge badge--accent">Primary</span>' : ''}</span>
      </div>`).join('')}
    </div>
  </div>
</section>

<section class="section section--flush-top" aria-labelledby="set-aside">
  <div class="wrap split">
    <div>
      ${sectionHead({
        eyebrow: 'Set-aside eligibility',
        title: 'Set-Aside Eligibility',
        id: 'set-aside',
      })}
      <div class="prose">
        <p>Ionic is eligible for SDVOSB set-aside and sole-source awards, and can be awarded as a small business under applicable NAICS size standards.</p>
      </div>
      <ul class="check-list mt-6">
        <li>${icons.check(15)}<span>SDVOSB set-aside awards</span></li>
        <li>${icons.check(15)}<span>SDVOSB sole-source awards</span></li>
        <li>${icons.check(15)}<span>Small business awards under applicable NAICS size standards</span></li>
      </ul>
    </div>

    <div>
      ${sectionHead({
        eyebrow: 'How to solicit or award',
        title: 'How to Solicit or Award to Ionic',
        lead: 'Contracting officers can request our capability statement, invite Ionic to bid, or reach out directly to discuss a requirement. We respond quickly and come prepared with the registrations and documentation you need to move.',
      })}
      <div class="steps">
        <div class="step reveal">
          <span class="step__num" aria-hidden="true"></span>
          <div>
            <h3 class="step__title">Request the capability statement</h3>
            <p class="step__body">Four fields, then the document. It carries capability detail and the principals&rsquo; operator experience.</p>
            <p class="mt-3">${btn('/capability-statement/', 'Request Capability Statement', { variant: 'secondary', sm: true })}</p>
          </div>
        </div>
        <div class="step reveal">
          <span class="step__num" aria-hidden="true"></span>
          <div>
            <h3 class="step__title">Invite Ionic to bid</h3>
            <p class="step__body">Send the agency, solicitation number, NAICS, due date and point of contact using the form below.</p>
            <p class="mt-3">${btn('#invite-to-bid', 'Invite Ionic to Bid', { variant: 'secondary', sm: true, arrow: false })}</p>
          </div>
        </div>
        <div class="step reveal">
          <span class="step__num" aria-hidden="true"></span>
          <div>
            <h3 class="step__title">Or just call and describe the requirement</h3>
            <p class="step__body">Reach us on <a href="${site.phoneHref}" style="color:var(--c-accent-bright)">${site.phone}</a> or <a href="mailto:${site.email}" style="color:var(--c-accent-bright)">${site.email}</a>.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section section--flush-top" aria-labelledby="bid-form-title">
  <div class="wrap wrap--narrow">
    <div class="form-panel">
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
    ${accordion(faqs, { idPrefix: 'co' })}
  </div>
</section>

${ctaBand({
  title: 'Everything you need to award is on this page.',
  lead: 'If something is missing from your file, ask and we will send it.',
})}
`;

export default {
  url: '/federal-contracting/',
  title: 'Federal Contracting — SDVOSB Set-Aside, UEI & CAGE',
  description:
    'How contracting officers solicit and award to Ionic Contractors LLC: SDVOSB SBA VetCert certification, active SAM.gov registration, UEI SUF6ZF8U5RA8, CAGE 9KDA3, NAICS codes, and set-aside eligibility.',
  crumbs: [{ href: '/federal-contracting/', label: 'Federal Contracting' }],
  extraLD: [faqLD(faqs)],
  body,
};
