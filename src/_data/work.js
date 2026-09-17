import fs from 'node:fs';
import path from 'node:path';
import { resize } from '../../lib/image.js';
import { humanise, listImages } from '../../lib/gallery.js';

// Per-case-study screenshot folders (plan WS-E step 5). Each
// src/work/<slug>/screenshots/ ships with a README and nothing else; when the
// owner drops images into it (from the Adobe XD files, say) the case-study
// layout renders them as a strip, so the pages keep their visual evidence if
// the XD embeds ever go dark. Returns { <slug>: { screenshots: [...] } }.
//
// Alt text: a same-basename .txt sidecar, else the humanised filename.

const WORK_ROOT = 'src/work';
const WIDTHS = [480, 960];

function readSidecar(dir, file) {
  const sidecar = path.join(dir, path.parse(file).name + '.txt');
  if (!fs.existsSync(sidecar)) return '';
  return fs.readFileSync(sidecar, 'utf8').trim();
}

async function buildScreenshot(dir, file) {
  const src = path.join(dir, file);
  const metadata = await resize(src, { widths: WIDTHS });
  const jpeg = metadata.jpeg;
  const largest = jpeg.at(-1);
  return {
    file,
    alt: readSidecar(dir, file) || humanise(file),
    src: jpeg[0].url,
    srcset: jpeg.map((entry) => entry.srcset).join(', '),
    webpSrcset: metadata.webp.map((entry) => entry.srcset).join(', '),
    full: largest.url,
    width: jpeg[0].width,
    height: jpeg[0].height
  };
}

export default async function () {
  const work = {};
  if (!fs.existsSync(WORK_ROOT)) return work;

  for (const entry of fs.readdirSync(WORK_ROOT, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const dir = path.join(WORK_ROOT, entry.name, 'screenshots');
    const files = fs.existsSync(dir) ? listImages(dir) : [];
    const screenshots = [];
    for (const file of files) {
      screenshots.push(await buildScreenshot(dir, file));
    }
    work[entry.name] = { screenshots };
  }

  return work;
}
