# Ionic Contractors LLC — ionic.contractors

Static marketing site for Ionic Contractors LLC, a Service-Disabled Veteran-Owned Small
Business (SDVOSB) federal contractor. Built from the July 16, 2026 content and build brief.

Plain HTML, CSS and vanilla JS. No framework, no build step required to deploy, no external
requests at runtime. Drop the repo root on any static host.

---

## Contents

| Page | File | Purpose |
| --- | --- | --- |
| Home | `index.html` | Dual-path entry for COs and primes |
| About / Our Story | `about.html` | Company-forward legitimacy and mission |
| Capabilities | `capabilities.html` | GC-led capability set + NAICS matrix |
| Federal Contracting | `federal-contracting.html` | CO page: identifiers, NAICS, Invite to Bid form |
| Teaming & Partnerships | `teaming.html` | Prime page + partner intake form |
| Subcontractor Registration | `subcontractors.html` | Vendor database intake, file uploads |
| Capability Statement | `capability-statement.html` | Gated download, 4-field qualifying form |
| Contact | `contact.html` | Dual-path contact form + direct contact |
| Privacy Policy | `privacy-policy.html` | Template — needs legal review |
| Terms of Use | `terms-of-use.html` | Template — needs legal review |
| Accessibility Statement | `accessibility.html` | Section 508 / WCAG 2.1 AA |
| Not found | `404.html` | Point 404 handling here |

Also: `robots.txt`, `sitemap.xml`.

---

## Before launch — required configuration

Both live in **`assets/js/config.js`** and both are intentionally empty so nothing fires
against a placeholder and no lead is dropped into a dead endpoint.

```js
window.IONIC_GA4_ID       = '';   // 'G-XXXXXXXXXX' — GA4 measurement ID
window.IONIC_FORM_ENDPOINT = '';  // CRM webhook / form service POST URL
```

**GA4** — with no ID set, no analytics script loads at all. Set the ID and the loader runs,
with `anonymize_ip` on. Events already wired:

| Event | Fires when | Parameters |
| --- | --- | --- |
| `generate_lead` | Any form submits successfully | `lead_type`, `form_name`, `page_path` |
| `file_download` | Capability statement PDF downloads | `file_name`, `lead_type` |
| `click_to_call` | Any `tel:` link clicked | `link_url`, `page_path` |
| `click_to_email` | Any `mailto:` link clicked | `link_url`, `page_path` |

Mark `generate_lead` as a conversion in GA4 and split reporting by `lead_type` to get the
CO-vs-teaming breakdown the brief asks for.

**Form endpoint** — every form POSTs `multipart/form-data` to `IONIC_FORM_ENDPOINT` with all
its fields plus three routing fields:

| Field | Values |
| --- | --- |
| `lead_type` | `co` · `teaming` · `subcontractor` · `capability` · `contact` |
| `lead_label` | Human-readable version of the above |
| `source_page` | Absolute URL of the submitting page |

Route on `lead_type` so contracting-officer inquiries, prime teaming leads and subcontractor
registrations land in separate queues, all mirrored to `service@ionic.contractors`.

**Until the endpoint is set**, forms fall back to composing a pre-filled email to
`service@ionic.contractors` in the visitor's mail client, with an on-page notice explaining
what happened and a direct mailto link if nothing opened. The site is never a dead end — but
file uploads cannot ride along on that fallback, so wire the endpoint before promoting the
subcontractor page.

**Search Console** — verify the property at launch (DNS TXT record is cleanest for a domain
property) and submit `https://ionic.contractors/sitemap.xml`.

---

## The 3D decision — ambient motif

The brief calls this the LIGHTEST ACCENT tier: *at most* one ambient motif, passive only,
Section 508 and speed win, and no 3D at all is an acceptable outcome.

**Shipped default: no canvas, no WebGL, no motion.** The hero's ambient treatment is pure CSS
— a layered gradient plus a masked grid, rendered by the compositor at 0 KB of JavaScript. It
cannot shift layout, cannot animate, and gives an accessibility audit nothing to catch.

An optional motif is included but **off by default** in `assets/js/config.js`:

```js
window.IONIC_HERO_MOTIF = false;  // set true only if the 508 review is comfortable
```

Flipping it to `true` enables `assets/js/hero-motif.js` — a ~2 KB dependency-free canvas
drawing a slow wireframe field. It refuses to run when any of these hold: the visitor requests
reduced motion, the viewport is under 900px, the device reports ≤ 4 cores or ≤ 4 GB RAM. The
canvas is `aria-hidden`, non-interactive, absolutely positioned inside the hero (so zero CLS),
pauses on tab blur, and carries no information — dropping it loses nothing.

Recommendation on file: **leave it off.** For this audience, restraint reads as competence and
the CSS treatment already gives the hero depth.

