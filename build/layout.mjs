/* ------------------------------------------------------------------
   The one place the page shell lives. Header, drawer, footer and all
   head metadata are defined here and shared by every page.
------------------------------------------------------------------- */

import {
  site, nav, utilityNav, legalNav, addressLine, capabilities, markets, locations,
  naicsList, capStatement, canonicalFor, intents,
} from './site.mjs';
import { esc, icons, logoImg } from './components.mjs';

const abs = (p) => new URL(p, site.origin).href;
const ORG = `${site.origin}/#organization`;

/* ==================================================================
   STRUCTURED DATA
================================================================== */
function organizationLD() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'GeneralContractor'],
    '@id': ORG,
    name: site.name,
    url: site.origin + '/',
    logo: {
      '@type': 'ImageObject',
      url: abs('/assets/img/brand/logo-color-960.webp'),
      width: 960,
      height: 329,
    },
    image: abs('/assets/img/og-default.jpg'),
    slogan: site.tagline,
    description:
      'Ionic Contractors is a Service-Disabled Veteran-Owned Small Business (SDVOSB) delivering general construction, environmental remediation, grounds and vegetation management, equipment maintenance, management consulting, logistics, and ground transportation to federal agencies, state and local governments, and private owners.',
    telephone: '+1-' + site.phone,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postal,
      addressCountry: site.address.country,
    },
    /* Schema.org's first-class `naics` property — buyers search by code. */
    naics: '236220',
    areaServed: { '@type': 'Country', name: 'United States' },
    location: locations.map((l) => ({
      '@type': 'Place',
      name: `${site.name}, ${l.role}, ${l.label}`,
      address: { '@type': 'PostalAddress', addressRegion: l.label, addressCountry: 'US' },
    })),
    identifier: [
      { '@type': 'PropertyValue', propertyID: 'UEI', value: site.ids.uei },
      { '@type': 'PropertyValue', propertyID: 'CAGE', value: site.ids.cage },
      ...naicsList.map((n) => ({ '@type': 'PropertyValue', propertyID: 'NAICS', value: n.code })),
    ],
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'certification',
      name: 'Service-Disabled Veteran-Owned Small Business (SDVOSB)',
      recognizedBy: { '@type': 'GovernmentOrganization', name: 'U.S. Small Business Administration (VetCert)' },
    },
    /* The capability lines, as an offer catalog. Built from the same
       data that renders the capability matrix. */
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Capability lines',
      itemListElement: capabilities.map((c) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: c.name,
          description: c.blurb,
          serviceType: c.name,
          provider: { '@id': ORG },
          areaServed: { '@type': 'Country', name: 'United States' },
          additionalProperty: c.naics.map((n) => ({ '@type': 'PropertyValue', propertyID: 'NAICS', value: n })),
        },
      })),
    },
    knowsAbout: [
      'SDVOSB set-aside contracting',
      'General construction',
      'Commercial and institutional building construction',
      'Environmental remediation',
      'Grounds maintenance and vegetation management',
      'Equipment maintenance and repair',
      'Management consulting',
      'Logistics consulting',
      'Ground passenger transportation',
      'Subcontracting and teaming',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: '+1-' + site.phone,
      email: site.email,
      areaServed: 'US',
      availableLanguage: 'English',
    },
  };
}

function websiteLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.origin}/#website`,
    url: site.origin + '/',
    name: site.name,
    inLanguage: 'en-US',
    publisher: { '@id': ORG },
  };
}

function breadcrumbLD(crumbs, url) {
  if (!crumbs || !crumbs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.origin + '/' },
      ...crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: c.label,
        item: canonicalFor(i === crumbs.length - 1 ? url : c.href),
      })),
    ],
  };
}

/* ==================================================================
   HEADER + DRAWER
================================================================== */
const isCurrentFor = (currentPath) => (href) =>
  href === '/' ? currentPath === '/' : currentPath.startsWith(href);

