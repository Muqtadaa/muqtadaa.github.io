# The D&D canon

Everything under `/dnd/` is built from the Markdown files in `posts/`. Add a
file, commit, and it appears on `/dnd/` (grouped by type), on the home page
under "The table", in the sitemap and in the JSON-LD, with a cover image
resized at build time. Nothing else needs editing.

## The three types

Every post has a `type`, and the build stops with an error if it is anything
other than one of these:

| type        | For                                                                                      | Group on /dnd/ |
|-------------|------------------------------------------------------------------------------------------|----------------|
| `campaign`  | A story the table has played through: the party, where it went, what it changed.        | Campaigns      |
| `lore`      | The world itself: places, history, gods, factions, house rules.                          | Lore           |
| `character` | One player character or NPC.                                                             | Characters     |

Within a group the newest post (by `date`) comes first, and the previous/next
links at the bottom of a post stay inside its type.

## Adding a post

Create `posts/<slug>.md`; the filename becomes the address (`/dnd/<slug>/`),
so keep it lower-case with hyphens.

```markdown
---
title: The Sunken Library
type: lore
summary: One or two sentences shown on /dnd/, on the home page and as the meta description.
date: 2026-10-01
tags: [dnd, maps]
cover: dragonvillage.jpg
---

The post itself, in Markdown. Headings start at `##`.
```

- `title`, `type`, `summary` and `date` are required.
- `tags` are optional. They are matched against the tags in
  `gallery/art/captions.yml` to pick the "Related art" strip on the post: an
  artwork shows when it shares at least one tag with the post, the ones sharing
  the most tags first. A post with no matching tags falls back to everything
  tagged `dnd`. Tagging a character post and its drawings with the same word
  (`wally`, say) keeps them together.
- `cover` is optional: the filename of an image in `gallery/art/` (it must
  already have a block in `captions.yml`, whose `alt` text is reused). It
  becomes the header image and the social-share image of the post.
- `placeholder: true` shows a "placeholder text" note at the top of the post.
  The three sample posts carry it; remove the line once the real copy is in.

The `dndPost` collection tag is added automatically by `posts.11tydata.js`;
do not add it by hand, and do not use it as a gallery tag.

## Where the pieces live

- `posts/*.md`: the posts.
- `posts/posts.11tydata.js`: layout, collection tag, permalink, type check,
  cover lookup and the Article JSON-LD.
- `index.njk`: `/dnd/`, on the `dnd-index` layout; groups the collection by
  type and adds the "From the sketchbook" strip of art tagged `dnd`, each tile
  opening that piece in the gallery lightbox (`/art/#<slug>`).
- `src/_includes/layouts/dnd-post.njk`: the post page.
- `lib/dnd.js`: the type list and copy, grouping, related-art and
  previous/next helpers, and the JSON-LD builder.
