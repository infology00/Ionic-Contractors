import {
  pageHero, sectionHead, ctaBand, icons, btn, btnRow, ctaPrimary, trustBar,
  leadershipSection, locationsGrid, deliveryCards,
} from '../components.mjs';

const body = `
${pageHero({
  crumbs: [{ href: '/about/', label: 'About' }],
  eyebrow: 'About Ionic',
  title: 'Veteran-owned. Built to deliver.',
  lead: 'A Service-Disabled Veteran-Owned Small Business with a general-construction core, a broad service capability, and a straightforward way of working for public and private clients.',
})}

${trustBar()}

<section class="section" aria-labelledby="who-we-are">
  <div class="wrap split split--wide-left">
    <div>
      ${sectionHead({
        eyebrow: 'Who we are',
        title: 'A veteran&rsquo;s standard, applied to every job.',
        id: 'who-we-are',
      })}
      <div class="prose reveal">
        <p>Ionic Contractors is a Service-Disabled Veteran-Owned Small Business, owned directly by its veteran principal. We bring a general-construction core and a broad service capability to federal agencies first, to state, county, and municipal governments, and to private-sector owners, as a prime contractor or as a teaming partner to established primes.</p>
        <p>Headquartered in North Carolina, with field offices in Texas and Florida and a multi-state partner network, Ionic mobilizes where the work is.</p>
      </div>
    </div>

    <div class="stack-lg">
      <div class="card card--pad-lg reveal">
        <span class="card__icon">${icons.compass()}</span>
        <h2 class="card__title t-xl">Our mission</h2>
        <p class="card__body" style="font-size:var(--t-md)">To be the dependable SDVOSB partner that agencies, primes, and owners can award with confidence: compliant, capable, and easy to work with.</p>
      </div>

      <div class="card card--pad-lg card--feature reveal">
        <span class="card__icon">${icons.shield()}</span>
        <h2 class="card__title t-xl">For veterans. By veterans.</h2>
        <p class="card__body" style="font-size:var(--t-md)">As a service-disabled veteran-owned business, Ionic brings the discipline, accountability, and follow-through of military service to every job, from the first site walk to the final turnover.</p>
      </div>
    </div>
  </div>
</section>

${leadershipSection()}

<section class="section section--flush-top" aria-labelledby="locations-title">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Locations',
      title: 'Headquartered in North Carolina. Mobilized nationwide.',
      lead: 'Field offices in Texas and Florida and a multi-state network of vetted trade partners let Ionic staff and equip a job wherever the requirement sits.',
      id: 'locations-title',
    })}
    ${locationsGrid()}
  </div>
</section>

<section class="section theme-gray" id="delivery" aria-labelledby="delivery-title">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Delivery approach',
      title: 'Mobilize. Execute. Close out.',
      lead: 'What we put in front of a contracting officer, a prime, or an owner is a verifiable vehicle, real capability to perform or team, and a disciplined way of delivering the work.',
      id: 'delivery-title',
    })}
    ${deliveryCards()}
  </div>
</section>

<section class="section" id="safety" aria-labelledby="safety-title">
  <div class="wrap split split--sticky">
    <div>
      ${sectionHead({
        eyebrow: 'Safety & quality',
        title: 'Zero incidents is the plan, not the hope.',
        lead: 'Safety and quality are planned before mobilization and enforced every day on site, for our own crews and for every subcontractor working under us.',
        id: 'safety-title',
      })}
    </div>
    <div class="grid grid--2">
      <article class="card reveal">
        <span class="card__icon">${icons.hardhat()}</span>
        <h3 class="card__title">Site-specific safety plans</h3>
        <p class="card__body">Hazards identified, controls set, and crews briefed before work starts, then reviewed as the job changes.</p>
      </article>
      <article class="card reveal" style="--reveal-delay:70ms">
        <span class="card__icon">${icons.users()}</span>
        <h3 class="card__title">Subcontractors held to our standard</h3>
        <p class="card__body">Trade partners are vetted for insurance, credentials, and safety performance before they set foot on site.</p>
      </article>
      <article class="card reveal" style="--reveal-delay:140ms">
        <span class="card__icon">${icons.check(22)}</span>
        <h3 class="card__title">Quality control at every phase</h3>
        <p class="card__body">Inspections at each stage of the work, with deficiencies corrected before the next phase begins.</p>
      </article>
      <article class="card reveal" style="--reveal-delay:210ms">
        <span class="card__icon">${icons.doc()}</span>
        <h3 class="card__title">Documented throughout</h3>
        <p class="card__body">Daily reports, inspection records, and closeout documentation the owner can put straight into the file.</p>
      </article>
    </div>
  </div>
</section>

<!-- Reserved: "Recent performance" block. Hidden from visitors until
     the content is supplied; drop it in without a layout rebuild. -->
<section class="section section--flush-top" id="recent-performance" aria-labelledby="recent-performance-title" hidden>
  <div class="wrap">
    <h2 id="recent-performance-title" class="display t-3xl">Recent performance</h2>
    <div class="projects"></div>
  </div>
</section>

<section class="section section--flush-top" aria-labelledby="how-we-work">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'How we work',
      title: 'Straightforward to award. Straightforward to team with.',
      id: 'how-we-work',
    })}
    <div class="grid grid--3">
      <article class="card reveal">
        <span class="card__icon">${icons.doc()}</span>
        <h3 class="card__title">Documentation ready</h3>
        <p class="card__body">Certifications, registrations, and identifiers are current and available on request, so nothing stalls at the paperwork stage.</p>
      </article>
      <article class="card reveal" style="--reveal-delay:70ms">
        <span class="card__icon">${icons.clock()}</span>
        <h3 class="card__title">Responsive by default</h3>
        <p class="card__body">Agency, owner, and teaming inquiries are answered promptly, usually the same business day.</p>
      </article>
      <article class="card reveal" style="--reveal-delay:140ms">
        <span class="card__icon">${icons.handshake()}</span>
        <h3 class="card__title">Clear about scope</h3>
        <p class="card__body">You will always know which parts of a job Ionic performs and which are delivered with partners, before award, not after.</p>
      </article>
    </div>
    <div class="mt-8 reveal">${btnRow(ctaPrimary(), btn('/capabilities/', 'View capabilities', { variant: 'secondary' }))}</div>
  </div>
</section>

${ctaBand({
  title: 'Ready to see what Ionic can carry?',
  lead: 'Get the capability statement, or tell us about the project you are working on.',
})}
`;

export default {
  url: '/about/',
  title: 'About Ionic Contractors | Veteran-Owned SDVOSB',
  description:
    'Ionic Contractors is a Service-Disabled Veteran-Owned Small Business with a North Carolina headquarters and field offices in Texas and Florida.',
  crumbs: [{ href: '/about/', label: 'About' }],
  body,
};
