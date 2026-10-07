import { site, capabilities, markets } from '../site.mjs';
import {
  pageHero, sectionHead, ctaBand, icons, btn, btnRow, ctaPrimary, ctaSecondary,
  marketGrid, deliveryCards, esc, trustBar, faqLD, accordion,
} from '../components.mjs';

const crumbsFor = (label, href) => [{ href: '/markets/', label: 'Markets' }, { href, label }];

/* Capability cards scoped to a market: same lines, market-specific
   examples. Keeps every page consistent with the capability matrix. */
function capsFor(examples) {
  return `<div class="grid grid--2">
    ${capabilities.map((c, i) => `<article class="card reveal" style="--reveal-delay:${i * 60}ms">
      <span class="card__icon">${icons[c.icon]()}</span>
      <h3 class="card__title">${esc(c.name)}</h3>
      <p class="card__body">${esc(examples[c.id])}</p>
      <div class="naics-cell">${c.naics.map((n) => `<span class="naics-chip">${n}</span>`).join('')}</div>
    </article>`).join('')}
  </div>`;
}

/* ==================================================================
   MARKETS OVERVIEW
================================================================== */
export const marketsOverview = {
  url: '/markets/',
  title: 'Markets: Federal, State & Local, Private',
  description:
    'Ionic Contractors serves federal agencies, state, county, and municipal governments, and private owners with general construction and support services.',
  crumbs: [{ href: '/markets/', label: 'Markets' }],
  body: `
${pageHero({
  crumbs: [{ href: '/markets/', label: 'Markets' }],
  eyebrow: 'Markets',
  title: 'Built for public and private work.',
  lead: 'Federal agencies come first. State, county, and municipal governments and private-sector owners get the same capability, documentation, and accountability.',
  actions: btnRow(ctaPrimary(), ctaSecondary()),
})}

${trustBar()}

<section class="section" aria-labelledby="markets-title">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Who we serve',
      title: 'Three markets, one standard of delivery.',
      id: 'markets-title',
    })}
    ${marketGrid({ headingLevel: 2 })}
  </div>
</section>

<section class="section theme-gray" aria-labelledby="delivery-title">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Delivery approach',
      title: 'Mobilize. Execute. Close out.',
      lead: 'The same disciplined sequence in every market.',
      id: 'delivery-title',
    })}
    ${deliveryCards()}
  </div>
</section>

${ctaBand({ lead: 'Tell us who you are buying for and what you need built or maintained. We will come back with what Ionic can carry.' })}
`,
};

/* ==================================================================
   STATE & LOCAL
================================================================== */
const slFaqs = [
  {
    q: 'Does Ionic bid state and local procurements?',
    a: '<p>Yes. Ionic pursues work with state agencies, counties, cities and towns, school systems, and public authorities, and can perform as prime or as a subcontractor to a prime.</p>',
  },
  {
    q: 'Does SDVOSB status help on state and local work?',
    a: '<p>Many states and localities run veteran-owned or historically underutilized business programs with their own certifications and goals. Ionic&rsquo;s federal SDVOSB certification is verifiable, and we pursue state and local certifications where a program calls for them.</p>',
  },
  {
    q: 'Where can Ionic work?',
    a: '<p>Ionic is headquartered in North Carolina with field offices in Texas and Florida, and mobilizes beyond those states through a vetted multi-state partner network.</p>',
  },
];

export const stateLocal = {
  url: '/state-local/',
  title: 'State & Local Government Contracting',
  description:
    'Construction, remediation, grounds, and equipment services for state agencies, counties, cities, school systems, and public authorities from an SDVOSB.',
  crumbs: crumbsFor('State & local', '/state-local/'),
  extraLD: [faqLD(slFaqs)],
  body: `
${pageHero({
  crumbs: crumbsFor('State & local', '/state-local/'),
  eyebrow: 'State, county & municipal',
  title: 'Public work, close to home.',
  lead: 'Construction and facility services for state agencies, counties, cities, school systems, and public authorities, delivered with the documentation discipline of a federal contractor.',
  actions: btnRow(ctaPrimary(), btn('/contact/', 'Send us a bid invitation', { variant: 'secondary' })),
})}

<section class="section" aria-labelledby="who">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Who we work with',
      title: 'The public owners we serve.',
      id: 'who',
    })}
    <div class="grid grid--4">
      ${[
        ['landmark', 'State agencies', 'Facilities, transportation, parks, and environmental departments.'],
        ['flag', 'Counties', 'Courthouses, public safety, utilities, and county facilities.'],
        ['building', 'Municipalities', 'City and town buildings, public works, and grounds.'],
        ['users', 'Schools & authorities', 'School systems, housing, port, airport, and water authorities.'],
      ].map(([ic, t, b], i) => `<article class="card reveal" style="--reveal-delay:${i * 70}ms">
        <span class="card__icon">${icons[ic]()}</span>
        <h3 class="card__title">${t}</h3>
        <p class="card__body">${b}</p>
      </article>`).join('')}
    </div>
  </div>
</section>

<section class="section theme-gray" aria-labelledby="caps">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Capabilities', title: 'What Ionic delivers for public owners.', id: 'caps' })}
    ${capsFor({
      'general-construction': 'New public facilities, renovations, ADA upgrades, interior build-outs, and electrical, plumbing, and HVAC work.',
      'environmental-remediation': 'Cleanup of contaminated sites and hazardous materials on public property, documented for regulators.',
      grounds: 'Grounds, landscaping, and vegetation management for parks, campuses, and rights-of-way.',
      equipment: 'Maintenance and sourcing of public-works, grounds, and construction equipment.',
      consulting: 'Program and project management support for capital and maintenance programs.',
    })}
  </div>
</section>

<section class="section" aria-labelledby="sl-faq">
  <div class="wrap wrap--narrow">
    ${sectionHead({ eyebrow: 'Common questions', title: 'Working with Ionic on public work', id: 'sl-faq' })}
    <div class="reveal">${accordion(slFaqs, { idPrefix: 'sl' })}</div>
  </div>
</section>

${ctaBand({ lead: 'Send the bid invitation, the scope, or the program you are planning. We will tell you quickly whether Ionic is the right fit.' })}
`,
};

