import { galleryStructuredData } from './jsonld.js';

// Directory data for a gallery page (src/art/art.11tydata.js and
// src/design/design.11tydata.js): which folder of `galleries` it renders,
// the lightbox script, and the CollectionPage + ItemList JSON-LD.
export function galleryPageData(folder) {
  return {
    gallery: folder,
    pageType: 'CollectionPage',
    pageScripts: ['/assets/js/lightbox.js'],
    eleventyComputed: {
      jsonld: (data) => {
        const items = data.galleries?.[folder];
        if (!items) throw new Error(`galleries.${folder} is missing: is gallery/${folder}/ present?`);
        return galleryStructuredData({ site: data.site, url: data.page.url, title: data.title, items });
      }
    }
  };
}
