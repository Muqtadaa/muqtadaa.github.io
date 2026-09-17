// One-time migration (plan WS-E step 4): turns the hand-written
// `<img alt="…">` blocks of the legacy digitalart/ and graphicdesign/ pages
// into gallery/<folder>/captions.yml. Its output is committed and then
// hand-edited (owner decision D11), so re-running it would undo those edits;
// it is kept for reference and for the owner to see where the data came from.
//
//   node scripts/migrate-captions.mjs            # writes both captions.yml
//   node scripts/migrate-captions.mjs --dry-run  # prints them instead
//
// Per item: `caption` is the legacy alt verbatim (the alt WAS the caption),
// `alt` is a short literal description drafted from the image for the owner
// to proofread, `title` comes from the filename with a few curated overrides,
// `order` is the position in the legacy page × 10, and the five special
// files get their `video` / `document` / `animated` blocks. Tags follow the
// taxonomy in the plan.
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const dryRun = process.argv.includes('--dry-run');

const SOURCES = {
  art: 'digitalart/digitalart.html',
  design: 'graphicdesign/graphicdesign.html'
};

// Legacy filename → current filename (renamed in the same git mv).
const RENAMES = {
  'Superman.jpg': 'superman-reeves.jpg',
  'superman.png': 'superman-flats.png',
  'youthlogo-one.png': 'youth-logo-one.png'
};

// Media that is not a plain image (no substring hacks: explicit fields).
const SPECIAL = {
  'Blue_Dragon.jpg': { video: { src: 'Blue_Dragon.mp4', poster: 'Blue_Dragon.jpg' } },
  'Eye_To_Eye_On_A_Mountaintop.png': {
    video: { src: 'Eye_To_Eye_On_A_Mountaintop.mp4', poster: 'Eye_To_Eye_On_A_Mountaintop.png' }
  },
  'Waterbending.gif': { animated: true },
  'Spider-Man_Running.gif': { animated: true },
  // The plan converts mosque.gif to mp4 + poster with ffmpeg; this sandbox
  // has none, so it ships as `animated` (the 11 MB GIF only loads in the
  // lightbox) until the conversion follow-up.
  'mosque.gif': { animated: true },
  'woc.png': { document: { url: 'woc.pdf', label: 'View the full booklet (PDF)' } }
};

const TAGS = {
  dnd: [
    'agdaron.png', 'dragonvillage.jpg', 'Isometric_Underground_Battlemap.jpg', 'Wally_the_Bugbear.png',
    'dragonborn.png', 'Wizard.jpg', 'Duck_Team.jpg', 'robot.jpg', 'galaxy.jpg'
  ],
  maps: ['agdaron.png', 'dragonvillage.jpg', 'Isometric_Underground_Battlemap.jpg', 'Fantasy_Planet.jpg'],
  timelapse: ['Blue_Dragon.jpg', 'Eye_To_Eye_On_A_Mountaintop.png'],
  animation: ['Waterbending.gif', 'Spider-Man_Running.gif', 'mosque.gif'],
  portrait: ['Ahmed.jpg', 'selfportrait.jpg', 'profileportrait.jpg', 'native_american.jpg'],
  'youth-group': [
    'horizons.jpeg', 'hotline.jpeg', 'millennial-ad.jpeg', 'millennial.jpeg', 'mosque.gif', 'snap-filter.png',
    'youth-logo-one.png', 'youth-logo-two.jpeg', 'youth-logo-three.jpeg', 'youthcard.jpeg', 'woc.png'
  ],
  client: ['taqwa-logo.png', 'utep-logo.png'],
  wally: ['Wally_the_Bugbear.png']
};

