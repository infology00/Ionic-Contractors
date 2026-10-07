import { site, addressLine } from '../site.mjs';
import { pageHero, ctaBand, icons } from '../components.mjs';

/* ------------------------------------------------------------------
   Legal pages. The client is supplying final, counsel-approved text;
   when it arrives, replace the `sections` arrays below and rebuild.
   The copy here is plain, factual, and describes only what this site
   actually does today (no analytics, no CRM, forms open your email).
------------------------------------------------------------------- */

const UPDATED = 'October 2026';

function legalPage({ url, title, pageTitle, description, eyebrow, lead, sections }) {
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

    <p class="mono" style="color:var(--c-text-3)">Last updated: ${UPDATED}</p>

    <div class="prose mt-6">
      ${sections.map((s) => `
        <h2 id="${s.id}">${s.h}</h2>
        ${s.p.map((p) => `<p>${p}</p>`).join('')}
        ${s.list ? `<ul class="check-list mt-4">${s.list.map((li) => `<li>${icons.check(15)}<span>${li}</span></li>`).join('')}</ul>` : ''}
      `).join('')}

      <h2 id="legal-contact">Contact</h2>
      <p>Questions about this page can be sent to <a href="mailto:${site.email}">${site.email}</a> or ${site.phone}, or by mail to ${site.name}, ${addressLine}.</p>
    </div>
  </div>
</section>

${ctaBand({ title: 'Still need something from us?', lead: 'Call or email and we will point you to the right person.' })}
`;

  return { url, title: `${pageTitle} | Ionic Contractors`, description, crumbs: [{ href: url, label: title }], body };
}

/* ================================================================== */

export const privacy = legalPage({
  url: '/privacy-policy/',
  title: 'Privacy Policy',
  pageTitle: 'Privacy Policy',
  description:
    'How Ionic Contractors collects, uses, and protects information submitted through this website, including inquiry, teaming, and subcontractor registration forms.',
  eyebrow: 'Legal',
  lead: 'How Ionic Contractors handles information submitted through this website.',
  sections: [
    {
      id: 'information-we-collect', h: 'Information we collect',
      p: [
        'This website collects only the information you choose to submit through its forms. Depending on the form, that may include your name, organization or agency, role, email address, telephone number, details of an opportunity or solicitation, your firm&rsquo;s trades, NAICS codes, certifications, insurance, and bonding details, and the names of any files you select.',
        'The site does not use advertising cookies or tracking pixels, and no analytics service is active.',
      ],
    },
    {
      id: 'how-forms-work', h: 'How our forms work',
      p: [
        'When you submit a form, your entries are checked in your browser and then handed to your own email application, pre-filled and addressed to us. Nothing is sent until you press send in your email application, and the message travels through your email provider like any other email.',
      ],
    },
    {
      id: 'how-we-use-it', h: 'How we use it',
      p: ['Information you send us is used to respond to your inquiry and to administer the relationship it relates to:'],
      list: [
        'Responding to agency, owner, prime contractor, and subcontractor inquiries',
        'Sending the capability statement when requested',
        'Maintaining our subcontractor and vendor network',
        'Evaluating teaming and subcontracting opportunities',
      ],
    },
    {
      id: 'sharing', h: 'Sharing',
      p: [
        'We do not sell or rent personal information. We share it only with teaming partners or agencies where you have asked us to pursue an opportunity together, with service providers who host our email and website, or where the law requires it.',
      ],
    },
    {
      id: 'retention', h: 'Retention',
      p: ['Inquiry records are kept for as long as needed to respond and to manage any resulting relationship. Subcontractor registrations are kept while your firm remains part of our network, or until you ask us to remove them.'],
    },
    {
      id: 'your-choices', h: 'Your choices',
      p: [`You can ask us to access, correct, or delete information you have submitted by emailing <a href="mailto:${site.email}">${site.email}</a>. We respond to these requests promptly.`],
    },
    {
      id: 'changes', h: 'Changes to this policy',
      p: ['If our practices change, for example when online form handling or analytics are introduced, this page will be updated and the date above revised.'],
    },
  ],
});

export const terms = legalPage({
  url: '/terms-of-use/',
  title: 'Terms of Use',
  pageTitle: 'Terms of Use',
  description:
    'Terms governing use of the Ionic Contractors website, including permitted use, accuracy of information, intellectual property, and limitation of liability.',
  eyebrow: 'Legal',
  lead: 'The terms that govern your use of this website.',
  sections: [
    {
      id: 'acceptance', h: 'Acceptance of terms',
      p: ['By accessing this website you agree to these terms. If you do not agree, please do not use the site.'],
    },
    {
      id: 'use-of-site', h: 'Permitted use',
      p: ['This site provides information about Ionic Contractors and its capabilities, and allows agencies, owners, prime contractors, and subcontractors to contact us.'],
      list: [
        'Do not use the site to transmit unlawful, misleading, or harmful material',
        'Do not attempt to gain unauthorized access to the site or its systems',
        'Do not use automated means to harvest information from the site',
      ],
    },
    {
      id: 'accuracy', h: 'Accuracy of information',
      p: [
        'Certifications, registrations, and identifiers shown on this site are published in good faith and kept current. Formal verification should always be made through the relevant government system of record, such as SAM.gov and SBA VetCert.',
        'Descriptions of capabilities are general in nature and do not constitute an offer, bid, or commitment to perform any specific work.',
      ],
    },
    {
      id: 'ip', h: 'Intellectual property',
      p: ['The Ionic Contractors name, logo, and the content of this site belong to Ionic Contractors. They may not be reproduced or used to imply endorsement without written permission.'],
    },
    {
      id: 'liability', h: 'Limitation of liability',
      p: ['This site is provided &ldquo;as is.&rdquo; To the extent permitted by law, Ionic Contractors is not liable for any loss arising from use of, or reliance on, the information on this site.'],
    },
    {
      id: 'governing-law', h: 'Governing law',
      p: ['These terms are governed by the laws of the State of North Carolina, without regard to its conflict-of-law rules.'],
    },
  ],
});

export const accessibility = legalPage({
  url: '/accessibility-statement/',
  title: 'Accessibility Statement',
  pageTitle: 'Accessibility Statement',
  description:
    'How Ionic Contractors works to conform to Section 508 and WCAG 2.1 Level AA, the accessibility measures built into this site, and how to report a barrier.',
  eyebrow: 'Section 508 · ADA',
  lead: 'Ionic Contractors is committed to making this site usable by everyone, including people using assistive technology.',
  sections: [
    {
      id: 'commitment', h: 'Our commitment',
      p: [
        'Ionic Contractors aims to conform to Section 508 of the Rehabilitation Act and the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA.',
      ],
    },
    {
      id: 'measures', h: 'Measures built into this site',
      p: ['The following are built into the site:'],
      list: [
        'Semantic HTML landmarks, one main heading per page, and a logical heading order',
        'A skip-to-content link, visible keyboard focus indicators, and full keyboard operability',
        'Form labels programmatically associated with their inputs, with inline errors announced to assistive technology',
        'Alternative text on meaningful images and empty alternative text on decorative ones',
        '<code>aria-expanded</code> state on the navigation menus and every accordion control',
        'All animated content is also present as real text; with <code>prefers-reduced-motion</code> set, scroll animation is replaced by static panels without hiding any content',
        'Full content available with JavaScript disabled',
        'Text that reflows without horizontal scrolling down to 320&nbsp;pixels, with fluid type sizing',
        'Color contrast meeting WCAG AA, and touch targets sized for finger operation throughout',
      ],
    },
    {
      id: 'documents', h: 'Documents',
      p: [
        'Downloadable documents, including the capability statement, are checked for tagged structure, reading order, and alternative text before they are published. If you need a document in another format, ask and we will provide it.',
      ],
    },
    {
      id: 'feedback', h: 'Reporting a barrier',
      p: [
        `If you encounter a barrier on this site, please tell us. Email <a href="mailto:${site.email}">${site.email}</a> or call ${site.phone} and describe the page and the problem. We will respond promptly and work to provide the information you need in an accessible format.`,
      ],
    },
  ],
});
