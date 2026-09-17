# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three audiences arrive on different pages and want different things:

- **People who came for the art** — friends, the mosque youth group, other D&D players, people who found a drawing somewhere else. They want to look at pictures and read the story behind each one. They scroll; they do not read.
- **Growth and product teams evaluating Muqtadaa as a CRO consultant** — they arrive from LinkedIn or from crotogether.com, want to confirm there is a real person with real range behind the consultancy, and then leave for crotogether.com to hire.
- **Recruiters and peers reading the UX case studies** — Yolk, Via and Port of Peri Peri are from 2019–2020 and are kept because they show how the work is thought through, not because they are current.

## Product Purpose

The personal site of Muqtadaa Miandara: digital art, graphic design, a homebrew D&D world, and a short account of the CRO work that links out to crotogether.com. It exists so the creative work has a home that is not a social feed, and so the consultancy has a human being standing behind it.

Success is: the galleries stay current without the owner touching a template, and a visitor who came for one of the three things finds the other two without being sold to.

## Positioning

A consultant's personal site that leads with the drawings rather than the résumé. The CRO work is one section that states one number and links out; everything else is made for people the owner knows.

## Operating Context

- Publishing is a file upload. New art goes into `gallery/art/` or `gallery/design/` through the GitHub web UI, with an optional block in that folder's `captions.yml`; the Eleventy build derives sizes, captions and alt text and the page updates itself. No CMS, no admin.
- The owner writes D&D posts as Markdown in `src/dnd/posts/`, occasionally, in his own time.
- Built by Eleventy 3, deployed by GitHub Actions to GitHub Pages on every push to `main`.

## Capabilities and Constraints

- Galleries: 37 art pieces, 14 design pieces, each with a title, a caption in the owner's voice, literal alt text, and tags. Timelapse videos, animated GIFs and a PDF booklet are first-class item types.
- Lightbox is a native `<dialog>`, progressively enhanced from a plain link: with JavaScript off, every tile still opens its full-size image and the timelapse and booklet links still work.
- No contact form and no email address anywhere on this site (owner decision). Contact goes to the form at crotogether.com/contact.
- No analytics, no tracking, no third-party fonts. Fonts are self-hosted woff2.
- Palette is "forest and moss"; every body-text pair is verified at 7:1 or better by `scripts/contrast.mjs` in CI.
- The three UX case studies embed Adobe XD prototypes that load only on click. If Adobe retires them, the case studies must still read as case studies.

## Brand Commitments

- Voice: first person, plain, dry, specific. It admits what did not work. It does not sell.
- Name and wordmark: "Muqtadaa Miandara", Newsreader.
- The two sites are one identity in structured data: this site's `#person` and CRO Together's `#organization` reference each other by `@id`.
- Never on this site: client names beyond those already published, money grievances about past freelance work, an employer's name attached to a complaint, a résumé PDF.

## Evidence on Hand

- Real: 51 pieces of the owner's own artwork with captions he wrote; three complete UX case studies with genuine research artefacts (a 43-person survey, personas, Crazy Eights wireframes, two rounds of onboarding tests); a hand-drawn world map.
- Real, stated once and linked out: $15.1M incremental revenue from experimentation in 2025. The supporting detail lives on crotogether.com/proof and is not restated here.
- Absent, and not to be invented: testimonials, client logos, ratings, prices, and any D&D lore beyond what the owner has written. The D&D section is genuinely new and mostly unwritten.

## Product Principles

1. **The work is the content.** A drawing, a caption and a date beat any amount of framing around them.
2. **Say it once.** If a page already shows it, do not also explain it; if another page says it, link there instead of repeating it.
3. **Never explain the interface.** A gallery that needs instructions is a gallery that needs fixing.
4. **Publishing must stay a file upload.** Any feature that makes the owner edit a template to publish is the wrong feature.
5. **The CRO work links out, it does not compete.** One stat, four links, no case for hiring anyone on this domain.

## Accessibility & Inclusion

Every gallery image carries literal alt text distinct from its caption, and an empty `alt:` fails the build. The lightbox is fully keyboard-operable and returns focus to the tile that opened it. Contrast is enforced at 7:1 (WCAG AAA) for body text by a CI script. Motion respects `prefers-reduced-motion`. The whole site works without JavaScript.
