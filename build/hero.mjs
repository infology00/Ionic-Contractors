/* ==================================================================
   HOME - SCROLL SEQUENCE: "FROM CONTRACT TO KEYS" (blueprint)
   ------------------------------------------------------------------
   One project followed from paperwork to handover, drawn like an
   architect's set: fine white linework on black, one orange accent.

     Contract   0-10%   the solicitation arrives; one key line is lit
     Mobilize  10-28%   the paper opens into a technical site plan:
                        grid, footprint, dimensions, staging markers
     Execute   28-58%   each capability floats in as a charged hex and
                        bonds into a honeycomb around the Ionic mark; the
     Close out 58-72%   one orange trace around the honeycomb; its cells light
                        falls and the windows light up: it is in use
     Footprint 72-86%   pull back to a dot-matrix US map: NC, TX, FL,
                        partner network
     Proof     86-96%   the drawing's title block; each credential is
                        checked off
     Resolve   96-100%  the real logo + CTA

   All copy is real HTML (SEO / Section 508); artwork is aria-hidden.
   With JS off or reduced motion, each beat is a static panel showing
   its final frame (the <symbol>s below). All geometry is generated
   here at build time; nothing is fetched at runtime.
================================================================== */
import { capabilities, capabilityGroups, hexLabels, locations, capStatement, site } from './site.mjs';
import { btn, esc, logoImg } from './components.mjs';

const W = 1000, H = 640;
const f = (n) => Math.round(n * 10) / 10;

/* ------------------------------------------------------------------
   US MAP: contiguous states outline (lon, lat), projected to the
   1000 x 640 artboard and filled with a dot matrix. Coarse on
   purpose: it only has to read as "the United States".
------------------------------------------------------------------- */
const US = [
  [-124.7,48.4],[-122.8,49.0],[-95.2,49.0],[-94.8,49.4],[-89.6,48.0],[-84.8,46.5],[-83.5,46.1],
  [-82.5,43.0],[-79.0,43.3],[-76.3,44.2],[-74.7,45.0],[-71.5,45.0],[-70.0,46.7],[-69.2,47.4],
  [-67.8,47.1],[-67.0,44.8],[-70.0,43.7],[-70.6,42.6],[-70.0,41.8],[-71.8,41.3],[-73.9,40.6],
  [-74.1,39.6],[-75.0,38.8],[-75.9,37.4],[-76.0,36.9],[-75.5,35.2],[-76.6,34.7],[-78.0,33.9],
  [-79.2,33.2],[-80.9,32.0],[-81.4,30.7],[-80.6,28.4],[-80.0,26.7],[-80.4,25.2],[-81.1,25.1],
  [-81.8,26.1],[-82.7,27.9],[-82.7,29.0],[-84.0,30.1],[-85.4,29.7],[-86.5,30.4],[-88.0,30.4],
  [-89.6,30.2],[-89.4,29.0],[-90.5,29.1],[-92.3,29.6],[-93.8,29.7],[-94.8,29.3],[-96.4,28.3],
  [-97.4,27.3],[-97.2,25.9],[-99.1,26.4],[-99.5,27.5],[-100.3,28.3],[-101.4,29.8],[-102.4,29.8],
  [-103.1,29.0],[-104.4,29.6],[-106.5,31.8],[-108.2,31.8],[-108.2,31.3],[-111.1,31.3],[-114.8,32.5],
  [-117.1,32.5],[-118.4,33.8],[-120.6,34.6],[-121.9,36.6],[-122.5,37.8],[-123.8,39.4],[-124.4,40.4],
  [-124.2,42.0],[-124.0,44.0],[-124.0,46.3],
];

const proj = (lon, lat) => [60 + (lon + 125) * 15.146, 80 + (49.5 - lat) * 19.22];

function inside(x, y, poly) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

/* Each dot is a zero-length segment with a round cap: one compact path
   for ~1,500 dots, styled entirely from CSS. */
function mapPath() {
  const poly = US.map(([lon, lat]) => proj(lon, lat));
  const step = 11;
  let d = '', n = 0;
  for (let row = 0, y = 70; y < 580; row++, y += step) {
    for (let x = 50 + (row % 2 ? step / 2 : 0); x < 960; x += step) {
      if (inside(x, y, poly)) { d += `M${f(x)} ${f(y)}h0`; n++; }
    }
  }
  return { d, n };
}

