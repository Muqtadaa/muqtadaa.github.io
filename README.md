# muqtadaa.github.io

Static portfolio website hosted via GitHub Pages.

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run lint checks (ESLint + Stylelint + Prettier):

   ```bash
   npm run lint
   ```

3. View bundle/asset sizes:

   ```bash
   npm run size:report
   ```

4. Enforce CSS/JS size budgets locally (same gate as CI):

   ```bash
   npm run size:check
   ```

## Build

Generate a production-ready output directory:

```bash
npm run build
```

The build copies site assets into `dist/` and runs budget checks. Generated files are placed in:

- `dist/` (all deployable static files)

## Deploy

This repository is intended for GitHub Pages deployment.

Typical flow:

1. Open a pull request.
2. CI runs lint + build (including asset budget checks).
3. Merge to `main` once checks pass.
4. Publish the `dist/` output using your preferred deploy mechanism (for Pages, this is often a workflow or branch publish step).
