import { capabilities } from '../site.mjs';
import {
  pageHero, sectionHead, ctaBand, icons, btn, btnRow, ctaPrimary, ctaSecondary,
  capabilityMatrix, needsInputNote, accordion, esc, faqLD,
} from '../components.mjs';

const supporting = capabilities.filter((c) => !c.primary);
const primary = capabilities.find((c) => c.primary);

/* One array feeds both the rendered accordion and the FAQPage schema,
   so the two can never drift out of sync. */
const faqs = [
  {
    q: 'When does Ionic self-perform?',
    a: '<p>General construction is our self-performance core. Where a scope sits inside that core and within our capacity, Ionic performs it directly and manages the documentation and compliance that come with a federal job.</p>',
  },
  {
    q: 'When does Ionic team?',
    a: '<p>Where a requirement calls for added capacity, specialist trades, or a scope wider than a single line, we bring qualified subcontractors and partners onto the job. You will be told which parts are self-performed and which are teamed before award, not after.</p>',
  },
  {
    q: 'Can Ionic take a services-only requirement?',
    a: '<p>Yes. Grounds and landscaping, facilities maintenance, janitorial, logistics and specialty consulting all stand alone as service requirements &mdash; they do not have to be attached to a construction scope.</p>',
  },
  {
    q: 'How does Ionic build capacity for a larger scope?',
    a: '<p>Through a vetted subcontractor and vendor database we maintain for exactly this purpose. Firms register with their trades, NAICS codes, certifications, insurance and bonding so we can assemble capacity quickly against a live opportunity. <a href="/subcontractor-registration/">Register to work with Ionic</a>.</p>',
  },
];

const body = `
${pageHero({
  crumbs: [{ href: '/capabilities/', label: 'Capabilities' }],
  eyebrow: 'Capabilities',
  title: 'A construction core,<br>organised for the requirement.',
  lead: 'Ionic leads with general construction and supports it with a broad set of allied services &mdash; organised by capability and NAICS so agencies and primes can quickly match us to a requirement. We perform directly where we can and team where a requirement calls for added capacity.',
  actions: btnRow(ctaPrimary(), btn('#matrix', 'Jump to capability matrix', { variant: 'secondary', arrow: false })),
})}

<section class="section" id="general-construction" aria-labelledby="gc-title">
  <div class="wrap">
    <div class="card card--pad-lg card--feature reveal" style="gap:var(--s-5)">
      <div style="display:flex;align-items:center;gap:var(--s-4);flex-wrap:wrap">
        <span class="card__icon" style="margin:0">${icons.construction(26)}</span>
        <span class="badge badge--accent"><span class="badge__dot"></span>Primary capability</span>
        <span class="naics-cell">${primary.naics.map((n) => `<span class="naics-chip">NAICS ${n}</span>`).join('')}</span>
      </div>
      <h2 id="gc-title" class="display t-3xl">General Construction</h2>
      <p class="lead" style="max-width:var(--measure)">Full-scope general construction for government facilities: new construction, renovation, repair, and build-out &mdash; managed to federal standards with proper documentation and compliance.</p>
      <div class="grid grid--2 mt-5" style="gap:var(--s-5)">
        <ul class="check-list">
          <li>${icons.check(15)}<span>New construction for government facilities</span></li>
          <li>${icons.check(15)}<span>Renovation and modernisation</span></li>
          <li>${icons.check(15)}<span>Repair and restoration work</span></li>
        </ul>
        <ul class="check-list">
          <li>${icons.check(15)}<span>Interior build-out and fit-out</span></li>
          <li>${icons.check(15)}<span>Managed to federal standards</span></li>
          <li>${icons.check(15)}<span>Documentation and compliance throughout</span></li>
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
      ${supporting.map((c, i) => `<article class="card reveal" id="${esc(c.id)}" style="--reveal-delay:${i * 60}ms">
        <span class="card__icon">${icons[c.icon] ? icons[c.icon]() : icons.building()}</span>
        <h3 class="card__title">${esc(c.name)}</h3>
        <p class="card__body">${esc(c.blurb)}</p>
        <div class="naics-cell">${
          c.naicsPending
            ? `<span class="naics-chip">NAICS to confirm</span>`
            : c.naics.map((n) => `<span class="naics-chip">NAICS ${n}</span>`).join('')
        }</div>
      </article>`).join('')}

      <article class="card reveal" id="miscellaneous">
        <span class="card__icon">${icons.building()}</span>
        <h3 class="card__title">Miscellaneous &amp; other support services</h3>
        <p class="card__body">Requirements that do not fit a standard line but sit within Ionic&rsquo;s reach to perform or team. Send the scope and we will tell you plainly whether we carry it.</p>
      </article>
    </div>
  </div>
</section>

<section class="section section--flush-top" id="matrix" aria-labelledby="matrix-title">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Capability matrix',
      title: 'Capability to NAICS, at a glance',
      lead: 'The mapping a contracting officer scans first. Each line shows the codes Ionic pursues and whether we prime it or bring it to a team.',
      id: 'matrix-title',
    })}

    ${capabilityMatrix()}

    ${needsInputNote(
      'NAICS mapping',
      'Confirm the capability-to-NAICS mapping above. Logistics and commodity sourcing currently has no NAICS assigned &mdash; add one if you want those lines bid under a specific code.'
    )}
  </div>
</section>

<section class="section section--flush-top" aria-labelledby="delivery">
  <div class="wrap split">
    <div>
      ${sectionHead({
        eyebrow: 'How we deliver',
        title: 'Perform, or team &mdash; stated up front.',
        lead: 'Ionic is candid about which route a requirement takes. That honesty is what makes us straightforward to award and easy to build into a proposal.',
        id: 'delivery',
      })}
      <div class="mt-6">${btnRow(ctaSecondary(), btn('/subcontractor-registration/', 'Register as a subcontractor', { variant: 'ghost' }))}</div>
    </div>
    <div>
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
  title: 'Capabilities & NAICS — General Construction and Support Services',
  description:
    'Ionic Contractors leads with general construction (NAICS 236220, 236210) and supports it with grounds and landscaping, facilities maintenance, janitorial, logistics, and specialty consulting. Full capability-to-NAICS matrix.',
  crumbs: [{ href: '/capabilities/', label: 'Capabilities' }],
  extraLD: [faqLD(faqs)],
  body,
};
