import Image from '@11ty/eleventy-img';

// One-image spike for @11ty/eleventy-img 7 on Eleventy 3.1.6 (P1). It writes
// derivatives of a single gallery file into .cache/img (persisted by
// actions/cache, never committed) and exposes the metadata to templates.
// Nothing renders it yet; P2's _data/galleries.js replaces it.
export default async function () {
  const src = 'digitalart/art/Aang.jpg';
  const metadata = await Image(src, {
    widths: [480],
    formats: ['webp', 'jpeg'],
    outputDir: '.cache/img',
    urlPath: '/img/',
    sharpJpegOptions: { quality: 82 }
  });
  return { src, metadata };
}
