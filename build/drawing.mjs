/* ------------------------------------------------------------------
   Blueprint linework used as the site-wide visual motif, so every page
   speaks the same language as the home sequence: the Ionic honeycomb
   drawn as a plan, with a drawing grid, dashed slots, grid bubbles and
   a dimension line. Pure line art in currentColor; color and opacity
   come from CSS.
------------------------------------------------------------------- */

const f = (n) => Math.round(n * 10) / 10;
const C = { x: 300, y: 230 }, R = 62, D = Math.sqrt(3) * R + 6;
const hex = (cx, cy, r) => Array.from({ length: 6 }, (_, k) => {
  const a = (Math.PI / 180) * (60 * k - 90);
  return f(cx + r * Math.cos(a)) + ',' + f(cy + r * Math.sin(a));
}).join(' ');
const line = (x1, y1, x2, y2, cls) => `<line class="${cls}" x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}"/>`;

function art() {
  let s = '';

  /* Drawing grid, fading toward the edges */
  for (let y = 20; y <= 440; y += 30) s += `<g opacity="${(1 - Math.abs(y - C.y) / 230 * 0.8).toFixed(2)}">${line(20, y, 580, y, 'bp-grid')}</g>`;
  for (let x = 30; x <= 570; x += 30) s += `<g opacity="${(1 - Math.abs(x - C.x) / 290 * 0.8).toFixed(2)}">${line(x, 20, x, 440, 'bp-grid')}</g>`;

  /* The honeycomb: a solid core, six dashed slots around it */
  const cells = [0, 60, 120, 180, 240, 300].map((t) => [C.x + D * Math.cos((Math.PI / 180) * t), C.y + D * Math.sin((Math.PI / 180) * t)]);
  s += `<polygon class="bp-face" points="${hex(C.x, C.y, R)}"/>`;
  s += `<polygon class="bp-fine" points="${hex(C.x, C.y, R - 14)}"/>`;
  cells.forEach(([x, y]) => { s += `<polygon class="bp-line bp-dash" points="${hex(x, y, R)}"/>`; });

  /* Dimension line under the cluster, with ticks */
  const span = D + R * 0.866, dy = C.y + D * 0.866 + R + 22;
  s += line(C.x - span, dy, C.x + span, dy, 'bp-dim');
  s += line(C.x - span, dy - 16, C.x - span, dy + 6, 'bp-dim') + line(C.x + span, dy - 16, C.x + span, dy + 6, 'bp-dim');
  s += line(C.x - span - 5, dy + 5, C.x - span + 5, dy - 5, 'bp-dim') + line(C.x + span - 5, dy + 5, C.x + span + 5, dy - 5, 'bp-dim');

  /* Grid bubbles on the cell columns */
  const top = C.y - D * 0.866 - R - 26;
  [C.x - D, C.x - D / 2, C.x, C.x + D / 2, C.x + D].forEach((x, i) => {
    s += line(x, top + 8, x, top + 22, 'bp-dim');
    s += `<circle class="bp-dim" cx="${f(x)}" cy="${f(top)}" r="8"/><text class="bp-text" x="${f(x)}" y="${f(top)}">${'ABCDE'[i]}</text>`;
  });
  return s;
}

const ART = art();

export function blueprintArt(cls = '') {
  return `<svg class="bp ${cls}" viewBox="0 0 600 460" fill="none" aria-hidden="true" focusable="false">${ART}</svg>`;
}
