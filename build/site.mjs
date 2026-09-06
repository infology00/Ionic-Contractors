/* ------------------------------------------------------------------
   Single source of truth for company data, nav and capability lines.
   Everything the templates render comes from here.
------------------------------------------------------------------- */

export const site = {
  name: 'Ionic Contractors',
  legalName: 'Ionic Contractors LLC',
  parent: 'Ionic Group LLC',
  origin: 'https://ionic.contractors',
  tagline: 'SDVOSB Federal Contractor',
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

  /* Analytics — see OPEN-ITEMS.md. Left null on purpose: shipping a made-up
     measurement ID would silently send data nowhere. Set these and rebuild. */
  ga4Id: null,
  searchConsoleToken: null,
};

export const addressLine = `${site.address.street}, ${site.address.locality}, ${site.address.region} ${site.address.postal}`;

export const nav = [
  { href: '/',                            label: 'Home' },
  { href: '/about/',                      label: 'About' },
  { href: '/capabilities/',               label: 'Capabilities' },
  { href: '/federal-contracting/',        label: 'Federal Contracting' },
  { href: '/teaming/',                    label: 'Teaming' },
  { href: '/subcontractor-registration/', label: 'Subcontractors' },
  { href: '/capability-statement/',       label: 'Capability Statement' },
  { href: '/contact/',                    label: 'Contact' },
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

/* Capability lines. `primary` drives the GC-first emphasis on Home. */
export const capabilities = [
  {
    id: 'general-construction',
    primary: true,
    name: 'General Construction',
    short: 'General Construction',
    naics: ['236220', '236210'],
    blurb: 'Full-scope general construction for government facilities: new construction, renovation, repair, and build-out — managed to federal standards with proper documentation and compliance.',
    icon: 'construction',
  },
  {
    id: 'grounds',
    name: 'Grounds, Landscaping & Arboriculture',
    short: 'Grounds & Landscaping',
    naics: ['561730'],
    blurb: 'Grounds maintenance and landscaping for federal sites, including tree pruning and removal by qualified arborists.',
    icon: 'tree',
  },
  {
    id: 'facilities',
    name: 'Facilities Maintenance & Repair',
    short: 'Facilities Maintenance',
    naics: ['561790'],
    blurb: 'Recurring and on-call maintenance and repair services that keep government facilities operational and compliant.',
    icon: 'wrench',
  },
  {
    id: 'janitorial',
    name: 'Janitorial & Custodial Services',
    short: 'Janitorial & Support',
    naics: ['561720'],
    blurb: 'Custodial and janitorial services scoped to facility requirements, performed to schedule and to specification.',
    icon: 'spray',
  },
  {
    id: 'logistics',
    name: 'Logistics & Commodity Sourcing',
    short: 'Logistics & Sourcing',
    naics: [],
    naicsPending: true,
    blurb: 'Transportation support, distribution, and sourcing of commodities and supplies against agency requirements.',
    icon: 'route',
  },
  {
    id: 'consulting',
    name: 'Specialty Consulting',
    short: 'Specialty Consulting',
    naics: ['541350'],
    blurb: 'Specialty consulting and building inspection support where a requirement calls for targeted technical expertise.',
    icon: 'compass',
  },
];

/* Full NAICS list for the Federal Contracting page — GC primary first. */
export const naicsList = [
  { code: '236220', title: 'Commercial & Institutional Building Construction', primary: true },
  { code: '236210', title: 'Industrial Building Construction' },
  { code: '561790', title: 'Other Services to Buildings & Dwellings' },
  { code: '561720', title: 'Janitorial Services' },
  { code: '561730', title: 'Landscaping Services' },
  { code: '541350', title: 'Building Inspection Services' },
];

/* Dropdown option sets reused across the forms. */
export const options = {
  audience: ['Contracting Officer / Agency', 'Prime Contractor', 'Small Business / Sub', 'Other'],
  seeking: ['Set-Aside Award', 'Teaming / Subcontracting', 'Market Research', 'General Inquiry'],
  contactReason: ['Solicitation', 'Teaming', 'Capability Statement', 'General'],
  teamingRole: ['Subcontractor', 'Joint Venture (JV)', 'Mentor-Protégé'],
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
  if (url.endsWith('.html')) return url.replace(/^\//, '');
  return url.replace(/^\//, '').replace(/\/$/, '') + '.html';
}

/* Absolute url for canonicals, Open Graph and the sitemap. */
export function canonicalFor(url) {
  const file = flatten(url);
  return site.origin + '/' + (file === 'index.html' ? '' : file);
}
