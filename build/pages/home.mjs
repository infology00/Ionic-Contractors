import { site, capabilities, naicsList, locations } from '../site.mjs';
import {
  btn, sectionHead, capabilityGroupsBlock, trustBar, capabilityCard, pathCard, ctaBand, statTile,
  differentiatorsStrip, marketGrid, deliveryCards, marquee, projectsSection,
} from '../components.mjs';
import { heroSequence } from '../hero.mjs';

const body = `
${heroSequence()}


<section class="section section--tight" aria-labelledby="why-ionic">
  <div class="wrap">
    <h2 id="why-ionic" class="sr-only">Why Ionic Contractors</h2>
    ${differentiatorsStrip()}
  </div>
</section>

<section class="section theme-gray" aria-labelledby="capability-snapshot">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Capabilities',
      title: 'Two lines of business. One accountable team.',
      lead: `${capabilities.length} capability lines across construction and non-construction services, each mapped to the NAICS codes buyers search by.`,
      id: 'capability-snapshot',
    })}
    ${capabilityGroupsBlock((c, i) => capabilityCard(c, { index: i, level: 4, feature: false }))}
    <div class="mt-8 reveal">${btn('/capabilities/', 'See the full capability matrix', { variant: 'secondary' })}</div>
  </div>
</section>

<section class="section" aria-labelledby="markets-title">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Markets',
      title: 'Public agencies first. Private owners too.',
      lead: 'Ionic is built to perform for federal agencies, for state, county, and municipal governments, and for private-sector owners, with the same discipline and documentation on every job.',
      id: 'markets-title',
    })}
    ${marketGrid()}
  </div>
</section>

<section class="stats-band theme-dark" aria-labelledby="at-a-glance">
  <div class="wrap">
    ${sectionHead({
      title: 'Registered, certified, and ready to award.',
      lead: 'The identifiers a contracting officer needs are current and on file, and inquiries are answered the same business day.',
      id: 'at-a-glance',
    })}
    <div class="grid grid--4">
      ${statTile({ value: String(capabilities.length), count: capabilities.length, label: 'Capability lines', note: 'Led by general construction' })}
      ${statTile({ value: String(naicsList.length), count: naicsList.length, label: 'NAICS codes', note: 'Primary: 236220' })}
      ${statTile({ value: String(locations.length), count: locations.length, label: 'Offices', note: 'NC headquarters, TX and FL field offices' })}
      ${statTile({ value: '1 day', label: 'Typical response', note: 'Agency and teaming inquiries' })}
    </div>
  </div>
</section>

<section class="section theme-gray" aria-labelledby="delivery-title">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Delivery approach',
      title: 'Mobilize. Execute. Close out.',
      lead: 'The same three-step discipline on every job, whatever the sector and whatever the scope.',
      id: 'delivery-title',
    })}
    ${deliveryCards()}
  </div>
</section>

<section class="section" aria-labelledby="dual-path">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Work with Ionic',
      title: 'Two ways to work with Ionic',
      lead: 'Agencies and owners use Submit an RFP at the top of every page. Prime contractors use Partner with us below.',
      id: 'dual-path',
      center: true,
    })}
    <div class="grid grid--2">
      ${pathCard({
        label: 'For agencies and owners',
        title: 'Award directly to a certified SDVOSB',
        body: 'Ionic is SDVOSB certified through SBA VetCert, active in SAM.gov, and eligible for set-aside and sole-source awards. State, local, and private owners get the same documented, accountable delivery.',
        points: [
          'Verifiable certification and registration identifiers',
          'Set-aside and sole-source eligible',
          'Documentation ready for a fast award',
        ],
      })}
      ${pathCard({
        label: 'For prime contractors',
        title: 'A teaming partner that helps you meet SDVOSB goals',
        body: 'Add a certified SDVOSB to your team. Ionic partners as a subcontractor, joint-venture partner, or mentor-protégé participant, with a general-construction core.',
        points: [
          'SDVOSB goal credit for subcontracting plans',
          'General construction and trades capability',
          'Subcontract, JV, or mentor-protégé',
        ],
      })}
    </div>
  </div>
</section>



${projectsSection()}

${ctaBand({
  lead: 'Send us the requirement, the solicitation number, or just the scope you are trying to cover. We will come back with what Ionic can carry and how quickly.',
})}
`;

export default {
  url: '/',
  title: 'Ionic Contractors | Veteran-Owned SDVOSB General Contractor',
  description:
    'Veteran-owned SDVOSB general contractor for federal agencies, state and local governments, and private owners. Construction, remediation, grounds, and more.',
  body,
};
