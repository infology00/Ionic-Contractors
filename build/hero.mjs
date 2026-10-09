/* ==================================================================
   HOME - SCROLL SEQUENCE: "FROM CONTRACT TO KEYS" (blueprint)
   ------------------------------------------------------------------
   One project followed from paperwork to handover, drawn like an
   architect's set: fine white linework on black, one orange accent.

     Contract   0-10%   the solicitation arrives; one key line is lit
     Mobilize  10-28%   the paper opens into a technical site plan:
                        grid, footprint, dimensions, staging markers
     Execute   28-58%   the building rises floor by floor (one floor per
                        capability line), wireframe first, then glass
     Close out 58-72%   one orange trace around the building; dusk
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
import { capabilities, locations, capStatement, site } from './site.mjs';
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

/* ==================================================================
   SITE DRAWING (beats 1-4): isometric, artboard coordinates
================================================================== */
const SITE_VIEW = '150 96 700 448';
const ISO = { ox: 500, oy: 412, c: 0.866, s: 0.5 };
const iso = (x, y, z = 0) => [ISO.ox + (x - y) * ISO.c, ISO.oy + (x + y) * ISO.s - z];
const pt = (q) => iso(...q).map(f).join(',');
const pts = (...q) => q.map(pt).join(' ');
const seg = (a, b, cls, extra = '') => {
  const [x1, y1] = iso(...a), [x2, y2] = iso(...b);
  return `<line class="${cls}" x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" ${extra}/>`;
};

const BX = 120, BY = 70, FH = 34, FLOORS = capabilities.length, TOP = FLOORS * FH, PARAPET = 8;
const GX = 245, GY = 175, GS = 35;

/* ---- The solicitation -------------------------------------------- */
const DOC = { x: 385, y: 150, w: 230, h: 304 };
const docLines = [
  [DOC.x + 22, DOC.y + 64, 150], [DOC.x + 22, DOC.y + 80, 186], [DOC.x + 22, DOC.y + 96, 120],
  [DOC.x + 22, DOC.y + 176, 186], [DOC.x + 22, DOC.y + 192, 160], [DOC.x + 22, DOC.y + 208, 178],
  [DOC.x + 22, DOC.y + 224, 132], [DOC.x + 22, DOC.y + 240, 170],
];
const docSVG = (attrs = '') => `<g class="seq-doc" ${attrs}>
  <rect class="seq-doc__sheet" x="${DOC.x}" y="${DOC.y}" width="${DOC.w}" height="${DOC.h}" rx="3"/>
  <rect class="seq-doc__title" x="${DOC.x + 22}" y="${DOC.y + 26}" width="104" height="12" rx="1.5"/>
  <rect class="seq-doc__meta" x="${DOC.x + DOC.w - 70}" y="${DOC.y + 26}" width="48" height="12" rx="1.5"/>
  ${docLines.map(([x, y, w]) => `<rect class="seq-doc__line" x="${x}" y="${y}" width="${w}" height="5" rx="2.5"/>`).join('')}
  <g class="seq-doc__flag">
    <rect class="seq-doc__flag-box" x="${DOC.x + 16}" y="${DOC.y + 116}" width="${DOC.w - 32}" height="40" rx="2" pathLength="1"/>
    <rect class="seq-doc__flag-line" x="${DOC.x + 30}" y="${DOC.y + 128}" width="118" height="5" rx="2.5"/>
    <rect class="seq-doc__flag-line" x="${DOC.x + 30}" y="${DOC.y + 140}" width="82" height="5" rx="2.5"/>
  </g>
  <line class="seq-doc__sign" x1="${DOC.x + 22}" y1="${DOC.y + 278}" x2="${DOC.x + 120}" y2="${DOC.y + 278}"/>
</g>`;

