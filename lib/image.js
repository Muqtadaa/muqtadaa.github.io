import Image from '@11ty/eleventy-img';

// Shared eleventy-img settings. Derivatives are written to .cache/img (kept
// between CI runs by actions/cache, never committed). The eleventy.after hook
// in eleventy.config.js copies to _site/img only the files this process
// produced (`producedFiles`), so derivatives of images that were deleted or
// renamed since the cache was saved never ship.
export const IMAGE_DEFAULTS = {
  formats: ['webp', 'jpeg'],
  outputDir: '.cache/img',
  urlPath: '/img/',
  sharpJpegOptions: { quality: 82 }
};

// Output paths (as eleventy-img reports them, e.g. .cache/img/<hash>-480.webp)
// of every derivative resize() returned during this process.
export const producedFiles = new Set();

export async function resize(src, options = {}) {
  const metadata = await Image(src, { ...IMAGE_DEFAULTS, ...options });
  for (const entries of Object.values(metadata)) {
    for (const entry of entries) {
      if (entry.outputPath) producedFiles.add(entry.outputPath);
    }
  }
  return metadata;
}
