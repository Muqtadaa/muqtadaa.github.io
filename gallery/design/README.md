# Adding a design piece

Three steps, all in the GitHub website; the site rebuilds itself.

1. **Export the image.** JPEG, PNG or WebP (GIF for animation), no larger
   than 2500 px on the long edge and under 25 MiB. Letters, digits, `-` and
   `_` in the filename; no spaces or parentheses.
2. **Upload it here.** On this folder's page: *Add file → Upload files*,
   drop the image in, commit.
3. **Add a block to `captions.yml`** (open it, pencil icon, paste at the
   end, commit). The image shows without one, with the filename as its
   caption and a warning in the build, so this step is worth doing.

```yaml
New_Flyer.jpg:
  title: New Flyer
  caption: The story behind it, in your own words. This is what shows under the image.
  alt: A literal one-line description of what is in the picture, for screen readers.
  tags: [youth-group]
  order: 5
```

Only `caption` and `alt` matter to visitors; everything else is optional.

- `order`: lower numbers come first. A file with no `order` goes to the top
  of the gallery (and onto the home page) until you give it one, so new
  work surfaces on its own. Give it a low `order` to keep it there, a high
  one to file it away.
- `tags`: free words. `dnd` also links a piece to the D&D section. The
  ones in use: `youth-group`, `client`, `animation`.
- `hidden: true` keeps a file in the folder but out of the gallery.

## Timelapse videos, animated GIFs and PDFs

The image is always the tile; the extra file is what opens on top of it.

```yaml
Blue_Dragon.jpg:
  caption: …
  alt: …
  video:
    src: Blue_Dragon.mp4        # uploaded to this folder next to the image
    poster: Blue_Dragon.jpg     # optional; defaults to the image itself

Waterbending.gif:
  caption: …
  alt: …
  animated: true                # the tile shows the first frame, the GIF plays in the lightbox

Booklet.png:
  caption: …
  alt: …
  document:
    url: Booklet.pdf
    label: View the full booklet (PDF)
```

## Other ways to caption

- A text file with the same name (`New_Flyer.txt`) next to the image
  is used as the caption when there is no `captions.yml` entry.
- A **Title** or **Description** embedded in the file is used when there is
  no `captions.yml` entry: on Windows, right-click the JPEG → *Properties →
  Details → Title*; on a Mac, the Title field in Photos, Preview (*Tools →
  Show Inspector*) or Lightroom. `captions.yml` and the `.txt` file always
  win over it.

Do not rename or delete files that already have a block here without
updating the block, or the build stops with an error naming the file.
