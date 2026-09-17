import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

// Shared by src/_data/galleries.js (the build) and scripts/check-gallery.mjs
// (the CI check), so both agree on what a gallery folder contains.

export const GALLERY_ROOT = 'gallery';
export const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;
export const MEDIA_EXT = /\.(mp4|webm|pdf)$/i;
export const CAPTIONS_FILE = 'captions.yml';

// Every gallery/<name>/ directory, sorted.
export function listFolders(root = GALLERY_ROOT) {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

// Image files of one folder, sorted case-insensitively so the order is the
// same on every filesystem.
export function listImages(dir) {
  return fs
    .readdirSync(dir)
    .filter((file) => IMAGE_EXT.test(file))
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
}

// captions.yml as a plain object keyed by filename. Malformed YAML and a
// non-map document throw; a missing file is an empty map.
export function loadCaptions(dir) {
  const file = path.join(dir, CAPTIONS_FILE);
  if (!fs.existsSync(file)) return { file, entries: {} };
  let data;
  try {
    data = yaml.load(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    throw new Error(`${file}: malformed YAML (${error.message})`);
  }
  if (data === undefined || data === null) return { file, entries: {} };
  if (typeof data !== 'object' || Array.isArray(data)) {
    throw new Error(`${file}: expected a map of filename → fields`);
  }
  for (const [key, value] of Object.entries(data)) {
    if (value !== null && (typeof value !== 'object' || Array.isArray(value))) {
      throw new Error(`${file}: entry "${key}" must be a map of fields`);
    }
  }
  return { file, entries: data };
}

// URL-safe id from a filename: "Wally_the_Bugbear.png" → "wally-the-bugbear".
export function slugify(file) {
  return path
    .parse(file)
    .name.normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item';
}

// "Aang_Breathing_Fire.jpg" → "Aang Breathing Fire".
export function humanise(file) {
  return path
    .parse(file)
    .name.replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Pairs of files whose slugs collide (case-insensitively).
export function findSlugCollisions(files) {
  const seen = new Map();
  const collisions = [];
  for (const file of files) {
    const slug = slugify(file);
    if (seen.has(slug)) collisions.push([seen.get(slug), file, slug]);
    else seen.set(slug, file);
  }
  return collisions;
}
