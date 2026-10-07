/* ==================================================================
   HOME — SCROLL SEQUENCE ("Mobilize / Execute / Close Out")
   ------------------------------------------------------------------
   One scroll-driven sequence built entirely in code (SVG + GSAP), so
   it stays crisp, fast and on-palette. Six beats:

     1 Open       0–10%   single orange-edged hex; headline
     2 Mobilize  10–30%   hex cells tile into a site-plan grid; markers drop
     3 Execute   30–60%   cells extrude into a facade row by row; callouts
     4 Close out 60–75%   orange trace runs once around the finished outline
     5 Footprint 75–92%   building shrinks to NC on a hex-tile US map;
                          NC → TX → FL pulse, partner network spreads
     6 Resolve   92–100%  hex cells collapse; the real logo file + CTA

   All copy is real HTML in the DOM (SEO / Section 508). The artwork is
   aria-hidden. With JS off or prefers-reduced-motion, CSS lays the
   beats out as static panels, each showing its final frame (the
   <symbol>s defined below).

   This module also returns the map geometry so it is generated once,
   at build time — no map file is fetched at runtime.
================================================================== */

import { capabilities, locations, capStatement, site } from './site.mjs';
import { btn, esc, logoImg } from './components.mjs';

const W = 1000, H = 640;
const SQ3 = Math.sqrt(3);
const f = (n) => Math.round(n * 10) / 10;

function hexPoints(cx, cy, R) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i - 90);
    pts.push(`${f(cx + R * Math.cos(a))},${f(cy + R * Math.sin(a))}`);
  }
  return pts.join(' ');
}

/* Compact relative path for one pointy-top hex, for the map. */
function hexPath(cx, cy, R) {
  const hw = f((SQ3 / 2) * R), h = f(R / 2), top = f(cy - R);
  return `M${f(cx)} ${top}l${hw} ${h}v${f(R)}l-${hw} ${h}-${hw}-${h}v-${f(R)}z`;
}

/* ------------------------------------------------------------------
   US MAP — contiguous states outline (lon, lat), projected to the
   1000 x 640 artboard, then filled with a hex lattice. Coarse on
   purpose: it only has to read as "the United States" in hex cells.
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

function mapPath() {
  const poly = US.map(([lon, lat]) => proj(lon, lat));
  const R = 9.6, w = SQ3 * R, step = 1.5 * R;
  let d = '', n = 0;
  for (let row = 0, y = 70; y < 580; row++, y += step) {
    for (let x = 50 + (row % 2 ? w / 2 : 0); x < 960; x += w) {
      if (inside(x, y, poly)) { d += hexPath(x, y, R - 1.6); n++; }
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

/* ------------------------------------------------------------------
   SITE GEOMETRY (beats 1–4)
------------------------------------------------------------------- */
const C = { x: 500, y: 320 };            // composition centre
/* The "camera": tight on the site for beats 1–4, then the viewBox
   itself is tweened out to the full artboard for the map. */
const SITE_VIEW = '170 96 660 422';

/* Site-plan grid: axial hex region, radius 4 */
const GR = 26, GW = SQ3 * GR;
const gridCells = [];
for (let q = -4; q <= 4; q++) {
  for (let r = -4; r <= 4; r++) {
    const s = -q - r;
    const ring = Math.max(Math.abs(q), Math.abs(r), Math.abs(s));
    if (ring > 4 || ring === 0) continue;
    gridCells.push({ x: C.x + GW * (q + r / 2), y: C.y + 1.5 * GR * r, ring });
  }
}
/* Staging markers — crews and equipment */
const markerCells = [[-2, 1], [2, -2], [3, 0], [-1, -3], [0, 3]].map(([q, r]) => ({
  x: C.x + GW * (q + r / 2), y: C.y + 1.5 * GR * r,
}));

/* Facade: 5 rows (one per capability line), pointy-top cells */
const BR = 24, BW = SQ3 * BR, ROWS = capabilities.length, BASE = 474;
const x0 = C.x - 4 * BW;
const rows = Array.from({ length: ROWS }, (_, r) => {
  const y = BASE - r * 1.5 * BR;
  const odd = r % 2 === 1;
  const count = odd ? 7 : 8;
  const cells = Array.from({ length: count }, (_, i) => ({ x: x0 + BW / 2 + (odd ? BW / 2 : 0) + i * BW, y }));
  return { y, cells };
});
const top = BASE - (ROWS - 1) * 1.5 * BR - BR;
const frame = { l: f(x0 - 10), r: f(x0 + 8 * BW + 10), t: f(top - 12), b: f(BASE + BR + 6) };
const outlineD = `M${frame.l} ${frame.b}V${frame.t + 18}L${frame.l + 18} ${frame.t}H${frame.r - 18}L${frame.r} ${frame.t + 18}V${frame.b}Z`;
const calloutX = frame.r + 14;