/* Locations → artboard. Partner network nodes are illustrative of a
   multi-state network, not a claim about specific partner sites. */
const LONLAT = { nc: [-78.0, 35.65], tx: [-98.6, 31.2], fl: [-81.7, 28.4] };
const hubs = locations.map((l) => ({ ...l, xy: proj(...LONLAT[l.id]) }));
const hubXY = Object.fromEntries(hubs.map((h) => [h.id, h.xy]));
const ncXY = hubXY.nc;

const NETWORK = [
  // [from, lon, lat, mobile?]
  ['nc', -78.6, 37.6, true], ['nc', -80.9, 33.9], ['nc', -83.4, 32.7, true], ['nc', -86.4, 35.8],
  ['nc', -82.8, 40.3, true], ['nc', -77.4, 40.9], ['nc', -76.8, 39.0], ['nc', -85.3, 37.6],
  ['fl', -86.8, 32.8], ['fl', -89.7, 32.4, true], ['fl', -84.3, 30.5],
  ['tx', -92.3, 31.0], ['tx', -97.4, 35.5, true], ['tx', -92.4, 34.8], ['tx', -106.1, 34.4],
  ['tx', -111.7, 34.3], ['tx', -105.5, 39.0], ['tx', -92.5, 38.4],
];

const network = NETWORK.map(([from, lon, lat, mobile]) => {
  const [x1, y1] = hubXY[from];
  const [x2, y2] = proj(lon, lat);
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const len = Math.hypot(x2 - x1, y2 - y1);
  // bow the line upward a little, proportional to its length
  const cx = mx, cy = my - Math.max(14, len * 0.22);
  return { d: `M${f(x1)} ${f(y1)}Q${f(cx)} ${f(cy)} ${f(x2)} ${f(y2)}`, x: f(x2), y: f(y2), mobile: !!mobile };
});

/* The document frame crops the artboard to its own area */
const SITE_VIEW = '150 96 700 448';

/* ==================================================================
   ARTWORK. Drawn like a technical illustration: real gradients for
   material and light, fine hairlines for construction lines, soft
   contact shadows, and one orange accent per beat. All gradients live
   in <defs> (gradientDefs below) and are shared by every layer.
================================================================== */

