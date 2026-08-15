#!/usr/bin/env python3
"""
Ionic Contractors — static page generator.

The site ships as plain HTML: every file in the repo root is deployable as-is
with no build step, no runtime and no dependencies. This script exists only so
the shared chrome (head, utility bar, header, nav, footer) is written once
instead of twelve times. Run it after editing the chrome or page content:

    python3 tools/build.py

It rewrites the generated pages listed in PAGES. index.html is generated here
too, so every page shares one source of truth for the header and footer.
"""

import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SITE_URL = "https://ionic.contractors/"
PHONE_DISPLAY = "252-546-7181"
PHONE_HREF = "+12525467181"
EMAIL = "service@ionic.contractors"

NAV = [
    ("index.html", "Home", "home"),
    ("about.html", "About", "about"),
    ("capabilities.html", "Capabilities", "capabilities"),
    ("federal-contracting.html", "Federal Contracting", "federal"),
    ("teaming.html", "Teaming", "teaming"),
    ("subcontractors.html", "Subcontractors", "subs"),
    ("contact.html", "Contact", "contact"),
]
NAV_CTA = ("capability-statement.html", "Capability Statement", "capstat")


def nav_markup(active):
    items = []
    for href, label, key in NAV:
        current = ' aria-current="page"' if key == active else ""
        items.append(f'        <li><a href="{href}"{current}>{label}</a></li>')
    href, label, key = NAV_CTA
    current = ' aria-current="page"' if key == active else ""
    items.append(f'        <li class="nav-cta"><a href="{href}"{current}>{label}</a></li>')
    return "\n".join(items)


BRAND = """<a class="brand" href="index.html">
      <img class="brand__mark" src="assets/img/logo-mark.svg" alt="" width="42" height="42">
      <span class="brand__text">
        <span class="brand__name">Ionic Contractors</span>
        <span class="brand__sub">SDVOSB · Federal Contractor</span>
      </span>
    </a>"""


HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{description}">
<link rel="canonical" href="{canonical}">
<meta name="theme-color" content="#0c2237">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Ionic Contractors LLC">
<meta property="og:title" content="{og_title}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="{canonical}">
<meta name="twitter:card" content="summary">{robots}
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="assets/css/styles.css">
<script src="assets/js/config.js"></script>{extra_head}
</head>
<body>
<a class="skip-link" href="#main">Skip to main content</a>

<div class="utility-bar">
  <div class="container">
    <p class="utility-bar__ids">
      <span>SDVOSB Certified</span>
      <span>UEI SUF6ZF8U5RA8</span>
      <span>CAGE 9KDA3</span>
    </p>
    <p class="utility-bar__contact">
      <a href="tel:{phone_href}">{phone}</a>
      <a href="mailto:{email}">{email}</a>
    </p>
  </div>
</div>

<header class="site-header">
  <div class="container site-header__inner">
    {brand}
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">
      <span class="nav-toggle__bars" aria-hidden="true"></span>
      <span class="nav-toggle__label">Menu</span>
    </button>
    <nav class="primary-nav" id="primary-nav" aria-label="Primary">
      <ul>
{nav}
      </ul>
    </nav>
  </div>
</header>

<main id="main">
"""


FOOT = """</main>

<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        {brand}
        <address>
          Ionic Contractors LLC<br>
          7432 Wiggins Mill Rd<br>
          Lucama, NC 27851<br>
          <a href="tel:{phone_href}">{phone}</a><br>
          <a href="mailto:{email}">{email}</a>
        </address>
      </div>

      <nav aria-labelledby="footer-company">
        <h2 id="footer-company">Company</h2>
        <ul>
          <li><a href="about.html">About / Our Story</a></li>
          <li><a href="capabilities.html">Capabilities</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </nav>

      <nav aria-labelledby="footer-work">
        <h2 id="footer-work">Work With Ionic</h2>
        <ul>
          <li><a href="federal-contracting.html">Federal Contracting</a></li>
          <li><a href="teaming.html">Teaming &amp; Partnerships</a></li>
          <li><a href="subcontractors.html">Subcontractor Registration</a></li>
          <li><a href="capability-statement.html">Capability Statement</a></li>
        </ul>
      </nav>

      <div>
        <h2>Registrations</h2>
        <p class="footer-ids">
          <span class="k">Certification</span> <span class="v">SDVOSB</span><br>
          <span class="k">UEI</span> <span class="v">SUF6ZF8U5RA8</span><br>
          <span class="k">CAGE</span> <span class="v">9KDA3</span><br>
          <span class="k">SAM.gov</span> <span class="v">Registered</span>
        </p>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; <span data-current-year>2026</span> Ionic Contractors LLC. A company of Ionic Group LLC.</p>
      <ul>
        <li><a href="privacy-policy.html">Privacy Policy</a></li>
        <li><a href="terms-of-use.html">Terms of Use</a></li>
        <li><a href="accessibility.html">Accessibility Statement</a></li>
      </ul>
    </div>
  </div>
</footer>

<script src="assets/js/main.js" defer></script>
<script src="assets/js/hero-motif.js" defer></script>{extra_scripts}
</body>
</html>
"""


def page_header(title, intro, crumb_label):
    return f"""
  <section class="page-header">
    <div class="container page-header__inner">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li><a href="index.html">Home</a></li>
          <li aria-current="page">{crumb_label}</li>
        </ol>
      </nav>
      <h1>{title}</h1>
      <p>{intro}</p>
    </div>
  </section>
"""


CTA_BAND = """
  <section class="cta-band" aria-labelledby="cta-title">
    <div class="container">
      <div class="cta-band__inner">
        <div>
          <h2 id="cta-title">Let's talk about your requirement.</h2>
          <p>Send us the scope, the solicitation, or just the question — we will come back quickly with what you need.</p>
          <p class="cta-band__contact">
            <a href="tel:+12525467181">252-546-7181</a>
            <a href="mailto:service@ionic.contractors">service@ionic.contractors</a>
          </p>
        </div>
        <p class="btn-row">
          <a class="btn btn--primary" href="capability-statement.html">Request Capability Statement</a>
          <a class="btn btn--secondary" href="teaming.html">Start a Teaming Conversation</a>
        </p>
      </div>
    </div>
  </section>
"""


def check(text):
    return (
        '<svg class="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
        'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" '
        'focusable="false"><path d="M20 6L9 17l-5-5"/></svg>\n              '
        f"<span>{text}</span>"
    )


def factlist(items):
    lis = "\n".join(f"            <li>\n              {check(i)}\n            </li>" for i in items)
    return f'<ul class="factlist">\n{lis}\n          </ul>'


PAGES = {}


# ---------------------------------------------------------------------------
# Page 1 — Home
# ---------------------------------------------------------------------------
PAGES["index.html"] = dict(
    active="home",
    title="SDVOSB General Contractor | Ionic Contractors LLC — Federal Construction &amp; Services",
    og_title="Your SDVOSB Partner for Federal Construction &amp; Services",
    description=(
        "Ionic Contractors LLC is a Service-Disabled Veteran-Owned Small Business (SDVOSB) "
        "delivering general construction and support services to federal, state and local "
        "agencies. SAM registered · UEI SUF6ZF8U5RA8 · CAGE 9KDA3. Ready to perform as prime "
        "or team with primes."
    ),
    canonical=SITE_URL,
    extra_head="""