/* ---- Site plan: grid, footprint, dimensions, bubbles, north -------- */
const LETTERS = 'ABCDEFG';
const planSVG = (attrs = '') => {
  let grid = '';
  for (let y = -GY; y <= GY; y += GS) {
    grid += seg([-GX, y, 0], [GX, y, 0], 'seq-plan__grid', `pathLength="1" opacity="${(1 - (Math.abs(y) / GY) * 0.7).toFixed(2)}"`);
  }
  for (let x = -GX; x <= GX; x += GS) {
    grid += seg([x, -GY, 0], [x, GY, 0], 'seq-plan__grid', `pathLength="1" opacity="${(1 - (Math.abs(x) / GX) * 0.7).toFixed(2)}"`);
  }
  const bubbles = [-210, -140, -70, 0, 70, 140, 210].map((x, i) => {
    const [cx, cy] = iso(x, -GY - 24, 0);
    return `<g class="seq-plan__bubble"><circle cx="${f(cx)}" cy="${f(cy)}" r="9"/><text x="${f(cx)}" y="${f(cy)}">${LETTERS[i]}</text></g>`;
  }).join('') + [-140, -70, 0, 70, 140].map((y, i) => {
    const [cx, cy] = iso(-GX - 24, y, 0);
    return `<g class="seq-plan__bubble"><circle cx="${f(cx)}" cy="${f(cy)}" r="9"/><text x="${f(cx)}" y="${f(cy)}">${i + 1}</text></g>`;
  }).join('');
  const dims = [
    seg([-BX, BY + 8, 0], [-BX, BY + 54, 0], 'seq-plan__dim'), seg([BX, BY + 8, 0], [BX, BY + 54, 0], 'seq-plan__dim'),
    seg([-BX, BY + 46, 0], [BX, BY + 46, 0], 'seq-plan__dim'),
    seg([-BX - 6, BY + 40, 0], [-BX + 6, BY + 52, 0], 'seq-plan__dim'), seg([BX - 6, BY + 40, 0], [BX + 6, BY + 52, 0], 'seq-plan__dim'),
    seg([BX + 8, BY, 0], [BX + 54, BY, 0], 'seq-plan__dim'), seg([BX + 8, -BY, 0], [BX + 54, -BY, 0], 'seq-plan__dim'),
    seg([BX + 46, -BY, 0], [BX + 46, BY, 0], 'seq-plan__dim'),
    seg([BX + 40, -BY - 6, 0], [BX + 52, -BY + 6, 0], 'seq-plan__dim'), seg([BX + 40, BY - 6, 0], [BX + 52, BY + 6, 0], 'seq-plan__dim'),
  ].join('');
  const [nx, ny] = iso(-GX + 20, -GY + 10, 0);
  const north = `<g class="seq-plan__north"><circle cx="${f(nx)}" cy="${f(ny - 40)}" r="13"/><path d="M${f(nx)} ${f(ny - 52)}L${f(nx + 6)} ${f(ny - 34)}L${f(nx)} ${f(ny - 38)}L${f(nx - 6)} ${f(ny - 34)}Z"/></g>`;
  return `<g class="seq-plan" ${attrs}>
    <g class="seq-plan__grids" data-g="grid">${grid}</g>
    <polygon class="seq-plan__foot" data-g="foot" points="${pts([-BX, -BY, 0], [BX, -BY, 0], [BX, BY, 0], [-BX, BY, 0])}" pathLength="1"/>
    <g class="seq-plan__annot" data-g="annot">${dims}${bubbles}${north}</g>
  </g>`;
};

/* Staging markers: crane, laydown, gate, site office */
const markerXY = [[175, -130], [-190, -115], [40, 150], [195, 95]].map(([x, y]) => iso(x, y, 0));
const markersSVG = () => `<g class="seq-markers" data-g="markers">${markerXY.map(([x, y]) =>
  `<g class="seq-marker" data-marker><circle class="seq-marker__halo" cx="${f(x)}" cy="${f(y)}" r="13"/><circle class="seq-marker__dot" cx="${f(x)}" cy="${f(y)}" r="5.5"/></g>`).join('')}</g>`;

/* ---- The building -------------------------------------------------- */
/* Deterministic "lived-in" pattern of lit windows for the dusk beat */
const litAt = (i, b, side) => ((i * 7 + b * 3 + (side === 'r' ? 5 : 0)) % 10) < 7;