/* ---- The solicitation: a paper RFP on a small stack ---------------- */
const DOC = { x: 362, y: 118, w: 276, h: 360 };
const dl = (x, y, w, cls = 'seq-doc__line') => `<rect class="${cls}" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="2.6" rx="1.3"/>`;
function docSVG(attrs = '') {
  const { x, y, w, h } = DOC, L = x + 22, cx = x + w / 2, cy = y + h / 2;
  const para = (y0, widths) => widths.map((ww, k) => dl(L, y0 + k * 8, ww)).join('');
  return `<g class="seq-doc" ${attrs}>
  <ellipse class="seq-doc__shadow" cx="${f(cx + 10)}" cy="${f(y + h + 14)}" rx="${f(w * 0.62)}" ry="16" fill="url(#seq-shadow)"/>
  <rect class="seq-doc__back" x="${x}" y="${y}" width="${w}" height="${h}" rx="3" transform="rotate(5 ${cx} ${cy}) translate(16 8)"/>
  <rect class="seq-doc__back seq-doc__back--2" x="${x}" y="${y}" width="${w}" height="${h}" rx="3" transform="rotate(-3.5 ${cx} ${cy}) translate(-12 6)"/>
  <rect class="seq-doc__sheet" x="${x}" y="${y}" width="${w}" height="${h}" rx="3"/>
  <rect class="seq-doc__mono" x="${L}" y="${y + 22}" width="24" height="24" rx="2"/>
  <path class="seq-doc__mono-mark" d="M${L + 7} ${y + 29}h10M${L + 12} ${y + 29}v10M${L + 7} ${y + 39}h10"/>
  <text class="seq-doc__head" x="${L + 34}" y="${y + 32}">REQUEST FOR PROPOSAL</text>
  ${dl(L + 34, y + 38, 96)}
  <rect class="seq-doc__meta" x="${x + w - 52}" y="${y + 26}" width="30" height="8" rx="1.5"/>
  <line class="seq-doc__rule" x1="${L}" y1="${y + 60}" x2="${x + w - 22}" y2="${y + 60}"/>
  <text class="seq-doc__h" x="${L}" y="${y + 80}">1. SCOPE OF WORK</text>
  ${para(y + 88, [232, 220, 232, 176])}
  <g class="seq-doc__flag">
    <rect class="seq-doc__swipe" x="${L - 6}" y="${y + 126}" width="${w - 32}" height="36" rx="2"/>
    <rect class="seq-doc__swipe-edge" x="${L - 6}" y="${y + 126}" width="3" height="36"/>
    <text class="seq-doc__h seq-doc__h--flag" x="${L + 4}" y="${y + 140}">2. SET-ASIDE</text>
    ${dl(L + 4, y + 147, 196, 'seq-doc__flag-line')}${dl(L + 4, y + 155, 150, 'seq-doc__flag-line')}
  </g>
  <text class="seq-doc__h" x="${L}" y="${y + 182}">3. PERIOD OF PERFORMANCE</text>
  ${para(y + 190, [232, 210, 120])}
  <g class="seq-doc__table">
    <rect class="seq-doc__thead" x="${L}" y="${y + 226}" width="${w - 44}" height="14"/>
    <rect class="seq-doc__tframe" x="${L}" y="${y + 226}" width="${w - 44}" height="56"/>
    <line class="seq-doc__tline" x1="${L}" y1="${y + 254}" x2="${x + w - 22}" y2="${y + 254}"/>
    <line class="seq-doc__tline" x1="${L + 46}" y1="${y + 226}" x2="${L + 46}" y2="${y + 282}"/>
    <line class="seq-doc__tline" x1="${L + 170}" y1="${y + 226}" x2="${L + 170}" y2="${y + 282}"/>
    ${dl(L + 8, y + 232, 26)}${dl(L + 54, y + 232, 70)}${dl(L + 178, y + 232, 40)}
    ${dl(L + 8, y + 245, 18)}${dl(L + 54, y + 245, 100)}${dl(L + 178, y + 245, 30)}
    ${dl(L + 8, y + 268, 18)}${dl(L + 54, y + 268, 84)}${dl(L + 178, y + 268, 34)}
  </g>
  <line class="seq-doc__sign" x1="${L}" y1="${y + h - 34}" x2="${L + 110}" y2="${y + h - 34}"/>
  <text class="seq-doc__caption" x="${L}" y="${y + h - 23}">CONTRACTING OFFICER</text>
  <line class="seq-doc__sign" x1="${x + w - 112}" y1="${y + h - 34}" x2="${x + w - 22}" y2="${y + h - 34}"/>
  <text class="seq-doc__caption" x="${x + w - 112}" y="${y + h - 23}">DATE</text>
</g>`;
}

/* ==================================================================
   EXECUTE: the ionic honeycomb (net layer, artboard coordinates)
   Each capability floats in as a charged cell, its orbit ring spinning,
   and bonds to the Ionic mark at the center. Construction lines dock
   on the left, professional and support lines on the right.
================================================================== */
const HC = { x: 500, y: 320 }, HR = 106, HD = Math.sqrt(3) * HR + 9;
const HEX_ANGLE = { 'general-construction': 240, 'environmental-remediation': 180, grounds: 120, equipment: 300, consulting: 0, logistics: 60 };
const hexPts = (cx, cy, r) => Array.from({ length: 6 }, (_, k) => {
  const a = (Math.PI / 180) * (60 * k - 90);
  return f(cx + r * Math.cos(a)) + ',' + f(cy + r * Math.sin(a));
}).join(' ');

function ionSVG(c, i) {
  const a = (Math.PI / 180) * HEX_ANGLE[c.id];
  const x = f(HC.x + HD * Math.cos(a)), y = f(HC.y + HD * Math.sin(a));
  const lines = hexLabels[c.id] || [c.short];
  const top = y - ((lines.length - 1) * 20) / 2 + 14;
  const tspans = lines.map((l, k) => `<tspan x="${x}" dy="${k ? 20 : 0}">${esc(l)}</tspan>`).join('');
  return `<g class="seq-ion seq-ion--${c.group}" data-ion="${i}" data-x="${x}" data-y="${y}">
      <ellipse class="seq-ion__orbit" cx="${x}" cy="${y}" rx="${HR + 26}" ry="${f((HR + 26) * 0.34)}" transform="rotate(-24 ${x} ${y})"/>
      <polygon class="seq-ion__charge" points="${hexPts(x, y, HR + 5)}"/>
      <polygon class="seq-ion__hex" points="${hexPts(x, y, HR - 2)}"/>
      <polygon class="seq-ion__lit" points="${hexPts(x, y, HR - 2)}"/>
      <polygon class="seq-ion__inset" points="${hexPts(x, y, HR - 11)}"/>
      <text class="seq-ion__num" x="${x}" y="${f(top - 30)}">${String(i + 1).padStart(2, '0')}</text>
      <text class="seq-ion__label" x="${x}" y="${f(top)}">${tspans}</text>
    </g>`;
}

