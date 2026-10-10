/* ------------------------------------------------------------------
   Single source of truth for company data, nav and capability lines.
   Everything the templates render comes from here.

   Content source of truth: the Ionic Contractors Capability Statement
   (2026-10). Where this file and that document disagree, the
   capability statement wins.
------------------------------------------------------------------- */

import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const site = {
  name: 'Ionic Contractors',
  origin: 'https://ionic.contractors',
  tagline: 'Veteran-owned. Built for public and private work.',
  descriptor: 'Service-Disabled Veteran-Owned Small Business',
  phone: '252-546-7181',
  phoneHref: 'tel:+12525467181',
  email: 'service@ionic.contractors',
  address: {
    street: '7432 Wiggins Mill Rd',
    locality: 'Lucama',
    region: 'NC',
    postal: '27851',
    country: 'US',
  },
  ids: {
    uei: 'SUF6ZF8U5RA8',
    cage: '9KDA3',
  },

  /* Analytics — left null on purpose: shipping a made-up measurement ID
     would silently send data nowhere. Set these and rebuild. */
  ga4Id: null,
  searchConsoleToken: null,
};

export const addressLine = `${site.address.street}, ${site.address.locality}, ${site.address.region} ${site.address.postal}`;

/* ------------------------------------------------------------------
   CAPABILITY STATEMENT — direct download, not gated.
   Drop the supplied PDF at this path and rebuild: every "Capability
   Statement" link on the site switches to a direct download. Until the
   file exists, those links go to the capability-statement page, which
   offers it by email.
------------------------------------------------------------------- */
export const capStatement = {
  pdf: '/assets/docs/Ionic-Contractors-Capability-Statement-2026-10.pdf',
  label: 'Capability Statement',
  edition: '2026-10',
};
capStatement.available = existsSync(path.join(ROOT, capStatement.pdf));
capStatement.href = capStatement.available ? capStatement.pdf : '/capability-statement/';

/* ------------------------------------------------------------------
   NAVIGATION
   Short main menu (About · Capabilities · Markets · Teaming · Contact),
   with Subcontractors, the capability statement and the phone number in
   a small utility bar above it.
------------------------------------------------------------------- */
export const markets = [
  {
    id: 'federal',
    href: '/federal-contracting/',
    label: 'Federal',
    title: 'Federal agencies',
    blurb: 'SDVOSB set-aside and sole-source eligible, SAM-registered, with UEI and CAGE ready for the contract file.',
  },
  {
    id: 'state-local',
    href: '/state-local/',
    label: 'State & local',
    title: 'State, county & municipal',
    blurb: 'Construction, grounds and facility work for state agencies, counties, cities, school systems and public authorities.',
  },
  {
    id: 'private',
    href: '/private-sector/',
    label: 'Private sector',
    title: 'Private sector',
    blurb: 'Commercial, institutional and industrial owners, developers and general contractors who need a disciplined, documented partner.',
  },
];

export const nav = [
  { href: '/about/',        label: 'About' },
  { href: '/capabilities/', label: 'Capabilities', children: [
    { href: '/capabilities/#construction', label: 'Construction services', desc: 'General construction, environmental remediation, grounds' },
    { href: '/capabilities/#professional', label: 'Non-construction services', desc: 'Equipment, consulting, logistics and transportation' },
  ] },
  { href: '/markets/',      label: 'Markets', children: markets.map((m) => ({ href: m.href, label: m.label })) },
  { href: '/teaming/',      label: 'Teaming' },
  { href: '/contact/',      label: 'Contact' },
];

export const utilityNav = [
  { href: '/subcontractor-registration/', label: 'Subcontractors' },
  { href: capStatement.href, label: 'Capability Statement', download: capStatement.available },
];

export const legalNav = [
  { href: '/privacy-policy/',         label: 'Privacy Policy' },
  { href: '/terms-of-use/',           label: 'Terms of Use' },
  { href: '/accessibility-statement/',label: 'Accessibility Statement' },
];