function floorSVG(i, { lit = false } = {}) {
  const z0 = i * FH, z1 = z0 + FH;
  let wins = '';
  for (let b = 0; b < 8; b++) {
    const door = i === 0 && (b === 3 || b === 4);
    const x0 = -BX + b * 30 + 5, x1 = x0 + 20;
    const zz0 = door ? z0 + 1 : z0 + (i === 0 ? 6 : 9), zz1 = z1 - 6;
    const on = lit && (door || litAt(i, b, 'l'));
    wins += `<polygon class="seq-win${door ? ' seq-win--door' : ''}${on ? ' is-lit' : ''}" data-lit="${door || litAt(i, b, 'l') ? 1 : 0}" points="${pts([x0, BY, zz0], [x1, BY, zz0], [x1, BY, zz1], [x0, BY, zz1])}"/>`;
  }
  for (let b = 0; b < 5; b++) {
    const y0 = BY - b * 28 - 5, y1 = y0 - 18;
    const zz0 = z0 + (i === 0 ? 6 : 9), zz1 = z1 - 6;
    const on = lit && litAt(i, b, 'r');
    wins += `<polygon class="seq-win seq-win--r${on ? ' is-lit' : ''}" data-lit="${litAt(i, b, 'r') ? 1 : 0}" points="${pts([BX, y0, zz0], [BX, y1, zz0], [BX, y1, zz1], [BX, y0, zz1])}"/>`;
  }
  const canopy = i === 0 ? `<polygon class="seq-canopy" points="${pts([-38, BY, FH - 4], [38, BY, FH - 4], [38, BY + 16, FH - 4], [-38, BY + 16, FH - 4])}"/>
    <polygon class="seq-canopy seq-canopy--edge" points="${pts([-38, BY + 16, FH - 4], [38, BY + 16, FH - 4], [38, BY + 16, FH - 8], [-38, BY + 16, FH - 8])}"/>` : '';
  return `<g class="seq-floor" data-floor="${i}">
    <polygon class="seq-face seq-face--l" points="${pts([-BX, BY, z0], [BX, BY, z0], [BX, BY, z1], [-BX, BY, z1])}" pathLength="1"/>
    <polygon class="seq-face seq-face--r" points="${pts([BX, BY, z0], [BX, -BY, z0], [BX, -BY, z1], [BX, BY, z1])}" pathLength="1"/>
    ${wins}
    <polyline class="seq-slab" points="${pts([-BX, BY, z1], [BX, BY, z1], [BX, -BY, z1])}"/>
    ${canopy}
  </g>`;
}

const TT = TOP + PARAPET;
const roofSVG = (attrs = '') => `<g class="seq-roof" ${attrs}>
  <polygon class="seq-face seq-face--l" points="${pts([-BX, BY, TOP], [BX, BY, TOP], [BX, BY, TT], [-BX, BY, TT])}"/>
  <polygon class="seq-face seq-face--r" points="${pts([BX, BY, TOP], [BX, -BY, TOP], [BX, -BY, TT], [BX, BY, TT])}"/>
  <polygon class="seq-roof__top" points="${pts([-BX, -BY, TT], [BX, -BY, TT], [BX, BY, TT], [-BX, BY, TT])}"/>
  <polygon class="seq-roof__inset" points="${pts([-BX + 8, -BY + 8, TT], [BX - 8, -BY + 8, TT], [BX - 8, BY - 8, TT], [-BX + 8, BY - 8, TT])}"/>
  <polygon class="seq-face seq-face--l" points="${pts([-55, 5, TT], [-5, 5, TT], [-5, 5, TT + 16], [-55, 5, TT + 16])}"/>
  <polygon class="seq-face seq-face--r" points="${pts([-5, 5, TT], [-5, -35, TT], [-5, -35, TT + 16], [-5, 5, TT + 16])}"/>
  <polygon class="seq-roof__top" points="${pts([-55, -35, TT + 16], [-5, -35, TT + 16], [-5, 5, TT + 16], [-55, 5, TT + 16])}"/>
</g>`;

const buildingSVG = ({ lit = false, roof = true } = {}) => `<g class="seq-building" data-g="building">
  ${Array.from({ length: FLOORS }, (_, i) => floorSVG(i, { lit })).join('')}
  ${roof ? roofSVG('data-g="roof"') : ''}
</g>`;

/* Silhouette of the finished building, for the one orange trace */
const outlineD = 'M' + [
  [-BX, BY, 0], [-BX, BY, TT], [-BX, -BY, TT], [BX, -BY, TT], [BX, -BY, 0], [BX, BY, 0],
].map((q) => iso(...q).map(f).join(' ')).join('L') + 'Z';
const outlineSVG = (cls = '') => `<path class="seq-outline ${cls}" data-g="outline" d="${outlineD}" pathLength="1"/>`;

/* Callout rides beside the floor that is being built */
const calloutX = iso(BX, -BY, 0)[0] + 8;
const floorMidY = Array.from({ length: FLOORS }, (_, i) => f(iso(BX, -BY, i * FH + FH / 2)[1]));

