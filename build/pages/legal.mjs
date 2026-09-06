import { site, addressLine } from '../site.mjs';
import { pageHero, ctaBand, needsInputNote, icons, btn } from '../components.mjs';

/* ------------------------------------------------------------------
   Legal pages ship as reviewed-ready templates, not invented law.
   Each carries a visible "Needs input" notice so nothing here can be
   mistaken for approved legal text.
------------------------------------------------------------------- */

const LAST_REVIEWED = 'Not yet reviewed';

function legalPage({ url, title, pageTitle, description, eyebrow, lead, notice, sections }) {
  const body = `
${pageHero({
  crumbs: [{ href: url, label: title }],
  eyebrow,
  title: pageTitle,
  lead,
})}

<section class="section" aria-labelledby="legal-body">
  <div class="wrap wrap--narrow">
    <h2 id="legal-body" class="sr-only">${title}</h2>

    ${needsInputNote('Legal text not yet approved', notice)}

    <p class="mono mt-6" style="color:var(--c-text-3)">Last reviewed &middot; ${LAST_REVIEWED}</p>

    <div class="prose mt-6">
      ${sections.map((s) => `
        <h2 id="${s.id}">${s.h}</h2>
        ${s.p.map((p) => `<p>${p}</p>`).join('')}
        ${s.list ? `<ul class="check-list mt-4">${s.list.map((li) => `<li>${icons.check(15)}<span>${li}</span></li>`).join('')}</ul>` : ''}
      `).join('')}

      <h2 id="legal-contact">Contact</h2>
      <p>Questions about this page can be sent to <a href="mailto:${site.email}">${site.email}</a> or ${site.phone}, or by post to ${addressLine}.</p>
    </div>
  </div>
</section>

${ctaBand({ title: 'Still need something from us?', lead: 'Call or email and we will point you to the right person.' })}
`;

  return { url, title: pageTitle.replace(/<br>/g, ' '), description, crumbs: [{ href: url, label: title }], body };
}

/* ================================================================== */

export const privacy = legalPage({
  url: '/privacy-policy/',
  title: 'Privacy Policy',
  pageTitle: 'Privacy Policy',
  description:
    'How Ionic Contractors LLC collects, uses, and protects information submitted through this website, including enquiry, teaming, and subcontractor registration forms.',
  eyebrow: 'Legal',
  lead: 'How Ionic Contractors LLC handles information submitted through this website.',
  notice:
    'This is a structural template covering the disclosures a site with lead-capture forms typically needs. It has not been drafted or reviewed by counsel. Replace with approved text before launch &mdash; and confirm the CRM, analytics and email processors actually in use so the disclosures are accurate.',
  sections: [
    {
      id: 'information-we-collect', h: 'Information we collect',
      p: [
        'This website collects the information you choose to submit through its forms. Depending on the form, that may include your name, organisation or agency, role, email address, telephone number, details of an opportunity or solicitation, and any files you attach.',
        '<strong>[Placeholder]</strong> Confirm the complete list of fields collected across the contact, teaming, capability-statement and subcontractor-registration forms, and whether any additional information is collected automatically.',
      ],
    },
    {
      id: 'how-we-use-it', h: 'How we use it',
      p: ['Information submitted through this site is used to respond to your enquiry and to administer the relationship it relates to.'],
      list: [
        'Responding to agency, prime contractor, and subcontractor enquiries',
        'Delivering the capability statement when requested',
        'Maintaining a subcontractor and vendor database',
        '<strong>[Placeholder]</strong> Confirm any marketing or newsletter use, if applicable',
      ],
    },
    {
      id: 'analytics', h: 'Analytics and measurement',
      p: [
        '<strong>[Placeholder]</strong> This site is built to run Google Analytics 4 and Google Search Console. Neither is active until measurement identifiers are supplied. Once enabled, disclose the data collected, the retention period, and the legal basis or consent mechanism relied upon.',
      ],
    },
    {
      id: 'sharing', h: 'Sharing and processors',
      p: [
        '<strong>[Placeholder]</strong> List the third parties that process submitted information &mdash; email provider, CRM, form-handling service, hosting provider and analytics &mdash; once those are selected in the dev working session.',
      ],
    },
    {
      id: 'retention', h: 'Retention',
      p: ['<strong>[Placeholder]</strong> State how long enquiry records and subcontractor registrations are retained, and what triggers deletion.'],
    },
    {
      id: 'your-rights', h: 'Your choices',
      p: ['<strong>[Placeholder]</strong> Describe how someone can request access to, correction of, or deletion of information they submitted, and the response timeframe.'],
    },
  ],
});

