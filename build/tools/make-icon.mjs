/* Rasterises the Ionic monogram to a PNG apple-touch-icon.
   No image dependency: antialiased capsule/segment fill into an RGBA
   buffer, then a zlib-deflated PNG. */

import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const S = 180;                 // icon size
const buf = Buffer.alloc(S * S * 4);

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

const BG = hex('#080D0C');
const BRASS = hex('#2FC4AC');
const BRIGHT = hex('#7FE9D6');

/* fill background */
for (let i = 0; i < S * S; i++) {
  buf[i * 4] = BG[0]; buf[i * 4 + 1] = BG[1]; buf[i * 4 + 2] = BG[2]; buf[i * 4 + 3] = 255;
}

function blend(x, y, color, a) {
  if (a <= 0 || x < 0 || y < 0 || x >= S || y >= S) return;
  const i = (y * S + x) * 4;
  a = Math.min(1, a);
  buf[i]     = Math.round(buf[i]     * (1 - a) + color[0] * a);
  buf[i + 1] = Math.round(buf[i + 1] * (1 - a) + color[1] * a);
  buf[i + 2] = Math.round(buf[i + 2] * (1 - a) + color[2] * a);
}

/* distance from point to segment */
function distSeg(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  let t = len2 ? ((px - x1) * dx + (py - y1) * dy) / len2 : 0;
  t = Math.max(0, Math.min(1, t));
  const cx = x1 + t * dx, cy = y1 + t * dy;
  return Math.hypot(px - cx, py - cy);
}

/* stroke a polyline with round caps, antialiased over 1px */
function stroke(points, width, color, close = false) {
  const half = width / 2;
  const segs = [];
  for (let i = 0; i < points.length - 1; i++) segs.push([...points[i], ...points[i + 1]]);
  if (close) segs.push([...points[points.length - 1], ...points[0]]);

  /* bounding box for speed */
  const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
  const x0 = Math.max(0, Math.floor(Math.min(...xs) - half - 2));
  const x1 = Math.min(S - 1, Math.ceil(Math.max(...xs) + half + 2));
  const y0 = Math.max(0, Math.floor(Math.min(...ys) - half - 2));
  const y1 = Math.min(S - 1, Math.ceil(Math.max(...ys) + half + 2));

  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      let d = Infinity;
      for (const s of segs) d = Math.min(d, distSeg(x + 0.5, y + 0.5, s[0], s[1], s[2], s[3]));
      const a = Math.max(0, Math.min(1, half + 0.5 - d));
      if (a > 0) blend(x, y, color, a);
    }
  }
}

/* Scale the 44-unit artwork up to the icon size */
const k = S / 44;
const P = (x, y) => [x * k, y * k];

/* hexagon */
stroke([P(22, 6.5), P(34.5, 13), P(34.5, 31), P(22, 37.5), P(9.5, 31), P(9.5, 13)], 1.5 * k, BRASS, true);
/* the I */
stroke([P(22, 13.5), P(22, 30.5)], 2.9 * k, BRIGHT);
stroke([P(16.5, 13.5), P(27.5, 13.5)], 2.5 * k, BRIGHT);
stroke([P(16.5, 30.5), P(27.5, 30.5)], 2.5 * k, BRIGHT);

/* ---- PNG encode ------------------------------------------------- */
const raw = Buffer.alloc((S * 4 + 1) * S);
for (let y = 0; y < S; y++) {
  raw[y * (S * 4 + 1)] = 0;  // filter: none
  buf.copy(raw, y * (S * 4 + 1) + 1, y * S * 4, (y + 1) * S * 4);
}

function crc32(b) {
  let c, table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k2 = 0; k2 < 8; k2++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xFFFFFFFF;
  for (const byte of b) crc = table[(crc ^ byte) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(S, 0); ihdr.writeUInt32BE(S, 4);
ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]);

writeFileSync('assets/img/apple-touch-icon.png', png);
console.log('apple-touch-icon.png', S + 'x' + S, (png.length / 1024).toFixed(1) + ' KB');
