# Portfolio redesign — handoff

Paused mid-flow so the roll can be re-run from a network without the
`impeccable.style` block. Everything needed to resume is here.

## Where the branch is

`claude/admiring-feynman-9pta38`, reset to `origin/main` at `65a6d13`
(PR #14 merged and deployed). Clean tree. No redesign code written yet —
by contract, none may be written until the direction round closes.

## What the user decided

Asked through the structured question tool, answered:

1. **Replace the visual world.** Not a refinement. The old look is evidence
   and anti-reference, not authority. DESIGN.md gets written at finish, from
   the built world.
2. **Warmth means three levers**, chosen from four offered:
   - warmer temperature (off forest green);
   - the gallery captions lead, instead of sitting as 14px grey metadata;
   - break the uniform grid, so 37 drawings stop being 37 identical tiles.
   - **Not** chosen: hand-drawn chrome. So the redesign must need no drawn
     assets from the user.
3. PR #14 is merged, so this is new work off a fresh `main` and gets its own
   pull request.

Carried over and still owed: a copy pass across the whole portfolio. The user
asked for it in the same breath as the redesign and chose the redesign route
over "copy first, design after", so the copy rides with the build rather than
preceding it.

## Constraints that outrank the roll

- `PRODUCT.md` brand commitments. Voice on the portfolio is **first person**
  (this is the opposite of `/dnd/`, which the user asked to keep third person
  — see `src/dnd/README.md`).
- Accessibility: body text pairs verified at 7:1 by `scripts/contrast.mjs` in
  CI. A new palette must pass the same gate; the script parses single-line
  `--name: #rrggbb;` declarations out of `tokens.css`.
- The whole site must keep working with JavaScript off.
- `tokens.css` currently mirrors CRO Together's `theme.css` role for role.
  A replacement world will likely break that parity. The user accepted this
  risk when choosing to replace.

## Impeccable flow state

Mode: **Experience** (portfolio/gallery — the work leads, the interface
recedes).

Seed already rolled:

```
node .claude/skills/impeccable/scripts/concept-seed.mjs --scope direction --mode experience
  → seed key a169a9d8
  → ASSIGNED INDEX: 7
  → source: degraded
```

**The roll ran degraded.** The agent proxy rejects `impeccable.style` with a
403 on the CONNECT tunnel, so there are no challenger worlds and no
QUALITY BAR boards. This is the thing to fix on resume:

```
node .claude/skills/impeccable/scripts/concept-seed.mjs \
  --scope direction --mode experience --from a169a9d8
```

Its only network contact is one GET to `https://impeccable.style/api/roll`
carrying scope, mode, the eight-hex seed key and a re-roll counter. No project
files, prompts, code or conversation context are transmitted, and nothing is
written.

Build path: no image generation is available in this environment, so the build
is **code-led** by contract. No comps; the ambition lives in the direction
contract's FIRST VIEWPORT block and a named signature interaction, which the
finish reviewer audits in behaviour.

## The grounded list (needed to read "index 7")

Seven worlds from this audience's own culture — fan art and fandom, iPad
illustration, D&D tables, comics, mosque youth-group design — ordered by
resonance, spanning five material families:

1. The sketchbook / artist's working surface — *analogue studio*
2. The comic book page — *print comics*
3. Procreate, the drawing app itself — *screen tool interface*
4. The D&D rulebook spread — *RPG publication*
5. The risograph zine / community flyer — *small-press print*
6. The animation model sheet — *studio production paperwork*
7. **The survey atlas / pictorial cartography — assigned by the roll**

Kept **out** as the rut: the quiet cream editorial portfolio with a serif
display face and a terracotta accent — which is what the site currently is —
and its predictable opposite, the near-black gallery with one neon accent.

## Guard on the assigned direction

The survey-atlas world must **not** render as parchment, sepia and
hand-lettering. That is the cream-and-serif default wearing the subject's
clothes, and it is the exact failure the calibration note in `new-work.md`
describes. Its palette comes from cartography's saturated materials —
geological survey sheets, mid-century pictorial atlases, nautical chart
cyan and magenta — not from fantasy-map parchment.

## What the audit found cold

Evidence for the build, from reading the built site at 1440px and 390px:

1. Every page opens identically: eyebrow, serif H1, lead paragraph, on linen.
   Art, Design, D&D and Work are indistinguishable above the fold.
2. Fourteen eyebrows site-wide. The craft floor bans them outright.
3. The 51 gallery captions are the warmest writing on the site and are set as
   14px muted grey under a tile.
4. The palette is cool; the warmest thing on screen is the Agdaron map.
5. Nothing is handmade, on a site by an illustrator.
6. The art sits in identical rounded rectangles at one aspect ratio.

## Next three steps on resume

1. Re-run the seed command above from an unrestricted network. If challengers
   come back, fuse each before judging, weigh on audience identification and
   product clarity, and record a verdict per challenger.
2. Present the direction round: the assigned direction fully committed, one
   IMPECCABLE'S PICK card for the top-ranked grounded candidate (the
   sketchbook, with familiarity named as its honest risk), any challengers by
   verdict, and the standing exit. Via `serve-question.mjs` if a browser can
   reach this container; the structured question tool is the fallback.
3. Only once the user locks a card: write the direction contract into the root
   layout as an HTML comment, then build.