/* CLOSE OUT: the honeycomb's outer edge, for the one orange trace. Each
   outer cell contributes its four outward corners, walked in order. */
const outlineD = 'M' + [0, 60, 120, 180, 240, 300].flatMap((t) => {
  const cx = HC.x + HD * Math.cos((Math.PI / 180) * t), cy = HC.y + HD * Math.sin((Math.PI / 180) * t), r = HR + 8;
  return [t - 90, t - 30, t + 30, t + 90].map((v) => [cx + r * Math.cos((Math.PI / 180) * v), cy + r * Math.sin((Math.PI / 180) * v)]);
}).map(([x, y]) => f(x) + ' ' + f(y)).join('L') + 'Z';
const outlineSVG = (cls = '') => `<path class="seq-outline ${cls}" data-g="outline" d="${outlineD}" pathLength="1"/>`;

const honeySVG = (staticAll = false) => `<g class="seq-honey${staticAll ? ' is-static' : ''}" data-g="honey">
  <polygon class="seq-ion__halo" points="${hexPts(HC.x, HC.y, HR + 14)}"/>
  <g class="seq-ion seq-ion--core" data-core>
    <polygon class="seq-ion__hex" points="${hexPts(HC.x, HC.y, HR - 2)}"/>
    <image href="/assets/img/brand/mark-160.webp" x="${HC.x - 40}" y="${HC.y - 45}" width="80" height="90"/>
  </g>
  ${capabilities.map(ionSVG).join('')}
</g>`;

/* ---- Mobilize: the honeycomb as a blueprint ------------------------
   Artboard coordinates, on the same center as the honeycomb, so each
   dashed slot here is exactly where its capability docks in Execute. */
const LETTERS = 'ABCDEFG';
const slotXY = () => capabilities.map((c) => {
  const a = (Math.PI / 180) * HEX_ANGLE[c.id];
  return [HC.x + HD * Math.cos(a), HC.y + HD * Math.sin(a)];
});