---

## Accessibility (Section 508 / WCAG 2.1 AA)

Built in, not retrofitted:

- Semantic landmarks, one `h1` per page, no heading-level skips, skip-to-content link.
- Every interactive element reachable by keyboard with a 3px gold focus ring at 2px offset.
- Mobile nav: `aria-expanded` on the toggle, `Escape` closes and returns focus, outside click closes.
- Forms: persistent visible labels, required fields marked visually *and* with `sr-only` text,
  `aria-invalid` + `aria-describedby` on failure, an error summary in a `role="status"` live
  region that receives focus, and per-field inline messages.
- Contrast verified for every foreground/background pairing in the palette (body text 15.4:1,
  muted 7.2:1, links 6.6:1, gold buttons 9.1:1).
- `prefers-reduced-motion: reduce` collapses all transitions and hides the optional canvas.
- Capability matrix uses real table semantics with `<caption>`, scoped headers, and a stacked
  card presentation under 720px driven by `data-label`.
- Decorative images (`logo-mark.svg`, `sdvosb-badge.svg`, tile icons) are `alt=""` /
  `aria-hidden` — no meaning is carried by graphics alone.
- Layout reflows to 320px and supports 200% zoom with no horizontal scrolling.

Run an automated pass (axe / Lighthouse / ANDI) plus a manual keyboard and screen-reader pass
before go-live. Automated tools catch roughly a third of real issues.

---

## Performance

Well inside the lightest-tier ceiling:

- Heaviest page ≈ **79 KB uncompressed**, everything included, against a 500 KB budget.
- No web fonts — system font stack. No framework, no jQuery, no icon library. Icons are inline SVG.
- All images are SVG. Every `<img>` carries explicit `width`/`height`, so **CLS is zero**.
- Scripts are `defer`red; `config.js` is the only blocking script and it is a few hundred bytes.
- Zero external requests at runtime once GA4 is either configured or left off.

---

## Editing the site

Shared chrome (head, utility bar, header, nav, footer) lives in `tools/build.py` so it is
written once instead of twelve times. Page content lives in the same file in the `PAGES` dict.

```bash
python3 tools/build.py     # regenerates all 12 HTML files
```

The generated HTML is committed and deployable as-is — you never need to run the generator to
serve the site, only to change shared chrome or page copy. If you would rather hand-edit the
HTML directly, delete `tools/` and edit the files; nothing at runtime depends on it.

Other files:

```
assets/css/styles.css     design tokens + all styles
assets/js/config.js       GA4 ID, form endpoint, motif flag   <- edit at launch
assets/js/main.js         nav, footer year, analytics helpers
assets/js/forms.js        validation, routing, lead tagging
assets/js/hero-motif.js   optional ambient canvas (off)
assets/img/               logo mark, SDVOSB badge, favicon
assets/docs/              drop the capability statement PDF here
```

---

## Open items — client input still needed

These are the brief's amber blocks. Each is live on the site as a **bordered "Pre-launch note
for Ionic" panel** so nothing ships silently unresolved. Delete the panel when the item closes.

| # | Item | Where | State |
| --- | --- | --- | --- |
| 1 | **Capability statement PDF** | `capability-statement.html` | Not supplied. Form captures and routes the lead; the document is sent by hand. To automate: drop the file at `assets/docs/ionic-contractors-capability-statement.pdf` and add `data-download-url="assets/docs/ionic-contractors-capability-statement.pdf"` to the `<form>` tag — the download button then appears on submit. Note this PDF, not the public site, is where the principals' operator experience lives. |
| 2 | **Founding narrative / mission** | `about.html` | Brief copy used verbatim. Confirm or adjust. |
| 3 | **Subcontractor fields** | `subcontractors.html` | All brief fields built (certifications, license, GL/WC, bonding, references, 2 uploads). Confirm which to keep. |
| 4 | **Logistics / commodity NAICS** | `capabilities.html` matrix | Two rows read "NAICS to be confirmed". Assign codes or leave as team-only. |
| 5 | **Legal text** | Privacy, Terms, Accessibility | Working templates, not reviewed. Counsel to approve; set effective dates. |
| 6 | **SDVOSB seal artwork** | `assets/img/sdvosb-badge.svg` | Placeholder is Ionic-branded and deliberately **not** an imitation of an official government seal. Replace with the real SBA VetCert artwork when supplied and update the `<img src>` in `tools/build.py`. |
| 7 | **Lead capture + CRM routing** | `assets/js/config.js` | Dev working session — see configuration above. |

## Deployment

Any static host. Point the 404 handler at `404.html`, serve over HTTPS, and set
`https://ionic.contractors/` as the canonical origin (the `<link rel="canonical">` tags
already assume it). No server-side runtime is required.