/* ==================================================================
   PRIVATE SECTOR
================================================================== */
export const privateSector = {
  url: '/private-sector/',
  title: 'Private-Sector Construction & Services',
  description:
    'Commercial, institutional, and industrial construction, remediation, grounds, and equipment services for private owners, developers, and general contractors.',
  crumbs: crumbsFor('Private sector', '/private-sector/'),
  body: `
${pageHero({
  crumbs: crumbsFor('Private sector', '/private-sector/'),
  eyebrow: 'Private sector',
  title: 'Federal discipline, for private owners.',
  lead: 'Commercial, institutional, and industrial owners, developers, and general contractors get the same planning, safety, and documentation Ionic brings to government work.',
  actions: btnRow(btn('/contact/', 'Talk about your project', { variant: 'primary' }), ctaPrimary('secondary')),
})}

<section class="section" aria-labelledby="who">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Who we work with',
      title: 'Owners and builders who need a dependable partner.',
      id: 'who',
    })}
    <div class="grid grid--4">
      ${[
        ['building', 'Commercial owners', 'Offices, retail, and mixed-use properties: new work, renovation, and repair.'],
        ['landmark', 'Institutions', 'Healthcare, education, and nonprofit facilities.'],
        ['wrench', 'Industrial operators', 'Plants, warehouses, and yards, including equipment maintenance.'],
        ['handshake', 'General contractors', 'Trade packages and SDVOSB participation for your private-sector bids.'],
      ].map(([ic, t, b], i) => `<article class="card reveal" style="--reveal-delay:${i * 70}ms">
        <span class="card__icon">${icons[ic]()}</span>
        <h3 class="card__title">${t}</h3>
        <p class="card__body">${b}</p>
      </article>`).join('')}
    </div>
  </div>
</section>

<section class="section theme-gray" aria-labelledby="caps">
  <div class="wrap">
    ${sectionHead({ eyebrow: 'Capabilities', title: 'What Ionic delivers for private owners.', id: 'caps' })}
    ${capsFor({
      'general-construction': 'Ground-up construction, tenant improvements, renovations, and electrical, plumbing, HVAC, and specialty trade work.',
      'environmental-remediation': 'Site remediation and hazardous-material cleanup ahead of redevelopment or sale.',
      grounds: 'Landscaping, grounds maintenance, and vegetation management for campuses and commercial sites.',
      equipment: 'Repair, maintenance, and sourcing of commercial, industrial, and grounds equipment.',
      consulting: 'Owner’s-side project management and technical consulting.',
    })}
  </div>
</section>

<section class="section" aria-labelledby="why">
  <div class="wrap split">
    ${sectionHead({
      eyebrow: 'Why Ionic',
      title: 'What a government-grade contractor brings to private work.',
      id: 'why',
    })}
    <ul class="check-list reveal" style="font-size:var(--t-md)">
      <li>${icons.check(16)}<span>Safety planned before mobilization, with a zero-incident standard on every site</span></li>
      <li>${icons.check(16)}<span>Daily reporting, inspection records, and complete closeout documentation</span></li>
      <li>${icons.check(16)}<span>A vetted multi-state network of trade partners for capacity when you need it</span></li>
      <li>${icons.check(16)}<span>SDVOSB participation that can help corporate supplier-diversity goals</span></li>
    </ul>
  </div>
</section>

${ctaBand({ title: 'Let&rsquo;s talk about your project.', lead: `Call ${site.phone} or send the scope. We will come back with what Ionic can carry and how quickly.` })}
`,
};

export { markets };
