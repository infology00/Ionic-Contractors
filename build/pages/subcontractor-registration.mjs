import { site, options } from '../site.mjs';
import {
  pageHero, sectionHead, ctaBand, icons, btn,
  formShell, textField, selectField, textareaField, fileField, checkboxGroup,
} from '../components.mjs';

const regForm = formShell({
  id: 'subcontractor-form',
  leadType: 'subcontractor',
  subject: 'Subcontractor registration: Ionic Contractors',
  submitLabel: 'Submit registration',
  note: 'Tagged for the subcontractor database, separately from contracting-officer and teaming leads.',
  children: `
    <fieldset class="fieldset">
      <legend class="fieldset__legend">Company</legend>
      <div class="form__grid form__grid--2">
        ${textField({ name: 'company', label: 'Company name', required: true, autocomplete: 'organization' })}
        ${textField({ name: 'website', label: 'Website', type: 'url', placeholder: 'https://', optionalNote: 'optional' })}
        ${textField({ name: 'contact', label: 'Primary contact', required: true, autocomplete: 'name' })}
        ${textField({ name: 'title', label: 'Title / role', optionalNote: 'optional' })}
        ${textField({ name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email' })}
        ${textField({ name: 'phone', label: 'Phone', type: 'tel', required: true, autocomplete: 'tel', placeholder: '000-000-0000' })}
        ${textField({ name: 'uei', label: 'UEI (SAM.gov)', optionalNote: 'if registered', placeholder: '12-character Unique Entity ID', hint: 'Your SAM.gov Unique Entity ID, if you have one.' })}
        ${textField({ name: 'cage', label: 'CAGE code', optionalNote: 'if assigned', placeholder: '5-character CAGE' })}
      </div>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset__legend">Capability</legend>
      <div class="form__grid form__grid--2">
        ${textField({ name: 'trades', label: 'Trade / service line(s)', required: true, placeholder: 'e.g. electrical, HVAC, remediation, tree removal', full: true })}
        ${textField({ name: 'naics', label: 'NAICS code(s) you perform', required: true, placeholder: 'e.g. 238210, 561730', hint: 'Comma-separated.' })}
        ${textField({ name: 'geography', label: 'Geographic coverage', required: true, placeholder: 'e.g. Eastern NC, VA, statewide' })}
      </div>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset__legend">Credentials</legend>
      ${checkboxGroup({
        name: 'certifications',
        legend: 'Business certifications',
        options: options.certifications,
        hint: 'Select all that apply. Certificates may be requested before award.',
      })}
      <div class="form__grid form__grid--2">
        ${textField({ name: 'license', label: 'License number(s)', optionalNote: 'where applicable', placeholder: 'State and number' })}
        ${textField({ name: 'bonding', label: 'Bonding capacity', optionalNote: 'if applicable', placeholder: 'e.g. $2M single / $5M aggregate' })}
        ${selectField({ name: 'insurance_gl', label: 'General liability (GL)', options: ['Yes, current', 'Yes, expiring within 30 days', 'No'], required: true })}
        ${selectField({ name: 'insurance_wc', label: "Workers' compensation (WC)", options: ['Yes, current', 'Exempt', 'No'], required: true })}
      </div>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset__legend">References &amp; documents</legend>
      ${textareaField({ name: 'references', label: 'References', rows: 4, placeholder: 'Two or three recent references: company, contact, phone or email, and a one-line description of the work.' })}
      <div class="form__grid form__grid--2">
        ${fileField({ name: 'capability_statement', label: 'Upload: Capability Statement', accept: '.pdf,.doc,.docx', hint: 'PDF preferred.', full: false })}
        ${fileField({ name: 'coi', label: 'Upload: Certificate of Insurance (COI)', accept: '.pdf,.jpg,.png', hint: 'Current COI.', full: false })}
      </div>
    </fieldset>`,
});

const body = `
${pageHero({
  crumbs: [{ href: '/subcontractor-registration/', label: 'Subcontractor Registration' }],
  eyebrow: 'Subcontractors & vendors',
  title: 'Register to work with Ionic.',
  lead: 'Ionic partners with qualified subcontractors, vendors, and suppliers to perform across our capability lines. Register below to be added to our network for upcoming federal, state, local, and private-sector opportunities.',
  actions: btn('#subcontractor-form', 'Go to the registration form', { variant: 'primary', arrow: false }),
})}

<section class="section" aria-labelledby="why-register">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Why register',
      title: 'Capacity we can call on quickly.',
      lead: 'A vetted network is how Ionic scales against a live opportunity, whether Ionic is the prime or is bringing capacity to a prime&rsquo;s team.',
      id: 'why-register',
    })}
    <div class="grid grid--3">
      <article class="card reveal">
        <span class="card__icon">${icons.building()}</span>
        <h3 class="card__title">Across every capability line</h3>
        <p class="card__body">Construction trades, environmental remediation, grounds and vegetation management, equipment maintenance, consulting, logistics, and ground transportation.</p>
      </article>
      <article class="card reveal" style="--reveal-delay:60ms">
        <span class="card__icon">${icons.clock()}</span>
        <h3 class="card__title">Contacted when the fit is real</h3>
        <p class="card__body">We reach out when an opportunity matches your trades, NAICS, coverage area, and credentials. No general mailings.</p>
      </article>
      <article class="card reveal" style="--reveal-delay:120ms">
        <span class="card__icon">${icons.shield()}</span>
        <h3 class="card__title">Certifications carry weight</h3>
        <p class="card__body">Small-business and socioeconomic certifications help both of us on subcontracting plans, so tell us what you hold.</p>
      </article>
    </div>
  </div>
</section>

<section class="section section--flush-top" aria-labelledby="reg-form-title">
  <div class="wrap wrap--narrow">
    <div class="form-panel reveal">
      <div class="form-panel__head">
        <p class="eyebrow">Registration form</p>
        <h2 id="reg-form-title" class="display t-2xl">Subcontractor &amp; vendor registration</h2>
        <p>Fields marked with an asterisk are required. Everything else helps us match you to the right opportunity faster.</p>
      </div>


      ${regForm}
    </div>
  </div>
</section>

${ctaBand({
  title: 'Questions before you register?',
  lead: 'Call or email us directly. We would rather answer a question than receive an incomplete registration.',
})}
`;

export default {
  url: '/subcontractor-registration/',
  title: 'Subcontractor & Vendor Registration',
  description:
    'Register your firm with Ionic Contractors for federal, state, local, and private opportunities in construction trades, remediation, grounds, and equipment.',
  crumbs: [{ href: '/subcontractor-registration/', label: 'Subcontractor Registration' }],
  body,
};
