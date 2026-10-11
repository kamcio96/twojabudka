// <head> każdej podstrony: title, description, canonical, Open Graph, Twitter Card i JSON-LD.
// Wstawiany w miejsce <!--app-head--> w index.html: przy buildzie przez prerender.mjs (osobno dla
// każdej strony z src/content/pages.ts), w trybie dev przez plugin vite-seo.ts.
// Firma dojazdowa: bez adresu i bez cen (priceRange, Offer.price).
import { business } from '../content/business';
import { faq as homeFaq } from '../content/faq';
import { packages } from '../content/packages';
import { homePage, type PageMeta } from '../content/pages';
import { seo } from '../content/seo';

export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const abs = (path: string) => new URL(path, business.url).href;
export const homeUrl = abs('/');
const businessId = `${homeUrl}#business`;
const websiteId = `${homeUrl}#website`;

const areaServed = [
  ...business.cities.map(name => ({ '@type': 'City', name })),
  { '@type': 'AdministrativeArea', name: business.region },
];

const faqPage = (url: string, items: { question: string; answer: string }[]) => ({
  '@type': 'FAQPage',
  '@id': `${url}#faq`,
  mainEntity: items.map(f => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
});

const siteNodes = [
  {
    '@type': 'LocalBusiness',
    '@id': businessId,
    name: business.name,
    description: seo.summary,
    url: homeUrl,
    telephone: business.phone.replace(/\s/g, ''),
    email: business.email,
    image: abs(seo.ogImage),
    areaServed,
    knowsLanguage: 'pl',
    sameAs: [...Object.values(business.social), ...Object.values(business.google)],
  },
  {
    '@type': 'WebSite',
    '@id': websiteId,
    url: homeUrl,
    name: business.name,
    inLanguage: 'pl-PL',
    publisher: { '@id': businessId },
  },
];

const homeNodes = () => [
  {
    '@type': 'Service',
    name: 'Wynajem fotobudki',
    serviceType: 'Fotobudka z wydrukami i asystentem',
    description: `Fotobudka na ${seo.occasions.join(', ')}.`,
    provider: { '@id': businessId },
    areaServed,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Pakiety',
      itemListElement: packages.map(p => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: `Pakiet ${p.name} (${p.duration})`,
          description: p.features.join(', '),
        },
      })),
    },
  },
  faqPage(homeUrl, homeFaq),
];

const subpageNodes = (page: PageMeta, url: string) => [
  {
    '@type': 'WebPage',
    '@id': url,
    url,
    name: page.title,
    description: page.description,
    inLanguage: 'pl-PL',
    isPartOf: { '@id': websiteId },
    breadcrumb: { '@id': `${url}#breadcrumb` },
  },
  {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [homePage, page].map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.label,
      item: abs(p.path),
    })),
  },
  ...(page.service
    ? [
        {
          '@type': 'Service',
          name: page.service.name,
          serviceType: 'Fotobudka z wydrukami i asystentem',
          description: page.service.description,
          provider: { '@id': businessId },
          areaServed: page.service.city ? { '@type': 'City', name: page.service.city } : areaServed,
          url,
        },
      ]
    : []),
  ...(page.faq?.length ? [faqPage(url, page.faq)] : []),
];

export const jsonLd = (page: PageMeta) => {
  const url = abs(page.path);
  return {
    '@context': 'https://schema.org',
    '@graph': [...siteNodes, ...(page.kind === 'home' ? homeNodes() : subpageNodes(page, url))],
  };
};

export function headHtml(page: PageMeta, { noindex = false } = {}): string {
  const url = abs(page.path);
  const image = abs(page.ogImage ?? seo.ogImage);
  const imageAlt = page.ogImageAlt ?? seo.ogImageAlt;
  const meta = (attrs: Record<string, string>) =>
    `<meta ${Object.entries(attrs).map(([k, v]) => `${k}="${esc(v)}"`).join(' ')}>`;
  return [
    `<title>${esc(page.title)}</title>`,
    meta({ name: 'description', content: page.description }),
    ...(noindex ? [meta({ name: 'robots', content: 'noindex, nofollow' })] : []),
    `<link rel="canonical" href="${esc(url)}">`,
    meta({ property: 'og:type', content: 'website' }),
    meta({ property: 'og:locale', content: 'pl_PL' }),
    meta({ property: 'og:site_name', content: business.name }),
    meta({ property: 'og:url', content: url }),
    meta({ property: 'og:title', content: page.title }),
    meta({ property: 'og:description', content: page.description }),
    meta({ property: 'og:image', content: image }),
    meta({ property: 'og:image:width', content: '1200' }),
    meta({ property: 'og:image:height', content: '630' }),
    meta({ property: 'og:image:alt', content: imageAlt }),
    meta({ name: 'twitter:card', content: 'summary_large_image' }),
    meta({ name: 'twitter:title', content: page.title }),
    meta({ name: 'twitter:description', content: page.description }),
    meta({ name: 'twitter:image', content: image }),
    // `<` zamieniony, żeby tekst nie mógł zamknąć znacznika <script>.
    `<script type="application/ld+json">${JSON.stringify(jsonLd(page)).replace(/</g, '\\u003c')}</script>`,
  ].join('\n    ');
}