<meta name="keywords" content="SDVOSB general contractor, SDVOSB teaming partner, service-disabled veteran-owned small business, federal construction contractor, NAICS 236220, SDVOSB set-aside">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  "name": "Ionic Contractors LLC",
  "alternateName": "Ionic Contractors",
  "url": "https://ionic.contractors/",
  "email": "service@ionic.contractors",
  "telephone": "+1-252-546-7181",
  "description": "Service-Disabled Veteran-Owned Small Business (SDVOSB) providing general construction and support services to federal, state and local government.",
  "parentOrganization": { "@type": "Organization", "name": "Ionic Group LLC" },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "7432 Wiggins Mill Rd",
    "addressLocality": "Lucama",
    "addressRegion": "NC",
    "postalCode": "27851",
    "addressCountry": "US"
  },
  "identifier": [
    { "@type": "PropertyValue", "name": "UEI", "value": "SUF6ZF8U5RA8" },
    { "@type": "PropertyValue", "name": "CAGE Code", "value": "9KDA3" }
  ],
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "credentialCategory": "Service-Disabled Veteran-Owned Small Business (SDVOSB) - SBA VetCert"
  },
  "knowsAbout": ["NAICS 236220", "NAICS 236210", "NAICS 561790", "NAICS 561720", "NAICS 561730", "NAICS 541350"],
  "areaServed": "US"
}
</script>""",
    body="""
  <!-- ================= HERO ================= -->
  <section class="hero on-dark" aria-labelledby="hero-title">
    <div class="container">
      <div class="hero__grid">
        <div>
          <p class="hero__seal">
            <img src="assets/img/sdvosb-badge.svg" alt="" width="46" height="46">
            <span class="hero__seal-text">
              SDVOSB Certified
              <small>SBA VetCert · Service-Disabled Veteran-Owned</small>
            </span>
          </p>
          <h1 id="hero-title">Your SDVOSB Partner for Federal Construction &amp; Services</h1>
          <p>
            Ionic Contractors LLC is a Service-Disabled Veteran-Owned Small Business delivering
            general construction and broad support services to federal, state, and local agencies —
            ready to perform as prime or team with primes to meet set-aside goals.
          </p>
          <p class="btn-row">
            <a class="btn btn--primary" href="capability-statement.html">Request Capability Statement</a>
            <a class="btn btn--secondary" href="teaming.html">Start a Teaming Conversation</a>
          </p>
        </div>

        <div class="quickref">
          <div class="quickref__head">
            <h2>Contracting Quick Reference</h2>
          </div>
          <dl>
            <dt>Certification</dt>
            <dd>SDVOSB — SBA VetCert</dd>
            <dt>SAM.gov</dt>
            <dd>Active registration</dd>
            <dt>Unique Entity ID (UEI)</dt>
            <dd class="mono">SUF6ZF8U5RA8</dd>
            <dt>CAGE Code</dt>
            <dd class="mono">9KDA3</dd>
            <dt>Primary NAICS</dt>
            <dd class="mono">236220</dd>
          </dl>
          <div class="quickref__foot">
            <a class="link-arrow" href="federal-contracting.html">Full registrations &amp; NAICS list</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ================= TRUST / REGISTRATION BAR ================= -->
  <section class="trust-bar" aria-label="Certifications and registrations">
    <div class="container">
      <ul class="trust-bar__list">
        <li>
          <img src="assets/img/sdvosb-badge.svg" alt="" width="40" height="40">
          <span>
            <span class="trust-bar__label">Certification</span>
            <span class="trust-bar__value">SDVOSB Certified</span>
          </span>
        </li>
        <li>
          <span>
            <span class="trust-bar__label">Verified via</span>
            <span class="trust-bar__value">SBA VetCert</span>
          </span>
        </li>
        <li>
          <span>
            <span class="trust-bar__label">Federal registration</span>
            <span class="trust-bar__value">SAM Registered</span>
          </span>
        </li>
        <li>
          <span>
            <span class="trust-bar__label">UEI</span>
            <span class="trust-bar__value mono">SUF6ZF8U5RA8</span>
          </span>
        </li>
        <li>
          <span>
            <span class="trust-bar__label">CAGE</span>
            <span class="trust-bar__value mono">9KDA3</span>
          </span>
        </li>
      </ul>
    </div>
  </section>

  <!-- ================= WHY AN SDVOSB PARTNER ================= -->
  <section class="section" aria-labelledby="why-title">
    <div class="container">
      <div class="split">
        <div>
          <span class="eyebrow">Why an SDVOSB partner</span>
          <h2 id="why-title">A certified vehicle for both sides of the award</h2>
          <p class="lede">
            Contracting officers use SDVOSB set-asides to meet federal goals; primes need SDVOSB
            partners to satisfy subcontracting plans. Ionic gives both a certified, registered,
            ready-to-perform vehicle — with a general-construction core and the flexibility to
            support a wide range of requirements.
          </p>
        </div>
        <div>
          __WHY_FACTS__
        </div>
      </div>
    </div>
  </section>

  <!-- ================= CAPABILITY SNAPSHOT ================= -->
  <section class="section section--tint" aria-labelledby="cap-title">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Capability snapshot</span>
        <h2 id="cap-title">General construction, with the support lines around it</h2>
        <p>Ionic leads with general construction and performs or teams across allied service lines.</p>
      </div>

      <div class="tiles tiles--gc-first">
        <article class="tile tile--primary">
          <span class="tile__badge">Primary capability</span>
          __ICON_GC__
          <h3>General Construction</h3>
          <p>New construction, renovation, repair and build-out for government facilities — managed to federal standards with proper documentation and compliance.</p>
          <p><a class="link-arrow" href="capabilities.html">See full capabilities</a></p>
        </article>

        <article class="tile">
          __ICON_TREE__
          <h3>Grounds, Landscaping &amp; Arboriculture</h3>
          <p>Grounds maintenance, landscaping, and tree pruning and removal at federal sites.</p>
        </article>

        <article class="tile">
          __ICON_WRENCH__
          <h3>Facilities Maintenance</h3>
          <p>Scheduled and corrective maintenance and repair keeping government facilities operational.</p>
        </article>

        <article class="tile">
          __ICON_SPRAY__
          <h3>Janitorial &amp; Support Services</h3>
          <p>Custodial and janitorial service lines, plus allied support scopes.</p>
        </article>

        <article class="tile">
          __ICON_TRUCK__
          <h3>Logistics &amp; Commodity Sourcing</h3>
          <p>Transportation support, supply and commodity sourcing for government requirements.</p>
        </article>

        <article class="tile">
          __ICON_CLIP__
          <h3>Specialty Consulting</h3>
          <p>Building inspection and specialty advisory scopes supporting the core construction line.</p>
        </article>

        <article class="tile tile--cta">
          <h3>Don't see your scope?</h3>
          <p>Send us the requirement. If it is not something we self-perform, we will say so plainly and bring the right partner to the team.</p>
          <p><a class="link-arrow" href="contact.html">Talk to us about a requirement</a></p>
        </article>
      </div>

      <p class="btn-row">
        <a class="btn btn--solid" href="capabilities.html">View capabilities &amp; NAICS matrix</a>
      </p>
    </div>
  </section>

  <!-- ================= TWO WAYS TO WORK WITH US ================= -->
  <section class="section" aria-labelledby="paths-title">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Two ways to work with us</span>
        <h2 id="paths-title">Pick the path that matches your role</h2>
      </div>
      <div class="grid grid--2">
        <article class="path-card">
          <p class="path-card__kicker">For Contracting Officers</p>
          <h3>A compliant SDVOSB set-aside vehicle, easy to solicit and award.</h3>
          <ul>
            <li>SDVOSB set-aside and sole-source eligible</li>
            <li>Active SAM registration, UEI and CAGE ready for your file</li>
            <li>Capability statement and bid response turned quickly</li>
          </ul>
          <p class="btn-row">
            <a class="btn btn--solid" href="federal-contracting.html">Federal contracting details</a>
          </p>
        </article>

        <article class="path-card path-card--alt">
          <p class="path-card__kicker">For Primes</p>
          <h3>A teaming and subcontracting partner that helps you meet SDVOSB goals — and gets the work done.</h3>
          <ul>
            <li>Verifiable certification for subcontracting-plan credit</li>
            <li>Self-performance in general construction, plus supporting scopes</li>
            <li>Subcontract, joint venture or mentor-protégé arrangements</li>
          </ul>
          <p class="btn-row">
            <a class="btn btn--solid" href="teaming.html">Teaming &amp; partnerships</a>
          </p>
        </article>
      </div>
    </div>
  </section>
"""
    + CTA_BAND,
)


# ---------------------------------------------------------------------------
# Page 2 — About
# ---------------------------------------------------------------------------
PAGES["about.html"] = dict(
    active="about",
    title="About Ionic Contractors | SDVOSB Federal Contractor in North Carolina",
    og_title="About Ionic Contractors LLC",
    description=(
        "Ionic Contractors LLC is a Service-Disabled Veteran-Owned Small Business built to deliver "
        "for government clients — a general-construction core and broad service capability for "
        "federal, state and local requirements."
    ),
    canonical=SITE_URL + "about.html",
    body=page_header(
        "About Ionic Contractors",
        "A Service-Disabled Veteran-Owned Small Business built to deliver for government clients — "
        "as a prime contractor or as a teaming partner to established primes.",
        "About",
    )
    + """
  <section class="section">
    <div class="container">
      <div class="split">
        <div class="prose">
          <h2>Who We Are</h2>
          <p>
            Ionic Contractors LLC is a Service-Disabled Veteran-Owned Small Business built to
            deliver for government clients. Founded on a veteran's commitment to mission and
            standards, Ionic brings a general-construction core and a broad service capability to
            federal, state, and local requirements — as a prime contractor or as a teaming partner
            to established primes.
          </p>

          <h2>Our Mission</h2>
          <p>
            To be the dependable SDVOSB partner agencies and primes can award with confidence —
            compliant, capable, and easy to work with.
          </p>

          <h2>Veteran-Owned</h2>
          <p>
            As a service-disabled veteran-owned business, Ionic brings a standard of discipline,
            accountability, and follow-through to the work we take on.
          </p>

          <h2>How We Work</h2>
          <p>
            We keep our registrations current, our documentation ready, and our responses fast.
            Where a requirement fits our self-performance capability we perform it directly; where
            it calls for added capacity we team, drawing on a vetted network of subcontractors and
            suppliers. Either way, the agency or prime gets one accountable point of contact.
          </p>
          <div class="callout">
            <h3>On past performance</h3>
            <p>
              Ionic is a newer company and we say so plainly. Our certifications and registrations
              are verifiable today, our capability and capacity are real, and the principals'
              operator track record is documented in our capability statement — available on
              request.
            </p>
          </div>
          <p class="btn-row">
            <a class="btn btn--primary" href="capability-statement.html">Request Capability Statement</a>
            <a class="btn btn--secondary" href="contact.html">Contact Ionic</a>
          </p>
        </div>

        <aside class="sidebar-card" aria-labelledby="about-facts">
          <h3 id="about-facts">Company Snapshot</h3>
          <ul>
            <li><span class="k">Entity</span><span class="v">Ionic Contractors LLC (NC)</span></li>
            <li><span class="k">Parent</span><span class="v">Ionic Group LLC (WY)</span></li>
            <li><span class="k">Certification</span><span class="v">SDVOSB — SBA VetCert</span></li>
            <li><span class="k">SAM.gov</span><span class="v">Active registration</span></li>
            <li><span class="k">UEI</span><span class="v mono">SUF6ZF8U5RA8</span></li>
            <li><span class="k">CAGE</span><span class="v mono">9KDA3</span></li>
            <li><span class="k">Registered office</span><span class="v">7432 Wiggins Mill Rd,<br>Lucama, NC 27851</span></li>
          </ul>
          <a class="link-arrow" href="federal-contracting.html">Federal contracting details</a>
        </aside>
      </div>
    </div>
  </section>
