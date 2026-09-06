/* ------------------------------------------------------------------
   The one place the page shell lives. Header, drawer, footer and all
   head metadata are defined here and shared by every page.
------------------------------------------------------------------- */

import { site, nav, legalNav, addressLine, capabilities, flatten, canonicalFor } from './site.mjs';
import { esc, icons, brandMark, ctaPrimary } from './components.mjs';

const abs = (p) => new URL(p, site.origin).href;

/* ==================================================================
   STRUCTURED DATA
================================================================== */
function organizationLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${site.origin}/#organization`,
    name: site.legalName,
    alternateName: 'Ionic Contractors',
    url: site.origin,
    description:
      'Ionic Contractors LLC is a Service-Disabled Veteran-Owned Small Business (SDVOSB) delivering general construction and broad support services to federal, state, and local agencies as a prime contractor or teaming partner.',
    telephone: site.phone,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postal,
      addressCountry: site.address.country,
    },
    /* Schema.org has a first-class `naics` property — worth using on a
       contractor whose buyers search by code. */
    naics: '236220',
    parentOrganization: { '@type': 'Organization', name: site.parent },
    areaServed: { '@type': 'Country', name: 'United States' },
    identifier: [
      { '@type': 'PropertyValue', name: 'UEI', value: site.ids.uei },
      { '@type': 'PropertyValue', name: 'CAGE Code', value: site.ids.cage },
      { '@type': 'PropertyValue', name: 'NAICS', value: '236220' },
    ],
    /* The capability lines, as an offer catalogue. Built from the same
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
          provider: { '@id': `${site.origin}/#organization` },
          ...(c.naics.length ? { additionalProperty: c.naics.map((n) => ({
            '@type': 'PropertyValue', name: 'NAICS', value: n,
          })) } : {}),
        },
      })),
    },
    knowsAbout: [
      'SDVOSB set-aside contracting',
      'Federal general construction',
      'Facilities maintenance',
      'Grounds and landscaping services',
      'Janitorial services',
      'Subcontracting and teaming',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: site.phone,
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
    url: site.origin,
    name: site.legalName,
    publisher: { '@id': `${site.origin}/#organization` },
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
function header(currentPath) {
  const isCurrent = (href) =>
    href === '/' ? currentPath === '/' : currentPath.startsWith(href);

  return `<header class="header" data-header data-scrolled="false">
    <div class="header__inner">
      <a class="brand" href="/" aria-label="${esc(site.legalName)} — home">
        ${brandMark(36)}
        <span class="brand__text">
          <span class="brand__name">Ionic Contractors</span>
          <span class="brand__sub">SDVOSB Federal Contractor</span>
        </span>
      </a>

      <nav class="nav" aria-label="Primary">
        ${nav.map((item) => `<a class="nav__link" href="${item.href}"${
          isCurrent(item.href) ? ' aria-current="page"' : ''
        }>${esc(item.label)}</a>`).join('')}
      </nav>

      <div class="header__actions">
        <span class="header__cta">${ctaPrimary('primary')}</span>
        <button class="menu-btn" type="button" data-menu-btn
                aria-expanded="false" aria-controls="site-drawer">
          <span class="menu-btn__bars" aria-hidden="true"><span></span><span></span><span></span></span>
          <span class="menu-btn__label">Menu</span>
          <span class="sr-only">Toggle navigation menu</span>
        </button>
      </div>
    </div>
  </header>`;
}

function drawer(currentPath) {
  const isCurrent = (href) =>
    href === '/' ? currentPath === '/' : currentPath.startsWith(href);

  return `<div class="drawer" id="site-drawer" data-drawer data-open="false" aria-hidden="true">
    <div class="drawer__top">
      <a class="brand" href="/" aria-label="${esc(site.legalName)} — home">
        ${brandMark(32)}
        <span class="brand__text">
          <span class="brand__name">Ionic Contractors</span>
          <span class="brand__sub">SDVOSB</span>
        </span>
      </a>
      <button class="menu-btn" type="button" data-drawer-close aria-expanded="true" aria-controls="site-drawer">
        <span class="menu-btn__bars" aria-hidden="true"><span></span><span></span><span></span></span>
        <span class="menu-btn__label">Close</span>
        <span class="sr-only">Close navigation menu</span>
      </button>
    </div>
    <div class="drawer__body">
      <nav class="drawer__nav" aria-label="Mobile">
        ${nav.map((item, i) => `<a class="drawer__link" href="${item.href}"${
          isCurrent(item.href) ? ' aria-current="page"' : ''
        }><span class="drawer__num">${String(i + 1).padStart(2, '0')}</span><span>${esc(item.label)}</span></a>`).join('')}
      </nav>
      <div class="drawer__foot">
        ${ctaPrimary('primary')}
        <div class="drawer__contact">
          <a href="${site.phoneHref}">${icons.phone(16)}&nbsp;&nbsp;${site.phone}</a>
          <a href="mailto:${site.email}">${icons.mail(16)}&nbsp;&nbsp;${site.email}</a>
          <p style="color:var(--c-text-3);font-size:var(--t-xs);margin-top:var(--s-2)">${esc(addressLine)}</p>
        </div>
      </div>
    </div>
  </div>`;
}

/* ==================================================================
   FOOTER
================================================================== */
function footer() {
  const capsNav = [
    { href: '/capabilities/', label: 'All capabilities' },
    { href: '/capabilities/#general-construction', label: 'General construction' },
    { href: '/capabilities/#matrix', label: 'Capability matrix' },
    { href: '/federal-contracting/', label: 'NAICS & registrations' },
  ];
  const workNav = [
    { href: '/federal-contracting/', label: 'For contracting officers' },
    { href: '/teaming/', label: 'For prime contractors' },
    { href: '/subcontractor-registration/', label: 'Subcontractor registration' },
    { href: '/capability-statement/', label: 'Capability statement' },
  ];

  return `<footer class="footer">
    <div class="wrap">
      <div class="footer__grid">
        <div>
          <a class="brand" href="/" aria-label="${esc(site.legalName)} — home">
            ${brandMark(36)}
            <span class="brand__text">
              <span class="brand__name">Ionic Contractors</span>
              <span class="brand__sub">SDVOSB Federal Contractor</span>
            </span>
          </a>
          <p class="footer__brand-copy">A Service-Disabled Veteran-Owned Small Business delivering general construction and support services to federal, state, and local agencies.</p>
          <div class="footer__ids">
            <span class="badge">UEI&nbsp; <span class="code">${site.ids.uei}</span></span>
            <span class="badge">CAGE&nbsp; <span class="code">${site.ids.cage}</span></span>
          </div>
        </div>

        <div>
          <h2 class="footer__heading">Capabilities</h2>
          <ul class="footer__list">
            ${capsNav.map((i) => `<li><a class="footer__link" href="${i.href}">${esc(i.label)}</a></li>`).join('')}
          </ul>
        </div>

        <div>
          <h2 class="footer__heading">Work with us</h2>
          <ul class="footer__list">
            ${workNav.map((i) => `<li><a class="footer__link" href="${i.href}">${esc(i.label)}</a></li>`).join('')}
          </ul>
        </div>

        <div>
          <h2 class="footer__heading">Contact</h2>
          <address class="footer__address">
            <a href="${site.phoneHref}">${site.phone}</a><br>
            <a href="mailto:${site.email}">${site.email}</a><br>
            <span style="color:var(--c-text-3)">${site.address.street}<br>${site.address.locality}, ${site.address.region} ${site.address.postal}</span>
          </address>
          <p style="margin-top:var(--s-4)"><a class="footer__link" href="/contact/">Send an enquiry ${icons.arrow(13)}</a></p>
        </div>
      </div>

      <div class="footer__bottom">
        <p>&copy; ${new Date().getFullYear()} ${esc(site.legalName)}. A ${esc(site.parent)} company. All rights reserved.</p>
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
    title,             // unique <title>
    description,
    body,
    crumbs = [],
    bodyClass = '',
    ogImage = '/assets/img/og-default.jpg',
    extraLD = [],
    preloadVideo = null,
    noIndex = false,
  } = page;

  const canonical = canonicalFor(url);
  const fullTitle = `${title} | Ionic Contractors LLC`;

  /* A WebPage node per page ties the title, description and canonical
     back to the Organization, so search engines read the site as one
     entity rather than eleven unrelated documents. */
  const webPageLD = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': canonical + '#webpage',
    url: canonical,
    name: fullTitle,
    description: description,
    inLanguage: 'en-US',
    isPartOf: { '@id': `${site.origin}/#website` },
    about: { '@id': `${site.origin}/#organization` },
    primaryImageOfPage: abs(ogImage),
  };

  const ld = [organizationLD(), websiteLD(), webPageLD, breadcrumbLD(crumbs, url), ...extraLD].filter(Boolean);

  return `<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${noIndex
  ? '<meta name="robots" content="noindex, follow">'
  : '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">'}

<meta name="theme-color" content="#080D0C">
<meta name="format-detection" content="telephone=yes">
<meta name="author" content="${esc(site.legalName)}">
<meta name="geo.region" content="US-NC">
<meta name="geo.placename" content="${esc(site.address.locality)}, ${esc(site.address.region)}">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="Ionic Contractors LLC">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${abs(ogImage)}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Ionic Contractors LLC — SDVOSB federal contractor">
<meta property="og:locale" content="en_US">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${abs(ogImage)}">
<meta name="twitter:image:alt" content="Ionic Contractors LLC — SDVOSB federal contractor">
${site.searchConsoleToken ? `<meta name="google-site-verification" content="${esc(site.searchConsoleToken)}">` : '<!-- Search Console verification token: see OPEN-ITEMS.md -->'}

<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">

<!-- Self-hosted fonts: preload the two faces used above the fold -->
<link rel="preload" href="/assets/fonts/public-sans-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/instrument-serif-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/site.css">
${preloadVideo ? `<link rel="preload" href="${preloadVideo}" as="video" type="video/mp4">` : ''}

<script>
/* Set the behaviour contract before first paint so there is no flash
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
${site.ga4Id ? `<!-- GA4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${site.ga4Id}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${site.ga4Id}');</script>`
  : `<!-- GA4 is not installed: no measurement ID supplied yet. Set ga4Id in src/site.mjs and rebuild. See OPEN-ITEMS.md. -->
<script>window.dataLayer=window.dataLayer||[];</script>`}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>

<a class="skip-link" href="#main">Skip to main content</a>

${header(url)}
${drawer(url)}

<main id="main" tabindex="-1">
${body}
</main>

${footer()}

<script src="/js/lenis-1.1.18.min.js" defer></script>
<script src="/js/app.js" defer></script>
</body>
</html>`;
}
