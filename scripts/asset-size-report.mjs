import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const args = new Set(process.argv.slice(2));
const shouldCheck = args.has('--check');

const ignoredDirectories = new Set(['.git', 'node_modules', 'dist', 'less.js-master']);
const trackedExtensions = new Set(['.js', '.css']);

function walkDirectory(dirPath, files = []) {
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) {
      continue;
    }

    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        walkDirectory(fullPath, files);
      }
      continue;
    }

    const extension = path.extname(entry.name);
    if (trackedExtensions.has(extension)) {
      files.push(fullPath);
    }
  }

  return files;
}

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(2)} KB`;
}

const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const budgets = packageJson.assetBudget ?? {};
const maxJsBytes = Number(budgets.maxJsBytes ?? 0);
const maxCssBytes = Number(budgets.maxCssBytes ?? 0);

const discoveredFiles = walkDirectory(rootDir)
  .map((absolutePath) => ({
    absolutePath,
    relativePath: path.relative(rootDir, absolutePath),
    extension: path.extname(absolutePath),
    bytes: fs.statSync(absolutePath).size
  }))
  .sort((a, b) => b.bytes - a.bytes);

let totalJsBytes = 0;
let totalCssBytes = 0;

for (const file of discoveredFiles) {
  if (file.extension === '.js') {
    totalJsBytes += file.bytes;
  }

  if (file.extension === '.css') {
    totalCssBytes += file.bytes;
  }
}

console.log('Asset size report');
console.log('=================');
for (const file of discoveredFiles) {
  console.log(`${file.relativePath}: ${formatBytes(file.bytes)}`);
}
console.log('-----------------');
console.log(`Total JS: ${formatBytes(totalJsBytes)}`);
console.log(`Total CSS: ${formatBytes(totalCssBytes)}`);

if (shouldCheck) {
  const failures = [];

  if (maxJsBytes > 0 && totalJsBytes > maxJsBytes) {
    failures.push(`JS budget exceeded (${formatBytes(totalJsBytes)} > ${formatBytes(maxJsBytes)})`);
  }

  if (maxCssBytes > 0 && totalCssBytes > maxCssBytes) {
    failures.push(`CSS budget exceeded (${formatBytes(totalCssBytes)} > ${formatBytes(maxCssBytes)})`);
  }

  if (failures.length > 0) {
    console.error('\nBudget check failed:');
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log('\nBudget check passed.');
}
