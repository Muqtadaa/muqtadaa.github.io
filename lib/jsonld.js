// Builds the JSON-LD @graph rendered in partials/head.njk on every page:
// Person + WebSite everywhere, WebPage + BreadcrumbList on inner pages, plus
// whatever a page passes as `jsonld` (e.g. a CreativeWork on a case study).
export function structuredData({ site, url, title, description, breadcrumbs = [], extra }) {
  const absolute = (value) => new URL(value, site.url).href;
  const home = absolute('/');

  const person = {
    '@type': 'Person',
    '@id': site.personId,
    name: site.name,
    url: home,
    image: absolute(site.portraitUrl),
    jobTitle: site.jobTitle,
    worksFor: {
      '@type': 'Organization',
      '@id': site.orgId,
      name: 'CRO Together',
      url: site.links.cro
    },
    sameAs: [site.links.cro, site.links.linkedin],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'inquiries',
      url: site.links.croContact
    },
    knowsAbout: site.knowsAbout
  };

  const website = {
    '@type': 'WebSite',
    '@id': site.websiteId,
    name: site.name,
    url: home,
    description: site.description,
    inLanguage: site.language,
    author: { '@id': site.personId }
  };

  const graph = [person, website];

  if (url && url !== '/') {
    const pageUrl = absolute(url);
    graph.push({
      '@type': 'WebPage',
      '@id': pageUrl,
      url: pageUrl,
      name: title,
      description,
      inLanguage: site.language,
      isPartOf: { '@id': site.websiteId },
      about: { '@id': site.personId }
    });

    const crumbs = [{ name: 'Home', url: home }, ...breadcrumbs, { name: title, url: pageUrl }];
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: absolute(crumb.url)
      }))
    });
  }

  if (extra) {
    graph.push(...(Array.isArray(extra) ? extra : [extra]));
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}
