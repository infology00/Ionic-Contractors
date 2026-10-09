===============================================================================
IONIC CONTRACTORS - WEBSITE  (V5)
Veteran-owned SDVOSB general contractor · federal, state & local, private
===============================================================================

Fifteen pre-rendered static pages with relative paths. No server code, no
database. JavaScript is enhancement only: every word of content is in the
HTML, and the site works with JS off.

READ OPEN-ITEMS.txt FIRST — it ticks off the round-2 handoff and lists what
is still needed (capability statement PDF, principals, legal text).


-------------------------------------------------------------------------------
1. QUICK START
-------------------------------------------------------------------------------

VIEW IT        double-click index.html, or
               node preview.mjs          ->  http://localhost:4321

DEPLOY IT      upload this folder to any static host (GitHub Pages works,
               including a project subfolder). build/ and source/ are not
               needed at runtime; robots.txt disallows them anyway.

REBUILD IT     node build/build.mjs      (or: npm run build / npm run dev)

The build prints a size report, then audits every page: broken links,
absolute paths, alt text, image sizes, labels, one <h1>, meta tags — and
the round-2 content rules. It FAILS if any page contains "LLC", "Ionic
Group", "past performance", "Prime or team", "self-perform", a "Needs
input" / [Placeholder] dev note, UK spellings (enquiry, organise,
programme…), or a double-escaped entity like "&amp;amp;".


