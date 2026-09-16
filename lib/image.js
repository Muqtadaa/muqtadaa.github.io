import Image from '@11ty/eleventy-img';

// Shared eleventy-img settings. Derivatives are written to .cache/img (kept
// between CI runs by actions/cache, never committed) and copied to _site/img
// by the eleventy.after hook in eleventy.config.js.
export const IMAGE_DEFAULTS = {
  formats: ['webp', 'jpeg'],
  outputDir: '.cache/img',
  urlPath: '/img/',
  sharpJpegOptions: { quality: 82 }
};

export function resize(src, options = {}) {
  return Image(src, { ...IMAGE_DEFAULTS, ...options });
}
