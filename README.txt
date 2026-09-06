===============================================================================
IONIC CONTRACTORS LLC — WEBSITE
Service-Disabled Veteran-Owned Small Business (SDVOSB) federal contractor
===============================================================================

Eight primary pages plus three utility pages and a 404. Everything is
pre-rendered static HTML with relative paths — no build step is needed to
view or deploy it, and JavaScript is enhancement only.


-------------------------------------------------------------------------------
1. QUICK START
-------------------------------------------------------------------------------

VIEW IT
  Double-click index.html. The whole site works straight off the disk
  because every path is relative.

  One caveat: the scroll-scrub hero video needs HTTP range requests, which
  the file:// protocol does not provide, so on disk the hero shows its
  poster frame instead of scrubbing. Everything else is identical. To see
  the film properly, run the preview server:

      node preview.mjs            ->  http://localhost:4321
      node preview.mjs 8080       ->  pick a different port

DEPLOY IT
  Upload the contents of this folder to any static host. There is no
  server-side code and no database.

  You may exclude build/ and source/ — they are the generator and the
  readable sources, not part of the running site. robots.txt already
  disallows both in case they are uploaded.

REBUILD IT (only needed if you edit content)
      node build/build.mjs

  or, with npm:
      npm run build      rebuild the site
      npm run preview    serve it
      npm run dev        both