function planSVG(attrs = '') {
  /* Drawing grid, fading out from the center */
  const X0 = 116, X1 = 884, Y0 = 8, Y1 = 632, STEP = 24;
  const fade = (d, m) => Math.max(0.12, 1 - (d / m) * 0.85).toFixed(2);
  let grid = '';
  for (let y = Y0; y <= Y1; y += STEP) {
    const major = Math.round((y - HC.y) / STEP) % 4 === 0;
    grid += `<line class="seq-plan__grid${major ? '' : ' seq-plan__grid--minor'}" x1="${X0}" y1="${y}" x2="${X1}" y2="${y}" pathLength="1" opacity="${fade(Math.abs(y - HC.y), 320)}"/>`;
  }
  for (let x = X0; x <= X1; x += STEP) {
    const major = Math.round((x - HC.x) / STEP) % 4 === 0;
    grid += `<line class="seq-plan__grid${major ? '' : ' seq-plan__grid--minor'}" x1="${x}" y1="${Y0}" x2="${x}" y2="${Y1}" pathLength="1" opacity="${fade(Math.abs(x - HC.x), 380)}"/>`;
  }

  /* Slots: one dashed cell per capability, plus the core */
  const slots = slotXY();
  const slotSVG = slots.map(([x, y], i) => `<polygon class="seq-plan__slot" points="${hexPts(x, y, HR - 2)}"/>
      <text class="seq-plan__slot-num" x="${f(x)}" y="${f(y + 36)}">${String(i + 1).padStart(2, '0')}</text>`).join('') +
    `<polygon class="seq-plan__slot seq-plan__slot--core" points="${hexPts(HC.x, HC.y, HR - 2)}"/>
      <polygon class="seq-plan__slot-inner" points="${hexPts(HC.x, HC.y, HR - 24)}"/>`;

  /* Grid bubbles on the cell columns and rows, a north arrow, and an
     overall dimension with ticks */
  const cols = [...new Set(slots.map(([x]) => Math.round(x)).concat(HC.x))].sort((a, b) => a - b);
  const rows = [...new Set(slots.map(([, y]) => Math.round(y)).concat(HC.y))].sort((a, b) => a - b);
  const top = HC.y - HD * 0.866 - HR - 34, left = HC.x - HD - HR - 34;
  const bubble = (cx, cy, t) => `<g class="seq-plan__bubble"><circle cx="${f(cx)}" cy="${f(cy)}" r="11"/><text x="${f(cx)}" y="${f(cy)}">${t}</text></g>`;
  const guide = (x1, y1, x2, y2, cls = 'seq-plan__fine') => `<line class="${cls}" x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}"/>`;
  const bubbles = cols.map((x, i) => guide(x, top + 11, x, HC.y + HD * 0.866 + HR) + bubble(x, top, LETTERS[i])).join('') +
    rows.map((y, i) => guide(left + 11, y, HC.x + HD + HR, y) + bubble(left, y, i + 1)).join('');
  const span = HD + HR * 0.866, dy = HC.y + HD * 0.866 + HR + 26;
  const tick = (x, y) => `<line class="seq-plan__dim seq-plan__tick" x1="${f(x - 5)}" y1="${f(y + 5)}" x2="${f(x + 5)}" y2="${f(y - 5)}"/>`;
  const dims = guide(HC.x - span, dy, HC.x + span, dy, 'seq-plan__dim') + tick(HC.x - span, dy) + tick(HC.x + span, dy) +
    guide(HC.x - span, dy - 20, HC.x - span, dy + 6, 'seq-plan__dim') + guide(HC.x + span, dy - 20, HC.x + span, dy + 6, 'seq-plan__dim');
  const nx = HC.x + HD + HR + 20, ny = top;
  const north = `<g class="seq-plan__north"><circle cx="${f(nx)}" cy="${f(ny)}" r="15"/><circle class="seq-plan__north-in" cx="${f(nx)}" cy="${f(ny)}" r="2"/><path d="M${f(nx)} ${f(ny - 17)}L${f(nx + 6)} ${f(ny + 2)}L${f(nx)} ${f(ny - 2)}L${f(nx - 6)} ${f(ny + 2)}Z"/><text x="${f(nx)}" y="${f(ny - 26)}">N</text></g>`;

  return `<g class="seq-plan" ${attrs}>
    <g class="seq-plan__grids" data-g="grid">${grid}</g>
    <g class="seq-plan__annot" data-g="annot">${bubbles}${dims}${north}${slotSVG}</g>
    <g data-g="foot">
      <path class="seq-plan__foot" d="${outlineD}" pathLength="1"/>
      <path class="seq-plan__hatch" d="${outlineD}" fill="url(#seq-hatch)"/>
    </g>
  </g>`;
}
/* Hatch as one pattern fill: far cheaper to paint than clipped lines */
const hatchDef = () => `<pattern id="seq-hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="10" stroke="#F3F4F6" stroke-opacity=".07" stroke-width="1"/></pattern>`;

/* Staging: a crew pin drops onto each slot; the core gets the one orange pin */
const markersSVG = () => {
  const pin = ([x, y], cls) => `<g class="seq-marker ${cls}" data-marker>
    <ellipse class="seq-marker__base" cx="${f(x)}" cy="${f(y)}" rx="12" ry="5"/>
    <path class="seq-marker__pin" d="M${f(x)} ${f(y)}c-1.6-7-10-11-10-19a10 10 0 0 1 20 0c0 8-8.4 12-10 19z"/>
    <circle class="seq-marker__dot" cx="${f(x)}" cy="${f(y - 19)}" r="3.8"/>
  </g>`;
  return `<g class="seq-markers" data-g="markers">${slotXY().map((p) => pin([p[0], p[1] + 8], 'seq-marker--crew')).join('')}${pin([HC.x, HC.y + 8], '')}</g>`;
};

/* Close out: a soft light behind the finished honeycomb */
const duskSVG = (attrs = '') => `<g class="seq-dusk" ${attrs}>
  <ellipse cx="${HC.x}" cy="${HC.y}" rx="420" ry="300" fill="url(#seq-glow)"/>
</g>`;

