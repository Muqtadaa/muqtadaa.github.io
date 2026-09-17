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

The `dndPost` collection tag is added automatically by `posts.11tydata.js`;
do not add it by hand, and do not use it as a gallery tag.

## What goes in a post

A post says only what is actually written down. When you sit down to add one,
or to expand one of the short ones, these are the sections worth having. They
live here rather than in the posts themselves, because an outline addressed to
the author is not something a reader should have to read.

**Lore.** The shape of the place (geography, and only what a traveller could
learn in a tavern — secrets belong in the campaign posts). Who runs things
(factions, crowns, churches). The rules of the world (how magic is taught, what
the gods answer, which monsters are real). What the map gets wrong (the running
list of what the party renamed, burned down or accidentally founded).

**Campaign.** The party, a paragraph per character, linking to their character
post once it exists: who they were at level one and what they turned into.
Where it went, in order, told the way you would tell a new player, spoilers
included. The moments people still bring up — three or four, told properly,
say more than any summary. What it changed in the world.

**Character.** Where they come from, in their own voice, at the length they
would tell it. What they can do, in plain words: what the kit gives them, what
it asks for, and the one trick the party has learned to stand clear of. A
session log, newest first.


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

## The character facts block

A character post opens with a short list of the things a reader wants before the
prose. It is plain HTML at the top of the Markdown body, and the `dnd-facts`
styles in `components.css` turn it into hairline rows:

```html
<dl class="dnd-facts">
  <div class="dnd-facts__row"><dt>Origin</dt><dd>Underkeep of Barazar</dd></div>
  <div class="dnd-facts__row"><dt>Status</dt><dd>Active with the Veil Piercers</dd></div>
</dl>
```

Four rows is the working maximum. Labels are nouns, not sentences, and the last
row is usually where the character's thread currently stands.

## Art still wanted

`the-undying-of-the-light.md` was written from the OneNote campaign records, and
it breaks into acts at the points where a picture would earn its place. Nothing
in `gallery/art/` covers them yet, and the post has no `cover` until one exists.
When a piece is ready, add it to `gallery/art/captions.yml` tagged `dnd` and it
joins the "Related art" strip automatically; the one that leads the post is the
`cover` in its front matter.

| Section | What would go there |
|---|---|
| The post cover | The lead image for the campaign as a whole |
| Six strangers in Elleris | Early Elleris battlemap, the party token line-up, or the Cistern map |
| Barazar | The Barazar map, dwarven city art, the Stonesword, or the Mind Flayer encounter |
| The Unity Tournament | The Malinar coup battlemap, Murdock's token art, the burning city or the divine manifestation |
| Dolonde | Dolonde Old City, Magnus Rex, Gray Lady / Arielle token art, the Arc du Fey |
| The Feywild | The Autumn Court, the Winter battlemap, Corellon's tomb, Feywild token art |
| Leviathan | Leviathan itself, the pirate city, the Astral Sea, the cracked Amulet of Aphiel |
| The Ruby Gate | The Gray Lady's Peril, the Elder Brain Dragon encounter, the Ruby Gate |

`children-of-a-broken-age.md` has no cover for the same reason. The character
posts have none either, apart from Wally; token art would be the natural fit.

## Voice

Third person throughout, in the register of a traditional fantasy chronicle.
Nothing under `/dnd/` is written in the first person, including the character
posts and the section copy on `/dnd/` and the home page.
