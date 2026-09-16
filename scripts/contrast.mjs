// Parses src/assets/css/tokens.css and asserts the Forest & moss contrast
// contract (plan section 4). Runs first in `npm run build`, so a token edit
// that breaks a body-text pair fails the build before Eleventy starts.
//
// Body-text pairs must reach 7:1 (WCAG AAA). Two documented exceptions:
//   - moss on sage-dark is large text only (>= 4.5:1);
//   - oat-light is a surface colour and is never checked as a text background.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const tokensPath = path.join(here, '..', 'src', 'assets', 'css', 'tokens.css');
const css = fs.readFileSync(tokensPath, 'utf8');

const tokens = {};
for (const match of css.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-f]{6}|#[0-9a-f]{3}|rgba?\([^)]*\))\s*;/gi)) {
  tokens[match[1]] = match[2].toLowerCase();
}

function parseColor(value) {
  const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: 1
    };
  }
  const rgba = value.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i);
  if (rgba) {
    return { r: +rgba[1], g: +rgba[2], b: +rgba[3], a: rgba[4] === undefined ? 1 : +rgba[4] };
  }
  throw new Error(`Cannot parse colour "${value}"`);
}

function resolve(name) {
  const value = tokens[name];
  if (!value) throw new Error(`Token --${name} is missing from tokens.css`);
  return parseColor(value);
}

// Alpha-composites `top` over an opaque `under`.
function over(top, under) {
  const a = top.a;
  return {
    r: top.r * a + under.r * (1 - a),
    g: top.g * a + under.g * (1 - a),
    b: top.b * a + under.b * (1 - a),
    a: 1
  };
}

function luminance({ r, g, b }) {
  const channel = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function ratio(fg, bg) {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const AAA = 7;
const LARGE = 4.5;

// [foreground, background, minimum, note]
const pairs = [
  ['ink', 'bone', AAA], ['ink', 'linen', AAA], ['ink', 'oat', AAA], ['ink', 'badge', AAA], ['ink', 'moss', AAA],
  ['white', 'ink-mid', AAA], ['bone', 'ink-mid', AAA], ['moss', 'ink-mid', AAA], ['text-muted-invert', 'ink-mid', AAA],
  ['white', 'ink', AAA], ['bone', 'ink', AAA], ['moss', 'ink', AAA], ['text-muted-invert', 'ink', AAA],
  ['sage', 'bone', AAA], ['sage', 'linen', AAA], ['sage', 'oat', AAA], ['sage', 'white', AAA],
  ['sage-dark', 'badge', AAA], ['white', 'sage-dark', AAA], ['bone', 'sage-dark', AAA],
  ['text-dark', 'bone', AAA], ['text-dark', 'linen', AAA], ['text-dark', 'oat', AAA],
  ['text-body', 'bone', AAA], ['text-body', 'linen', AAA], ['text-body', 'oat', AAA],
  ['text-muted', 'bone', AAA], ['text-muted', 'linen', AAA], ['text-muted', 'oat', AAA],
  ['moss', 'sage-dark', LARGE, 'large text only']
];

let failed = false;
const lines = [];

for (const [fg, bg, min, note] of pairs) {
  const value = ratio(resolve(fg), resolve(bg));
  const ok = value >= min;
  if (!ok) failed = true;
  lines.push(`${ok ? 'ok  ' : 'FAIL'}  ${fg} on ${bg}: ${value.toFixed(2)}:1 (min ${min}${note ? ', ' + note : ''})`);
}

// Lightbox caption: bone on the ink scrim, composited over the darkest and the
// lightest thing it can sit on (ink and white).
for (const under of ['ink', 'white']) {
  const scrim = over(resolve('lightbox-scrim'), resolve(under));
  const value = ratio(resolve('bone'), scrim);
  const ok = value >= AAA;
  if (!ok) failed = true;
  lines.push(`${ok ? 'ok  ' : 'FAIL'}  bone on lightbox-scrim over ${under}: ${value.toFixed(2)}:1 (min ${AAA})`);
}

// Guard rails for the two "never" rules: they are documented, not assumed.
const mossOnBone = ratio(resolve('moss'), resolve('bone'));
lines.push(`info  moss on bone: ${mossOnBone.toFixed(2)}:1 (accent on dark only, never text on light)`);
lines.push('info  oat-light: surfaces only, never checked as a text background');

console.log(`contrast: ${Object.keys(tokens).length} colour tokens parsed from ${path.relative(process.cwd(), tokensPath)}`);
console.log(lines.join('\n'));

if (failed) {
  console.error('\ncontrast: one or more pairs fall below the required ratio');
  process.exit(1);
}
console.log(`\ncontrast: all ${pairs.length + 2} pairs pass`);