"""
    + CTA_BAND,
)


# ---------------------------------------------------------------------------
# Page 3 — Capabilities
# ---------------------------------------------------------------------------
PAGES["capabilities.html"] = dict(
    active="capabilities",
    title="Capabilities &amp; NAICS Matrix | Ionic Contractors — SDVOSB General Contractor",
    og_title="Capabilities &amp; NAICS Matrix",
    description=(
        "General construction led, with grounds and arboriculture, facilities maintenance, "
        "janitorial, logistics, commodity sourcing and specialty consulting. Capability matrix "
        "by NAICS for agencies and primes."
    ),
    canonical=SITE_URL + "capabilities.html",
    body=page_header(
        "Capabilities",
        "Ionic leads with general construction and supports it with a broad set of allied services — "
        "organized by capability and NAICS so agencies and primes can quickly match us to a "
        "requirement. We perform directly where we can and team where a requirement calls for added "
        "capacity.",
        "Capabilities",
    )
    + """
  <section class="section">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Primary capability</span>
        <h2>General Construction</h2>
      </div>
      <div class="split">
        <div class="prose">
          <p class="lede">
            Full-scope general construction for government facilities: new construction,
            renovation, repair, and build-out — managed to federal standards with proper
            documentation and compliance.
          </p>
          __GC_FACTS__
        </div>
        <aside class="sidebar-card" aria-labelledby="gc-naics">
          <h3 id="gc-naics">Primary NAICS</h3>
          <ul>
            <li><span class="k">Commercial &amp; institutional</span><span class="v mono">236220</span></li>
            <li><span class="k">Industrial building</span><span class="v mono">236210</span></li>
          </ul>
          <a class="link-arrow" href="federal-contracting.html">All NAICS codes</a>
        </aside>
      </div>
    </div>
  </section>

  <section class="section section--tint" aria-labelledby="supporting-title">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Supporting capabilities</span>
        <h2 id="supporting-title">Allied service lines around the construction core</h2>
      </div>
      <div class="tiles">
        <article class="tile">
          __ICON_TREE__
          <h3>Grounds, Landscaping &amp; Arboriculture</h3>
          <p>Grounds maintenance and landscaping, including tree pruning and removal at federal sites.</p>
        </article>
        <article class="tile">
          __ICON_WRENCH__
          <h3>Facilities Maintenance &amp; Repair</h3>
          <p>Scheduled and corrective maintenance that keeps government facilities operational.</p>
        </article>
        <article class="tile">
          __ICON_SPRAY__
          <h3>Janitorial &amp; Custodial Services</h3>
          <p>Recurring custodial and janitorial service across government facilities.</p>
        </article>
        <article class="tile">
          __ICON_TRUCK__
          <h3>Logistics &amp; Transportation Support</h3>
          <p>Movement, handling and transportation support for government requirements.</p>
        </article>
        <article class="tile">
          __ICON_BOX__
          <h3>Commodity Sourcing &amp; Supply</h3>
          <p>Sourcing and supply of commodities and materials against agency requirements.</p>
        </article>
        <article class="tile">
          __ICON_CLIP__
          <h3>Specialty Consulting</h3>
          <p>Building inspection and specialty advisory scopes supporting the construction core.</p>
        </article>
        <article class="tile">
          __ICON_DOTS__
          <h3>Miscellaneous Support Services</h3>
          <p>Other support scopes where our capability and teaming network fit the requirement.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="matrix-title">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Capability matrix</span>
        <h2 id="matrix-title">Capability lines by NAICS</h2>
        <p>The quick-scan view: what we do, the code it is bid under, and whether we pursue it as prime or through a team.</p>
      </div>

      <div class="table-wrap">
        <table class="matrix">
          <caption>Ionic Contractors capability matrix. Primary general-construction line listed first.</caption>
          <thead>
            <tr>
              <th scope="col">Capability line</th>
              <th scope="col">NAICS code(s)</th>
              <th scope="col">Prime or team</th>
            </tr>
          </thead>
          <tbody>
            <tr class="is-primary">
              <th scope="row">General Construction <span class="tag-inline">(primary)</span></th>
              <td data-label="NAICS code(s)" class="mono">236220 · 236210</td>
              <td data-label="Prime or team">Prime · Team</td>
            </tr>
            <tr>
              <th scope="row">Grounds, Landscaping &amp; Arboriculture</th>
              <td data-label="NAICS code(s)" class="mono">561730</td>
              <td data-label="Prime or team">Prime · Team</td>
            </tr>
            <tr>
              <th scope="row">Facilities Maintenance &amp; Repair</th>
              <td data-label="NAICS code(s)" class="mono">561790</td>
              <td data-label="Prime or team">Prime · Team</td>
            </tr>
            <tr>
              <th scope="row">Janitorial &amp; Custodial Services</th>
              <td data-label="NAICS code(s)" class="mono">561720</td>
              <td data-label="Prime or team">Prime · Team</td>
            </tr>
            <tr>
              <th scope="row">Specialty Consulting / Building Inspection</th>
              <td data-label="NAICS code(s)" class="mono">541350</td>
              <td data-label="Prime or team">Prime · Team</td>
            </tr>
            <tr>
              <th scope="row">Logistics &amp; Transportation Support</th>
              <td data-label="NAICS code(s)" class="mono">NAICS to be confirmed</td>
              <td data-label="Prime or team">Team</td>
            </tr>
            <tr>
              <th scope="row">Commodity Sourcing &amp; Supply</th>
              <td data-label="NAICS code(s)" class="mono">NAICS to be confirmed</td>
              <td data-label="Prime or team">Team</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="alert alert--notice" style="margin-top:2rem">
        <h3>Pre-launch note for Ionic — remove before go-live</h3>
        <p>
          Capability-to-NAICS mapping needs client confirmation, and logistics / commodity sourcing
          have no NAICS assigned yet. Those two rows read &ldquo;NAICS to be confirmed&rdquo; until
          you decide whether to bid them under a specific code. Everything else reflects the
          suggested mapping in the content brief.
        </p>
      </div>

      <p class="btn-row">
        <a class="btn btn--primary" href="capability-statement.html">Request Capability Statement</a>
        <a class="btn btn--secondary" href="subcontractors.html">Register as a Subcontractor</a>
      </p>
    </div>
  </section>