/* Shared gradients and clips */
const gradientDefs = `
  <radialGradient id="seq-glow"><stop offset="0" stop-color="#F3F4F6" stop-opacity=".12"/><stop offset="1" stop-color="#F3F4F6" stop-opacity="0"/></radialGradient>
  <linearGradient id="seq-paper" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="#FAFAFB"/><stop offset="1" stop-color="#E3E5E9"/></linearGradient>
  <linearGradient id="seq-paper-back" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#C9CCD2"/><stop offset="1" stop-color="#9FA3AB"/></linearGradient>
  <linearGradient id="seq-ion-c" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stop-color="#43434B"/><stop offset="1" stop-color="#26262B"/></linearGradient>
  <linearGradient id="seq-ion-p" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stop-color="#26262C"/><stop offset="1" stop-color="#121215"/></linearGradient>
  <linearGradient id="seq-ion-core" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#DDE0E5"/></linearGradient>
  <linearGradient id="seq-ion-lit" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#F3F4F6" stop-opacity=".2"/><stop offset="1" stop-color="#F3F4F6" stop-opacity=".04"/></linearGradient>
  <linearGradient id="seq-swipe" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FC5809" stop-opacity=".28"/><stop offset="1" stop-color="#FC5809" stop-opacity=".1"/></linearGradient>
  ${hatchDef()}`;

/* ==================================================================
   PROOF: the drawing's title block (net layer, artboard coordinates)
================================================================== */
export const proofs = [
  { label: 'SDVOSB certified', detail: 'SBA VetCert', tbLabel: 'SDVOSB', tbValue: 'SBA VETCERT' },
  { label: 'SAM.gov registered', detail: 'Active', tbLabel: 'SAM.GOV', tbValue: 'ACTIVE' },
  { label: 'UEI', detail: site.ids.uei, code: true, tbLabel: 'UEI', tbValue: site.ids.uei },
  { label: 'CAGE', detail: site.ids.cage, code: true, tbLabel: 'CAGE', tbValue: site.ids.cage },
  { label: 'NAICS', detail: '236220 primary', code: true, tbLabel: 'NAICS', tbValue: '236220' },
  { label: 'Zero-incident safety', detail: 'Planned before mobilization', tbLabel: 'SAFETY', tbValue: 'ZERO-INCIDENT' },
  { label: '3 offices', detail: 'NC, TX, FL + partners', tbLabel: 'OFFICES', tbValue: 'NC / TX / FL' },
];
const TB = { x: 230, y: 92, w: 540, head: 72, row: 52 };
const tbRowY = proofs.map((_, i) => TB.y + TB.head + i * TB.row);
const TBH = TB.head + proofs.length * TB.row;

const proofSVG = (staticAll = false) => `<g class="seq-tb${staticAll ? ' is-static' : ''}" data-g="proof">
  <rect class="seq-tb__frame" x="${TB.x}" y="${TB.y}" width="${TB.w}" height="${TBH}" pathLength="1"/>
  <text class="seq-tb__head" x="${TB.x + 30}" y="${TB.y + 44}">IONIC CONTRACTORS</text>
  <rect class="seq-tb__lock" data-g="plock" x="${TB.x}" y="${tbRowY[0]}" width="${TB.w}" height="${TB.row}"/>
  ${proofs.map((p, i) => {
    const y = tbRowY[i];
    const bx = TB.x + TB.w - 52, by = y + TB.row / 2 - 11;
    return `<g class="seq-tb__row${staticAll ? ' is-locked' : ''}" data-prow="${i}">
      <line class="seq-tb__rule" x1="${TB.x}" y1="${y}" x2="${TB.x + TB.w}" y2="${y}"/>
      <text class="seq-tb__label" x="${TB.x + 30}" y="${y + TB.row / 2 + 5}">${esc(p.tbLabel)}</text>
      <text class="seq-tb__value" x="${TB.x + 190}" y="${y + TB.row / 2 + 6}">${esc(p.tbValue)}</text>
      <rect class="seq-tb__box" x="${bx}" y="${by}" width="22" height="22" rx="2"/>
      <path class="seq-tb__check" d="M${bx + 5} ${by + 11.5}l4.4 4.4 8-9" pathLength="1"/>
    </g>`;
  }).join('')}
</g>`;

