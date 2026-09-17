import { ExifTool } from 'exiftool-vendored';

// One exiftool process for the whole build, started only when a gallery file
// has neither a captions.yml entry nor a .txt sidecar. eleventy.after calls
// endExiftool() so the build exits; the next build (in --serve) starts a
// fresh one.
let instance = null;

export function getExiftool() {
  if (!instance) {
    instance = new ExifTool({ taskTimeoutMillis: 20000 });
  }
  return instance;
}

export async function endExiftool() {
  if (!instance) return;
  const running = instance;
  instance = null;
  await running.end();
}

// Embedded caption fields in precedence order (plan section 3). Windows
// Explorer's "Title" on a JPEG fans out to the first four; Photoshop/Bridge
// write the XMP one; PNG text chunks are what dedicated tools write.
const CAPTION_TAGS = [
  'XMP:Description',
  'IPTC:Caption-Abstract',
  'EXIF:ImageDescription',
  'EXIF:XPTitle',
  'EXIF:XPComment',
  'PNG:Description',
  'PNG:Comment',
  'PNG:Title'
];

// Returns { caption, source } or null when the file carries no caption.
export async function readEmbeddedCaption(file) {
  const raw = await getExiftool().readRaw(file, ['-G0', ...CAPTION_TAGS.map((tag) => `-${tag}`)]);
  for (const tag of CAPTION_TAGS) {
    const value = raw[tag];
    const text = Array.isArray(value) ? value.join(' ') : value;
    if (typeof text === 'string' && text.trim()) {
      return { caption: text.trim(), source: tag };
    }
  }
  return null;
}
