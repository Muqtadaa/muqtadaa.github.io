module.exports = function(eleventyConfig) {
  eleventyConfig.setInputDirectory('.');
  eleventyConfig.setOutputDirectory('_site');
  eleventyConfig.addPassthroughCopy('css');
  eleventyConfig.addPassthroughCopy('images');
  eleventyConfig.addPassthroughCopy('files');
  eleventyConfig.addPassthroughCopy('script.js');
  eleventyConfig.addPassthroughCopy('via');
  eleventyConfig.addPassthroughCopy('yolk');
  eleventyConfig.addPassthroughCopy('porto');
  eleventyConfig.addPassthroughCopy('digitalart');
  eleventyConfig.addPassthroughCopy('graphicdesign');

  return {
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    dir: {
      includes: '_includes',
      data: '_data'
    }
  };
};