/* Dusk: a warm glow behind the building and a pool of light at the door */
const [poolX, poolY] = iso(0, BY + 34, 0);
const duskSVG = (attrs = '') => `<g class="seq-dusk" ${attrs}>
  <ellipse cx="500" cy="300" rx="340" ry="230" fill="url(#seq-glow)"/>
  <ellipse cx="${f(poolX)}" cy="${f(poolY)}" rx="80" ry="22" fill="url(#seq-pool)"/>
</g>`;
const gradientDefs = `<radialGradient id="seq-glow"><stop offset="0" stop-color="#F4DDB2" stop-opacity=".16"/><stop offset="1" stop-color="#F4DDB2" stop-opacity="0"/></radialGradient>
  <radialGradient id="seq-pool"><stop offset="0" stop-color="#F4DDB2" stop-opacity=".45"/><stop offset="1" stop-color="#F4DDB2" stop-opacity="0"/></radialGradient>`;

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
    <symbol id="frame-mobilize" viewBox="${SITE_VIEW}">${planSVG()}${markersSVG()}</symbol>
    <symbol id="frame-execute" viewBox="${SITE_VIEW}">${planSVG('opacity=".45"')}${buildingSVG({ roof: false })}</symbol>
    <symbol id="frame-closeout" viewBox="${SITE_VIEW}">${duskSVG()}${planSVG('opacity=".3"')}${buildingSVG({ lit: true })}${outlineSVG('is-static')}</symbol>
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
  const capLabel = capStatement.available ? 'Download statement' : 'Get the statement';
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
      <div class="seq__layer seq__layer--net" data-layer="net">${svgOpen(`data-seq-svg data-nc="${f(ncXY[0])} ${f(ncXY[1])}" data-rows="${floorMidY.join(',')}" data-tb-rows="${tbRowY.join(',')}" data-tb-center="${TB.x + TB.w / 2} ${TB.y + TBH / 2}"`)}
        <g data-g="net">${netSVG()}</g>
        ${proofSVG()}
      </svg></div>
      <div class="seq__layer seq__layer--site" data-layer="site">${svgOpen()}
        ${duskSVG('data-g="dusk"')}
        ${planSVG('data-g="plan"')}
        ${markersSVG()}
        ${buildingSVG()}
        ${outlineSVG()}
        <g class="seq-callout" data-g="callout">
          <line x1="${f(calloutX)}" y1="0" x2="${f(calloutX + 64)}" y2="0"/>
          <circle cx="${f(calloutX + 70)}" cy="0" r="5"/>
        </g>
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
          </div>
        </div>

        <div class="seq__beat" data-beat="mobilize">
          ${frameSVG('frame-mobilize')}
          <div class="seq__text">
            <p class="seq__label"><span class="seq__num">01</span>Mobilize</p>
            <h2 class="seq__title">The contract becomes a site plan.</h2>
            <p class="seq__sub">Schedule, safety plan, and logistics are locked before crews and equipment arrive, staged where the work needs them.</p>
          </div>
        </div>

        <div class="seq__beat" data-beat="execute">
          ${frameSVG('frame-execute')}
          <div class="seq__text">
            <p class="seq__label"><span class="seq__num">02</span>Execute</p>
            <h2 class="seq__title">The plan becomes a building.</h2>
            <ol class="seq__caps" aria-label="Capability lines">
              ${capabilities.map((c, i) => `<li data-cap="${i}"><span class="seq__cap-num">${String(i + 1).padStart(2, '0')}</span><span>${esc(c.callout)}</span></li>`).join('')}
            </ol>
          </div>
        </div>

        <div class="seq__beat" data-beat="closeout">
          ${frameSVG('frame-closeout')}
          <div class="seq__text">
            <p class="seq__label"><span class="seq__num">03</span>Close out</p>
            <h2 class="seq__title">The building becomes yours.</h2>
            <p class="seq__sub">Handed over complete, on time and on budget, with zero incidents and every record in your file. Then the lights come on.</p>
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
          ${btn('/contact/', 'Talk to our team', { variant: 'secondary' })}
        </div>
      </div>
    </div>

    <ol class="seq__rail" aria-hidden="true">
      ${['Mobilize', 'Execute', 'Close out', 'Footprint', 'Proof'].map((l, i) => `<li data-rail="${i + 1}"><span>${l}</span></li>`).join('')}
    </ol>
  </div>
</section>`;
}