// Titles that a humanised filename gets wrong.
const TITLES = {
  'Aang.jpg': 'Aang',
  'Aang_Breathing_Fire.jpg': 'Aang Breathing Fire',
  'agdaron.png': 'Agdaron',
  'Blue_Dragon.jpg': 'Blue Dragon',
  'dragonvillage.jpg': 'Dragon Village',
  'dragonborn.png': 'Lucky the Lizard',
  'Eye_To_Eye_On_A_Mountaintop.png': 'Eye to Eye on a Mountaintop',
  'eyepencil.jpg': 'Eye in Pencil',
  'greenlantern.jpg': 'Green Lantern',
  'native_american.jpg': 'Native American',
  'obama.png': 'President v. Aliens II',
  'profileportrait.jpg': 'Profile Portrait',
  'robot.jpg': 'Little Robot',
  'selfportrait.jpg': 'Self-Portrait',
  'spiderman.png': 'Spider-Man',
  'Spider-Man_Running.gif': 'Spider-Man Running',
  'superman-flats.png': 'Superman, Flats',
  'superman-reeves.jpg': 'Superman, Reeves',
  'theflash.jpg': 'The Flash',
  'Wally_the_Bugbear.png': 'Wally the Bugbear',
  'Wizard.jpg': 'Athatar Ellerium',
  'womanpencil.jpg': 'Woman in Pencil',
  'horizons.jpeg': 'Looking Beyond the Horizon',
  'hotline.jpeg': '1-800-HOTLINEDEEN',
  'millennial-ad.jpeg': 'The Millennial Muslim, teaser',
  'millennial.jpeg': 'The Millennial Muslim, flyer',
  'mosque.gif': 'Mosque expansion',
  'old-logo.png': 'Old personal logo',
  'snap-filter.png': 'Youth dinner Snapchat filter',
  'taqwa-logo.png': 'Taqwa Seminary',
  'utep-logo.png': 'UTEP MSL',
  'youth-logo-one.png': 'IACC Youth logo',
  'youth-logo-two.jpeg': 'IACC Youth, Lucasfilm style',
  'youth-logo-three.jpeg': 'Build-a-Basket',
  'youthcard.jpeg': 'Youth group card',
  'woc.png': 'A Life, A Legacy'
};

// Literal descriptions drafted from the images (owner proofreads).
const ALTS = {
  'Aang.jpg': 'Aang from Avatar: The Last Airbender, bald with a blue arrow tattoo and a beard, against a cloudy sky',
  'Aang_Breathing_Fire.jpg': 'A figure lit in yellow and orange breathes a sweeping arc of fire across a smoky green background',
  'agdaron.png': 'Hand-drawn fantasy world map of Agdaron on parchment, with mountains, forests, a sailing ship and a compass rose',
  'Ahmed.jpg': 'Digital portrait of a bearded young man with dark hair looking straight at the viewer, on a grey background',
  'Apocalypse_Mario.jpg': 'A gruff, realistic Mario in a red cap and overalls with a mallet over his shoulder, standing in fog',
  'batman.jpg': "Heavy black ink drawing of Batman's cowled head and shoulders in profile",
  'Blue_Dragon.jpg': "Painted blue dragon's head in profile with white horns and an open, toothy mouth",
  'Cinch.jpg': 'A cartoon blue-and-white raccoon-like mascot in a red T-shirt, standing on green grass',
  'dragonvillage.jpg': 'Top-down map of a village whose houses and roads are laid out around the huge skeleton of a dragon',
  'dragonborn.png': 'A gold-scaled dragonborn barbarian with red eyes and a greataxe, in a mountain pass',
  'Duck_Team.jpg': 'Three fantasy adventurers in the clouds: a blue-skinned elf, a muscular warrior holding a duck, and a green frog in a hoodie',
  'Eye.png': 'Close-up painting of a green eye with lashes and freckled skin',
  'Eye_To_Eye_On_A_Mountaintop.png': 'A small figure in a green cloak stands on a rocky peak facing a huge blue one-eyed giant',
  'eyepencil.jpg': 'Pencil drawing of an eye and eyebrow with soft shading',
  'Fantasy_Planet.jpg': 'A small fantasy planet with continents, oceans and a moon, floating in dark space',
  'galaxy.jpg': 'A spiral galaxy glowing in pink, green and gold against black space',
  'Ganondorf.png': 'Ganondorf from Tears of the Kingdom with red hair and gold jewellery, bare-chested, on a dark green background',
  'Girl.png': 'Painted portrait of a young woman with blue eyes and auburn hair, looking at the viewer',
  'greenlantern.jpg': 'Green Lantern flying over a glowing green globe on a black background',
  'Isometric_Underground_Battlemap.jpg': 'Isometric map of an underground cave system with stone platforms, water and a wooden bridge',
  'joker.png': 'Grinning Joker with green hair and a purple suit, drawn in bold black lines on white',
  'Logan_Poster.png': 'Grey-scale drawing of a small hand held by a larger hand with claws, over the word LOGAN',
  'Mario_Pratt.png': "Comic panel of Mario calming a blue Yoshi, with a speech bubble that reads 'Easy now, Blue! Easy, you know me…'",
  'native_american.jpg': 'A man in a wide-brimmed hat, long coat and boots stands in front of a sunset over hills',
  'obama.png': "Low-poly portrait of Barack Obama's face on a black background",
  'profileportrait.jpg': 'Side profile of a bearded man with glasses against a blue and purple background',
  'robot.jpg': 'A small blue cartoon robot with a rounded body, glowing eyes and a single tread, on a green floor',
  'selfportrait.jpg': 'Loosely painted self-portrait of a bearded man with dark hair, in an oily brush style',
  'spiderman.png': 'Spider-Man in a red-and-black cross-hatched suit, drawn from the chest up on white',
  'Spider-Man_Running.gif': 'Animated loop of Spider-Man sprinting in a full run',
  'superman-flats.png': 'Flat-colour Superman flying toward the viewer, on black',
  'superman-reeves.jpg': 'Clark Kent tearing open his shirt to reveal the Superman emblem',
  'theflash.jpg': 'The Flash sprinting down a road in a red suit with lightning streaks, under a cloudy sky',
  'Wally_the_Bugbear.png': 'A brown-furred bugbear with blue eyes and a blue-and-yellow scarf, in front of mountains and a crescent moon',
  'Waterbending.gif': 'Animated stick figure bending a stream of water',
  'Wizard.jpg': 'A bearded wizard in a dark cloak reads a glowing book with green magic in both hands, in a library',
  'womanpencil.jpg': "Pencil drawing of a woman's face in profile, eyes lowered",
  'horizons.jpeg': "Fundraising banquet flyer with a sunset silhouette of a family and a mosque, titled 'Looking Beyond the Horizon'",
  'hotline.jpeg': "Pink T-shirt design with '1-800-HOTLINEDEEN' repeated in white lines",
  'millennial-ad.jpeg': "Star Wars-style teaser: 'IACC Youth presents The Millennial Muslim' in yellow letters over a starfield",
  'millennial.jpeg': 'Event flyer for The Millennial Muslim youth conference, January 15 and 16, 2016, with dates, a QR code and sponsor logos',
  'mosque.gif': 'Animated 3D walkthrough of a mosque expansion model with green domes',
  'old-logo.png': 'Black-and-white logo of two mirrored Ms with a blue accent',
  'snap-filter.png': 'Snapchat filter frame with floating candles at the top and a long dining table at the bottom, Harry Potter style',
  'taqwa-logo.png': 'Taqwa Seminary logo in blue and yellow lettering on black',
  'utep-logo.png': 'Circular UTEP MSL logo with orange and blue arcs on black',
  'youth-logo-one.png': 'IACC Youth logo in dark lettering with scattered pink petals on black',
  'youth-logo-two.jpeg': 'IACC Youth wordmark in green outlined letters styled like the Lucasfilm logo',
  'youth-logo-three.jpeg': "Round Build-a-Basket logo: a basket of red hearts with a pink bow, ringed by 'IACC Youth'",
  'youthcard.jpeg': "Blue informational card with the IACC Youth crest, 'love profoundly, serve purposefully' and social handles",
  'woc.png': "Cover of the 2014 annual philanthropic report booklet, a tree on green, titled 'A Life, A Legacy'"
};

