import fs from 'node:fs';
import path from 'node:path';

// Disposable Eleventy 3 config for the deploy rescue (P1). The legacy pages
// stay where they are; the rebuild (P2) replaces this with a fresh src/ tree.
export default function (eleventyConfig) {
  eleventyConfig.setInputDirectory('.');
  eleventyConfig.setOutputDirectory('_site');

  // Not templates, or not served: keep Eleventy out of them.
  eleventyConfig.ignores.add('node_modules');
  eleventyConfig.ignores.add('_site');
  eleventyConfig.ignores.add('.cache');
  eleventyConfig.ignores.add('README.md');
  eleventyConfig.ignores.add('tools');
  eleventyConfig.ignores.add('styles/dist');
  eleventyConfig.ignores.add('assets');

  // Static assets served as-is. The five page directories themselves are NOT
  // copied: their .html files are rendered by Eleventy, and only their
  // stylesheet, script and gallery media are passed through.
  eleventyConfig.addPassthroughCopy('css');
  eleventyConfig.addPassthroughCopy('styles');
  eleventyConfig.addPassthroughCopy('images');
  eleventyConfig.addPassthroughCopy('files');
  eleventyConfig.addPassthroughCopy('script.js');
  eleventyConfig.addPassthroughCopy('src/js');
  eleventyConfig.addPassthroughCopy('*/style.css');
  eleventyConfig.addPassthroughCopy('*/script.js');
  eleventyConfig.addPassthroughCopy('*/art/**');

  // GitHub Pages must not run Jekyll over the built output.
  eleventyConfig.on('eleventy.after', ({ directories }) => {
    const outDir = directories?.output || '_site';
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, '.nojekyll'), '');
  });

  return {
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    dir: {
      includes: '_includes',
      data: '_data'
    }
  };
}