-------------------------------------------------------------------------------
2. WHAT IS IN THIS FOLDER
-------------------------------------------------------------------------------

  index.html                       Home — the scroll-scrub film experience
  about.html                       About / Our Story
  capabilities.html                Capabilities + capability-to-NAICS matrix
  federal-contracting.html         For contracting officers (UEI, CAGE, NAICS)
  teaming.html                     For prime contractors
  subcontractor-registration.html  Subcontractor & vendor registration
  capability-statement.html        Gated capability-statement request
  contact.html                     Dual-path contact
  privacy-policy.html              \
  terms-of-use.html                 |  utility / legal  (SEE SECTION 7)
  accessibility-statement.html     /
  404.html                         Not-found page

  css/site.css        The whole stylesheet, minified, one request
  js/app.js           All site behaviour
  js/lenis-*.min.js   Lenis smooth-scroll, vendored and version-pinned

  assets/fonts/       Self-hosted woff2, Latin subset
  assets/img/         Favicon, touch icon, social share image
  assets/video/       Web encodes and posters of the two brand films

  robots.txt          Also disallows /build/ and /source/
  sitemap.xml         All 11 indexable pages (404 excluded)
  site.webmanifest    Icons and theme colour
  _headers            Cache policy — SEE SECTION 6

  preview.mjs         Local preview server
  package.json        npm script shortcuts

  source/             The readable, commented CSS and JS.
                      css/site.css is built from source/css/*.css.
  build/              The generator: page modules, templates and tools.

  OPEN-ITEMS.txt      What the client still owes before launch. READ THIS.


-------------------------------------------------------------------------------
3. EDITING CONTENT
-------------------------------------------------------------------------------

The HTML files are generated. Editing them directly works, but your changes
are lost on the next build. To make a change stick, edit the source and
rebuild:

  Copy on one page ............ build/pages/<page>.mjs
  Anything that repeats ....... build/site.mjs
      (nav, footer, phone, email, address, capability lines, NAICS codes)
      This is the single source of truth. It feeds the pages, the
      navigation, the footer, the structured data AND the sitemap, so a
      change to a NAICS code or a phone number happens in exactly one place.
  The page shell .............. build/layout.mjs   (head, header, footer)
  Shared components ........... build/components.mjs (buttons, cards, forms)
  Styling ..................... source/css/*.css
  Behaviour ................... source/js/app.js

Then:  node build/build.mjs

The build prints a size report and then audits its own output: broken
internal links, absolute paths, missing alt text, missing width/height,
unlabelled form fields, duplicate or missing <h1>, missing meta tags and
dangling anchors. If it says PASS, those classes of bug are not present.


-------------------------------------------------------------------------------
4. DESIGN SYSTEM
-------------------------------------------------------------------------------

Every colour, type size, space and motion value is defined once, in
source/css/01-tokens.css. Nothing downstream hardcodes a value, so
re-skinning the site is a single-file edit.

COLOUR
  Near-black interiors with a green undertone, taken from the brand
  footage. The accent is a verdigris / signal teal, chosen to sit
  complementary to the warm practical lighting in the film — that
  opposition is what gives the hero its contrast. A steel blue carries the
  secondary.

  The accent is defined once as --c-accent-rgb and every tint, line, wash
  and glow derives from it. To change the entire site's accent, change
  that one line (and the matching literal in --select-arrow just below it,
  which has to be a literal because a data: URI cannot read a variable).

  Amber is reserved exclusively for "needs input" flags, so a placeholder
  can never be mistaken for brand colour.

TYPE — self-hosted, ~77 KB for the three faces actually loaded
  Instrument Serif   display / headlines. Engraved, institutional.
  Public Sans        body and UI. This is the US Web Design System face,
                     chosen deliberately for a federal-facing site.
  JetBrains Mono     eyebrows, labels, and the identifiers a contracting
                     officer scans — UEI, CAGE, NAICS.


-------------------------------------------------------------------------------
5. THE SCROLL-SCRUB FILM  (home page)
-------------------------------------------------------------------------------

Two film stages. Each is a tall scroll track with a sticky viewport-height
stage; scroll position drives both the video's currentTime and a set of
copy "beats" that travel through Z-space over the footage.

  Scene 01 — corridor.  The hero. Loads eagerly behind the preloader.
  Scene 02 — boardroom. Sets up the dual-path section. Loads lazily when
                        it comes within 150% of the viewport.

WHY IT SCRUBS SMOOTHLY
  The source clips are re-encoded with a keyframe every 4 frames
  (-g 4 -keyint_min 4 -x264-params scenecut=0). Seeking then lands without
  having to decode a long group of pictures. This is the single biggest
  factor in whether scroll-scrubbing feels smooth or stutters.

  Two renditions are produced per scene and app.js picks by viewport, so a
  phone never downloads the desktop file:

      Scene 01    1.6 MB desktop   /   0.7 MB mobile
      Scene 02    2.4 MB desktop   /   1.1 MB mobile

  Re-encode after replacing the source clips:  npm run video
  The raw camera masters are NOT in this package — the encode script
  expects them in a videos/ folder next to it.

BEAT TIMING
  Each beat declares a start/end window in build/pages/home.mjs. The
  windows overlap by exactly the FADE constant in app.js (0.17), so one
  beat's fade-out is the next one's fade-in and the stage is never blank.
  If you add a beat, keep that spacing.

SMOOTH SCROLL
  Lenis, deliberately light (lerp 0.11, wheel only). Enough to make the
  scrub feel continuous without the page sliding around on its own. Touch
  devices keep their native momentum, which feels better than smoothing.


-------------------------------------------------------------------------------
6. SEO AND PERFORMANCE
-------------------------------------------------------------------------------

GENERATED PER PAGE
  Unique title and meta description, canonical, robots directives,
  Open Graph and Twitter cards with image dimensions and alt text.
  sitemap.xml and robots.txt. The 404 is noindex,follow.

STRUCTURED DATA (JSON-LD, cross-linked by @id)
  Organization    UEI, CAGE and NAICS as identifiers, plus the first-class
                  naics property, parentOrganization and areaServed
  OfferCatalog    all six capability lines as Service items with NAICS
  WebSite         site-level node
  WebPage         per page, tied back to the Organization
  BreadcrumbList  on inner pages, matching the visible breadcrumb
  FAQPage         on capabilities.html and federal-contracting.html, built
                  from the SAME array that renders the accordion, so the
                  schema cannot claim something the page does not show

BEFORE LAUNCH
  Confirm site.origin in build/site.mjs. It drives every canonical, every
  Open Graph url and every sitemap entry. It is currently
  https://ionic.contractors — if the site goes anywhere else, change it
  and rebuild, or the canonicals will point at the wrong domain.

PERFORMANCE
  An inner page is about 107 KB gzipped, and 77 KB of that is the fonts.

  - CSS minified at build: 72 KB source -> ~50 KB shipped, one request.
  - HTML minified conservatively: whitespace inside <pre>, <textarea>,
    <script> and <style> is preserved byte-for-byte, and a run of
    whitespace between inline elements collapses to one space, never none.
  - Off-screen sections skip layout and paint (content-visibility: auto
    with contain-intrinsic-size: auto, so scrollbar length stays stable).
    Deliberately not applied to the film stage, which needs sticky.
  - No third-party requests at runtime. Fonts and Lenis are self-hosted.
  - The animation loop parks itself when nothing is moving and wakes on
    input. Looping CSS animations pause when scrolled out of view or when
    the tab is hidden.
  - Images carry explicit width and height; below-the-fold ones are lazy.

  _headers ships a cache policy: a year and immutable on fonts, video and
  images; a week on CSS and JS; always-revalidate on HTML.

  IMPORTANT: Netlify and Cloudflare Pages read _headers directly. On any
  other host it does nothing — you must translate it into that host's own
  configuration or the caching benefit is simply lost.


-------------------------------------------------------------------------------
7. FORMS — READ THIS BEFORE LAUNCH
-------------------------------------------------------------------------------

There are five lead-capture forms, each tagged so contracting-officer,
teaming and subcontractor leads can be routed separately:

  contact.html ........................ general_contact
  federal-contracting.html (bid) ...... contracting_officer
  teaming.html ........................ teaming_prime
  subcontractor-registration.html ..... subcontractor
  capability-statement.html ........... capability_statement

NO BACKEND IS CONNECTED YET.

Rather than ship a form that silently does nothing, each one validates in
the browser and then hands a pre-filled message to the visitor's email
application, addressed to service@ionic.contractors. Every form states
this on the page. With JavaScript disabled the form's action is a real
mailto:, so a submission still reaches an inbox.

To connect a real endpoint, set data-endpoint on the form — see
formShell() in build/components.mjs. app.js will POST to it and fall back
to mailto: only if that request fails.

Every submission also pushes a lead_submit event with its lead_type into
window.dataLayer, so conversion tracking that splits CO from teaming leads
works the moment a GA4 measurement ID is added.

FILE UPLOADS on the subcontractor form cannot be carried by mailto:. The
form lists the chosen filenames in the message body and asks the sender to
attach them. Real uploads need a backend.

ANALYTICS are NOT installed. build/site.mjs has ga4Id and
searchConsoleToken set to null and the pages emit a comment instead of a
tag. That is deliberate: shipping a made-up measurement ID would look
installed while sending data nowhere. Set both values and rebuild.


-------------------------------------------------------------------------------
8. ACCESSIBILITY
-------------------------------------------------------------------------------

Built to Section 508 / WCAG 2.1 AA, because the audience is federal.

  - Semantic landmarks, exactly one <h1> per page, skip-to-content link
  - Visible focus on everything; focus is never removed, only restyled
  - The mobile drawer is a real focus trap: aria-expanded, Escape to
    close, focus returned to the control that opened it
  - Accordions use aria-expanded and aria-controls on a region panel
  - Every form control has an associated <label for>; errors are announced
    through aria-describedby and a polite live region
  - Faded-out film beats are marked inert, so their buttons are never
    focusable while invisible
  - prefers-reduced-motion disables the scrub, the smooth scrolling, the
    parallax and the preloader without hiding any content
  - Touch targets are at least 44px; no horizontal scrolling from 320px up

PROGRESSIVE ENHANCEMENT
  The static rendering is the baseline, not an afterthought.

                    JS off              Reduced motion      Full
  Film stages       poster still        poster still        scrubbed video
  Copy beats        stacked in flow     stacked in flow     3D, cross-faded
  Accordions        all panels open     open/close, no anim animated
  Preloader         not rendered        removed at once     real progress
  Forms             native validation   full validation     full validation
                    + mailto: submit

  An inline script in <head> sets the mode before first paint, so nobody
  sees a flash of the wrong treatment.

NOTE: the capability statement PDF, once supplied, must itself be checked
for accessibility (tagged structure, reading order, alt text) before it is
offered for download, since this site makes a Section 508 claim.


-------------------------------------------------------------------------------
9. BROWSER SUPPORT
-------------------------------------------------------------------------------

Current Chrome, Edge, Firefox and Safari, desktop and mobile. Verified at
320, 375, 768, 1280 and 1440 pixels wide with no horizontal scrolling.

Older browsers that do not support content-visibility or inert simply do
not get those optimisations; nothing breaks.


===============================================================================
Anything the client still owes is listed in OPEN-ITEMS.txt AND flagged
visibly on the page itself with a dashed amber "Needs input" badge, so no
placeholder content can ship silently as fact.
===============================================================================
