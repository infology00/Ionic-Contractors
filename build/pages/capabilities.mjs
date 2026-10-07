import { capabilities } from '../site.mjs';
import {
  pageHero, sectionHead, ctaBand, icons, btn, btnRow, ctaPrimary, ctaSecondary,
  capabilityMatrix, accordion, esc, faqLD, deliveryCards,
} from '../components.mjs';

const supporting = capabilities.filter((c) => !c.primary);
const primary = capabilities.find((c) => c.primary);

/* One array feeds both the rendered accordion and the FAQPage schema,
   so the two can never drift out of sync. */
const faqs = [
  {
    q: 'Which NAICS codes does Ionic work under?',
    a: `<p>General construction and trades lead, under NAICS 236220 (primary), 236210, 238210, 238220, and 238990. Supporting lines cover 562910, 561730, 115112, 811310, 423810, 423820, 541611, and 541690. The full list, with Product Service Codes, is on the <a href="/federal-contracting/">Federal Contracting</a> page.</p>`,
  },
  {
    q: 'Can Ionic take a services-only requirement?',
    a: '<p>Yes. Environmental remediation, grounds and vegetation management, equipment maintenance and sourcing, and management and technical consulting all stand alone as requirements. They do not have to be attached to a construction scope.</p>',
  },
  {
    q: 'Does Ionic work for state, local, and private clients?',
    a: '<p>Yes. Federal agencies come first, and Ionic delivers the same capability lines for state, county, and municipal governments and for private-sector owners, developers, and general contractors.</p>',
  },
  {
    q: 'How does Ionic build capacity for a larger scope?',
    a: '<p>Through a vetted subcontractor and vendor network maintained for exactly this purpose. Firms register with their trades, NAICS codes, certifications, insurance, and bonding, so capacity can be assembled quickly against a live opportunity. <a href="/subcontractor-registration/">Register to work with Ionic</a>.</p>',
  },
];

const body = `
${pageHero({
  crumbs: [{ href: '/capabilities/', label: 'Capabilities' }],
  eyebrow: 'Capabilities',
  title: 'A construction core, organized for the requirement.',
  lead: `Ionic leads with general construction and trades, supported by ${supporting.length} allied service lines, each mapped to the NAICS codes in our capability statement so agencies, primes, and owners can match us to a requirement quickly.`,
  actions: btnRow(ctaPrimary(), btn('#matrix', 'Jump to capability matrix', { variant: 'secondary', arrow: false })),
})}

<section class="section" id="${esc(primary.id)}" aria-labelledby="gc-title">
  <div class="wrap">
    <div class="card card--pad-lg card--feature reveal" style="gap:var(--s-5)">
      <div style="display:flex;align-items:center;gap:var(--s-4);flex-wrap:wrap">
        <span class="card__icon" style="margin:0">${icons.construction(26)}</span>
        <span class="badge badge--accent"><span class="badge__dot"></span>Primary capability</span>
      </div>
      <h2 id="gc-title" class="display t-3xl">${esc(primary.name)}</h2>
      <p class="lead" style="max-width:var(--measure);color:#D2D4DA">${esc(primary.blurb)}</p>
      <div class="naics-cell">${primary.naics.map((n) => `<span class="naics-chip">NAICS ${n}</span>`).join('')}</div>
      <div class="grid grid--2 mt-5" style="gap:var(--s-5)">
        <ul class="check-list">
          ${primary.points.slice(0, 3).map((p) => `<li>${icons.check(15)}<span>${esc(p)}</span></li>`).join('')}
        </ul>
        <ul class="check-list">
          ${primary.points.slice(3).map((p) => `<li>${icons.check(15)}<span>${esc(p)}</span></li>`).join('')}
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="section section--flush-top" aria-labelledby="supporting">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Supporting capabilities',
      title: 'The services that surround the build.',
      lead: 'Allied lines that stand alone on a services requirement, or round out a construction scope on the same site.',
      id: 'supporting',
    })}

    <div class="grid grid--2">
      ${supporting.map((c, i) => `<article class="card reveal" id="${esc(c.id)}" style="--reveal-delay:${i * 70}ms">
        <span class="card__icon">${icons[c.icon] ? icons[c.icon]() : icons.building()}</span>
        <h3 class="card__title">${esc(c.name)}</h3>
        <p class="card__body">${esc(c.blurb)}</p>
        <div class="naics-cell">${c.naics.map((n) => `<span class="naics-chip">NAICS ${n}</span>`).join('')}</div>
      </article>`).join('')}
    </div>
  </div>
</section>

<section class="section section--flush-top" id="matrix" aria-labelledby="matrix-title">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Capability matrix',
      title: 'Capability to NAICS, at a glance',
      lead: 'The mapping a contracting officer scans first: each capability line and the NAICS codes it is pursued under.',
      id: 'matrix-title',
    })}

    ${capabilityMatrix()}
  </div>
</section>

<section class="section theme-gray" aria-labelledby="delivery-title">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Delivery approach',
      title: 'Mobilize. Execute. Close out.',
      lead: 'Every capability line is delivered the same way: planned before mobilization, documented through execution, and closed out complete.',
      id: 'delivery-title',
    })}
    ${deliveryCards()}
  </div>
</section>

<section class="section" aria-labelledby="faq-title">
  <div class="wrap split">
    <div>
      ${sectionHead({
        eyebrow: 'Common questions',
        title: 'Matching Ionic to your requirement.',
        lead: 'Send the scope, the NAICS, or the solicitation number and we will tell you plainly what Ionic carries.',
        id: 'faq-title',
      })}
      <div class="mt-6 reveal">${btnRow(ctaSecondary(), btn('/subcontractor-registration/', 'Register as a subcontractor', { variant: 'ghost' }))}</div>
    </div>
    <div class="reveal">
      ${accordion(faqs, { idPrefix: 'cap' })}
    </div>
  </div>
</section>

${ctaBand({
  title: 'Match a requirement to a capability.',
  lead: 'Send the scope, the NAICS, or the solicitation number. We will tell you what Ionic carries and how we would deliver it.',
})}
`;

export default {
  url: '/capabilities/',
  title: 'Capabilities & NAICS Codes',
  description:
    'General construction & trades, environmental remediation, grounds & vegetation management, equipment maintenance, and consulting, mapped to NAICS codes.',
  crumbs: [{ href: '/capabilities/', label: 'Capabilities' }],
  extraLD: [faqLD(faqs)],
  body,
};