/* ---- Network (footprint beat) ------------------------------------- */
const netSVG = () => `<g class="seq-net">${network.map((n) => `<path class="seq-net__line${n.mobile ? '' : ' seq-desktop'}" d="${n.d}" pathLength="1"/>`).join('')}</g>
  <g class="seq-net-nodes">${network.map((n) => `<circle class="seq-net__node${n.mobile ? '' : ' seq-desktop'}" cx="${n.x}" cy="${n.y}" r="3.2"/>`).join('')}</g>
  ${hubs.map((h) => `<g class="seq-hub" data-hub="${h.id}">
    <circle class="seq-hub__pulse" cx="${f(h.xy[0])}" cy="${f(h.xy[1])}" r="8"/>
    <circle class="seq-hub__dot" cx="${f(h.xy[0])}" cy="${f(h.xy[1])}" r="${h.primary ? 8 : 6.5}"/>
  </g>`).join('')}`;

/* ------------------------------------------------------------------
   PUBLIC: <defs> sprite + the sequence section
------------------------------------------------------------------- */
export function heroDefs() {
  const map = mapPath();
  return `<svg class="seq-defs" width="0" height="0" aria-hidden="true" focusable="false">
  <defs>
    ${gradientDefs}
    <path id="seq-us" d="${map.d}"/>
    <symbol id="frame-open" viewBox="${SITE_VIEW}">${docSVG()}</symbol>
    <symbol id="frame-mobilize" viewBox="0 0 ${W} ${H}">${planSVG()}${markersSVG()}</symbol>
    <symbol id="frame-execute" viewBox="0 0 ${W} ${H}">${honeySVG(true)}</symbol>
    <symbol id="frame-closeout" viewBox="0 0 ${W} ${H}">${duskSVG()}<g class="is-lit">${honeySVG(true)}</g>${outlineSVG('is-static')}</symbol>
    <symbol id="frame-footprint" viewBox="0 0 ${W} ${H}"><use href="#seq-us" class="seq-us"/>${netSVG()}</symbol>
    <symbol id="frame-proof" viewBox="0 0 ${W} ${H}">${proofSVG(true)}</symbol>
  </defs>
</svg>`;
}

/* The outer viewBox is the symbol's own size at the origin; the symbol
   carries the crop. */
const SITE_FRAME = '0 0 ' + SITE_VIEW.split(' ').slice(2).join(' ');
const frameSVG = (id, view = SITE_FRAME) =>
  `<div class="seq__frame" aria-hidden="true"><svg viewBox="${view}" focusable="false"><use href="#${id}"/></svg></div>`;