function humanise(file) {
  return path.parse(file).name.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function tagsFor(file) {
  return Object.entries(TAGS).filter(([, files]) => files.includes(file)).map(([tag]) => tag);
}

// The legacy gallery images in DOM order: <img class="gallery-image" src="./art/X" … alt="…">
function parseLegacy(html) {
  const items = [];
  const re = /<img class="gallery-image" src="\.\/art\/([^"]+)"[^>]*alt="([^"]*)">/g;
  for (const match of html.matchAll(re)) {
    items.push({ legacyFile: match[1], caption: match[2] });
  }
  return items;
}

for (const [folder, source] of Object.entries(SOURCES)) {
  const html = fs.readFileSync(source, 'utf8');
  const items = parseLegacy(html);
  if (items.length === 0) throw new Error(`No gallery images found in ${source}`);

  const captions = {};
  items.forEach(({ legacyFile, caption }, index) => {
    const file = RENAMES[legacyFile] || legacyFile;
    if (!fs.existsSync(path.join('gallery', folder, file))) {
      throw new Error(`${source}: ${legacyFile} → gallery/${folder}/${file} does not exist`);
    }
    if (!ALTS[file]) throw new Error(`No drafted alt for ${file}`);
    const entry = {
      title: TITLES[file] || humanise(file),
      caption,
      alt: ALTS[file],
      tags: tagsFor(file),
      order: (index + 1) * 10,
      ...(SPECIAL[file] || {})
    };
    captions[file] = entry;
  });

  const header = [
    `# Captions for gallery/${folder}/ (one block per file; see README.md in this folder).`,
    '# Keys are filenames. `caption` is the story shown under the image, `alt` is the',
    '# literal description for screen readers, `order` sorts the gallery (lower first).',
    ''
  ].join('\n');
  const body = yaml.dump(captions, { lineWidth: -1, noRefs: true, quotingType: '"', sortKeys: false });
  const out = header + body;
  const target = path.join('gallery', folder, 'captions.yml');
  if (dryRun) {
    console.log(`--- ${target}\n${out}`);
  } else {
    fs.writeFileSync(target, out);
    console.log(`${target}: ${items.length} entries`);
  }
}