export const registrations = [
  { label: 'SDVOSB Certified', detail: 'SBA VetCert' },
  { label: 'SAM Registered',   detail: 'sam.gov · active' },
  { label: 'UEI',              detail: site.ids.uei,  mono: true },
  { label: 'CAGE',             detail: site.ids.cage, mono: true },
];

/* ------------------------------------------------------------------
   CAPABILITY LINES — built from the capability statement's NAICS codes.
   `primary` drives the general-construction-led emphasis. The same
   array feeds the home cards, both marquees, the Capabilities page,
   the matrix, the Federal NAICS list, the footer, the structured data
   and the Execute-beat callouts in the hero animation.
------------------------------------------------------------------- */
export const capabilities = [
  {
    id: 'general-construction',
    primary: true,
    name: 'General Construction & Trades',
    short: 'General Construction & Trades',
    callout: 'General construction & trades',
    naics: ['236220', '236210', '238210', '238220', '238990'],
    blurb: 'New construction, renovation, repair, and build-out for public and private facilities, with electrical, plumbing, HVAC, and specialty trade work delivered under one general contractor.',
    points: [
      'New construction and additions',
      'Renovation, repair, and modernization',
      'Interior build-out and tenant improvements',
      'Electrical, plumbing, and HVAC',
      'Specialty trade work',
      'Documentation and compliance throughout',
    ],
    icon: 'construction',
  },
  {
    id: 'environmental-remediation',
    name: 'Environmental Remediation',
    short: 'Environmental Remediation',
    callout: 'Environmental remediation',
    naics: ['562910'],
    blurb: 'Site remediation and hazardous-material cleanup, managed to regulatory requirements with the documentation a closeout demands.',
    icon: 'remediation',
  },
  {
    id: 'grounds',
    name: 'Grounds, Landscaping & Vegetation Management',
    short: 'Grounds & Vegetation Management',
    callout: 'Grounds & vegetation management',
    naics: ['561730', '115112'],
    blurb: 'Grounds maintenance, landscaping, and vegetation management for campuses, facilities, rights-of-way, and installations.',
    icon: 'tree',
  },
  {
    id: 'equipment',
    name: 'Equipment Maintenance & Sourcing',
    short: 'Equipment Maintenance & Sourcing',
    callout: 'Equipment maintenance & sourcing',
    naics: ['811310', '423810', '423820'],
    blurb: 'Maintenance and repair of commercial and industrial equipment, and sourcing of construction, grounds, and agricultural machinery.',
    icon: 'wrench',
  },
  {
    id: 'consulting',
    name: 'Management & Technical Consulting',
    short: 'Management & Technical Consulting',
    callout: 'Management & technical consulting',
    naics: ['541611', '541618', '541690'],
    blurb: 'Program and project management support, management consulting, and technical consulting where a requirement calls for targeted expertise.',
    icon: 'compass',
  },
  {
    id: 'logistics',
    name: 'Logistics & Ground Transportation',
    short: 'Logistics & Ground Transportation',
    callout: 'Logistics & ground transportation',
    naics: ['541614', '485999'],
    blurb: 'Logistics and physical-distribution planning, and ground passenger transportation for crews, staff, and program support.',
    icon: 'route',
  },
];

/* Two top-level lines of business. Every capability carries one. */
export const capabilityGroups = [
  {
    id: 'construction',
    name: 'Construction services',
    blurb: 'Building, site, and environmental work delivered under one general contractor.',
    lines: ['general-construction', 'environmental-remediation', 'grounds'],
  },
  {
    id: 'professional',
    name: 'Non-construction services',
    blurb: 'Equipment, consulting, logistics, and transportation support that stands alone or rounds out a project.',
    lines: ['equipment', 'consulting', 'logistics'],
  },
];
capabilities.forEach((c) => { c.group = capabilityGroups.find((g) => g.lines.includes(c.id)).id; });
export const capsIn = (groupId) => capabilities.filter((c) => c.group === groupId);

