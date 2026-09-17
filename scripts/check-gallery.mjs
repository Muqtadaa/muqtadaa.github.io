// Checks gallery/<folder>/ before the build (plan WS-E step 4). Runs in
// `npm run build` and in .github/workflows/gallery-check.yml and pages.yml.
//
//   ::warning  image without a captions.yml entry
//   ::warning  file > 25 MiB, image > 2500 px on its long edge, unsupported
//     or       extension, spaces or parentheses in the name: a ::warning for
//   ::notice   the files named by --changed-since, a ::notice when every
//              file is checked (see below)
//   ::error    malformed captions.yml, an entry whose file is missing, a
//              filename collision once lower-cased (exit 1)
//
//   node scripts/check-gallery.mjs                       # every file
//   node scripts/check-gallery.mjs --changed-since <ref>  # size/dimension/
//        name findings only for files added or changed since that git ref
//        (the CI workflows pass the PR base); the error checks always run
//        on the whole folder.
//
// GitHub Actions shows at most 10 annotations of each level per step. The
// legacy originals already produce more than that many size findings, so a
// full-tree run demotes them to ::notice and keeps ::warning for the one
// finding a new upload most needs to see: the missing captions.yml entry.
// The --changed-since run in CI reports the touched files as ::warning.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
import {
  CAPTIONS_FILE,
  IMAGE_EXT,
  MEDIA_EXT,
  findSlugCollisions,
  listFolders,
  listImages,
  loadCaptions
} from '../lib/gallery.js';

const MAX_BYTES = 25 * 1024 * 1024;
const MAX_EDGE = 2500;
const ALLOWED = /\.(jpe?g|png|webp|gif|mp4|webm|pdf|txt|yml|yaml|md)$/i;

let warnings = 0;
let notices = 0;
let errors = 0;

function warn(file, message) {
  warnings += 1;
  console.log(`::warning file=${file}::${message}`);
}

function notice(file, message) {
  notices += 1;
  console.log(`::notice file=${file}::${message}`);
}

function error(file, message) {
  errors += 1;
  console.log(`::error file=${file}::${message}`);
}

// Files changed since a ref, or null when every file should be checked.
function changedSince(argv) {
  const flag = argv.indexOf('--changed-since');
  if (flag === -1) return null;
  const ref = argv[flag + 1];
  if (!ref || /^0+$/.test(ref)) return null;
  try {
    const out = execFileSync('git', ['diff', '--name-only', '--diff-filter=AMR', `${ref}...HEAD`, '--', 'gallery'], {
      encoding: 'utf8'
    });
    return new Set(out.split('\n').filter(Boolean));
  } catch (err) {
    console.log(`::notice::could not diff against ${ref} (${err.message.split('\n')[0]}); checking every file`);
    return null;
  }
}

const changed = changedSince(process.argv.slice(2));
// Size, dimension and filename findings: ::warning for the changed files of
// a --changed-since run, ::notice when the whole tree is checked.
const flag = changed ? warn : notice;
const folders = listFolders();
if (folders.length === 0) {
  console.log('check-gallery: no gallery/ folders found');
  process.exit(0);
}

for (const folder of folders) {
  const dir = path.posix.join('gallery', folder);
  let captions = { entries: {} };
  try {
    captions = loadCaptions(dir);
  } catch (err) {
    error(path.posix.join(dir, CAPTIONS_FILE), err.message);
  }

  const files = fs.readdirSync(dir).sort();
  const images = listImages(dir);
  const imageSet = new Set(images);

  for (const key of Object.keys(captions.entries)) {
    if (!fs.existsSync(path.join(dir, key))) {
      error(path.posix.join(dir, CAPTIONS_FILE), `"${key}" is listed but the file is not in ${dir}/`);
    } else if (!imageSet.has(key)) {
      error(path.posix.join(dir, CAPTIONS_FILE), `"${key}" is not an image; captions.yml keys must be the jpg/png/webp/gif shown in the gallery`);
    }
  }

  for (const [a, b, slug] of findSlugCollisions(images)) {
    error(path.posix.join(dir, b), `"${a}" and "${b}" both become "${slug}" once lower-cased; rename one of them`);
  }

  for (const file of files) {
    const rel = path.posix.join(dir, file);
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) continue;
    if (file === CAPTIONS_FILE || file === 'README.md') continue;

    if (imageSet.has(file) && !captions.entries[file]) {
      warn(rel, `no captions.yml entry; it will show with its filename as the caption until you add one`);
    }

    if (changed && !changed.has(rel)) continue;

    if (!ALLOWED.test(file)) {
      flag(rel, `unsupported file type; the gallery shows jpg, jpeg, png, webp and gif (video as mp4/webm, documents as pdf)`);
      continue;
    }
    if (/[\s()]/.test(file)) {
      flag(rel, `spaces or parentheses in the filename make awkward URLs; prefer letters, digits, - and _`);
    }
    const bytes = fs.statSync(full).size;
    if (bytes > MAX_BYTES) {
      flag(rel, `${(bytes / 1024 / 1024).toFixed(1)} MiB is over the 25 MiB limit; export a smaller file`);
    }
    if (IMAGE_EXT.test(file)) {
      try {
        const meta = await sharp(full, { limitInputPixels: false }).metadata();
        const edge = Math.max(meta.width || 0, meta.height || 0);
        if (edge > MAX_EDGE) {
          flag(rel, `${meta.width}x${meta.height} is larger than ${MAX_EDGE} px on the long edge; it will be downscaled at build, but a smaller export keeps the repository lean`);
        }
      } catch (err) {
        flag(rel, `could not read image dimensions (${err.message})`);
      }
    } else if (!MEDIA_EXT.test(file) && !/\.txt$/i.test(file)) {
      // yml/yaml/md other than captions.yml and README.md: harmless, ignored.
    }
  }
}

// The D&D pages show art tagged `dnd`: the "From the sketchbook" strip on
// /dnd/ and the "Related art" strip under each post. With nothing tagged,
// those sections render nothing at all rather than explaining themselves to
// the reader, so the reminder to tag something belongs here instead.
const artCaptions = loadCaptions(path.join('gallery', 'art')).entries;
const taggedDnd = Object.values(artCaptions).filter(
  (entry) => Array.isArray(entry?.tags) && entry.tags.includes('dnd')
).length;
if (fs.existsSync(path.join('gallery', 'art')) && taggedDnd === 0) {
  warn(
    path.join('gallery', 'art', CAPTIONS_FILE),
    'no artwork is tagged `dnd`, so the sketchbook strips on /dnd/ and on each D&D post render nothing; add `tags: [dnd]` to a drawing to fill them'
  );
}

console.log(
  `check-gallery: ${folders.length} folder(s), ${warnings} warning(s), ${notices} notice(s), ${errors} error(s)`
);
if (errors > 0) process.exit(1);