function utilityLink(item) {
  const sub = item.href.includes('subcontractor');
  return `<a class="utility__link${sub ? ' utility__link--sub' : ''}" href="${item.href}"${item.download ? ' download' : ''}>${
    item.download ? icons.download(13) : ''}${esc(item.label)}</a>`;
}

function header(currentPath) {
  const isCurrent = isCurrentFor(currentPath);
  const inMenu = (item) => item.children && (isCurrent(item.href) || item.children.some((c) => isCurrent(c.href)));

  return `<header class="header" data-header data-scrolled="false">
    <div class="utility">
      <div class="utility__inner">
        <p class="utility__ids"><span>SDVOSB</span><span>UEI <span class="code">${site.ids.uei}</span></span><span>CAGE <span class="code">${site.ids.cage}</span></span></p>
        <nav class="utility__links" aria-label="Utility">
          ${utilityNav.map(utilityLink).join('')}
          <a class="utility__link" href="${site.phoneHref}">${icons.phone(13)}${site.phone}</a>
        </nav>
      </div>
    </div>
    <div class="bar">
      <div class="bar__inner">
        <a class="brand" href="/" aria-label="${esc(site.name)} home">
          ${logoImg('color', { cls: 'brand__logo', width: 152, sizes: '(min-width: 60rem) 152px, 134px', alt: '', eager: true })}
        </a>

        <nav class="nav" aria-label="Primary">
          ${nav.map((item) => item.children ? `<div class="nav__item" data-menu>
            <a class="nav__link" href="${item.href}"${inMenu(item) ? ' aria-current="page"' : ''}>${esc(item.label)}</a>
            <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="menu-${item.label.toLowerCase()}" data-menu-toggle>
              ${icons.chevron(14)}<span class="sr-only">${esc(item.label)} submenu</span>
            </button>
            <div class="nav__menu" id="menu-${item.label.toLowerCase()}">
              ${item.children.map((c) => `<a href="${c.href}"${isCurrent(c.href) ? ' aria-current="page"' : ''}>${c.desc ? `<span class="nav__menu-text"><span>${esc(c.label)}</span><small>${esc(c.desc)}</small></span>` : esc(c.label)}${icons.arrow(14)}</a>`).join('')}
            </div>
          </div>` : `<div class="nav__item"><a class="nav__link" href="${item.href}"${
            isCurrent(item.href) ? ' aria-current="page"' : ''}>${esc(item.label)}</a></div>`).join('')}
        </nav>

        <div class="header__actions">
          <a class="btn btn--dark btn--sm header__cta" href="${intents.rfp.href}">${intents.rfp.label}</a>
          <button class="menu-btn" type="button" data-menu-btn
                  aria-expanded="false" aria-controls="site-drawer">
            <span class="menu-btn__bars" aria-hidden="true"><span></span><span></span><span></span></span>
            <span class="menu-btn__label">Menu</span>
            <span class="sr-only">Toggle navigation menu</span>
          </button>
        </div>
      </div>
      <span class="progress" data-progress aria-hidden="true"></span>
    </div>
  </header>`;
}

function drawer(currentPath) {
  const isCurrent = isCurrentFor(currentPath);
  const items = [{ href: '/', label: 'Home' }, ...nav, { href: '/subcontractor-registration/', label: 'Subcontractors' }];

  return `<div class="drawer" id="site-drawer" data-drawer data-open="false" aria-hidden="true">
    <div class="drawer__top">
      <a class="brand" href="/" aria-label="${esc(site.name)} home">
        ${logoImg('color', { cls: 'brand__logo', width: 134, alt: '' })}
      </a>
      <button class="menu-btn" type="button" data-drawer-close aria-expanded="true" aria-controls="site-drawer">
        <span class="menu-btn__bars" aria-hidden="true"><span></span><span></span><span></span></span>
        <span class="menu-btn__label">Close</span>
        <span class="sr-only">Close navigation menu</span>
      </button>
    </div>
    <div class="drawer__body">
      <nav class="drawer__nav" aria-label="Mobile">
        ${items.map((item, i) => `<a class="drawer__link" href="${item.href}"${
          isCurrent(item.href) ? ' aria-current="page"' : ''
        }><span class="drawer__num">${String(i + 1).padStart(2, '0')}</span><span>${esc(item.label)}</span></a>${
          item.children ? `<div class="drawer__sub">${item.children.map((c) => `<a href="${c.href}"${isCurrent(c.href) ? ' aria-current="page"' : ''}>${esc(c.label)}</a>`).join('')}</div>` : ''
        }`).join('')}
      </nav>
      <div class="drawer__foot">
        <a class="drawer__cta" href="${intents.rfp.href}">${intents.rfp.label}${icons.arrow(16)}</a>
        <div class="drawer__contact">
          <a href="${site.phoneHref}">${icons.phone(16)}${site.phone}</a>
          <a href="mailto:${site.email}">${icons.mail(16)}${site.email}</a>
          <p style="color:var(--c-text-3);font-size:var(--t-xs);margin-top:var(--s-2)">Headquarters: ${esc(addressLine)}</p>
        </div>
      </div>
    </div>
  </div>`;
}