/* Collapse ring for the resolve beat */
const ringCells = Array.from({ length: 12 }, (_, i) => {
  const a = (Math.PI * 2 * i) / 12;
  return { x: C.x + Math.cos(a) * 230, y: C.y + Math.sin(a) * 180 };
});

/* ------------------------------------------------------------------
   SVG PARTS — shared by the animated stage and the static frames
------------------------------------------------------------------- */
const gridSVG = (cls = '') => `<g class="seq-grid ${cls}" data-g="grid">${gridCells.map((c) =>
  `<polygon class="seq-cell" data-ring="${c.ring}" points="${hexPoints(c.x, c.y, GR - 2)}"/>`).join('')}</g>`;

const markersSVG = () => `<g class="seq-markers" data-g="markers">${markerCells.map((m) =>
  `<g class="seq-marker" data-marker><circle class="seq-marker__halo" cx="${f(m.x)}" cy="${f(m.y)}" r="13"/><circle class="seq-marker__dot" cx="${f(m.x)}" cy="${f(m.y)}" r="5.5"/></g>`).join('')}</g>`;

const buildingSVG = () => `<g class="seq-building" data-g="building">${rows.map((row, r) =>
  `<g class="seq-row" data-row="${r}">${row.cells.map((c) => `<polygon class="seq-bcell" points="${hexPoints(c.x, c.y, BR - 1.5)}"/>`).join('')}</g>`).join('')}</g>`;

const outlineSVG = (cls = '') => `<path class="seq-outline ${cls}" data-g="outline" d="${outlineD}" pathLength="1"/>`;

/* The opening cell. Its glow is a wide, faint stroke underneath; a CSS
   drop-shadow filter here repainted the whole layer every frame. */
const openSVG = (attrs = '') => `<g class="seq-open" ${attrs}>
  <polygon class="seq-open__glow" points="${hexPoints(C.x, C.y, 70)}"/>
  <polygon class="seq-open__edge" points="${hexPoints(C.x, C.y, 70)}" pathLength="1"/>
</g>`;

const netSVG = () => `<g class="seq-net">${network.map((n) => `<path class="seq-net__line${n.mobile ? '' : ' seq-desktop'}" d="${n.d}" pathLength="1"/>`).join('')}</g>
  <g class="seq-net-nodes">${network.map((n) => `<circle class="seq-net__node${n.mobile ? '' : ' seq-desktop'}" cx="${n.x}" cy="${n.y}" r="3.2"/>`).join('')}</g>
  ${hubs.map((h) => `<g class="seq-hub" data-hub="${h.id}">
    <circle class="seq-hub__pulse" cx="${f(h.xy[0])}" cy="${f(h.xy[1])}" r="8"/>
    <circle class="seq-hub__dot" cx="${f(h.xy[0])}" cy="${f(h.xy[1])}" r="${h.primary ? 8 : 6.5}"/>
  </g>`).join('')}`;

const GROUND = 'translate(0 180) translate(500 320) scale(1 .3) translate(-500 -320)';

/* ------------------------------------------------------------------
   PUBLIC: <defs> sprite + the sequence section
------------------------------------------------------------------- */
export function heroDefs() {
  const map = mapPath();
  return `<svg class="seq-defs" width="0" height="0" aria-hidden="true" focusable="false">
  <defs>
    <path id="seq-us" d="${map.d}"/>
    <symbol id="frame-open" viewBox="${SITE_VIEW}">${openSVG()}</symbol>
    <symbol id="frame-mobilize" viewBox="${SITE_VIEW}">${gridSVG('is-static')}${markersSVG()}<polygon class="seq-cell is-center" points="${hexPoints(C.x, C.y, GR - 2)}"/></symbol>
    <symbol id="frame-execute" viewBox="${SITE_VIEW}"><g transform="${GROUND}">${gridSVG('is-static is-ground')}</g>${buildingSVG()}</symbol>
    <symbol id="frame-closeout" viewBox="${SITE_VIEW}"><g transform="${GROUND}">${gridSVG('is-static is-ground')}</g>${buildingSVG()}${outlineSVG('is-static')}</symbol>
    <symbol id="frame-footprint" viewBox="0 0 ${W} ${H}"><use href="#seq-us" class="seq-us"/>${netSVG()}</symbol>
  </defs>
</svg>`;
}

