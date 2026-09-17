// Retired addresses → their replacements (owner decision D13). Mostly legacy
// .html paths from the old site; also any page that has since been renamed.
// src/redirects.njk writes one meta-refresh stub per entry at the old path so
// links in the wild, and search results, keep working.
export default [
  { from: '/digitalart/digitalart.html', to: '/art/', label: 'Art' },
  { from: '/graphicdesign/graphicdesign.html', to: '/design/', label: 'Design' },
  { from: '/yolk/yolk.html', to: '/work/yolk/', label: 'Yolk' },
  { from: '/via/via.html', to: '/work/via/', label: 'Via' },
  { from: '/porto/porto.html', to: '/work/port-of-peri-peri/', label: 'Port of Peri Peri' },
  { from: '/dnd/dnd.html', to: '/dnd/', label: 'D&D' },
  {
    from: '/dnd/the-agdaron-campaign/',
    to: '/dnd/the-undying-of-the-light/',
    label: 'The Undying of the Light'
  }
];