/* ==================================================================
   FOOTER
================================================================== */
function footer() {
  const capLinks = (group) => capabilities.filter((c) => c.group === group)
    .map((c) => `<li><a class="footer__link" href="/capabilities/#${c.id}">${esc(c.short)}</a></li>`).join('');
  const workNav = [
    ...markets.map((m) => ({ href: m.href, label: m.title })),
    { href: '/teaming/', label: 'Teaming with primes' },
    { href: '/subcontractor-registration/', label: 'Subcontractor registration' },
    { href: capStatement.href, label: 'Capability statement', download: capStatement.available },
  ];

  return `<footer class="footer theme-dark">
    <div class="wrap">
      <div class="footer__grid">
        <div>
          <a class="brand" href="/" aria-label="${esc(site.name)} home">
            ${logoImg('white', { cls: 'footer__logo', width: 184, alt: '' })}
          </a>
          <p class="footer__brand-copy">A Service-Disabled Veteran-Owned Small Business delivering general construction and support services to federal agencies, state and local governments, and private owners.</p>
          <div class="footer__ids">
            <span class="badge">SDVOSB</span>
            <span class="badge">UEI&nbsp; <span class="code">${site.ids.uei}</span></span>
            <span class="badge">CAGE&nbsp; <span class="code">${site.ids.cage}</span></span>
          </div>
        </div>

        <div>
          <h2 class="footer__heading">Capabilities</h2>
          <p class="footer__sub">Construction</p>
          <ul class="footer__list">${capLinks('construction')}</ul>
          <p class="footer__sub">Non-construction</p>
          <ul class="footer__list">${capLinks('professional')}</ul>
        </div>

        <div>
          <h2 class="footer__heading">Markets &amp; partners</h2>
          <ul class="footer__list">
            ${workNav.map((i) => `<li><a class="footer__link" href="${i.href}"${i.download ? ' download' : ''}>${esc(i.label)}</a></li>`).join('')}
          </ul>
        </div>

        <div>
          <h2 class="footer__heading">Contact</h2>
          <address class="footer__address">
            <a href="${site.phoneHref}">${site.phone}</a><br>
            <a href="mailto:${site.email}">${site.email}</a><br>
            <span style="display:block;margin-top:var(--s-3)">Headquarters<br>${site.address.street}<br>${site.address.locality}, ${site.address.region} ${site.address.postal}</span>
            <span style="display:block;margin-top:var(--s-3);color:var(--c-text-3)">Field offices: Texas &middot; Florida</span>
          </address>
          <p style="margin-top:var(--s-4)"><a class="footer__link" href="/contact/">Send an inquiry ${icons.arrow(13)}</a></p>
        </div>
      </div>

      <div class="footer__naics">
        <h2 class="footer__heading">NAICS codes</h2>
        <ul class="footer__codes">
          ${naicsList.map((n) => `<li class="code${n.code === '236220' ? ' is-primary' : ''}" title="${esc(n.title || '')}">${n.code}</li>`).join('')}
        </ul>
        <a class="footer__link" href="/capabilities/#matrix">Capability matrix ${icons.arrow(13)}</a>
      </div>

      <div class="footer__bottom">
        <p>&copy; ${new Date().getFullYear()} ${esc(site.name)}. All rights reserved.</p>
        <nav class="footer__legal-nav" aria-label="Legal">
          ${legalNav.map((i) => `<a href="${i.href}">${esc(i.label)}</a>`).join('')}
        </nav>
      </div>
    </div>
  </footer>`;
}

