// Keep the existing .html URLs (e.g. /yolk/yolk.html) instead of Eleventy's
// default /yolk/yolk/index.html, so every link on the live site keeps working.
// Disposable: the rebuild (P2) moves to clean URLs with redirect stubs.
export default {
  permalink: (data) => data.page.filePathStem + '.html'
};
