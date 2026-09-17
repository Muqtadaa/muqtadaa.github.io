import fs from 'node:fs';
import path from 'node:path';
import { resize } from '../../lib/image.js';
import { readEmbeddedCaption } from '../../lib/exif.js';
import {
  GALLERY_ROOT,
  findSlugCollisions,
  humanise,
  listFolders,
  listImages,
  loadCaptions,
  slugify
} from '../../lib/gallery.js';

// Gallery data (plan WS-E step 4). One entry per gallery/<folder>/ with an
// array of items sorted for display. Adding a file to gallery/art/ is enough
// for it to show up; captions.yml (see gallery/art/README.md) gives it a
// title, caption, alt text, tags and position.
//
// Caption precedence: captions.yml > same-basename .txt > embedded metadata
// (exiftool) > humanised filename (with a build warning).
//
// The build fails for malformed YAML, an entry whose file is missing, an
// explicit `alt: ""` with no caption, and a case-insensitive slug collision.
// Everything else degrades to a `::warning` line.

const WIDTHS = [480, 960, 1600];
const TILE_MAX_WIDTH = 960;

function warn(file, message) {
  console.log(`::warning file=${file}::${message}`);
}

function srcsetFor(entries, maxWidth = Infinity) {
  return entries
    .filter((entry) => entry.width <= maxWidth)
    .map((entry) => entry.srcset)
    .join(', ');
}

function mediaUrl(folder, file) {
  return `/media/${folder}/${file}`;
}

function assertFile(dir, file, what) {
  if (typeof file !== 'string' || !file) throw new Error(`${dir}: ${what} must be a filename`);
  if (!fs.existsSync(path.join(dir, file))) throw new Error(`${dir}: ${what} "${file}" does not exist`);
  return file;
}

function normaliseTags(tags, file) {
  if (tags === undefined || tags === null) return [];
  const list = Array.isArray(tags) ? tags : [tags];
  return list.map((tag) => {
    if (typeof tag !== 'string' || !tag.trim()) throw new Error(`${file}: tags must be strings`);
    return tag.trim().toLowerCase();
  });
}

async function resolveCaption(dir, file, entry, captionsFile) {
  if (typeof entry?.caption === 'string' && entry.caption.trim()) {
    return { caption: entry.caption.trim(), source: 'captions.yml' };
  }
  const sidecar = path.join(dir, path.parse(file).name + '.txt');
  if (fs.existsSync(sidecar)) {
    const text = fs.readFileSync(sidecar, 'utf8').trim();
    if (text) return { caption: text, source: 'sidecar' };
  }
  const embedded = await readEmbeddedCaption(path.join(dir, file));
  if (embedded) return embedded;
  if (!entry) {
    warn(path.posix.join(dir, file), `no captions.yml entry, .txt sidecar or embedded caption; using the filename. Add a block for "${file}" to ${captionsFile}.`);
  } else {
    warn(captionsFile, `"${file}" has no caption; using the filename.`);
  }
  return { caption: humanise(file), source: 'filename' };
}

