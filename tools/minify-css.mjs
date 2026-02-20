import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outDir = path.join(root, 'styles/dist');
fs.mkdirSync(outDir, { recursive: true });

const targets = [
  ['styles/shared.css', 'shared.min.css'],
  ['css/style.css', 'home.min.css'],
  ['via/style.css', 'via.min.css'],
  ['yolk/style.css', 'yolk.min.css'],
  ['porto/style.css', 'porto.min.css'],
  ['digitalart/style.css', 'digitalart.min.css'],
  ['graphicdesign/style.css', 'graphicdesign.min.css']
];

const loadCss = (filePath, seen = new Set()) => {
  const abs = path.resolve(root, filePath);
  if (seen.has(abs)) return '';
  seen.add(abs);
  let css = fs.readFileSync(abs, 'utf8');
  css = css.replace(/@import\s+url\(["'](.+?)["']\);/g, (_, rel) => {
    const nested = path.join(path.dirname(filePath), rel);
    return loadCss(nested, seen);
  });
  return css;
};

const minify = (css) => css
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{}:;,])\s*/g, '$1')
  .replace(/;}/g, '}')
  .trim();

for (const [input, output] of targets) {
  const css = minify(loadCss(input));
  fs.writeFileSync(path.join(outDir, output), css + '\n');
}