export function heroSequence() {
  const capHref = capStatement.href;
  const capAttrs = capStatement.available ? 'download' : '';
  const capLabel = capStatement.available ? 'Download the capability statement' : 'Get the capability statement';
  const svgOpen = (extra = '') =>
    `<svg class="seq__svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" focusable="false" ${extra}>`;

  return `${heroDefs()}
<section class="seq theme-dark" id="top" data-seq aria-label="From contract to keys: how Ionic delivers a project">
  <div class="seq__pin" data-seq-pin>

    <!-- Three stacked layers sharing one coordinate system. Moving a
         whole layer is a GPU transform; only the small layer that is
         actually changing ever repaints. -->
    <div class="seq__visual" aria-hidden="true">
      <div class="seq__layer seq__layer--map" data-layer="map">${svgOpen()}<use href="#seq-us" class="seq-us"/></svg></div>
      <div class="seq__layer seq__layer--net" data-layer="net">${svgOpen(`data-seq-svg data-nc="${f(ncXY[0])} ${f(ncXY[1])}" data-tb-rows="${tbRowY.join(',')}" data-tb-center="${TB.x + TB.w / 2} ${TB.y + TBH / 2}"`)}
        <g data-g="net">${netSVG()}</g>
        ${proofSVG()}
      </svg></div>
      <!-- The blueprint sits on its own layer (same camera as the site) so
           the pins dropping onto it never repaint the drawing. -->
      <div class="seq__layer seq__layer--site" data-layer="plan">${svgOpen()}
        ${planSVG('data-g="plan"')}
        ${markersSVG()}
      </svg></div>
      <div class="seq__layer seq__layer--site" data-layer="site">${svgOpen()}
        ${duskSVG('data-g="dusk"')}
        ${honeySVG()}
        ${outlineSVG()}
        ${docSVG('data-g="doc"')}
      </svg></div>
    </div>

    <div class="seq__copy wrap">
      <div class="seq__beats">

        <div class="seq__beat" data-beat="open">
          ${frameSVG('frame-open')}
          <div class="seq__text">
            <p class="seq__kicker">${esc(site.descriptor)}</p>
            <h1 class="seq__title seq__title--hero" data-split>From contract to keys.</h1>
            <p class="seq__sub">Hand us the solicitation. We hand back a finished facility, for federal agencies, state and local governments, and private owners.</p>
            <ul class="seq__creds" aria-label="Registrations">
              <li>SDVOSB certified</li><li>SAM registered</li><li>UEI <span class="code">${site.ids.uei}</span></li><li>CAGE <span class="code">${site.ids.cage}</span></li>
            </ul>
          </div>
        </div>

        <div class="seq__beat" data-beat="mobilize">
          ${frameSVG('frame-mobilize', `0 0 ${W} ${H}`)}
          <div class="seq__text">
            <p class="seq__label"><span class="seq__num">01</span>Mobilize</p>
            <h2 class="seq__title">The contract becomes a plan.</h2>
            <p class="seq__sub">Schedule, safety plan, and logistics are locked before crews and equipment arrive. Every trade has its place before day one.</p>
          </div>
        </div>

        <div class="seq__beat" data-beat="execute">
          ${frameSVG('frame-execute', `0 0 ${W} ${H}`)}
          <div class="seq__text">
            <p class="seq__label"><span class="seq__num">02</span>Execute</p>
            <h2 class="seq__title">Every capability, bonded into one team.</h2>
            <div class="seq__groups">
              ${capabilityGroups.map((g) => `<div class="seq__group">
                <p class="seq__group-label">${esc(g.name)}</p>
                <ol class="seq__caps">
                  ${capabilities.map((c, i) => (c.group !== g.id ? '' : `<li data-cap="${i}"><span class="seq__cap-num">${String(i + 1).padStart(2, '0')}</span><span>${esc(c.callout)}</span></li>`)).join('')}
                </ol>
              </div>`).join('')}
            </div>
          </div>
        </div>

        <div class="seq__beat" data-beat="closeout">
          ${frameSVG('frame-closeout', `0 0 ${W} ${H}`)}
          <div class="seq__text">
            <p class="seq__label"><span class="seq__num">03</span>Close out</p>
            <h2 class="seq__title">The finished project becomes yours.</h2>
            <p class="seq__sub">Handed over complete, on time and on budget, with zero incidents and every record in your file. Every capability accounted for.</p>
          </div>
        </div>

        <div class="seq__beat" data-beat="footprint">
          ${frameSVG('frame-footprint', `0 0 ${W} ${H}`)}
          <div class="seq__text">
            <p class="seq__label"><span class="seq__num">04</span>Footprint</p>
            <h2 class="seq__title">Then we do it again, nationwide.</h2>
            <ul class="seq__locs">
              ${locations.map((l) => `<li data-loc="${l.id}"><strong>${esc(l.label)}</strong><span>${esc(l.role)}</span></li>`).join('')}
              <li data-loc="network"><strong>Multi-state</strong><span>Partner network</span></li>
            </ul>
            <ul class="seq__sectors" aria-label="Sectors served">
              <li>Federal</li><li>State</li><li>County &amp; municipal</li><li>Private</li>
            </ul>
          </div>
        </div>

        <div class="seq__beat" data-beat="proof">
          ${frameSVG('frame-proof', `0 0 ${W} ${H}`)}
          <div class="seq__text">
            <p class="seq__label"><span class="seq__num">05</span>Proof</p>
            <h2 class="seq__title">Every piece of it can be verified.</h2>
            <ul class="seq__proofs">
              ${proofs.map((p, i) => `<li data-proof="${i}"><strong>${esc(p.label)}</strong><span${p.code ? ' class="code"' : ''}>${esc(p.detail)}</span></li>`).join('')}
            </ul>
          </div>
        </div>

      </div>
    </div>

    <div class="seq__resolve theme-light" data-beat="resolve">
      <div class="seq__resolve-inner wrap">
        ${logoImg('color', { cls: 'seq__logo', width: 480, sizes: '(min-width: 48rem) 26rem, 72vw', alt: 'Ionic Contractors' })}
        <p class="seq__resolve-line">One accountable partner, from contract to keys.</p>
        <div class="btn-row seq__cta">
          ${btn(capHref, capLabel, { variant: 'primary', attrs: capAttrs })}
        </div>
      </div>
    </div>

    <ol class="seq__rail" aria-hidden="true">
      ${['Mobilize', 'Execute', 'Close out', 'Footprint', 'Proof'].map((l, i) => `<li data-rail="${i + 1}"><span>${l}</span></li>`).join('')}
    </ol>
  </div>
</section>`;
}