/* The outer viewBox is the symbol's own size at the origin; the symbol
   carries the crop. (Repeating SITE_VIEW here offset the art twice.) */
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
<section class="seq theme-dark" id="top" data-seq aria-label="How Ionic delivers: mobilize, execute, close out">
  <div class="seq__pin" data-seq-pin>

    <!-- Three stacked layers sharing one coordinate system. Moving a
         whole layer is a GPU transform; only the small layer that is
         actually changing ever repaints. -->
    <div class="seq__visual" aria-hidden="true">
      <div class="seq__layer seq__layer--map" data-layer="map">${svgOpen()}<use href="#seq-us" class="seq-us"/></svg></div>
      <div class="seq__layer seq__layer--net" data-layer="net">${svgOpen(`data-seq-svg data-nc="${f(ncXY[0])} ${f(ncXY[1])}" data-rows="${rows.map((r) => f(r.y)).join(',')}"`)}
        <g data-g="net">${netSVG()}</g>
        <g class="seq-ring" data-g="ring">${ringCells.map((c) => `<polygon class="seq-rcell" points="${hexPoints(c.x, c.y, 26)}"/>`).join('')}</g>
      </svg></div>
      <div class="seq__layer seq__layer--site" data-layer="site">${svgOpen()}
        ${gridSVG()}
        ${markersSVG()}
        ${buildingSVG()}
        ${outlineSVG()}
        <g class="seq-callout" data-g="callout">
          <line x1="${f(frame.r - 6)}" y1="0" x2="${f(calloutX + 46)}" y2="0"/>
          <circle cx="${f(calloutX + 52)}" cy="0" r="5"/>
        </g>
        ${openSVG('data-g="open"')}
      </svg></div>
    </div>

    <div class="seq__copy wrap">
      <div class="seq__beats">

        <div class="seq__beat" data-beat="open">
          ${frameSVG('frame-open')}
          <div class="seq__text">
            <p class="seq__kicker">${esc(site.descriptor)}</p>
            <h1 class="seq__title seq__title--hero" data-split>Veteran-owned. Built for public and private work.</h1>
            <p class="seq__sub">General construction and support services for federal agencies, state and local governments, and private owners.</p>
          </div>
        </div>

        <div class="seq__beat" data-beat="mobilize">
          ${frameSVG('frame-mobilize')}
          <div class="seq__text">
            <p class="seq__label"><span class="seq__num">01</span>Mobilize</p>
            <h2 class="seq__title">Every job starts with a plan on the ground.</h2>
            <p class="seq__sub">Site plan, schedule, safety, and logistics are set before crews and equipment arrive.</p>
          </div>
        </div>

        <div class="seq__beat" data-beat="execute">
          ${frameSVG('frame-execute')}
          <div class="seq__text">
            <p class="seq__label"><span class="seq__num">02</span>Execute</p>
            <h2 class="seq__title">Built row by row, to specification.</h2>
            <ol class="seq__caps" aria-label="Capability lines">
              ${capabilities.map((c, i) => `<li data-cap="${i}"><span class="seq__cap-num">${String(i + 1).padStart(2, '0')}</span><span>${esc(c.callout)}</span></li>`).join('')}
            </ol>
          </div>
        </div>

        <div class="seq__beat" data-beat="closeout">
          ${frameSVG('frame-closeout')}
          <div class="seq__text">
            <p class="seq__label"><span class="seq__num">03</span>Close out</p>
            <h2 class="seq__title">On time, on budget, zero-incident turnover.</h2>
            <p class="seq__sub">Punch lists closed, documentation delivered, and the facility handed over ready for use.</p>
          </div>
        </div>

        <div class="seq__beat" data-beat="footprint">
          ${frameSVG('frame-footprint', `0 0 ${W} ${H}`)}
          <div class="seq__text">
            <p class="seq__label"><span class="seq__num">04</span>Footprint</p>
            <h2 class="seq__title">Headquartered in North Carolina. Mobilized nationwide.</h2>
            <ul class="seq__locs">
              ${locations.map((l) => `<li data-loc="${l.id}"><strong>${esc(l.label)}</strong><span>${esc(l.role)}</span></li>`).join('')}
              <li data-loc="network"><strong>Multi-state</strong><span>Partner network</span></li>
            </ul>
            <ul class="seq__sectors" aria-label="Sectors served">
              <li>Federal</li><li>State</li><li>County &amp; municipal</li><li>Private</li>
            </ul>
          </div>
        </div>

      </div>
    </div>

    <div class="seq__resolve theme-light" data-beat="resolve">
      <div class="seq__resolve-inner wrap">
        ${logoImg('color', { cls: 'seq__logo', width: 480, sizes: '(min-width: 48rem) 26rem, 72vw', alt: 'Ionic Contractors' })}
        <p class="seq__resolve-line">One accountable partner, from mobilization to closeout.</p>
        <div class="btn-row seq__cta">
          ${btn(capHref, capLabel, { variant: 'primary', attrs: capAttrs })}
          ${btn('/contact/', 'Talk to our team', { variant: 'secondary' })}
        </div>
      </div>
    </div>

    <ol class="seq__rail" aria-hidden="true">
      ${['Mobilize', 'Execute', 'Close out', 'Footprint'].map((l, i) => `<li data-rail="${i + 1}"><span>${l}</span></li>`).join('')}
    </ol>
  </div>
</section>`;
}