"""
    + CTA_BAND,
)


# ---------------------------------------------------------------------------
# Page 4 — Federal Contracting
# ---------------------------------------------------------------------------
PAGES["federal-contracting.html"] = dict(
    active="federal",
    title="Federal Contracting | SDVOSB Set-Aside, UEI SUF6ZF8U5RA8, CAGE 9KDA3",
    og_title="Federal Contracting — How to Work With Ionic",
    description=(
        "Identifiers and award path for contracting officers: SDVOSB (SBA VetCert), active SAM "
        "registration, UEI SUF6ZF8U5RA8, CAGE 9KDA3, and NAICS 236220, 236210, 561790, 561720, "
        "561730, 541350. Set-aside and sole-source eligible."
    ),
    canonical=SITE_URL + "federal-contracting.html",
    extra_scripts='\n<script src="assets/js/forms.js" defer></script>',
    body=page_header(
        "Federal Contracting",
        "Everything a contracting officer needs to solicit, evaluate and award to Ionic — "
        "identifiers, codes, eligibility and a direct path to a bid.",
        "Federal Contracting",
    )
    + """
  <section class="section" aria-labelledby="regs-title">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Certifications &amp; registrations</span>
        <h2 id="regs-title">Verifiable and current</h2>
      </div>
      <dl class="id-block">
        <div>
          <dt>Certification</dt>
          <dd>SDVOSB<small>SBA VetCert certified</small></dd>
        </div>
        <div>
          <dt>Federal registration</dt>
          <dd>SAM.gov<small>Active registration</small></dd>
        </div>
        <div>
          <dt>Unique Entity ID</dt>
          <dd class="mono">SUF6ZF8U5RA8</dd>
        </div>
        <div>
          <dt>CAGE Code</dt>
          <dd class="mono">9KDA3</dd>
        </div>
      </dl>
    </div>
  </section>

  <section class="section section--tint" aria-labelledby="naics-title">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">NAICS codes</span>
        <h2 id="naics-title">Codes we contract under</h2>
        <p>Primary general-construction code listed first.</p>
      </div>
      <ul class="naics-list">
        <li class="is-primary">
          <code>236220</code>
          <span class="naics-name">Commercial &amp; Institutional Building Construction</span>
          <span class="tag">Primary</span>
        </li>
        <li><code>236210</code> <span class="naics-name">Industrial Building Construction</span></li>
        <li><code>561790</code> <span class="naics-name">Other Services to Buildings &amp; Dwellings</span></li>
        <li><code>561720</code> <span class="naics-name">Janitorial Services</span></li>
        <li><code>561730</code> <span class="naics-name">Landscaping Services</span></li>
        <li><code>541350</code> <span class="naics-name">Building Inspection Services</span></li>
      </ul>
    </div>
  </section>

  <section class="section" aria-labelledby="setaside-title">
    <div class="container">
      <div class="split">
        <div class="prose">
          <span class="eyebrow">Set-aside eligibility</span>
          <h2 id="setaside-title">Eligible for set-aside and sole-source award</h2>
          <p class="lede">
            Ionic is eligible for SDVOSB set-aside and sole-source awards, and can be awarded as a
            small business under applicable NAICS size standards.
          </p>

          <h2>How to Solicit or Award to Ionic</h2>
          <p>
            Contracting officers can request our capability statement, invite Ionic to bid, or reach
            out directly to discuss a requirement. We respond quickly and come prepared with the
            registrations and documentation you need to move.
          </p>
          <ol class="steps">
            <li>
              <div>
                <h3>Pull our file</h3>
                <p>UEI, CAGE and SAM registration above — everything you need to verify us before you reach out.</p>
              </div>
            </li>
            <li>
              <div>
                <h3>Request the capability statement</h3>
                <p>Four fields, delivered immediately, with the detail your market research needs.</p>
              </div>
            </li>
            <li>
              <div>
                <h3>Invite Ionic to bid</h3>
                <p>Send the solicitation number, NAICS and due date and we will confirm intent quickly.</p>
              </div>
            </li>
          </ol>
          <p class="btn-row">
            <a class="btn btn--primary" href="capability-statement.html">Request Capability Statement</a>
            <a class="btn btn--secondary" href="#invite-to-bid">Invite Ionic to Bid</a>
          </p>
        </div>

        <aside class="sidebar-card" aria-labelledby="co-quick">
          <h3 id="co-quick">Quick Reference</h3>
          <ul>
            <li><span class="k">Certification</span><span class="v">SDVOSB — SBA VetCert</span></li>
            <li><span class="k">SAM.gov</span><span class="v">Active</span></li>
            <li><span class="k">UEI</span><span class="v mono">SUF6ZF8U5RA8</span></li>
            <li><span class="k">CAGE</span><span class="v mono">9KDA3</span></li>
            <li><span class="k">Primary NAICS</span><span class="v mono">236220</span></li>
            <li><span class="k">Phone</span><span class="v"><a href="tel:+12525467181">252-546-7181</a></span></li>
            <li><span class="k">Email</span><span class="v"><a href="mailto:service@ionic.contractors">service@ionic.contractors</a></span></li>
          </ul>
          <p style="font-size:.875rem;color:var(--ink-muted);margin:0">
            Response commitment: agency inquiries answered promptly — usually the same business day.
          </p>
        </aside>
      </div>
    </div>
  </section>

  <section class="section section--tint" id="invite-to-bid" aria-labelledby="invite-title">
    <div class="container">
      <div class="split split--form">
        <div>
          <div class="form-panel">
            <span class="eyebrow">For contracting officers</span>
            <h2 id="invite-title">Invite Ionic to Bid</h2>
            <p>Send us the solicitation details and we will confirm intent and follow up with any documentation you need.</p>

            <form data-ionic-form data-lead-type="co" data-form-name="Invite to Bid" id="invite-form" novalidate
                  data-success-heading="Received — thank you."
                  data-success-message="Your solicitation details are with our contracting team. We respond to agency inquiries promptly, usually the same business day. If it is time-sensitive, call &lt;a href=&quot;tel:+12525467181&quot;&gt;252-546-7181&lt;/a&gt;.">
              <div class="form-fields">
                <p class="hp-field" aria-hidden="true">
                  <label for="invite-company-url">Leave this field blank</label>
                  <input class="hp-input" type="text" id="invite-company-url" name="company_url" tabindex="-1" autocomplete="off">
                </p>

                <div class="field-grid">
                  <div class="field">
                    <label for="invite-agency">Agency <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
                    <input type="text" id="invite-agency" name="agency" required autocomplete="organization">
                  </div>
                  <div class="field">
                    <label for="invite-solicitation">Solicitation number <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
                    <input type="text" id="invite-solicitation" name="solicitation_number" required>
                  </div>
                </div>

                <div class="field-grid">
                  <div class="field">
                    <label for="invite-naics">NAICS code</label>
                    <input type="text" id="invite-naics" name="naics" inputmode="numeric" aria-describedby="invite-naics-hint" data-hint-id="invite-naics-hint">
                    <span class="hint" id="invite-naics-hint">For example 236220.</span>
                  </div>
                  <div class="field">
                    <label for="invite-due">Response due date</label>
                    <input type="date" id="invite-due" name="due_date">
                  </div>
                </div>

                <div class="field-grid">
                  <div class="field">
                    <label for="invite-poc">Point of contact <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
                    <input type="text" id="invite-poc" name="poc_name" required autocomplete="name">
                  </div>
                  <div class="field">
                    <label for="invite-email">Email <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
                    <input type="email" id="invite-email" name="poc_email" required autocomplete="email">
                  </div>
                </div>

                <div class="field">
                  <label for="invite-phone">Phone</label>
                  <input type="tel" id="invite-phone" name="poc_phone" autocomplete="tel">
                </div>

                <div class="field">
                  <label for="invite-notes">Requirement notes</label>
                  <textarea id="invite-notes" name="notes"></textarea>
                </div>
              </div>

              <p class="form-actions btn-row">
                <button class="btn btn--primary" type="submit">Send Bid Invitation</button>
              </p>
              <p class="form-footnote">
                Fields marked <span class="req" aria-hidden="true">*</span> are required.
                Submissions route to <a href="mailto:service@ionic.contractors">service@ionic.contractors</a>
                and are tagged as a contracting-officer inquiry.
              </p>
            </form>
          </div>
        </div>

        <aside class="sidebar-card" aria-labelledby="invite-aside">
          <h3 id="invite-aside">Prefer to send it directly?</h3>
          <ul>
            <li><span class="k">Email</span><span class="v"><a href="mailto:service@ionic.contractors">service@ionic.contractors</a></span></li>
            <li><span class="k">Phone</span><span class="v"><a href="tel:+12525467181">252-546-7181</a></span></li>
          </ul>
          <p style="font-size:.9375rem;color:var(--ink-muted)">
            Doing market research instead? The capability statement covers our certifications,
            NAICS coverage and the principals' operator experience.
          </p>
          <a class="link-arrow" href="capability-statement.html">Request Capability Statement</a>
        </aside>
      </div>
    </div>
  </section>
