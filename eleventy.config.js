import fs from 'node:fs';
import path from 'node:path';
import { generateHTML } from '@11ty/eleventy-img';
import { IMAGE_DEFAULTS, resize } from './lib/image.js';
import { structuredData } from './lib/jsonld.js';

// Eleventy 3 config for the rebuilt site under src/ (plan WS-E). The legacy
// pages at the repository root are no longer built; they stay in git until P4
// deletes them.

export default function (eleventyConfig) {
  eleventyConfig.setInputDirectory('src');
  eleventyConfig.setOutputDirectory('_site');
  eleventyConfig.setIncludesDirectory('_includes');
  eleventyConfig.setDataDirectory('_data');

  // Not templates: the legacy scripts (deleted in P4) and folder READMEs.
  eleventyConfig.ignores.add('src/js');
  eleventyConfig.ignores.add('src/**/README.md');

  // Static assets served as-is.
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });

  // Gallery media that is never resized (video, PDF, animated GIF) is served
  // from /media/<folder>/. Object globs flatten into the target, so map one
  // folder at a time. gallery/ arrives in P2b; until then this is a no-op.
  if (fs.existsSync('gallery')) {
    for (const folder of fs.readdirSync('gallery', { withFileTypes: true })) {
      if (!folder.isDirectory()) continue;
      eleventyConfig.addPassthroughCopy({
        [`gallery/${folder.name}/*.{mp4,webm,pdf,gif}`]: `media/${folder.name}`
      });
    }
  }
  eleventyConfig.addWatchTarget('gallery');

  // ── Images ────────────────────────────────────────────────────────────
  // eleventy-img derivatives go to .cache/img (persisted by actions/cache,
  // never committed) and are copied to _site/img in eleventy.after: a
  // passthrough copy would race the shortcodes that write them.
  eleventyConfig.addShortcode('image', async function (src, alt, options = {}) {
    if (typeof alt !== 'string') {
      throw new Error(`image shortcode: alt text is required for ${src}`);
    }
    const metadata = await resize(src, { widths: options.widths || [480, 960] });
    const attributes = {
      alt,
      sizes: options.sizes || '100vw',
      loading: options.loading || 'lazy',
      decoding: options.decoding || 'async'
    };
    if (options.class) attributes.class = options.class;
    if (options.fetchpriority) attributes.fetchpriority = options.fetchpriority;
    return generateHTML(metadata, attributes);
  });

  // URL of one derivative (used for og:image and JSON-LD `image`).
  eleventyConfig.addAsyncFilter('imageUrl', async function (src, width = 960, format = 'jpeg') {
    const metadata = await resize(src, { widths: [width], formats: [format] });
    return metadata[format][0].url;
  });

  // ── Filters ───────────────────────────────────────────────────────────
  eleventyConfig.addFilter('absoluteUrl', (value, base) => new URL(value, base).href);

  // JSON for <script type="application/ld+json">: `<` is escaped so no
  // string in the graph can close the script element.
  const toJsonLd = (value) => JSON.stringify(value).replace(/</g, '\\u003c');
  eleventyConfig.addFilter('jsonld', toJsonLd);
  eleventyConfig.addFilter('structuredData', (input) => toJsonLd(structuredData(input)));

  eleventyConfig.addFilter('isActive', (pageUrl, href) =>
    href === '/' ? pageUrl === '/' : pageUrl.startsWith(href)
  );

  eleventyConfig.addFilter('limit', (array, count) => (array || []).slice(0, count));

  eleventyConfig.addFilter('readableDate', (value) =>
    new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    })
  );

  eleventyConfig.addFilter('isoDate', (value) => new Date(value).toISOString().slice(0, 10));

  // ── After build ───────────────────────────────────────────────────────
  eleventyConfig.on('eleventy.after', async ({ directories }) => {
    const outDir = directories?.output || '_site';
    fs.mkdirSync(outDir, { recursive: true });

    // GitHub Pages must not run Jekyll over the built output.
    fs.writeFileSync(path.join(outDir, '.nojekyll'), '');

    if (fs.existsSync(IMAGE_DEFAULTS.outputDir)) {
      fs.cpSync(IMAGE_DEFAULTS.outputDir, path.join(outDir, 'img'), { recursive: true });
    }

    // _data/galleries.js (P2b) reads embedded captions with exiftool-vendored;
    // its process must be closed or the build never exits. Optional until
    // that dependency lands.
    try {
      const { exiftool } = await import('exiftool-vendored');
      await exiftool.end();
    } catch (error) {
      if (error?.code !== 'ERR_MODULE_NOT_FOUND') throw error;
    }
  });

  return {
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk'
  };
}
