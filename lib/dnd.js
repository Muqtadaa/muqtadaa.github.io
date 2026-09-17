// The D&D canon (plan WS-F). Shared by src/dnd/posts/posts.11tydata.js (type
// validation, Article JSON-LD), src/_data/dnd.js (the group order and copy on
// /dnd/) and the filters eleventy.config.js registers for the layouts.

// Display order on /dnd/ and in the home teaser: Campaigns, Lore, Characters.
export const POST_TYPES = [
  {
    id: 'campaign',
    label: 'Campaign',
    plural: 'Campaigns',
    description: 'The stories the table has actually played through: who was there, where it went, and what broke.'
  },
  {
    id: 'lore',
    label: 'Lore',
    plural: 'Lore',
    description: 'The world itself. Places, history, gods, factions and the rules that hold them together.'
  },
  {
    id: 'character',
    label: 'Character',
    plural: 'Characters',
    description: 'Player characters and the NPCs who refused to stay minor.'
  }
];

export const TYPE_IDS = POST_TYPES.map((type) => type.id);

// The collection tag that gathers the posts; distinct from the gallery tag
// `dnd`, which marks artwork.
export const COLLECTION_TAG = 'dndPost';

export function isPostType(value) {
  return TYPE_IDS.includes(value);
}

export function typeLabel(id) {
  return POST_TYPES.find((type) => type.id === id)?.label || id;
}

// Tags that describe the post's subject, i.e. everything except the
// collection tag.
export function subjectTags(tags) {
  return (tags || []).filter((tag) => tag !== COLLECTION_TAG);
}

// Posts of one type, newest first. `posts` is collections.dndPost.
export function postsOfType(posts, type) {
  return (posts || [])
    .filter((post) => post.data.type === type)
    .sort((a, b) => b.date - a.date);
}

// [{ type, posts }] for every type that has at least one post, in display
// order.
export function groupPosts(posts) {
  return POST_TYPES.map((type) => ({ type, posts: postsOfType(posts, type.id) })).filter(
    (group) => group.posts.length
  );
}

// Art items (galleries.art) related to a post: those whose tags intersect the
// post's subject tags, the ones sharing the most tags first, gallery order
// as the tie-break. Falls back to everything tagged `dnd`.
export function relatedArt(items, tags, limit = 6) {
  const wanted = new Set(subjectTags(tags));
  let scored = (items || [])
    .map((item, index) => ({ item, index, shared: item.tags.filter((tag) => wanted.has(tag)).length }))
    .filter((entry) => entry.shared > 0);
  if (!scored.length) {
    scored = (items || [])
      .map((item, index) => ({ item, index, shared: 1 }))
      .filter((entry) => entry.item.tags.includes('dnd'));
  }
  return scored
    .sort((a, b) => b.shared - a.shared || a.index - b.index)
    .slice(0, limit)
    .map((entry) => entry.item);
}

// The neighbours of a post inside its type: `newer` and `older`, either
// undefined at the ends. `posts` is collections.dndPost, `url` the page url.
export function adjacentPosts(posts, url) {
  const current = (posts || []).find((post) => post.url === url);
  if (!current) return { newer: undefined, older: undefined };
  const siblings = postsOfType(posts, current.data.type);
  const index = siblings.findIndex((post) => post.url === url);
  return {
    newer: index > 0 ? siblings[index - 1] : undefined,
    older: index < siblings.length - 1 ? siblings[index + 1] : undefined
  };
}

// Article JSON-LD for one post, added to the page graph by head.njk through
// the `jsonld` data key.
export function articleStructuredData({ site, url, title, summary, date, type, tags, cover }) {
  const pageUrl = new URL(url, site.url).href;
  const article = {
    '@type': 'Article',
    '@id': `${pageUrl}#article`,
    headline: title,
    description: summary,
    url: pageUrl,
    datePublished: new Date(date).toISOString().slice(0, 10),
    articleSection: typeLabel(type),
    genre: 'Dungeons & Dragons campaign canon',
    inLanguage: site.language,
    isPartOf: { '@id': site.websiteId },
    author: { '@id': site.personId },
    creator: { '@id': site.personId },
    publisher: { '@id': site.personId },
    mainEntityOfPage: { '@id': pageUrl }
  };
  const keywords = subjectTags(tags);
  if (keywords.length) article.keywords = keywords.join(', ');
  if (cover) article.image = new URL(cover.full, site.url).href;
  return article;
}