"""
    + CTA_BAND,
)


# ---------------------------------------------------------------------------
# Page 5 — Teaming
# ---------------------------------------------------------------------------
PAGES["teaming.html"] = dict(
    active="teaming",
    title="SDVOSB Teaming Partner | Subcontract, JV &amp; Mentor-Protégé | Ionic Contractors",
    og_title="Teaming &amp; Partnerships",
    description=(
        "Primes needing a qualified SDVOSB partner for subcontracting goals: Ionic is certified, "
        "registered and ready to team as a subcontractor, joint-venture partner or mentor-protégé "
        "participant."
    ),
    canonical=SITE_URL + "teaming.html",
    extra_scripts='\n<script src="assets/js/forms.js" defer></script>',
    body=page_header(
        "Teaming &amp; Partnerships",
        "Ionic is the SDVOSB partner that is straightforward to add to a team — certified, "
        "registered, and ready to perform the scope you need covered.",
        "Teaming",
    )
    + """
  <section class="section" aria-labelledby="team-title">
    <div class="container">
      <div class="split">
        <div class="prose">
          <span class="eyebrow">Team with an SDVOSB</span>
          <h2 id="team-title">A qualified partner for your subcontracting plan</h2>
          <p class="lede">
            Primes pursuing federal work often need a qualified SDVOSB partner to meet
            subcontracting goals and strengthen a proposal. Ionic is certified, registered, and
            ready to team — as a subcontractor, joint-venture partner, or mentor-protégé
            participant.
          </p>

          <h2>What Ionic Brings to a Team</h2>
          __TEAM_FACTS__

          <h2>Partnering Vehicles</h2>
          <div class="grid grid--3" style="margin-top:1.5rem">
            <div class="card">
              <h3>Subcontracting</h3>
              <p>Defined scopes under your prime contract, with SDVOSB credit toward your plan.</p>
            </div>
            <div class="card">
              <h3>Joint Ventures</h3>
              <p>JV structures where the pursuit calls for combined capability and capacity.</p>
            </div>
            <div class="card">
              <h3>Mentor-Protégé</h3>
              <p>Mentor-protégé arrangements that build capability while delivering the work.</p>
            </div>
          </div>
        </div>

        <aside class="sidebar-card" aria-labelledby="team-quick">
          <h3 id="team-quick">Partner Quick Facts</h3>
          <ul>
            <li><span class="k">Certification</span><span class="v">SDVOSB — SBA VetCert</span></li>
            <li><span class="k">UEI</span><span class="v mono">SUF6ZF8U5RA8</span></li>
            <li><span class="k">CAGE</span><span class="v mono">9KDA3</span></li>
            <li><span class="k">Self-performs</span><span class="v">General construction</span></li>
            <li><span class="k">Vehicles</span><span class="v">Sub · JV · Mentor-protégé</span></li>
          </ul>
          <a class="link-arrow" href="capabilities.html">Capabilities &amp; NAICS matrix</a>
        </aside>
      </div>
    </div>
  </section>

  <section class="section section--tint" id="partner-intake" aria-labelledby="intake-title">
    <div class="container">
      <div class="split split--form">
        <div>
          <div class="form-panel">
            <span class="eyebrow">Partner intake</span>
            <h2 id="intake-title">Start a Teaming Conversation</h2>
            <p>Tell us about the opportunity and the scope you need covered. We will come back with a straight answer on fit and availability.</p>

            <form data-ionic-form data-lead-type="teaming" data-form-name="Teaming Intake" id="teaming-form" novalidate
                  data-success-heading="Thank you — your teaming request is in."
                  data-success-message="We will review the opportunity and respond promptly, usually the same business day. For a pursuit on a short fuse, call &lt;a href=&quot;tel:+12525467181&quot;&gt;252-546-7181&lt;/a&gt;.">
              <div class="form-fields">
                <p class="hp-field" aria-hidden="true">
                  <label for="team-website">Leave this field blank</label>
                  <input class="hp-input" type="text" id="team-website" name="website" tabindex="-1" autocomplete="off">
                </p>

                <fieldset>
                  <legend>Your company</legend>
                  <div class="field">
                    <label for="team-company">Company name <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
                    <input type="text" id="team-company" name="company_name" required autocomplete="organization">
                  </div>
                  <div class="field-grid">
                    <div class="field">
                      <label for="team-contact">Contact name <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
                      <input type="text" id="team-contact" name="contact_name" required autocomplete="name">
                    </div>
                    <div class="field">
                      <label for="team-email">Email <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
                      <input type="email" id="team-email" name="contact_email" required autocomplete="email">
                    </div>
                  </div>
                  <div class="field">
                    <label for="team-phone">Phone <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
                    <input type="tel" id="team-phone" name="contact_phone" required autocomplete="tel">
                  </div>
                </fieldset>

                <fieldset>
                  <legend>The opportunity</legend>
                  <div class="field-grid">
                    <div class="field">
                      <label for="team-opportunity">Opportunity / agency <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
                      <input type="text" id="team-opportunity" name="opportunity" required>
                    </div>
                    <div class="field">
                      <label for="team-solicitation">Solicitation number</label>
                      <input type="text" id="team-solicitation" name="solicitation_number" aria-describedby="team-sol-hint" data-hint-id="team-sol-hint">
                      <span class="hint" id="team-sol-hint">If one has been issued.</span>
                    </div>
                  </div>
                  <div class="field">
                    <label for="team-role">Role sought <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
                    <select id="team-role" name="role_sought" required>
                      <option value="">Select a role…</option>
                      <option>Subcontractor</option>
                      <option>Joint Venture (JV)</option>
                      <option>Mentor-Protégé</option>
                      <option>Not sure yet</option>
                    </select>
                  </div>
                  <div class="field">
                    <label for="team-scope">Scope needed from Ionic <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
                    <textarea id="team-scope" name="scope_needed" required aria-describedby="team-scope-hint" data-hint-id="team-scope-hint"></textarea>
                    <span class="hint" id="team-scope-hint">Trades, service lines, estimated value, place of performance — whatever you have.</span>
                  </div>
                </fieldset>
              </div>

              <p class="form-actions btn-row">
                <button class="btn btn--primary" type="submit">Start a Teaming Conversation</button>
              </p>
              <p class="form-footnote">
                Fields marked <span class="req" aria-hidden="true">*</span> are required.
                Teaming inquiries route to <a href="mailto:service@ionic.contractors">service@ionic.contractors</a>
                and are tracked separately from contracting-officer inquiries.
              </p>
            </form>
          </div>
        </div>

        <aside class="sidebar-card" aria-labelledby="team-aside">
          <h3 id="team-aside">Also useful</h3>
          <p style="font-size:.9375rem;color:var(--ink-muted)">
            Our capability statement covers certifications, NAICS coverage and the principals'
            operator experience — the detail proposal teams usually ask for next.
          </p>
          <p><a class="link-arrow" href="capability-statement.html">Request Capability Statement</a></p>
          <p style="font-size:.9375rem;color:var(--ink-muted)">
            Looking to work <em>for</em> Ionic rather than with us on a pursuit?
          </p>
          <p><a class="link-arrow" href="subcontractors.html">Register as a subcontractor</a></p>
        </aside>
      </div>
    </div>
  </section>
"""
    + CTA_BAND,
)


# ---------------------------------------------------------------------------
# Page 6 — Subcontractor Registration
# ---------------------------------------------------------------------------
PAGES["subcontractors.html"] = dict(
    active="subs",
    title="Subcontractor &amp; Vendor Registration | Ionic Contractors LLC",
    og_title="Register to Work With Ionic",
    description=(
        "Register your company as a subcontractor, vendor or supplier to Ionic Contractors for "
        "upcoming federal, state and local opportunities across our capability lines."
    ),
    canonical=SITE_URL + "subcontractors.html",
    extra_scripts='\n<script src="assets/js/forms.js" defer></script>',
    body=page_header(
        "Subcontractor Registration",
        "Ionic partners with qualified subcontractors, vendors, and suppliers to perform across our "
        "capability lines. Register below to be added to our database for upcoming federal, state, "
        "and local opportunities.",
        "Subcontractors",
    )
    + """
  <section class="section">
    <div class="container">
      <div class="split split--form">
        <div>
          <div class="form-panel">
            <span class="eyebrow">Register to work with Ionic</span>
            <h2 id="reg-title">Subcontractor &amp; Vendor Registration</h2>
            <p>Complete as much as applies to your business. Everything except the contact block is optional — send what you have and we will follow up if we need more.</p>

            <form data-ionic-form data-lead-type="subcontractor" data-form-name="Subcontractor Registration" id="sub-form" novalidate
                  data-success-heading="You're registered — thank you."
                  data-success-message="Your details are with our team and will be added to the Ionic subcontractor database. We reach out as opportunities match your trades and coverage.">
              <div class="form-fields">
                <p class="hp-field" aria-hidden="true">
                  <label for="sub-website">Leave this field blank</label>
                  <input class="hp-input" type="text" id="sub-website" name="website" tabindex="-1" autocomplete="off">
                </p>

                <fieldset>
                  <legend>Company &amp; contact</legend>
                  <div class="field">
                    <label for="sub-company">Company name <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
                    <input type="text" id="sub-company" name="company_name" required autocomplete="organization">
                  </div>
                  <div class="field-grid">
                    <div class="field">
                      <label for="sub-contact">Primary contact <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
                      <input type="text" id="sub-contact" name="contact_name" required autocomplete="name">
                    </div>
                    <div class="field">
                      <label for="sub-phone">Phone <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
                      <input type="tel" id="sub-phone" name="contact_phone" required autocomplete="tel">
                    </div>
                  </div>
                  <div class="field">
                    <label for="sub-email">Email <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
                    <input type="email" id="sub-email" name="contact_email" required autocomplete="email">
                  </div>
                </fieldset>

                <fieldset>
                  <legend>What you perform</legend>
                  <div class="field">
                    <label for="sub-trades">Trade / service line(s) <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
                    <textarea id="sub-trades" name="trades" required aria-describedby="sub-trades-hint" data-hint-id="sub-trades-hint" style="min-height:100px"></textarea>
                    <span class="hint" id="sub-trades-hint">For example: electrical, sitework, roofing, janitorial, tree removal.</span>
                  </div>
                  <div class="field">
                    <label for="sub-naics">NAICS code(s) you perform</label>
                    <input type="text" id="sub-naics" name="naics_codes" aria-describedby="sub-naics-hint" data-hint-id="sub-naics-hint">
                    <span class="hint" id="sub-naics-hint">Comma separated.</span>
                  </div>
                  <div class="field">
                    <label for="sub-geo">Geographic coverage</label>
                    <input type="text" id="sub-geo" name="geographic_coverage" aria-describedby="sub-geo-hint" data-hint-id="sub-geo-hint">
                    <span class="hint" id="sub-geo-hint">States, regions or radius you will travel.</span>
                  </div>
                </fieldset>

                <fieldset>
                  <legend>Business certifications</legend>
                  <div class="checkbox-grid">
                    <label class="checkbox" for="cert-sdvosb"><input type="checkbox" id="cert-sdvosb" name="certifications" value="SDVOSB"> SDVOSB</label>
                    <label class="checkbox" for="cert-vosb"><input type="checkbox" id="cert-vosb" name="certifications" value="VOSB"> VOSB</label>
                    <label class="checkbox" for="cert-wosb"><input type="checkbox" id="cert-wosb" name="certifications" value="WOSB"> WOSB</label>
                    <label class="checkbox" for="cert-8a"><input type="checkbox" id="cert-8a" name="certifications" value="8(a)"> 8(a)</label>
                    <label class="checkbox" for="cert-hubzone"><input type="checkbox" id="cert-hubzone" name="certifications" value="HUBZone"> HUBZone</label>
                    <label class="checkbox" for="cert-smallbiz"><input type="checkbox" id="cert-smallbiz" name="certifications" value="Small Business"> Small Business</label>
                    <label class="checkbox" for="cert-none"><input type="checkbox" id="cert-none" name="certifications" value="None"> None</label>
                  </div>
                </fieldset>

                <fieldset>
                  <legend>Licensing, insurance &amp; bonding</legend>
                  <div class="field">
                    <label for="sub-license">License number(s)</label>
                    <input type="text" id="sub-license" name="license_numbers" aria-describedby="sub-license-hint" data-hint-id="sub-license-hint">
                    <span class="hint" id="sub-license-hint">Where applicable, with issuing state.</span>
                  </div>
                  <div class="field-grid">
                    <div class="field">
                      <label for="sub-gl">General liability coverage</label>
                      <input type="text" id="sub-gl" name="insurance_gl" aria-describedby="sub-gl-hint" data-hint-id="sub-gl-hint">
                      <span class="hint" id="sub-gl-hint">Per-occurrence / aggregate limits.</span>
                    </div>
                    <div class="field">
                      <label for="sub-wc">Workers' compensation</label>
                      <input type="text" id="sub-wc" name="insurance_wc">
                    </div>
                  </div>
                  <div class="field">
                    <label for="sub-bonding">Bonding capacity</label>
                    <input type="text" id="sub-bonding" name="bonding_capacity" aria-describedby="sub-bond-hint" data-hint-id="sub-bond-hint">
                    <span class="hint" id="sub-bond-hint">Single job and aggregate, if applicable.</span>
                  </div>
                </fieldset>

                <fieldset>
                  <legend>References &amp; documents</legend>
                  <div class="field">
                    <label for="sub-refs">References</label>
                    <textarea id="sub-refs" name="references" aria-describedby="sub-refs-hint" data-hint-id="sub-refs-hint" style="min-height:100px"></textarea>
                    <span class="hint" id="sub-refs-hint">Company, contact and phone for recent comparable work.</span>
                  </div>
                  <div class="field-grid">
                    <div class="field">
                      <label for="sub-capstat">Upload capability statement</label>
                      <input type="file" id="sub-capstat" name="capability_statement" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" aria-describedby="sub-capstat-hint" data-hint-id="sub-capstat-hint">
                      <span class="hint" id="sub-capstat-hint">PDF, DOC, DOCX, JPG or PNG. 10 MB maximum.</span>
                    </div>
                    <div class="field">
                      <label for="sub-coi">Upload certificate of insurance (COI)</label>
                      <input type="file" id="sub-coi" name="certificate_of_insurance" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" aria-describedby="sub-coi-hint" data-hint-id="sub-coi-hint">
                      <span class="hint" id="sub-coi-hint">PDF, DOC, DOCX, JPG or PNG. 10 MB maximum.</span>
                    </div>
                  </div>
                </fieldset>
              </div>

              <p class="form-actions btn-row">
                <button class="btn btn--primary" type="submit">Submit Registration</button>
              </p>
              <p class="form-footnote">
                Fields marked <span class="req" aria-hidden="true">*</span> are required.
                Registrations route to <a href="mailto:service@ionic.contractors">service@ionic.contractors</a>
                and into the Ionic subcontractor database, tracked separately from agency and teaming inquiries.
              </p>
            </form>
          </div>

          <div class="alert alert--notice" style="margin-top:2rem">
            <h3>Pre-launch note for Ionic — remove before go-live</h3>
            <p>
              The certification list and the licensing / insurance / bonding fields above follow the
              content brief. Confirm which of these you actually want to capture before launch, and
              we will trim or extend the form to match.
            </p>
          </div>
        </div>

        <aside class="sidebar-card" aria-labelledby="sub-aside">
          <h3 id="sub-aside">Why register</h3>
          <p style="font-size:.9375rem;color:var(--ink-muted)">
            Registered subcontractors and suppliers are the capacity Ionic draws on when we perform
            directly and when we team with a prime. We contact registrants as opportunities match
            their trades, certifications and geography.
          </p>
          <ul>
            <li><span class="k">Opportunity types</span><span class="v">Federal · State · Local</span></li>
            <li><span class="k">Capability lines</span><span class="v">Construction &amp; allied services</span></li>
            <li><span class="k">Questions</span><span class="v"><a href="mailto:service@ionic.contractors">service@ionic.contractors</a></span></li>
          </ul>
          <a class="link-arrow" href="capabilities.html">See our capability lines</a>
        </aside>
      </div>
    </div>
  </section>
