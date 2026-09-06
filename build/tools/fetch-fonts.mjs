import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const OUT = path.resolve('assets/fonts');

// family query -> { outName prefix }
const JOBS = [
  { q: 'Public+Sans:wght@300..800', name: 'public-sans-var' },
  { q: 'Public+Sans:ital,wght@1,300..800', name: 'public-sans-var-italic' },
  { q: 'Instrument+Serif:wght@400', name: 'instrument-serif-400' },
  { q: 'Instrument+Serif:ital@1', name: 'instrument-serif-400-italic' },
  { q: 'JetBrains+Mono:wght@400..600', name: 'jetbrains-mono-var' },
];

await mkdir(OUT, { recursive: true });

for (const job of JOBS) {
  const url = `https://fonts.googleapis.com/css2?family=${job.q}&display=swap`;
  const css = await fetch(url, { headers: { 'User-Agent': UA } }).then(r => r.text());
  // Grab the block labelled /* latin */ only
  const blocks = css.split('/*').map(b => '/*' + b);
  const latin = blocks.find(b => b.startsWith('/* latin */'));
  if (!latin) { console.error('NO LATIN BLOCK for', job.name); continue; }
  const m = latin.match(/url\((https:[^)]+\.woff2)\)/);
  if (!m) { console.error('NO URL for', job.name); continue; }
  const buf = Buffer.from(await fetch(m[1], { headers: { 'User-Agent': UA } }).then(r => r.arrayBuffer()));
  const file = path.join(OUT, job.name + '.woff2');
  await writeFile(file, buf);
  const ur = latin.match(/unicode-range:\s*([^;]+);/);
  console.log(job.name.padEnd(30), (buf.length / 1024).toFixed(1) + ' KB', m[1]);
}
