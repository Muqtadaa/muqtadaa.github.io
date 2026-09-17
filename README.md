# muqtadaa.github.io

Source for [muqtadaa.github.io](https://muqtadaa.github.io): digital art,
graphic design, the D&D canon, three older UX case studies, and a summary of
the CRO work at [CRO Together](https://crotogether.com).

The site is static. It is built with Eleventy on every push and published to
GitHub Pages by a GitHub Actions workflow; nothing built is committed.

## Stack

| Piece | Choice | Notes |
|---|---|---|
| Generator | [Eleventy](https://www.11ty.dev/) `3.1.6`, ESM config, Nunjucks templates | `eleventy.config.js`; `"type": "module"` in `package.json` |
| Images | `@11ty/eleventy-img` `7.0.0` (sharp) | Derivatives in `.cache/img`, served from `/img/`; see *Pins* below |
| Captions | `js-yaml` for `captions.yml`, `exiftool-vendored` for embedded metadata | One exiftool process per build, closed in `eleventy.after` |
| Fonts | Newsreader + Manrope, self-hosted woff2 from `@fontsource-variable/*` | Copied into `src/assets/fonts/`; no Google Fonts request |
| CSS / JS | Hand-written, no framework, no bundler | Tokens + utilities + components; three small scripts |
| Node | 22 (`.nvmrc`) | |
| Hosting | GitHub Pages (user site), deployed from an Actions artifact | |

There is no analytics, no tracking and no email address anywhere on the site.
Contact goes through <https://crotogether.com/contact>.

## Folder layout

```
.
├── eleventy.config.js      input src/, output _site/, image shortcode, filters, .nojekyll
├── package.json            build = contrast check + gallery check + eleventy
├── .nvmrc                  Node 22
├── .github/workflows/
│   ├── pages.yml           build on every push/PR, deploy on main (see Deploy)
│   └── gallery-check.yml   lint uploads when gallery/ changes
├── gallery/                the galleries: images + captions.yml, one folder each
│   ├── art/                /art/   (README.md explains uploads)
│   └── design/             /design/
├── src/                    the Eleventy input
│   ├── index.njk           home
│   ├── art/, design/       gallery pages (layout: gallery)
│   ├── dnd/                D&D section: index.njk + posts/*.md (README.md)
│   ├── work/               case studies: yolk/, via/, port-of-peri-peri/ (+ screenshots/)
│   ├── redirects.njk       meta-refresh stubs at the old .html paths
│   ├── 404.njk             branded 404
│   ├── sitemap.njk, robots.txt.njk, llms.txt.njk
│   ├── _data/              site.js, nav.js, galleries.js, dnd.js, work.js, redirects.js
│   ├── _includes/          layouts/, partials/ (head, nav, footer, gallery, xd-embed), macros/
│   └── assets/
│       ├── css/            tokens.css (the palette contract), base, utilities, components
│       ├── js/             nav.js, lightbox.js, xd-embed.js
│       ├── fonts/          three variable woff2 files
│       ├── img/            portrait + case-study figures (build inputs, never copied as-is)
│       └── favicon.svg
├── lib/                    build helpers shared by templates, data files and scripts
│   ├── image.js            eleventy-img defaults (.cache/img, /img/, webp + jpeg)
│   ├── gallery.js          folder listing, captions.yml loading, slugs, collisions
│   ├── gallery-page.js     directory data for the two gallery pages
│   ├── exif.js             the single exiftool instance
│   ├── jsonld.js           Person / WebSite / WebPage / BreadcrumbList graph
│   └── dnd.js              post types, grouping, related art, prev/next
└── scripts/
    ├── contrast.mjs        asserts the token pairs in tokens.css meet 7:1 (fails the build)
    └── check-gallery.mjs   warns on oversized/odd uploads, fails on bad YAML or collisions
```

Build output (`_site/`), `node_modules/` and `.cache/` are git-ignored.

## Local development

```sh
npm ci
npm run build     # node scripts/contrast.mjs && node scripts/check-gallery.mjs && eleventy
npm start         # eleventy --serve (watches gallery/ too)
```

The first build resizes every gallery image (three widths, two formats) and
takes a few minutes; later builds reuse `.cache/img` and are fast.

## Adding art or design work

The galleries are data-driven: the files in `gallery/art/` and
`gallery/design/` *are* the galleries. Nothing in `src/` changes when a piece
is added. From the GitHub website:

1. Export the image: JPEG, PNG or WebP (GIF for animation), at most 2500 px
   on the long edge and under 25 MiB. Use letters, digits, `-` and `_` in the
   filename; no spaces or parentheses.
2. Open the folder on GitHub and use **Add file → Upload files**.
3. Add a block to that folder's `captions.yml` with a `caption` (your words,
   shown under the image), an `alt` (a literal one-line description), and
   optionally `title`, `tags` and `order`.

`gallery/art/README.md` and `gallery/design/README.md` carry the copy-paste
template, including the `video`, `document` and `animated` blocks used for
timelapse MP4s, the PDF booklet and animated GIFs.

How a caption is chosen, in order: `captions.yml` entry → a `.txt` file with
the same basename → embedded metadata (XMP `dc:description`, XMP `dc:title`,
IPTC caption, EXIF `ImageDescription`, Windows title/comment, PNG text) → the
filename, humanised, with a `::warning` in the build log. Files with no
`order` sort first, so a fresh upload lands at the top of the gallery and on
the home page.

The build **fails** for malformed `captions.yml`, an entry whose file is
missing, an explicit `alt: ""` with no caption, or two filenames that differ
only by case. A missing `captions.yml` entry is a `::warning`. Size, dimension
and filename findings are a `::warning` for the files a push or PR touched
(`--changed-since`, run by both workflows) and a `::notice` when the whole
tree is checked (`npm run build`), because Actions shows at most 10
annotations per level per step and the legacy originals alone exceed that.
`gallery-check.yml` runs the same checks on any push or PR that touches
`gallery/`, so a bad upload is flagged before it reaches `main`.

Existing originals stay in git untouched (some are 5000 × 5000 PNGs); they are
downscaled at build time and never copied to the output. Video, PDF and GIF
files are served as-is from `/media/<folder>/`.

## The D&D canon

`/dnd/` is a Markdown collection in `src/dnd/posts/`. Each post has front
matter `title`, `type` (`campaign`, `lore` or `character`; anything else fails
the build), `summary`, `date`, optional `tags` and an optional `cover` naming
an image in `gallery/art/`. The index groups posts by type, newest first, and
shows a strip of art tagged `dnd`; each post lists related art by shared tags
and links to the previous/next post of its type. `src/dnd/README.md` has the
template. The three sample posts carry `placeholder: true` until real copy
replaces them.

## Case studies

`src/work/<slug>/index.njk` on the `case-study` layout. The Adobe XD
prototypes are click-to-load (`partials/xd-embed.njk` + `assets/js/xd-embed.js`)
with an "Open in Adobe XD" link. Drop screenshots into
`src/work/<slug>/screenshots/` and the layout renders them as a strip
(`src/_data/work.js`), so the pages keep their evidence if the embeds go dark.

## Design tokens

`src/assets/css/tokens.css` is the Forest & moss palette; header comments map
each token to its CRO Together `theme.css` origin. `scripts/contrast.mjs`
parses the file and fails the build if any body-text pair drops below 7:1
(WCAG AAA). Light mode only.

## Deploy

`.github/workflows/pages.yml`:

- **build** runs on every push, pull request and manual dispatch: Node 22,
  `npm ci`, `check-gallery.mjs --changed-since` for the touched files,
  `npm run build`, then uploads `_site/` as the Pages artifact. The `.cache/`
  directory is restored and saved with `actions/cache` keyed by
  `hashFiles('gallery/**')` (with a prefix restore key), so only new or
  changed images are resized on CI. Only the derivatives the build asked for
  are copied from `.cache/img` to `_site/img`, so a restored cache never
  ships derivatives of deleted or renamed images.
- **deploy** runs on every push to `main`. Pull requests stop after the build
  job. Its first step sets the repository's Pages build type to `workflow`
  through the API, then `actions/deploy-pages` publishes the artifact. That
  first step matters: while Pages is set to "Deploy from a branch" the
  deployment fails and the repository instead runs Jekyll over the source,
  which cannot compile the Nunjucks templates. (`actions/configure-pages` does
  not cover this. It returns early when a Pages site already exists, so it only
  sets the build type when Pages is off entirely.) The call is idempotent and
  needs only the `pages: write` permission the job already has.

If that step is ever refused, the run fails rather than publishing nothing, and
the setting can be changed by hand at **Settings → Pages → Build and deployment
→ Source = GitHub Actions**.

Rollback is `git revert` and a push; Pages redeploys the previous artifact.

The output includes `.nojekyll`, `sitemap.xml`, `robots.txt`, `llms.txt`,
`404.html`, and meta-refresh stubs at the old `.html` addresses
(`src/_data/redirects.js`) so links in the wild keep resolving.

## Pins

- `@11ty/eleventy` `3.1.6` and `@11ty/eleventy-img` `7.0.0` are pinned exactly.
  eleventy-img 7 was verified on this Eleventy version with a one-image spike
  before the galleries were built; if a future Eleventy or sharp update breaks
  it, `@11ty/eleventy-img` `6.0.4` is the known-good fallback and uses the
  same `Image()` API in `lib/image.js`.
- `sharp`, `exiftool-vendored` and `js-yaml` use caret ranges; `npm ci` keeps
  them at what `package-lock.json` says.
- Fonts were copied once from `@fontsource-variable/newsreader` and
  `@fontsource-variable/manrope` `5.3.0`; the packages stay in
  `devDependencies` only to record where the files came from.