"""
    + CTA_BAND,
)


# ---------------------------------------------------------------------------
# Page 7 — Capability Statement (gated)
# ---------------------------------------------------------------------------
PAGES["capability-statement.html"] = dict(
    active="capstat",
    title="Request Our Capability Statement | Ionic Contractors — SDVOSB",
    og_title="Request the Ionic Contractors Capability Statement",
    description=(
        "Request the Ionic Contractors capability statement: certifications, NAICS coverage, "
        "capability lines and the principals' operator experience. Four fields, delivered immediately."
    ),
    canonical=SITE_URL + "capability-statement.html",
    extra_scripts='\n<script src="assets/js/forms.js" defer></script>',
    body=page_header(
        "Capability Statement",
        "The full picture — certifications, NAICS coverage, capability lines, and the principals' "
        "operator experience. Four fields and it is yours.",
        "Capability Statement",
    )
    + """
  <section class="section">
    <div class="container">
      <div class="split split--form">
        <div>
          <div class="form-panel">
            <span class="eyebrow">Gated download</span>
            <h2 id="capstat-title">Request Capability Statement</h2>
            <p>Tell us who you are so we can route your request properly. The document downloads as soon as you submit.</p>

            <form data-ionic-form data-lead-type="capability" data-form-name="Capability Statement Request" id="capstat-form" novalidate
                  data-success-heading="Thank you — your download is ready."
                  data-success-message="A copy is also on its way to our team so we can follow up with anything else you need. Questions in the meantime: &lt;a href=&quot;tel:+12525467181&quot;&gt;252-546-7181&lt;/a&gt;.">
              <div class="form-fields">
                <p class="hp-field" aria-hidden="true">
                  <label for="cap-website">Leave this field blank</label>
                  <input class="hp-input" type="text" id="cap-website" name="website" tabindex="-1" autocomplete="off">
                </p>

                <div class="field">
                  <label for="cap-who">Who you are <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
                  <select id="cap-who" name="requester_type" required>
                    <option value="">Select one…</option>
                    <option>Contracting Officer / Agency</option>
                    <option>Prime Contractor</option>
                    <option>Small Business / Sub</option>
                    <option>Other</option>
                  </select>
                </div>

                <div class="field">
                  <label for="cap-email">Email <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
                  <input type="email" id="cap-email" name="email" required autocomplete="email">
                </div>

                <div class="field">
                  <label for="cap-phone">Phone number <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
                  <input type="tel" id="cap-phone" name="phone" required autocomplete="tel">
                </div>

                <div class="field">
                  <label for="cap-looking">What you're looking for <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
                  <select id="cap-looking" name="interest" required>
                    <option value="">Select one…</option>
                    <option>Set-Aside Award</option>
                    <option>Teaming / Subcontracting</option>
                    <option>Market Research</option>
                    <option>General Inquiry</option>
                  </select>
                </div>
              </div>

              <p class="form-actions btn-row">
                <button class="btn btn--primary" type="submit">Request Capability Statement</button>
              </p>
              <p class="form-footnote">
                Four fields, nothing more. We use your details to send the document and follow up on
                your requirement — see our <a href="privacy-policy.html">Privacy Policy</a>.
              </p>
            </form>
          </div>

          <div class="alert alert--notice" style="margin-top:2rem">
            <h3>Pre-launch note for Ionic — remove before go-live</h3>
            <p>
              The capability statement PDF has not been supplied yet. Drop the file in as
              <code>assets/docs/ionic-contractors-capability-statement.pdf</code> and add
              <code>data-download-url="assets/docs/ionic-contractors-capability-statement.pdf"</code>
              to the form tag on this page — the download button then appears automatically on
              submit. Until then the form captures and routes the lead, and the document is sent
              by hand.
            </p>
          </div>
        </div>

        <aside class="sidebar-card" aria-labelledby="capstat-aside">
          <h3 id="capstat-aside">What's inside</h3>
          <ul>
            <li><span class="k">Registrations</span><span class="v">SDVOSB · SAM · UEI · CAGE</span></li>
            <li><span class="k">Codes</span><span class="v">Full NAICS coverage</span></li>
            <li><span class="k">Capability</span><span class="v">GC core &amp; support lines</span></li>
            <li><span class="k">Experience</span><span class="v">Principals' operator background</span></li>
            <li><span class="k">Differentiators</span><span class="v">Why award to Ionic</span></li>
          </ul>
          <p style="font-size:.9375rem;color:var(--ink-muted)">
            Doing market research for an upcoming requirement? This is the document to pull.
          </p>
          <a class="link-arrow" href="federal-contracting.html">Federal contracting details</a>
        </aside>
      </div>
    </div>
  </section>
