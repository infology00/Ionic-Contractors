/* ------------------------------------------------------------------
   Blueprint linework used as the site-wide visual motif, so every page
   speaks the same language as the home sequence: an isometric building
   drawn in fine lines over a site grid, with dimension and grid-bubble
   annotations. Pure line art in currentColor; color and opacity come
   from CSS.
------------------------------------------------------------------- */

const f = (n) => Math.round(n * 10) / 10;
const O = { x: 300, y: 330, c: 0.866, s: 0.5 };
const iso = (x, y, z = 0) => [O.x + (x - y) * O.c, O.y + (x + y) * O.s - z];
const ln = (a, b, cls = '') => {
  const [x1, y1] = iso(...a), [x2, y2] = iso(...b);
  return `<line${cls ? ` class="${cls}"` : ''} x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}"/>`;
};
const poly = (...q) => q.map((p) => iso(...p).map(f).join(',')).join(' ');

function art() {
  const BX = 110, BY = 64, FH = 30, FLOORS = 5, TOP = FLOORS * FH + 8;
  let s = '';

  /* Site grid, fading toward the edges */
  for (let y = -175; y <= 175; y += 35) s += `<g opacity="${(1 - Math.abs(y) / 175 * 0.75).toFixed(2)}">${ln([-245, y], [245, y], 'bp-grid')}</g>`;
  for (let x = -245; x <= 245; x += 35) s += `<g opacity="${(1 - Math.abs(x) / 245 * 0.75).toFixed(2)}">${ln([x, -175], [x, 175], 'bp-grid')}</g>`;

  /* Building wireframe: visible faces, slabs, mullions */
  s += `<polygon class="bp-face" points="${poly([-BX, BY, 0], [BX, BY, 0], [BX, BY, TOP], [-BX, BY, TOP])}"/>`;
  s += `<polygon class="bp-face" points="${poly([BX, BY, 0], [BX, -BY, 0], [BX, -BY, TOP], [BX, BY, TOP])}"/>`;
  s += `<polygon class="bp-face" points="${poly([-BX, -BY, TOP], [BX, -BY, TOP], [BX, BY, TOP], [-BX, BY, TOP])}"/>`;
  for (let i = 1; i <= FLOORS; i++) {
    const z = i * FH;
    s += `<polyline class="bp-line" points="${poly([-BX, BY, z], [BX, BY, z], [BX, -BY, z])}"/>`;
  }
  for (let x = -BX + 27.5; x < BX; x += 27.5) s += ln([x, BY, 0], [x, BY, FLOORS * FH], 'bp-fine');
  for (let y = BY - 25.6; y > -BY; y -= 25.6) s += ln([BX, y, 0], [BX, y, FLOORS * FH], 'bp-fine');

  /* Dimension lines with ticks */
  s += ln([-BX, BY + 8], [-BX, BY + 52], 'bp-dim') + ln([BX, BY + 8], [BX, BY + 52], 'bp-dim') + ln([-BX, BY + 44], [BX, BY + 44], 'bp-dim');
  s += ln([-BX - 6, BY + 38], [-BX + 6, BY + 50], 'bp-dim') + ln([BX - 6, BY + 38], [BX + 6, BY + 50], 'bp-dim');

  /* Grid bubbles */
  ['A', 'B', 'C', 'D', 'E'].forEach((l, i) => {
    const [cx, cy] = iso(-140 + i * 70, -199);
    s += `<circle class="bp-dim" cx="${f(cx)}" cy="${f(cy)}" r="8"/><text class="bp-text" x="${f(cx)}" y="${f(cy)}">${l}</text>`;
  });
  return s;
}

const ART = art();

export function blueprintArt(cls = '') {
  return `<svg class="bp ${cls}" viewBox="0 0 600 460" fill="none" aria-hidden="true" focusable="false">${ART}</svg>`;
}
