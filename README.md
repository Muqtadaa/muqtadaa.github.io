# muqtadaa.github.io
My Portfolio

## Asset pipeline and committed artifacts

- This branch is the published site source, so only runtime web assets should be committed (`.html`, compiled `.css`, images, and client-side scripts used by pages).
- Third-party build tool source trees (for example vendored compiler repos) should not be committed to this site branch.
- If Less is needed for development, install it as a dev dependency (`npm install --save-dev less`) and compile styles locally (for example: `npx lessc input.less output.css`). Commit the compiled CSS output that the site serves.