"""
    + CTA_BAND,
)


# ---------------------------------------------------------------------------
# Page 8 — Contact
# ---------------------------------------------------------------------------
PAGES["contact.html"] = dict(
    active="contact",
    title="Contact Ionic Contractors LLC | SDVOSB Federal Contractor",
    og_title="Contact Ionic Contractors",
    description=(
        "Contact Ionic Contractors LLC: 252-546-7181, service@ionic.contractors, 7432 Wiggins Mill "
        "Rd, Lucama, NC 27851. We respond to agency and teaming inquiries promptly — usually the "
        "same business day."
    ),
    canonical=SITE_URL + "contact.html",
    extra_scripts='\n<script src="assets/js/forms.js" defer></script>',
    body=page_header(
        "Contact Ionic",
        "Agency requirement, teaming pursuit, or a straight question about our capability — send it "
        "over and we will come back quickly.",
        "Contact",
    )
    + """
  <section class="section">
    <div class="container">
      <div class="split split--form">
        <div>
          <div class="form-panel">
            <h2 id="contact-title">Send Us a Message</h2>
            <p>Tell us who you are and we will route your message to the right person straight away.</p>

            <form data-ionic-form data-lead-type="contact" data-form-name="Contact" id="contact-form" novalidate
                  data-success-heading="Thank you — your message is with us."
                  data-success-message="We respond to agency and teaming inquiries promptly, usually the same business day. If it is urgent, call &lt;a href=&quot;tel:+12525467181&quot;&gt;252-546-7181&lt;/a&gt;.">
              <div class="form-fields">
                <p class="hp-field" aria-hidden="true">
                  <label for="contact-website">Leave this field blank</label>
                  <input class="hp-input" type="text" id="contact-website" name="website" tabindex="-1" autocomplete="off">
                </p>

                <div class="field-grid">
                  <div class="field">
                    <label for="contact-name">Name <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
                    <input type="text" id="contact-name" name="name" required autocomplete="name">
                  </div>
                  <div class="field">
                    <label for="contact-org">Organization / agency</label>
                    <input type="text" id="contact-org" name="organization" autocomplete="organization">
                  </div>
                </div>

                <div class="field">
                  <label for="contact-role">I am a… <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
                  <select id="contact-role" name="requester_type" required>
                    <option value="">Select one…</option>
                    <option>Contracting Officer</option>
                    <option>Prime Contractor</option>
                    <option>Small Business</option>
                    <option>Other</option>
                  </select>
                </div>

                <div class="field-grid">
                  <div class="field">
                    <label for="contact-email">Email <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
                    <input type="email" id="contact-email" name="email" required autocomplete="email">
                  </div>
                  <div class="field">
                    <label for="contact-phone">Phone</label>
                    <input type="tel" id="contact-phone" name="phone" autocomplete="tel">
                  </div>
                </div>

                <div class="field">
                  <label for="contact-reason">Reason for contact <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
                  <select id="contact-reason" name="reason" required>
                    <option value="">Select one…</option>
                    <option>Solicitation</option>
                    <option>Teaming</option>
                    <option>Capability Statement</option>
                    <option>General</option>
                  </select>
                </div>

                <div class="field">
                  <label for="contact-message">Message <span class="req" aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
                  <textarea id="contact-message" name="message" required></textarea>
                </div>
              </div>

              <p class="form-actions btn-row">
                <button class="btn btn--primary" type="submit">Send Message</button>
              </p>
              <p class="form-footnote">
                Fields marked <span class="req" aria-hidden="true">*</span> are required.
                Messages are tagged by role so agency and prime inquiries reach the right queue.
                See our <a href="privacy-policy.html">Privacy Policy</a>.
              </p>
            </form>
          </div>
        </div>

        <aside class="sidebar-card" aria-labelledby="contact-direct">
          <h3 id="contact-direct">Direct Contact</h3>
          <ul>
            <li><span class="k">Phone</span><span class="v"><a href="tel:+12525467181">252-546-7181</a></span></li>
            <li><span class="k">Email</span><span class="v"><a href="mailto:service@ionic.contractors">service@ionic.contractors</a></span></li>
            <li>
              <span class="k">Registered office</span>
              <span class="v">
                <address style="font-style:normal;font-weight:700">
                  Ionic Contractors LLC<br>
                  7432 Wiggins Mill Rd<br>
                  Lucama, NC 27851
                </address>
              </span>
            </li>
          </ul>
          <h3 style="margin-top:1.5rem">Response Commitment</h3>
          <p style="font-size:.9375rem;color:var(--ink-muted);margin:0">
            We respond to agency and teaming inquiries promptly — usually the same business day.
          </p>
        </aside>
      </div>
    </div>
  </section>
"""
    + CTA_BAND,
)


# ---------------------------------------------------------------------------
# Utility pages
# ---------------------------------------------------------------------------
LEGAL_NOTICE = """
      <div class="alert alert--notice">
        <h2>Pre-launch note for Ionic — remove before go-live</h2>
        <p>
          This is a working template, not reviewed legal text. Have counsel review and approve the
          wording before launch, and update the effective date below.
        </p>
      </div>
"""

PAGES["privacy-policy.html"] = dict(
    active="",
    title="Privacy Policy | Ionic Contractors LLC",
    og_title="Privacy Policy",
    description="How Ionic Contractors LLC collects, uses and protects information submitted through ionic.contractors.",
    canonical=SITE_URL + "privacy-policy.html",
    body=page_header(
        "Privacy Policy",
        "How we handle the information you send us through this site.",
        "Privacy Policy",
    )
    + """
  <section class="section">
    <div class="container">
      <div class="prose">
        __LEGAL_NOTICE__
        <p><strong>Effective date:</strong> to be confirmed at launch.</p>

        <h2>Who we are</h2>
        <p>
          Ionic Contractors LLC (&ldquo;Ionic&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) operates
          ionic.contractors. Our registered office is 7432 Wiggins Mill Rd, Lucama, NC 27851. You
          can reach us at <a href="mailto:service@ionic.contractors">service@ionic.contractors</a>
          or <a href="tel:+12525467181">252-546-7181</a>.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li><strong>Information you give us.</strong> Contact and business details you enter into our contact, teaming, bid-invitation, capability-statement and subcontractor-registration forms — including any files you upload, such as a capability statement or certificate of insurance.</li>
          <li><strong>Information collected automatically.</strong> Standard analytics data such as pages viewed, referring site, approximate location, device and browser type, collected through Google Analytics 4.</li>
        </ul>

        <h2>How we use it</h2>
        <ul>
          <li>To respond to your inquiry and provide the documents you request.</li>
          <li>To evaluate teaming, subcontracting and vendor opportunities.</li>
          <li>To maintain our subcontractor and vendor database and contact registrants about relevant opportunities.</li>
          <li>To understand how the site is used and improve it.</li>
        </ul>

        <h2>How we share it</h2>
        <p>
          We do not sell your information. We share it only with service providers who help us
          operate the site and manage inquiries (for example, our email, analytics and
          customer-relationship providers), and where required by law or by the terms of a
          government contract.
        </p>

        <h2>Cookies and analytics</h2>
        <p>
          This site uses Google Analytics 4 to measure traffic and form conversions. You can block
          cookies through your browser settings or opt out of Google Analytics using Google's
          browser add-on. Blocking analytics does not affect your ability to use the site or submit
          a form.
        </p>

        <h2>Retention</h2>
        <p>
          We keep inquiry and registration records for as long as needed to respond, to maintain our
          vendor database, and to meet contractual and legal record-keeping obligations.
        </p>

        <h2>Your choices</h2>
        <p>
          Ask us to correct or delete your information, or to remove you from our subcontractor
          database, by emailing
          <a href="mailto:service@ionic.contractors">service@ionic.contractors</a>. We will respond
          promptly.
        </p>

        <h2>Security</h2>
        <p>
          We apply reasonable administrative and technical measures to protect the information you
          send us. No method of transmission over the internet is completely secure, so please do
          not send classified, controlled unclassified, or otherwise sensitive government
          information through this site's forms.
        </p>

        <h2>Children</h2>
        <p>This site is a business-to-government service and is not directed to children.</p>

        <h2>Changes</h2>
        <p>We may update this policy; the effective date above will change when we do.</p>
      </div>
    </div>
  </section>
""",
)

PAGES["terms-of-use.html"] = dict(
    active="",
    title="Terms of Use | Ionic Contractors LLC",
    og_title="Terms of Use",
    description="The terms that apply to your use of the Ionic Contractors LLC website at ionic.contractors.",
    canonical=SITE_URL + "terms-of-use.html",
    body=page_header(
        "Terms of Use",
        "The terms that apply when you use this site.",
        "Terms of Use",
    )
    + """
  <section class="section">
    <div class="container">
      <div class="prose">
        __LEGAL_NOTICE__
        <p><strong>Effective date:</strong> to be confirmed at launch.</p>

        <h2>Acceptance</h2>
        <p>
          By using ionic.contractors you agree to these terms. If you do not agree, please do not
          use the site.
        </p>

        <h2>Informational purpose</h2>
        <p>
          Content on this site describes Ionic Contractors LLC's capabilities and registrations for
          general information. It is not an offer, a bid, a proposal, or a commitment to contract,
          and it does not create a teaming agreement or a subcontract. Any contractual relationship
          is formed only by a signed written agreement.
        </p>

        <h2>Accuracy of registrations</h2>
        <p>
          We work to keep our certifications, UEI, CAGE code and NAICS listings current. Official
          registration data of record is maintained in SAM.gov and the SBA's certification systems;
          those systems govern in the event of any discrepancy.
        </p>

        <h2>Your submissions</h2>
        <p>
          You confirm that information and files you submit are accurate and that you are authorized
          to share them. Do not submit classified, controlled unclassified, or export-controlled
          information through this site.
        </p>

        <h2>Intellectual property</h2>
        <p>
          The content, layout and marks on this site are owned by Ionic Contractors LLC or its
          licensors, except for government seals and certification marks, which belong to their
          respective agencies and are used to indicate our certification status.
        </p>

        <h2>Third-party links</h2>
        <p>
          Links to external sites, including government systems, are provided for convenience. We
          are not responsible for their content.
        </p>

        <h2>Disclaimer and limitation of liability</h2>
        <p>
          The site is provided &ldquo;as is&rdquo; without warranties of any kind. To the extent
          permitted by law, Ionic Contractors LLC is not liable for any indirect or consequential
          loss arising from your use of the site.
        </p>

        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of the State of North Carolina, without regard to its
          conflict-of-laws rules.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms:
          <a href="mailto:service@ionic.contractors">service@ionic.contractors</a>.
        </p>
      </div>
    </div>
  </section>
