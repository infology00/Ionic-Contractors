import { options } from '../site.mjs';
import {
  pageHero, sectionHead, ctaBand, icons, btn, btnRow,
  formShell, textField, selectField, textareaField, esc,
} from '../components.mjs';

const teamingForm = formShell({
  id: 'teaming-form',
  leadType: 'teaming_prime',
  subject: 'Teaming enquiry — Ionic Contractors LLC',
  submitLabel: 'Start a Teaming Conversation',
  note: 'Tagged as a teaming lead and routed separately from contracting-officer enquiries.',
  children: `
    <div class="form__grid form__grid--2">
      ${textField({ name: 'company', label: 'Company name', required: true, autocomplete: 'organization', placeholder: 'Your firm' })}
      ${textField({ name: 'contact', label: 'Contact name', required: true, autocomplete: 'name', placeholder: 'Full name' })}
      ${textField({ name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email', placeholder: 'name@company.com' })}
      ${textField({ name: 'phone', label: 'Phone', type: 'tel', required: true, autocomplete: 'tel', placeholder: '000-000-0000' })}
      ${textField({ name: 'opportunity', label: 'Opportunity or agency', required: true, placeholder: 'e.g. USACE Wilmington District' })}
      ${textField({ name: 'solicitation', label: 'Solicitation number', optionalNote: 'if any', placeholder: 'e.g. W912PM25R0004' })}
      ${selectField({ name: 'role', label: 'Role sought', options: options.teamingRole, required: true, full: false })}
      ${textField({ name: 'due_date', label: 'Proposal due date', type: 'date' })}
      ${textareaField({ name: 'scope', label: 'Scope needed from Ionic', required: true, rows: 5, placeholder: 'Which parts of the scope would Ionic carry, and roughly what share of the work?', full: true })}
    </div>`,
});

const body = `
${pageHero({
  crumbs: [{ href: '/teaming/', label: 'Teaming' }],
  eyebrow: 'For prime contractors',
  title: 'Team with an SDVOSB<br>that is ready to work.',
  lead: 'Primes pursuing federal work often need a qualified SDVOSB partner to meet subcontracting goals and strengthen a proposal. Ionic is certified, registered, and ready to team &mdash; as a subcontractor, joint-venture partner, or mentor-prot&eacute;g&eacute; participant.',
  actions: btnRow(
    btn('#teaming-form', 'Start a Teaming Conversation', { variant: 'primary', arrow: false }),
    btn('/capability-statement/', 'Request Capability Statement', { variant: 'secondary' })
  ),
})}

<section class="section" aria-labelledby="brings">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'What Ionic brings',
      title: 'What Ionic Brings to a Team',
      lead: 'Four things that make a difference to a proposal and to the job that follows.',
      id: 'brings',
    })}

    <div class="grid grid--4">
      <article class="card reveal">
        <span class="card__icon">${icons.shield()}</span>
        <h3 class="card__title">Verifiable SDVOSB certification</h3>
        <p class="card__body">SBA VetCert certified and SAM-registered, for set-aside eligibility and subcontracting-plan goal credit.</p>
      </article>
      <article class="card reveal" style="--reveal-delay:60ms">
        <span class="card__icon">${icons.construction()}</span>
        <h3 class="card__title">General-construction self-performance</h3>
        <p class="card__body">A real construction core we perform ourselves &mdash; not a pass-through arrangement.</p>
      </article>
      <article class="card reveal" style="--reveal-delay:120ms">
        <span class="card__icon">${icons.route()}</span>
        <h3 class="card__title">Broad supporting services</h3>
        <p class="card__body">Grounds, facilities maintenance, janitorial, logistics and consulting to round out a scope.</p>
      </article>
      <article class="card reveal" style="--reveal-delay:180ms">
        <span class="card__icon">${icons.doc()}</span>
        <h3 class="card__title">Documentation-ready contracting</h3>
        <p class="card__body">Registrations, certifications and paperwork current, so we do not slow your submission down.</p>
      </article>
    </div>
  </div>
</section>

<section class="section section--flush-top" aria-labelledby="vehicles">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Partnering vehicles',
      title: 'Three ways to bring Ionic onto a team',
      id: 'vehicles',
    })}

    <div class="grid grid--3">
      <article class="card card--pad-lg reveal">
        <span class="mono" style="color:var(--c-accent)">01</span>
        <h3 class="card__title t-xl">Subcontracting</h3>
        <p class="card__body">Ionic takes a defined scope beneath your prime contract, with SDVOSB credit toward your subcontracting plan.</p>
      </article>
      <article class="card card--pad-lg reveal" style="--reveal-delay:60ms">
        <span class="mono" style="color:var(--c-accent)">02</span>
        <h3 class="card__title t-xl">Joint Ventures (JV)</h3>
        <p class="card__body">A formal JV where the requirement and the set-aside call for a combined entity with shared performance.</p>
      </article>
      <article class="card card--pad-lg reveal" style="--reveal-delay:120ms">
        <span class="mono" style="color:var(--c-accent)">03</span>
        <h3 class="card__title t-xl">Mentor-Prot&eacute;g&eacute;</h3>
        <p class="card__body">A mentor-prot&eacute;g&eacute; arrangement that builds capability on both sides across a longer horizon.</p>
      </article>
    </div>
  </div>
</section>

<section class="section section--flush-top" id="partner-intake" aria-labelledby="intake-title">
  <div class="wrap wrap--narrow">
    <div class="form-panel">
      <div class="form-panel__head">
        <p class="eyebrow">Partner intake</p>
        <h2 id="intake-title" class="display t-2xl">Start a teaming conversation</h2>
        <p>Tell us about the opportunity and the scope you need covered. We will come back with what Ionic can carry, in what role, and on what timeline.</p>
      </div>
      ${teamingForm}
    </div>

    <div class="grid grid--2 mt-8">
      <article class="card reveal">
        <span class="card__icon">${icons.users()}</span>
        <h3 class="card__title">Need capacity beneath us instead?</h3>
        <p class="card__body">Ionic maintains a vetted subcontractor and vendor database across every capability line.</p>
        <p class="mt-4">${btn('/subcontractor-registration/', 'Register as a subcontractor', { variant: 'secondary', sm: true })}</p>
      </article>
      <article class="card reveal" style="--reveal-delay:60ms">
        <span class="card__icon">${icons.doc()}</span>
        <h3 class="card__title">Building a proposal now?</h3>
        <p class="card__body">The capability statement carries the detail your proposal team needs, including principal experience.</p>
        <p class="mt-4">${btn('/capability-statement/', 'Request Capability Statement', { variant: 'secondary', sm: true })}</p>
      </article>
    </div>
  </div>
</section>

${ctaBand({
  title: 'Add a certified SDVOSB to your team.',
  lead: 'Send the opportunity and the scope. We will tell you quickly whether Ionic is the right partner for it.',
})}
`;

export default {
  url: '/teaming/',
  title: 'Teaming & Partnerships — SDVOSB Subcontractor, JV & Mentor-Protégé',
  description:
    'Ionic Contractors is a certified SDVOSB ready to team with prime contractors as a subcontractor, joint-venture partner, or mentor-protégé participant — helping primes meet subcontracting goals with real self-performance capability.',
  crumbs: [{ href: '/teaming/', label: 'Teaming' }],
  body,
};
