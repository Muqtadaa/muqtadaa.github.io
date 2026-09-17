import { COLLECTION_TAG, TYPE_IDS, articleStructuredData, isPostType } from '../../../lib/dnd.js';

// Directory data for the D&D posts (plan WS-F). Every Markdown file in this
// folder becomes /dnd/<file-slug>/ on the dnd-post layout and joins the
// `dndPost` collection (distinct from the gallery tag `dnd`, which marks
// artwork). Front matter, see src/dnd/README.md:
//   title, type (lore | campaign | character), summary, date,
//   tags (optional, matched against gallery tags for "Related art"),
//   cover (optional: a filename in gallery/art/),
//   placeholder: true (optional: shows the "placeholder text" note).
export default {
  layout: 'layouts/dnd-post.njk',
  tags: [COLLECTION_TAG],
  permalink: '/dnd/{{ page.fileSlug }}/',
  eleventyComputed: {
    type: (data) => {
      if (!isPostType(data.type)) {
        throw new Error(
          `${data.page.inputPath}: "type" must be one of ${TYPE_IDS.join(', ')} (got ${JSON.stringify(data.type)})`
        );
      }
      return data.type;
    },
    // The gallery item behind `cover`, so the layout has its alt text and
    // derivatives and the page shares its image as og:image.
    coverItem: (data) => {
      if (!data.cover) return undefined;
      const item = (data.galleries?.art || []).find((entry) => entry.file === data.cover);
      if (!item) {
        throw new Error(`${data.page.inputPath}: cover "${data.cover}" is not a file in gallery/art/`);
      }
      return item;
    },
    // The summary doubles as the meta description unless one is set.
    description: (data) => data.description || data.summary,
    ogImage: (data) => data.coverItem?.full,
    ogImageAlt: (data) => data.coverItem?.alt,
    jsonld: (data) =>
      articleStructuredData({
        site: data.site,
        url: data.page.url,
        title: data.title,
        summary: data.summary,
        date: data.page.date,
        type: data.type,
        tags: data.tags,
        cover: data.coverItem
      })
  }
};