""",
)

PAGES["accessibility.html"] = dict(
    active="",
    title="Accessibility Statement (Section 508 / WCAG 2.1 AA) | Ionic Contractors",
    og_title="Accessibility Statement",
    description=(
        "Ionic Contractors is committed to Section 508 and WCAG 2.1 Level AA conformance across "
        "ionic.contractors. Read our accessibility commitment, measures taken and feedback process."
    ),
    canonical=SITE_URL + "accessibility.html",
    body=page_header(
        "Accessibility Statement",
        "Ionic Contractors is committed to making this site usable by everyone, including people "
        "who use assistive technology.",
        "Accessibility",
    )
    + """
  <section class="section">
    <div class="container">
      <div class="prose">
        __LEGAL_NOTICE__
        <p><strong>Effective date:</strong> to be confirmed at launch.</p>

        <h2>Our commitment</h2>
        <p>
          As a federal contractor, we hold this site to Section 508 of the Rehabilitation Act and
          the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. We treat accessibility as a
          build requirement, not a retrofit.
        </p>

        <h2>Conformance status</h2>
        <p>
          This site is designed and built to conform to WCAG 2.1 Level AA. We test with keyboard-only
          navigation and screen readers, and we re-check after content changes. If any part falls
          short, we want to hear about it and will fix it.
        </p>

        <h2>Measures we take</h2>
        <ul>
          <li>Semantic HTML with landmark regions, a logical heading order and a skip-to-content link.</li>
          <li>Full keyboard operability with a visible, high-contrast focus indicator on every interactive element.</li>
          <li>Text and interface colors that meet or exceed WCAG AA contrast ratios.</li>
          <li>Form fields with persistent visible labels, clear required-field marking, and errors announced to assistive technology and tied to the field they describe.</li>
          <li>Text alternatives for meaningful images; decorative graphics are hidden from assistive technology.</li>
          <li>Motion kept to a minimum and disabled entirely for visitors whose systems request reduced motion. No content or meaning is conveyed by animation.</li>
          <li>Responsive layout that supports zoom to 200% and reflow on small screens without loss of content or function.</li>
          <li>Data tables with proper header associations, and a stacked presentation on narrow screens.</li>
        </ul>

        <h2>Known limitations</h2>
        <p>
          Documents offered for download, including our capability statement, are prepared as
          tagged, accessible PDFs where possible. If you need any document in an alternative
          format, contact us and we will provide one.
        </p>

        <h2>Feedback</h2>
        <p>
          If you encounter a barrier on this site, or need information in another format, contact us
          and we will respond promptly — usually the same business day.
        </p>
        <ul>
          <li>Email: <a href="mailto:service@ionic.contractors">service@ionic.contractors</a></li>
          <li>Phone: <a href="tel:+12525467181">252-546-7181</a></li>
          <li>Mail: Ionic Contractors LLC, 7432 Wiggins Mill Rd, Lucama, NC 27851</li>
        </ul>
        <p>Please tell us the page address and what you were trying to do so we can reproduce and fix it quickly.</p>
      </div>
    </div>
  </section>
""",
)

PAGES["404.html"] = dict(
    active="",
    title="Page Not Found | Ionic Contractors LLC",
    og_title="Page Not Found",
    description="The page you requested could not be found on ionic.contractors.",
    canonical=SITE_URL + "404.html",
    robots='\n<meta name="robots" content="noindex">',
    body="""
  <section class="page-header">
    <div class="container page-header__inner">
      <h1>Page not found</h1>
      <p>The page you asked for isn't here. It may have moved, or the address may have a typo.</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="prose">
        <h2>Try one of these instead</h2>
        <ul>
          <li><a href="index.html">Home</a> — who we are and how to work with us</li>
          <li><a href="federal-contracting.html">Federal Contracting</a> — identifiers, NAICS codes and the award path</li>
          <li><a href="capabilities.html">Capabilities</a> — capability lines and the NAICS matrix</li>
          <li><a href="teaming.html">Teaming &amp; Partnerships</a> — for primes seeking an SDVOSB partner</li>
          <li><a href="capability-statement.html">Capability Statement</a> — request the document</li>
          <li><a href="contact.html">Contact</a> — reach us directly</li>
        </ul>
        <p>Or call <a href="tel:+12525467181">252-546-7181</a> and we will point you to the right place.</p>
      </div>
    </div>
  </section>
""",
)


# ---------------------------------------------------------------------------
# Shared fragments injected into page bodies
# ---------------------------------------------------------------------------
def icon(paths):
    return (
        '<svg class="tile__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
        'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" '
        f'focusable="false">{paths}</svg>'
    )


FRAGMENTS = {
    "__ICON_GC__": icon(
        '<path d="M3 19h18v2H3zM5 19v-3.5a7 7 0 0114 0V19"/>'
        '<path d="M10 9.5V6.4A1.4 1.4 0 0111.4 5h1.2A1.4 1.4 0 0114 6.4v3.1"/>'
    ),
    "__ICON_TREE__": icon(
        '<path d="M12 22v-5"/>'
        '<path d="M12 17a5.5 5.5 0 01-4.6-8.5A4.6 4.6 0 0112 3a4.6 4.6 0 014.6 5.5A5.5 5.5 0 0112 17z"/>'
        '<path d="M9.6 12.4L12 14.4l2.4-2"/>'
    ),
    "__ICON_WRENCH__": icon(
        '<path d="M15.5 3.5a5.5 5.5 0 00-5 7.7L3.6 18a2 2 0 102.8 2.8l6.8-6.9a5.5 5.5 0 007.3-6.6'
        'l-3 3-2.6-2.6 3-3a5.6 5.6 0 00-2.4-.2z"/>'
    ),
    "__ICON_SPRAY__": icon(
        '<path d="M9 8h5a2 2 0 012 2v10a2 2 0 01-2 2H9a2 2 0 01-2-2V10a2 2 0 012-2z"/>'
        '<path d="M10 8V4h3M13 4h4M17 4v3M7 13h9"/>'
    ),
    "__ICON_TRUCK__": icon(
        '<path d="M3 7h11v9H3zM14 10h4l3 3.2V16h-7z"/>'
        '<circle cx="7.5" cy="18" r="1.8"/><circle cx="17.5" cy="18" r="1.8"/>'
    ),
    "__ICON_BOX__": icon(
        '<path d="M12 3l8 4.2v9.6L12 21l-8-4.2V7.2z"/><path d="M4 7.2l8 4.3 8-4.3M12 11.5V21"/>'
    ),
    "__ICON_CLIP__": icon(
        '<path d="M9 3.5h6v3H9z"/>'
        '<path d="M7 5H6a2 2 0 00-2 2v13a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1"/>'
        '<path d="M8.5 13.5l2 2 4-4"/>'
    ),
    "__ICON_DOTS__": icon(
        '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>'
        '<path d="M3 5h18M3 19h18"/>'
    ),
    "__WHY_FACTS__": factlist(
        [
            "<strong>Set-aside eligible</strong> — SDVOSB set-aside and sole-source awards.",
            "<strong>Goal credit for primes</strong> — verifiable certification for subcontracting plans.",
            "<strong>Registered and current</strong> — active SAM registration, UEI and CAGE on file.",
            "<strong>Low friction</strong> — documentation-ready, quick to respond, easy to award.",
        ]
    ),
    "__GC_FACTS__": factlist(
        [
            "New construction for government facilities",
            "Renovation, alteration and tenant build-out",
            "Repair and restoration scopes",
            "Managed to federal standards, with the documentation and compliance the contract requires",
        ]
    ),
    "__TEAM_FACTS__": factlist(
        [
            "Verifiable SDVOSB certification for set-aside and goal credit",
            "General-construction self-performance capability",
            "Broad supporting services to round out a scope",
            "Responsive, documentation-ready contracting",
        ]
    ),
    "__LEGAL_NOTICE__": LEGAL_NOTICE,
}


def render(filename, page):
    body = page["body"]
    for token, value in FRAGMENTS.items():
        body = body.replace(token, value)
    leftover = re.findall(r"__[A-Z_]+__", body)
    if leftover:
        raise SystemExit(f"{filename}: unresolved fragment token(s): {sorted(set(leftover))}")

    head = HEAD.format(
        title=page["title"],
        description=page["description"],
        og_title=page.get("og_title", page["title"]),
        canonical=page["canonical"],
        robots=page.get("robots", ""),
        extra_head=page.get("extra_head", ""),
        brand=BRAND,
        nav=nav_markup(page["active"]),
        phone=PHONE_DISPLAY,
        phone_href=PHONE_HREF,
        email=EMAIL,
    )
    foot = FOOT.format(
        brand=BRAND,
        phone=PHONE_DISPLAY,
        phone_href=PHONE_HREF,
        email=EMAIL,
        extra_scripts=page.get("extra_scripts", ""),
    )
    return head + body + foot


def main():
    for filename, page in PAGES.items():
        html = render(filename, page)
        with open(os.path.join(ROOT, filename), "w", encoding="utf-8") as fh:
            fh.write(html)
        print(f"wrote {filename} ({len(html):,} bytes)")


if __name__ == "__main__":
    main()