/* Label lines for the hero honeycomb (one short phrase per line) */
export const hexLabels = {
  'general-construction': ['General', 'Construction', '& Trades'],
  'environmental-remediation': ['Environmental', 'Remediation'],
  grounds: ['Grounds &', 'Vegetation', 'Management'],
  equipment: ['Equipment', 'Maintenance', '& Sourcing'],
  consulting: ['Management &', 'Technical', 'Consulting'],
  logistics: ['Logistics &', 'Ground', 'Transportation'],
};

/* ------------------------------------------------------------------
   CONVERSION INTENTS: one button per destination per page.
   The header carries "Submit an RFP" on every page, so no other button
   may point at the RFP form; "Partner with us" is the second intent.
   The build audit fails if two buttons on a page share a destination.
------------------------------------------------------------------- */
export const intents = {
  rfp: { label: 'Submit an RFP', href: '/federal-contracting/#invite-to-bid' },
  partner: { label: 'Partner with us', href: '/teaming/#teaming-form' },
};

/* Full NAICS list for the Federal Contracting page — GC primary first. */
export const naicsList = [
  { code: '236220', title: 'Commercial and Institutional Building Construction', primary: true },
  { code: '236210', title: 'Industrial Building Construction' },
  { code: '238210', title: 'Electrical Contractors and Other Wiring Installation Contractors' },
  { code: '238220', title: 'Plumbing, Heating, and Air-Conditioning Contractors' },
  { code: '238990', title: 'All Other Specialty Trade Contractors' },
  { code: '562910', title: 'Remediation Services' },
  { code: '561730', title: 'Landscaping Services' },
  { code: '115112', title: 'Soil Preparation, Planting, and Cultivating' },
  { code: '811310', title: 'Commercial and Industrial Machinery and Equipment Repair and Maintenance' },
  { code: '423810', title: 'Construction and Mining Machinery and Equipment Merchant Wholesalers' },
  { code: '423820', title: 'Farm and Garden Machinery and Equipment Merchant Wholesalers' },
  { code: '541611', title: 'Administrative Management and General Management Consulting Services' },
  { code: '541618', title: 'Other Management Consulting Services' },
  { code: '541690', title: 'Other Scientific and Technical Consulting Services' },
  { code: '541614', title: 'Process, Physical Distribution, and Logistics Consulting Services' },
  { code: '485999', title: 'All Other Transit and Ground Passenger Transportation' },
];

/* Product Service Codes (federal) */
export const pscList = [
  { code: 'Z1DA', title: 'Maintenance of hospitals and infirmaries' },
  { code: 'Z2AA', title: 'Repair or alteration of office buildings' },
  { code: 'Z2DA', title: 'Repair or alteration of hospitals and infirmaries' },
  { code: 'F108', title: 'Hazardous substance removal, cleanup, and disposal' },
  { code: 'S208', title: 'Landscaping and groundskeeping services' },
  { code: 'J037', title: 'Maintenance and repair of agricultural machinery and equipment' },
  { code: 'J038', title: 'Maintenance and repair of construction, mining, and excavating equipment' },
  { code: 'R408', title: 'Program management and support services' },
];

/* ------------------------------------------------------------------
   LOCATIONS — matches the footprint-map beat in the hero animation.
   `x`/`y` are positions on the 1000 x 600 map artboard.
------------------------------------------------------------------- */
export const locations = [
  { id: 'nc', label: 'North Carolina', role: 'Headquarters', x: 815, y: 288, primary: true },
  { id: 'tx', label: 'Texas',          role: 'Field office', x: 470, y: 455 },
  { id: 'fl', label: 'Florida',        role: 'Field office', x: 778, y: 478 },
];

