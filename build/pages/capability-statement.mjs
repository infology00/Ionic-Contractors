import { site, capStatement } from '../site.mjs';
import {
  pageHero, sectionHead, ctaBand, icons, btn, btnRow, capStatementBtn, logoImg,
} from '../components.mjs';

/* Direct download, not gated. When the PDF is in place the primary
   button downloads it; until then it opens a pre-addressed email so a
   visitor is never left at a dead end. */
const mailHref = `mailto:${site.email}?subject=${encodeURIComponent('Capability statement request: Ionic Contractors')}`;
const getIt = capStatement.available
  ? capStatementBtn('primary')
  : btn(mailHref, 'Email me the capability statement', { variant: 'primary', icon: icons.mail(15) });

const contents = [
  'Company overview and SDVOSB status',
  'Certifications, registrations, UEI, and CAGE identifiers',
  'Capability lines mapped to NAICS and PSC codes',
  'Locations: North Carolina headquarters, Texas and Florida field offices',
  'Principals&rsquo; operator experience',
  'Differentiators and points of contact',
];

const body = `
${pageHero({
  crumbs: [{ href: '/capability-statement/', label: 'Capability Statement' }],
  eyebrow: 'Capability statement',
  title: 'The Ionic capability statement.',
  lead: `The document contracting officers, proposal teams, and owners ask for: capability detail, registrations, NAICS and PSC codes, and the principals&rsquo; operator experience. ${capStatement.available ? 'One click, no form.' : 'Ask and it is on its way, no form required.'}`,
  actions: btnRow(getIt),
})}

<section class="section" aria-labelledby="doc-title">
  <div class="wrap">
    <div class="doc">
      <div class="reveal" aria-hidden="true">
        <div class="doc__sheet">
          <span class="doc__sheet-bar"></span>
          ${logoImg('color', { width: 220, alt: '' })}
          <span class="doc__sheet-line"></span>
          <span class="doc__sheet-line"></span>
          <span class="doc__sheet-line"></span>
          <div class="doc__sheet-cols">
            <span class="doc__sheet-line"></span><span class="doc__sheet-line"></span>
            <span class="doc__sheet-line"></span><span class="doc__sheet-line"></span>
            <span class="doc__sheet-line"></span><span class="doc__sheet-line"></span>
          </div>
          <span class="doc__sheet-foot"></span>
        </div>
      </div>

      <div>
        ${sectionHead({
          eyebrow: `Edition ${capStatement.edition}`,
          title: 'What it contains',
          id: 'doc-title',
        })}
        <div class="doc__contents">
          ${contents.map((c) => `<p class="doc__row reveal">${icons.check(15)}<span>${c}</span></p>`).join('')}
        </div>
        <div class="reveal">${btnRow(
          capStatement.available ? capStatementBtn('secondary') : btn(mailHref, 'Email me the capability statement', { variant: 'secondary', icon: icons.mail(15) }),
          btn(site.phoneHref, `Call ${site.phone}`, { variant: 'ghost', arrow: false })
        )}</div>
      </div>
    </div>
  </div>
</section>

<section class="section theme-gray" aria-labelledby="meanwhile">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'Also on this site',
      title: 'Everything public is already here.',
      lead: 'Registrations, identifiers, NAICS mapping, and capability detail are published openly.',
      id: 'meanwhile',
      center: true,
    })}
    <div class="grid grid--3">
      <article class="card card--link reveal">
        <span class="card__icon">${icons.shield()}</span>
        <h3 class="card__title"><a class="card__link" href="/federal-contracting/">Certifications and identifiers</a></h3>
        <p class="card__body">SDVOSB, SAM, UEI ${site.ids.uei}, CAGE ${site.ids.cage}, NAICS and PSC codes, and set-aside eligibility.</p>
        <span class="card__more">Federal contracting ${icons.arrow(13)}</span>
      </article>
      <article class="card card--link reveal" style="--reveal-delay:70ms">
        <span class="card__icon">${icons.construction()}</span>
        <h3 class="card__title"><a class="card__link" href="/capabilities/#matrix">Capability matrix</a></h3>
        <p class="card__body">Every capability line mapped to its NAICS codes.</p>
        <span class="card__more">Capability matrix ${icons.arrow(13)}</span>
      </article>
      <article class="card card--link reveal" style="--reveal-delay:140ms">
        <span class="card__icon">${icons.handshake()}</span>
        <h3 class="card__title"><a class="card__link" href="/teaming/">Teaming vehicles</a></h3>
        <p class="card__body">Subcontracting, joint ventures, and mentor-prot&eacute;g&eacute; arrangements.</p>
        <span class="card__more">Teaming ${icons.arrow(13)}</span>
      </article>
    </div>
  </div>
</section>

${ctaBand({
  title: 'Need it today?',
  lead: 'Call and ask. We would rather get the document into your hands than have you wait.',
})}
`;

export default {
  url: '/capability-statement/',
  title: 'Capability Statement',
  description:
    'Get the Ionic Contractors capability statement: SDVOSB status, UEI and CAGE, NAICS and PSC codes, locations, and principals’ operator experience.',
  crumbs: [{ href: '/capability-statement/', label: 'Capability Statement' }],
  body,
};
