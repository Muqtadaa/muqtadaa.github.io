import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();
const outputDir = path.join(rootDir, 'dist');

const excludedEntries = new Set([
  '.git',
  '.github',
  'node_modules',
  'dist',
  'less.js-master',
  'package-lock.json',
  'package.json'
]);

function copyRecursive(source, destination) {
  const stats = fs.statSync(source);

  if (stats.isDirectory()) {
    fs.mkdirSync(destination, { recursive: true });
    for (const entry of fs.readdirSync(source)) {
      if (excludedEntries.has(entry)) {
        continue;
      }
      copyRecursive(path.join(source, entry), path.join(destination, entry));
    }
    return;
  }

  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

for (const entry of fs.readdirSync(rootDir)) {
  if (excludedEntries.has(entry)) {
    continue;
  }

  copyRecursive(path.join(rootDir, entry), path.join(outputDir, entry));
}

const budgetCheck = spawnSync('node', ['scripts/asset-size-report.mjs', '--check'], {
  cwd: rootDir,
  stdio: 'inherit'
});

if (budgetCheck.status !== 0) {
  process.exit(budgetCheck.status ?? 1);
}

console.log('\nBuild output generated at dist/.');
