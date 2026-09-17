// Directory data for src/work/. Case studies (the pages with a `year` in
// their front matter) get a CreativeWork in the JSON-LD graph that
// partials/head.njk renders; the BreadcrumbList comes from the layout's
// `breadcrumbs` through lib/jsonld.js. The work index has no `year` and only
// gets the WebPage + breadcrumbs every inner page has.
export default {
  eleventyComputed: {
    jsonld: (data) => {
      if (!data.year) return undefined;
      const { site } = data;
      const pageUrl = new URL(data.page.url, site.url).href;
      const work = {
        '@type': 'CreativeWork',
        '@id': `${pageUrl}#work`,
        name: data.title,
        headline: data.title,
        description: data.description,
        url: pageUrl,
        genre: 'UX case study',
        dateCreated: String(data.year),
        inLanguage: site.language,
        author: { '@id': site.personId },
        creator: { '@id': site.personId },
        mainEntityOfPage: { '@id': pageUrl }
      };
      if (data.ogImage) work.image = new URL(data.ogImage, site.url).href;
      if (data.keywords) work.keywords = data.keywords.join(', ');
      return work;
    }
  }
};