/* ==================================================================
   THE PAGE SHELL
================================================================== */
export function layout(page) {
  const {
    url,               // '/about/'
    title,             // unique <title> (without the brand suffix)
    description,
    body,
    crumbs = [],
    bodyClass = '',
    ogImage = '/assets/img/og-default.jpg',
    extraLD = [],
    noIndex = false,
    preload = '',
  } = page;

  const canonical = canonicalFor(url);
  /* Brand suffix, never duplicated if the title already names us. */
  const fullTitle = /Ionic Contractors/.test(title) ? title : `${title} | Ionic Contractors`;
  const ogAlt = 'Ionic Contractors logo, Service-Disabled Veteran-Owned Small Business';

  const webPageLD = {
    '@context': 'https://schema.org',
    '@type': url === '/contact/' ? 'ContactPage' : url === '/about/' ? 'AboutPage' : 'WebPage',
    '@id': canonical + '#webpage',
    url: canonical,
    name: fullTitle,
    description: description,
    inLanguage: 'en-US',
    isPartOf: { '@id': `${site.origin}/#website` },
    about: { '@id': ORG },
    primaryImageOfPage: abs(ogImage),
  };

  const ld = [organizationLD(), websiteLD(), webPageLD, breadcrumbLD(crumbs, url), ...extraLD].filter(Boolean);

  return `<!doctype html>
<html lang="en-US" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${noIndex
  ? '<meta name="robots" content="noindex, follow">'
  : '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">'}

<meta name="theme-color" content="#FFFFFF">
<meta name="format-detection" content="telephone=yes">
<meta name="author" content="${esc(site.name)}">
<meta name="geo.region" content="US-NC">
<meta name="geo.placename" content="${esc(site.address.locality)}, ${esc(site.address.region)}">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${abs(ogImage)}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${ogAlt}">
<meta property="og:locale" content="en_US">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${abs(ogImage)}">
<meta name="twitter:image:alt" content="${ogAlt}">
${site.searchConsoleToken ? `<meta name="google-site-verification" content="${esc(site.searchConsoleToken)}">` : ''}

<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/assets/img/favicon-32.png" type="image/png" sizes="32x32">
<link rel="icon" href="/assets/img/icon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">

<!-- Self-hosted fonts: preload the one face used above the fold -->
<link rel="preload" href="/assets/fonts/archivo-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/site.css">
${preload}

<script>
/* Set the behavior contract before first paint so there is no flash
   of the enhanced layout for users who get the static one. */
(function(d){
  var r = d.documentElement;
  r.classList.remove('no-js');
  r.classList.add('js');
  try {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    r.setAttribute('data-motion', reduce ? 'reduced' : 'ok');
    if (!reduce) r.classList.add('motion-ok');
  } catch (e) {
    r.setAttribute('data-motion','ok');
    r.classList.add('motion-ok');
  }
})(document);
</script>

${ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')}
${site.ga4Id ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${site.ga4Id}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${site.ga4Id}');</script>`
  : `<script>window.dataLayer=window.dataLayer||[];</script>`}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>

<a class="skip-link" href="#main">Skip to main content</a>

${header(url)}
${drawer(url)}

<main id="main" tabindex="-1">
${body}
</main>

${footer()}

<script src="/js/gsap-3.15.0.min.js" defer></script>
<script src="/js/ScrollTrigger-3.15.0.min.js" defer></script>
<script src="/js/lenis-1.1.18.min.js" defer></script>
<script src="/js/app.js" defer></script>
</body>
</html>`;
}