/* Delivery approach — mirrors the Mobilize / Execute / Close Out beats. */
export const delivery = [
  {
    id: 'mobilize',
    label: 'Mobilize',
    title: 'Plan the site, stage the crews.',
    body: 'Submittals, schedule, safety plan, and site logistics are locked before the first crew arrives. Equipment and vetted trade partners are staged where the work needs them.',
  },
  {
    id: 'execute',
    label: 'Execute',
    title: 'Build to the plan, document every step.',
    body: 'Daily supervision, quality control, and clear reporting keep the work on schedule and the owner informed. Every line of work is built to specification and documented as it goes.',
  },
  {
    id: 'close-out',
    label: 'Close out',
    title: 'Turn it over complete.',
    body: 'Punch lists closed, as-builts and warranties delivered, and a clean, zero-incident turnover. On time, on budget, and ready for use.',
  },
];

/* Differentiators strip. `bonding` is a slot: set a value and rebuild
   and it appears; while null it renders nothing. */
export const differentiators = [
  { id: 'veteran',  icon: 'shield',    title: 'Veteran-owned SDVOSB',      body: 'Certified through SBA VetCert and active in SAM.gov.' },
  { id: 'mobilize', icon: 'pin',       title: 'Nationwide mobilization',   body: 'North Carolina headquarters, Texas and Florida field offices, and a multi-state partner network.' },
  { id: 'network',  icon: 'users',     title: 'Vetted subcontractor network', body: 'Qualified trade partners we can call on quickly against a live requirement.' },
  { id: 'safety',   icon: 'hardhat',   title: 'Zero-incident safety',      body: 'Safety planned before mobilization and enforced every day on site.' },
];
export const bonding = null; // e.g. { title: 'Bonding capacity', body: '$X single / $Y aggregate' }

/* ------------------------------------------------------------------
   LEADERSHIP — the two principals from the capability statement
   (page 2). The section only renders when every entry is complete, so
   a half-filled card can never go live. Fill in the veteran principal
   from the capability statement and rebuild.
------------------------------------------------------------------- */
export const principals = [
  {
    name: null,            // veteran owner — from capability statement p.2
    role: 'Principal & Owner',
    veteran: true,
    bio: null,             // service background — from capability statement p.2
  },
  {
    name: 'Diego Leon',
    role: 'Principal / Business Development Lead',
    bio: null,             // from capability statement p.2
  },
];
export const leadershipReady = principals.every((p) => p.name && p.bio);

/* Project cards — built, hidden until projects are supplied. */
export const projects = [];

/* Dropdown option sets reused across the forms. */
export const options = {
  audience: ['Contracting Officer / Agency', 'State or Local Government', 'Prime Contractor', 'Private Owner / Developer', 'Small Business / Sub', 'Other'],
  seeking: ['Set-Aside Award', 'Teaming / Subcontracting', 'Market Research', 'General Inquiry'],
  contactReason: ['Solicitation', 'Teaming', 'Capability Statement', 'Private Project', 'General'],
  teamingRole: ['Subcontractor', 'Joint venture (JV)', 'Mentor-protégé'],
  certifications: ['SDVOSB', 'VOSB', 'WOSB / EDWOSB', '8(a)', 'HUBZone', 'Small Business', 'None'],
};

/* ------------------------------------------------------------------
   Pages are authored with directory-style urls ('/about/') because it
   reads well in the source. The site ships as flat .html files so it
   can be opened straight from disk, so both the output filename and
   the canonical url come from here.
------------------------------------------------------------------- */
export function flatten(url) {
  if (url === '/') return 'index.html';
  if (url.endsWith('.html') || url.endsWith('.pdf')) return url.replace(/^\//, '');
  return url.replace(/^\//, '').replace(/\/$/, '') + '.html';
}

/* Absolute url for canonicals, Open Graph and the sitemap. */
export function canonicalFor(url) {
  const file = flatten(url);
  return site.origin + '/' + (file === 'index.html' ? '' : file);
}
