import {
  pageHero, sectionHead, ctaBand, icons, btn, btnRow, ctaPrimary,
  needsInputNote, sealSlot, trustBar,
} from '../components.mjs';

const body = `
${pageHero({
  crumbs: [{ href: '/about/', label: 'About' }],
  eyebrow: 'About Ionic',
  title: 'Built to deliver for<br>government clients.',
  lead: 'A Service-Disabled Veteran-Owned Small Business with a general-construction core, a broad service capability, and a straightforward way of working.',
})}

${trustBar()}

<section class="section" aria-labelledby="who-we-are">
  <div class="wrap split split--wide-left">
    <div>
      ${sectionHead({
        eyebrow: 'Who we are',
        title: 'Who We Are',
        id: 'who-we-are',
      })}
      <div class="prose">
        <p>Ionic Contractors LLC is a Service-Disabled Veteran-Owned Small Business built to deliver for government clients. Founded on a veteran&rsquo;s commitment to mission and standards, Ionic brings a general-construction core and a broad service capability to federal, state, and local requirements &mdash; as a prime contractor or as a teaming partner to established primes.</p>
      </div>
      ${needsInputNote(
        'Founding narrative',
        'The paragraph above is the brief&rsquo;s draft wording. Confirm or adjust the founding narrative before launch &mdash; particularly any detail about when and why the company was formed.'
      )}
      <div class="mt-8">${sealSlot()}</div>
    </div>

    <div class="stack-lg">
      <div class="card card--pad-lg">
        <span class="card__icon">${icons.compass()}</span>
        <h2 class="card__title t-xl">Our Mission</h2>
        <p class="card__body" style="font-size:var(--t-md)">To be the dependable SDVOSB partner agencies and primes can award with confidence &mdash; compliant, capable, and easy to work with.</p>
      </div>

      <div class="card card--pad-lg card--feature">
        <span class="card__icon">${icons.shield()}</span>
        <h2 class="card__title t-xl">Veteran-Owned</h2>
        <p class="card__body" style="font-size:var(--t-md)">As a service-disabled veteran-owned business, Ionic brings a standard of discipline, accountability, and follow-through to the work we take on.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section--flush-top" aria-labelledby="how-we-work">
  <div class="wrap">
    ${sectionHead({
      eyebrow: 'How we work',
      title: 'Straightforward to award. Straightforward to team with.',
      lead: 'Ionic is early in its own past-performance record and says so plainly. What we put in front of a contracting officer or a prime is a verifiable set-aside vehicle, real capability to perform or team, and a short path to contract.',
      id: 'how-we-work',
    })}

    <div class="grid grid--3">
      <article class="card reveal">
        <span class="card__icon">${icons.doc()}</span>
        <h3 class="card__title">Documentation ready</h3>
        <p class="card__body">Certifications, registrations, and identifiers are current and available on request, so nothing stalls at the paperwork stage.</p>
      </article>
      <article class="card reveal" style="--reveal-delay:60ms">
        <span class="card__icon">${icons.clock()}</span>
        <h3 class="card__title">Responsive by default</h3>
        <p class="card__body">Agency and teaming enquiries are answered promptly &mdash; usually the same business day.</p>
      </article>
      <article class="card reveal" style="--reveal-delay:120ms">
        <span class="card__icon">${icons.handshake()}</span>
        <h3 class="card__title">Honest about scope</h3>
        <p class="card__body">We perform directly where we can and team where a requirement calls for added capacity. You will always know which one you are getting.</p>
      </article>
    </div>

    <div class="card card--pad-lg mt-8 reveal" style="border-color:var(--c-accent-line)">
      <p class="eyebrow">Principal experience</p>
      <h3 class="card__title t-xl">Operator track record sits in the capability statement.</h3>
      <p class="card__body" style="font-size:var(--t-md);max-width:var(--measure)">Ionic&rsquo;s principals bring an operator track record that speaks directly to the work. That detail belongs in a document you can attach to a file &mdash; not a marketing page &mdash; so it is presented in the capability statement rather than published here.</p>
      <div class="mt-5">${btnRow(ctaPrimary(), btn('/capabilities/', 'View capabilities', { variant: 'secondary' }))}</div>
    </div>
  </div>
</section>

${ctaBand({
  title: 'Ready to see what Ionic can carry?',
  lead: 'Request the capability statement, or tell us about the requirement you are working on.',
})}
`;

export default {
  url: '/about/',
  title: 'About Ionic Contractors — SDVOSB Federal Contractor',
  description:
    'Ionic Contractors LLC is a Service-Disabled Veteran-Owned Small Business built to deliver for government clients, with a general-construction core and broad supporting service capability for federal, state, and local requirements.',
  crumbs: [{ href: '/about/', label: 'About' }],
  body,
};
