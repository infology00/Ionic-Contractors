/* ==================================================================
   Local preview server.

     node preview.mjs            http://localhost:4321
     node preview.mjs 8080       pick a port

   The site is plain relative-path HTML, so you can also just open
   index.html in a browser. Use this when you want the video scrubbing
   to work properly: that needs HTTP range requests, which the
   file:// protocol does not provide.
================================================================== */

import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.argv[2]) || 4321;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
};

createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/' || urlPath === '') urlPath = '/index.html';

  /* Keep the server inside the project directory. */
  const file = path.join(ROOT, path.normalize(urlPath).replace(/^([/\\])+/, ''));
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  if (!existsSync(file) || statSync(file).isDirectory()) {
    const nf = path.join(ROOT, '404.html');
    res.writeHead(404, { 'Content-Type': MIME['.html'] });
    if (existsSync(nf)) createReadStream(nf).pipe(res);
    else res.end('Not found');
    return;
  }

  const ext = path.extname(file);
  const type = MIME[ext] || 'application/octet-stream';
  const size = statSync(file).size;

  /* Range support — without 206 responses the scroll-scrub video
     cannot seek, so the hero would sit on its first frame. */
  const range = req.headers.range;
  if (range && ext === '.mp4') {
    const [s, e] = range.replace(/bytes=/, '').split('-');
    const start = parseInt(s, 10) || 0;
    const end = e ? parseInt(e, 10) : size - 1;
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
      'Content-Type': type,
    });
    createReadStream(file, { start, end }).pipe(res);
    return;
  }

  res.writeHead(200, {
    'Content-Type': type,
    'Content-Length': size,
    'Accept-Ranges': ext === '.mp4' ? 'bytes' : 'none',
    'Cache-Control': 'no-cache',
  });
  createReadStream(file).pipe(res);
}).listen(PORT, () => {
  console.log(`\n  Ionic Contractors — preview on http://localhost:${PORT}\n`);
});