async function buildItem({ folder, dir, file, entry, captionsFile }) {
  const { caption, source } = await resolveCaption(dir, file, entry, captionsFile);
  const title = typeof entry?.title === 'string' && entry.title.trim() ? entry.title.trim() : humanise(file);

  let alt;
  if (typeof entry?.alt === 'string' && entry.alt.trim()) {
    alt = entry.alt.trim();
  } else if (entry && entry.alt === '' && source === 'filename') {
    throw new Error(`${captionsFile}: "${file}" has an empty alt and no caption to fall back on`);
  } else {
    alt = caption;
  }

  const type = entry?.video ? 'video' : entry?.document ? 'document' : entry?.animated ? 'animated' : 'image';
  const tags = normaliseTags(entry?.tags, path.posix.join(dir, file));

  // formatFiltering is emptied so transparent PNGs still get a JPEG
  // fallback (the lightbox backdrop is ink, so dropped alpha is invisible).
  const metadata = await resize(path.join(dir, file), { widths: WIDTHS, formatFiltering: [] });
  const jpeg = metadata.jpeg;
  const webp = metadata.webp;
  const smallest = jpeg[0];
  const largest = jpeg.at(-1);

  const item = {
    folder,
    file,
    slug: slugify(file),
    url: `/${folder}/#${slugify(file)}`,
    title,
    caption,
    captionSource: source,
    alt,
    tags,
    order: typeof entry?.order === 'number' ? entry.order : null,
    type,
    animated: type === 'animated',
    width: smallest.width,
    height: smallest.height,
    thumb: smallest.url,
    srcset: srcsetFor(jpeg, TILE_MAX_WIDTH),
    webpSrcset: srcsetFor(webp, TILE_MAX_WIDTH),
    full: largest.url,
    fullWebp: webp.at(-1).url,
    fullWidth: largest.width,
    fullHeight: largest.height,
    video: null,
    document: null
  };

  if (type === 'animated') {
    // The flattened first frame is the tile poster; the original GIF only
    // loads inside the lightbox.
    item.full = mediaUrl(folder, file);
    item.fullWebp = null;
  }

  if (type === 'video') {
    const video = entry.video;
    if (typeof video !== 'object' || video === null) throw new Error(`${captionsFile}: "${file}" video must be a map with src (and poster)`);
    const src = assertFile(dir, video.src, `"${file}" video.src`);
    let poster = item.full;
    if (video.poster && video.poster !== file) {
      const posterMeta = await resize(path.join(dir, assertFile(dir, video.poster, `"${file}" video.poster`)), {
        widths: WIDTHS,
        formatFiltering: []
      });
      poster = posterMeta.jpeg.at(-1).url;
    }
    item.video = { src: mediaUrl(folder, src), poster };
  }

  if (type === 'document') {
    const doc = entry.document;
    if (typeof doc !== 'object' || doc === null) throw new Error(`${captionsFile}: "${file}" document must be a map with url and label`);
    const url = assertFile(dir, doc.url, `"${file}" document.url`);
    const label = typeof doc.label === 'string' && doc.label.trim() ? doc.label.trim() : 'View the document';
    item.document = { url: mediaUrl(folder, url), label };
  }

  // What the tile links to without JavaScript.
  item.href = item.type === 'video' ? item.video.src : item.type === 'document' ? item.document.url : item.full;
  return item;
}

function compareItems(a, b) {
  const ao = a.order ?? -Infinity;
  const bo = b.order ?? -Infinity;
  if (ao !== bo) return ao - bo;
  return a.file.toLowerCase().localeCompare(b.file.toLowerCase());
}

async function loadGallery(folder) {
  const dir = path.join(GALLERY_ROOT, folder);
  const { file: captionsFile, entries } = loadCaptions(dir);
  const files = listImages(dir);
  const fileSet = new Set(files);

  for (const key of Object.keys(entries)) {
    if (!fs.existsSync(path.join(dir, key))) throw new Error(`${captionsFile}: "${key}" does not exist in ${dir}`);
    if (!fileSet.has(key)) throw new Error(`${captionsFile}: "${key}" is not an image (jpg, jpeg, png, webp or gif)`);
  }

  const collisions = findSlugCollisions(files);
  if (collisions.length) {
    const list = collisions.map(([a, b, slug]) => `"${a}" and "${b}" (${slug})`).join('; ');
    throw new Error(`${dir}: filenames collide once lower-cased: ${list}. Rename one of them.`);
  }

  // All items at once: eleventy-img queues the encodes itself.
  const items = await Promise.all(
    files
      .filter((file) => entries[file]?.hidden !== true)
      .map((file) => buildItem({ folder, dir, file, entry: entries[file] || null, captionsFile }))
  );
  return items.sort(compareItems);
}

export default async function () {
  const galleries = {};
  for (const folder of listFolders()) {
    galleries[folder] = await loadGallery(folder);
  }
  return galleries;
}
