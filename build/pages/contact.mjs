import { site, options, capStatement } from '../site.mjs';
import {
  pageHero, sectionHead, icons, btn,
  formShell, textField, selectField, textareaField, esc,
} from '../components.mjs';

const contactForm = formShell({
  id: 'contact-form',
  leadType: 'general_contact',
  subject: 'Website inquiry: Ionic Contractors',
  submitLabel: 'Send inquiry',
  note: 'Tagged by role so agency, prime, and owner inquiries reach the right person.',
  children: `
    <div class="form__grid form__grid--2">
      ${textField({ name: 'name', label: 'Name', required: true, autocomplete: 'name', placeholder: 'Full name' })}
      ${textField({ name: 'organization', label: 'Organization / agency', required: true, autocomplete: 'organization', placeholder: 'Agency, activity or company' })}
      ${selectField({ name: 'role', label: 'I am a…', options: options.audience, required: true })}
      ${selectField({ name: 'reason', label: 'Reason for contact', options: options.contactReason, required: true })}
      ${textField({ name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email', placeholder: 'name@agency.gov' })}
      ${textField({ name: 'phone', label: 'Phone', type: 'tel', optionalNote: 'optional', autocomplete: 'tel', placeholder: '000-000-0000' })}
      ${textareaField({ name: 'message', label: 'Message', required: true, rows: 6, placeholder: 'Tell us about the requirement, the opportunity, or what you need from us.' })}
    </div>`,
});

const body = `
${pageHero({
  crumbs: [{ href: '/contact/', label: 'Contact' }],
  eyebrow: 'Contact',
  title: 'Tell us about the project.',
  lead: 'Contracting officers, state and local agencies, primes, private owners, and small businesses all reach us the same way. Say which you are and your inquiry goes straight to the right person.',
})}

<section class="section" aria-labelledby="contact-form-title">
  <div class="wrap split split--wide-left">
    <div>
      <div class="form-panel reveal">
        <div class="form-panel__head">
          <p class="eyebrow">Send an inquiry</p>
          <h2 id="contact-form-title" class="display t-2xl">Contact Ionic Contractors</h2>
          <p>Fields marked with an asterisk are required.</p>
        </div>
        ${contactForm}
      </div>
    </div>

    <div class="stack-lg">
      <div>
        ${sectionHead({
          eyebrow: 'Direct contact',
          title: 'Reach us directly',
          level: 2,
        })}
        <div class="contact-cards">
          <div class="contact-card">
            <span class="contact-card__icon">${icons.phone(20)}</span>
            <span class="contact-card__label">Phone</span>
            <a class="contact-card__value" href="${site.phoneHref}">${site.phone}</a>
            <span class="contact-card__note">Tap to call on mobile</span>
          </div>
          <div class="contact-card">
            <span class="contact-card__icon">${icons.mail(20)}</span>
            <span class="contact-card__label">Email</span>
            <a class="contact-card__value" href="mailto:${site.email}">${site.email}</a>
            <span class="contact-card__note">Monitored throughout the business day</span>
          </div>
        </div>

        <div class="contact-card mt-4">
          <span class="contact-card__icon">${icons.pin(20)}</span>
          <span class="contact-card__label">Headquarters</span>
          <address class="contact-card__value" style="font-style:normal;font-size:var(--t-base);font-weight:500">
            ${site.address.street}<br>${site.address.locality}, ${site.address.region} ${site.address.postal}
          </address>
          <span class="contact-card__note">Field offices in Texas and Florida</span>
        </div>
      </div>

      <div class="card card--pad-lg card--feature">
        <span class="card__icon">${icons.clock()}</span>
        <h2 class="card__title t-xl">Response commitment</h2>
        <p class="card__body" style="font-size:var(--t-md)">We respond to agency, owner, and teaming inquiries promptly, usually the same business day.</p>
      </div>

      <div class="card">
        <h2 class="card__title t-lg">Looking for something specific?</h2>
        <ul class="footer__list mt-3">
          <li><a class="footer__link" href="${capStatement.href}"${capStatement.available ? ' download' : ''}>${icons.arrow(13)}&nbsp; Get the capability statement</a></li>
          <li><a class="footer__link" href="/federal-contracting/#invite-to-bid">${icons.arrow(13)}&nbsp; Invite Ionic to bid</a></li>
          <li><a class="footer__link" href="/teaming/#teaming-form">${icons.arrow(13)}&nbsp; Start a teaming conversation</a></li>
          <li><a class="footer__link" href="/subcontractor-registration/">${icons.arrow(13)}&nbsp; Register as a subcontractor</a></li>
        </ul>
      </div>
    </div>
  </div>
</section>
`;

export default {
  url: '/contact/',
  title: 'Contact | Ionic Contractors',
  description:
    'Contact Ionic Contractors, a veteran-owned SDVOSB general contractor. Call 252-546-7181 or email service@ionic.contractors. We respond promptly.',
  crumbs: [{ href: '/contact/', label: 'Contact' }],
  body,
};
