import { resize } from '../../lib/image.js';

// Site-wide facts shared by every template. No email address anywhere on the
// site (owner decision D4): contact goes through crotogether.com/contact.
const url = 'https://muqtadaa.github.io';
const cro = 'https://crotogether.com';

// The 800 x 800 headshot; the hero and og:image share its derivatives (plan
// open question 1). Not copied to _site: only the resized versions are served.
const portrait = 'src/assets/img/portrait.jpeg';

export default async function () {
  const portraitMeta = await resize(portrait, { widths: [320, 640, 800] });

  return {
    name: 'Muqtadaa Miandara',
    url,
    tagline: 'Digital art, design and D&D',
    description:
      'The personal site of Muqtadaa Miandara: digital art, graphic design for people I care about, the world my D&D group has been building for years, and a summary of my CRO work at CRO Together.',
    language: 'en',
    locale: 'en_US',
    year: new Date().getFullYear(),
    // Shared JSON-LD identities. CRO Together's Organization uses the same
    // @ids so the two sites describe one person and one company.
    personId: `${url}/#person`,
    orgId: `${cro}/#organization`,
    websiteId: `${url}/#website`,
    jobTitle: 'Founder & Chief Strategist, CRO Together',
    portrait,
    portraitAlt: 'Muqtadaa Miandara',
    portraitUrl: portraitMeta.jpeg.at(-1).url,
    knowsAbout: [
      'Digital art',
      'Graphic design',
      'Dungeons & Dragons',
      'Conversion rate optimisation',
      'A/B testing and experimentation',
      'UX research',
      'Web analytics'
    ],
    links: {
      cro,
      croContact: `${cro}/contact`,
      croProof: `${cro}/proof`,
      croServices: `${cro}/services`,
      croTools: `${cro}/tools`,
      linkedin: 'https://www.linkedin.com/in/muqtadaa'
    }
  };
}