export const terms = legalPage({
  url: '/terms-of-use/',
  title: 'Terms of Use',
  pageTitle: 'Terms of Use',
  description:
    'Terms governing use of the Ionic Contractors LLC website, including acceptable use, intellectual property, and limitations of liability.',
  eyebrow: 'Legal',
  lead: 'The terms that govern your use of this website.',
  notice:
    'Standard boilerplate structure only. This has not been drafted or reviewed by counsel and is not enforceable as written. Replace with approved text before launch.',
  sections: [
    {
      id: 'acceptance', h: 'Acceptance of terms',
      p: ['By accessing this website you agree to these terms. If you do not agree, please do not use the site.',
          '<strong>[Placeholder]</strong> Approved acceptance language.'],
    },
    {
      id: 'use-of-site', h: 'Permitted use',
      p: ['This site is provided for information about Ionic Contractors LLC and its capabilities, and to allow agencies, prime contractors, and subcontractors to make contact.'],
      list: [
        'Do not use the site to transmit unlawful, misleading, or harmful material',
        'Do not attempt to gain unauthorised access to the site or its systems',
        'Do not use automated means to harvest information from the site',
      ],
    },
    {
      id: 'accuracy', h: 'Accuracy of information',
      p: [
        'Certifications, registrations, and identifiers shown on this site are published in good faith and kept current. Formal verification should always be made through the relevant government system of record.',
        '<strong>[Placeholder]</strong> Confirm approved disclaimer language regarding capability descriptions and forward-looking statements.',
      ],
    },
    {
      id: 'ip', h: 'Intellectual property',
      p: ['<strong>[Placeholder]</strong> Ownership of site content, marks, and imagery, and the terms on which any of it may be reproduced.'],
    },
    {
      id: 'liability', h: 'Limitation of liability',
      p: ['<strong>[Placeholder]</strong> Approved limitation of liability and disclaimer of warranties.'],
    },
    {
      id: 'governing-law', h: 'Governing law',
      p: ['<strong>[Placeholder]</strong> Confirm governing law and venue. Ionic Contractors LLC is a North Carolina entity under Ionic Group LLC, a Wyoming holding company &mdash; counsel should confirm which applies.'],
    },
  ],
});

export const accessibility = legalPage({
  url: '/accessibility-statement/',
  title: 'Accessibility Statement',
  pageTitle: 'Accessibility Statement',
  description:
    'Ionic Contractors LLC is committed to accessibility. This statement describes the measures taken to conform with Section 508 and WCAG 2.1 Level AA, and how to report a barrier.',
  eyebrow: 'Section 508 &middot; ADA',
  lead: 'Ionic Contractors is committed to making this site usable by everyone, including people using assistive technology. Accessibility matters particularly on a federal-facing site.',
  notice:
    'The conformance measures listed below describe what has actually been built into this site. The formal conformance claim, the evaluation date, and the details of any third-party audit still need to be confirmed and approved before launch.',
  sections: [
    {
      id: 'commitment', h: 'Our commitment',
      p: [
        'Ionic Contractors LLC aims to conform with Section 508 of the Rehabilitation Act and the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA.',
        '<strong>[Placeholder]</strong> Confirm the formal conformance claim &mdash; fully conformant, partially conformant, or conformance in progress &mdash; and the date of the most recent evaluation.',
      ],
    },
    {
      id: 'measures', h: 'Measures built into this site',
      p: ['The following have been implemented as part of the site build:'],
      list: [
        'Semantic HTML landmarks, one main heading per page, and a logical heading order',
        'A skip-to-content link, visible keyboard focus indicators, and full keyboard operability',
        'Form labels programmatically associated with their inputs, with inline errors announced to assistive technology',
        'Alternative text on meaningful images and empty alternative text on decorative ones',
        '<code>aria-expanded</code> state on the navigation menu and every accordion control',
        'Support for <code>prefers-reduced-motion</code>: scroll-driven video and animation are disabled without hiding any content',
        'Full content available with JavaScript disabled',
        'Text that reflows without horizontal scrolling down to 320&nbsp;pixels, with fluid type sizing',
        'Touch targets sized for finger operation throughout',
      ],
    },
    {
      id: 'limitations', h: 'Known limitations',
      p: [
        '<strong>[Placeholder]</strong> Record any known limitations here after evaluation &mdash; for example third-party embeds or documents that have not yet been remediated.',
        'Note that the capability statement PDF, once supplied, must itself be checked for accessibility (tagged structure, reading order, and alternative text) before it is offered for download.',
      ],
    },
    {
      id: 'feedback', h: 'Reporting a barrier',
      p: [
        `If you encounter a barrier on this site, please tell us. Email <a href="mailto:${site.email}">${site.email}</a> or call ${site.phone} and describe the page and the problem. We will respond promptly and work to provide the information you need in an accessible format.`,
      ],
    },
    {
      id: 'assessment', h: 'Assessment approach',
      p: [
        '<strong>[Placeholder]</strong> State how the site was evaluated &mdash; self-assessment, external audit, or both &mdash; and name the evaluator and date once complete.',
      ],
    },
  ],
});