-------------------------------------------------------------------------------
2. WHAT IS IN THIS FOLDER
-------------------------------------------------------------------------------

  index.html                       Home — scroll sequence + sections
  about.html                       About, locations, safety & quality
  capabilities.html                5 capability lines + NAICS matrix
  markets.html                     Markets overview
  federal-contracting.html         Federal (UEI, CAGE, NAICS, PSC, set-aside)
  state-local.html                 State, county & municipal
  private-sector.html              Private sector
  teaming.html                     For prime contractors
  subcontractor-registration.html  Subcontractor & vendor registration
  capability-statement.html        Capability statement (direct download)
  contact.html                     Contact
  privacy-policy.html / terms-of-use.html / accessibility-statement.html
  404.html

  css/site.css                     whole stylesheet, minified (built)
  js/app.js                        site behavior (built from source/js)
  js/gsap-3.15.0.min.js            GSAP core        } self-hosted,
  js/ScrollTrigger-3.15.0.min.js   ScrollTrigger    } version-pinned
  js/lenis-1.1.18.min.js           smooth scrolling }

  assets/img/brand/                the supplied logos, web-encoded (WebP):
                                   logo-color (header, light grounds),
                                   logo-white (footer, dark grounds),
                                   logo-stacked, mark (icon)
  assets/img/                      favicons, app icons, og-default.jpg
  assets/fonts/                    Archivo (variable) + JetBrains Mono
  assets/docs/                     put the capability statement PDF here

  build/site.mjs                   SINGLE SOURCE OF TRUTH: company data,
                                   nav, capability lines + NAICS, PSC,
                                   locations, principals, markets
  build/hero.mjs                   the home scroll sequence (SVG generator)
  build/layout.mjs                 page shell: head, header, footer, JSON-LD
  build/components.mjs             shared components
  build/pages/*.mjs                page copy
  source/css, source/js            readable sources


-------------------------------------------------------------------------------
3. BRAND
-------------------------------------------------------------------------------

From the Ionic Brand Identity Standards and the round-2 handoff:

  Colors   black #0B0B0C · graphite #2E2E33 · light gray #F3F4F6 · white
            Ionic orange #FC5809 is the ONLY accent.
  Orange    one orange element per screen: the animation highlight OR the
            primary button, never both. Everything else is black/graphite/
            gray. In CSS, --c-accent is graphite on purpose; orange lives in
            --c-orange and is used only by .btn--primary, the animation and
            the focus ring. Button text on orange is black (6.4:1, AA).
  Logo      always the supplied files, never redrawn or recoloured. Full
            color on light backgrounds, reversed white on dark. Header logo
            is 152px wide (brand minimum for the horizontal lockup: 150px).
  Type      Archivo, one self-hosted variable file (width 62-125,
            weight 100-900). Headlines use the expanded width, which echoes
            the wide CONTRACTORS lettering in the logo; body uses normal
            width. JetBrains Mono for identifiers (UEI, CAGE, NAICS) only.
  Scale     seven text sizes only (--fs-display, h2, h3, h4, lead, body,
            sm, label) and one spacing rhythm (--section-y, --head-gap,
            --gap, --pad-card). One radius (3px) everywhere.
  Icons     Phosphor (regular), generated into build/icons.mjs.

All tokens are in source/css/01-tokens.css. Any element with .theme-dark
gets the dark palette (hero, inner-page heroes, CTA band, footer).


-------------------------------------------------------------------------------
4. THE HOME SCROLL SEQUENCE: "FROM CONTRACT TO KEYS"
-------------------------------------------------------------------------------

One project followed from paperwork to handover, then the proof behind
it. The point for a buyer: hand Ionic the solicitation, get back a
finished facility, and every claim along the way can be verified.
Built in code (SVG + GSAP ScrollTrigger), no video.

  0-10%    Contract    a solicitation; its SDVOSB set-aside line is lit
  10-28%   Mobilize    the paper unfolds into a hex site plan; crews and
                       equipment stage (orange markers)
  28-58%   Execute     the plan tilts to ground and a building rises,
                       one row per capability line, with a callout
  58-72%   Close out   an orange trace runs once around the building,
                       then the TURNED OVER stamp lands
  72-86%   Footprint   pull back to the hex US map: NC, TX, FL, partner
                       network; Federal, State, County & municipal, Private
  86-96%   Proof       seven facts lock into a honeycomb: SDVOSB, SAM, UEI,
                       CAGE, NAICS, zero-incident safety, three offices
  96-100%  Resolve     the honeycomb collapses into the real logo + CTA

Reduced motion or no JS: the same beats render as static panels, each with
its final frame. Mobile: shorter scroll, simplified network, compact proof
list on short screens.

Performance: the artwork is three stacked SVG layers (map, network,
site) sharing one coordinate system. Camera moves are CSS transforms on a
whole layer (GPU-composited, no repaint); the 1,000-cell map is drawn
once. Measured at a steady 60 fps (p95 frame 16.8 ms) at 1440x900.

Edit copy in build/hero.mjs, timing in initSequence() in source/js/app.js
(positions are 0–100 = percent of the pinned scroll). Capability callouts
come straight from build/site.mjs.

Reduced motion or no JS: the same beats render as static panels, each with
its final frame. Mobile: shorter scroll, simplified network.


-------------------------------------------------------------------------------
5. OTHER MOTION (all pages)
-------------------------------------------------------------------------------

  - headlines rise word by word from a mask as they enter
  - content blocks reveal in staggered batches (triggered early)
  - inner-page heroes: hex lattice drifts, copy lifts away on scroll
  - capability marquee speeds up / reverses with scroll velocity
  - Mobilize / Execute / Close out cards stack as you scroll (desktop)
  - stat counters, scroll-progress line under the header
  - Lenis smooth wheel scrolling, synced to ScrollTrigger

Everything is off under prefers-reduced-motion, and nothing ever hides
content: if GSAP fails to load, the page falls back to the static layout.


-------------------------------------------------------------------------------
6. SEO AND PERFORMANCE
-------------------------------------------------------------------------------

  - Unique title + meta description per page, canonical, robots, Open
    Graph + Twitter cards (og-default.jpg, 1200x630), sitemap.xml with all
    14 indexable pages, robots.txt
  - JSON-LD: Organization + GeneralContractor (UEI, CAGE, all NAICS,
    SDVOSB credential, HQ + field-office locations, logo), OfferCatalog of
    the capability lines, WebSite, WebPage/AboutPage/ContactPage,
    BreadcrumbList, FAQPage (built from the same arrays as the accordions)
  - Home page ~19 KB gzipped HTML; the animation is ~37 KB of SVG geometry
    in the page (the V1 hero shipped 6.8 MB of video)
  - Header logo fetched at high priority; all other images lazy, sized,
    WebP; only one font preloaded; no third-party requests at runtime
  - _headers: long-lived immutable caching for fonts/images, short for
    CSS/JS, revalidate HTML, plus basic security headers (Netlify /
    Cloudflare Pages read it; other hosts need their own equivalent)

  Before launch confirm site.origin in build/site.mjs
  (https://ionic.contractors) and rebuild.


-------------------------------------------------------------------------------
7. FORMS
-------------------------------------------------------------------------------

No backend yet (that is the later backend phase). Each form validates in
the browser, then opens the visitor's email app pre-filled and addressed to
service@ionic.contractors. With JS off the form action is a real mailto:.
Setting data-endpoint (formShell() in build/components.mjs) switches a form
to POST. Each submission pushes lead_submit + lead_type to dataLayer.


-------------------------------------------------------------------------------
8. ACCESSIBILITY
-------------------------------------------------------------------------------

Section 508 / WCAG 2.1 AA: landmarks, one <h1> per page, skip link,
visible focus, focus-trapped mobile drawer, keyboard-operable Markets menu,
labelled fields with announced errors, AA contrast, 44px touch targets, no
horizontal scroll from 320px. Animation copy is real text; tabbing to a
control inside the hero scrolls to the beat where it is visible.
===============================================================================
