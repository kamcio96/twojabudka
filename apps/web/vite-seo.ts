// SEO/GEO dla SPA: wszystko, co boty (Google, crawlery AI bez JS) muszą zobaczyć w surowym HTML.
// Dane wyłącznie z src/content (business, seo, packages) — bez ręcznie wpisanych kontaktów.
// SEO_NOINDEX=true (np. środowisko testowe) → meta noindex i robots.txt blokujący wszystko.
import type { HtmlTagDescriptor, Plugin } from 'vite';
import { business } from './src/content/business';
import { faq } from './src/content/faq';
import { packages } from './src/content/packages';
import { seo } from './src/content/seo';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const abs = (path: string) => new URL(path, business.url).href;
const homeUrl = abs('/');
const businessId = `${homeUrl}#business`;

const areaServed = [
  ...business.cities.map(name => ({ '@type': 'City', name })),
  { '@type': 'AdministrativeArea', name: business.region },
];

// Firma dojazdowa: bez adresu i bez cen (priceRange, Offer.price).
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
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
    {
      '@type': 'FAQPage',
      '@id': `${homeUrl}#faq`,
      mainEntity: faq.map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    },
    {
      '@type': 'WebSite',
      '@id': `${homeUrl}#website`,
      url: homeUrl,
      name: business.name,
      inLanguage: 'pl-PL',
      publisher: { '@id': businessId },
    },
  ],
};

const headTags = (noindex: boolean): HtmlTagDescriptor[] => {
  const meta = (attrs: Record<string, string>): HtmlTagDescriptor => ({ tag: 'meta', attrs, injectTo: 'head' });
  return [
    { tag: 'title', children: esc(seo.title), injectTo: 'head' },
    meta({ name: 'description', content: seo.description }),
    ...(noindex ? [meta({ name: 'robots', content: 'noindex, nofollow' })] : []),
    { tag: 'link', attrs: { rel: 'canonical', href: homeUrl }, injectTo: 'head' },
    meta({ property: 'og:type', content: 'website' }),
    meta({ property: 'og:locale', content: 'pl_PL' }),
    meta({ property: 'og:site_name', content: business.name }),
    meta({ property: 'og:url', content: homeUrl }),
    meta({ property: 'og:title', content: seo.title }),
    meta({ property: 'og:description', content: seo.description }),
    meta({ property: 'og:image', content: abs(seo.ogImage) }),
    meta({ property: 'og:image:width', content: '1200' }),
    meta({ property: 'og:image:height', content: '630' }),
    meta({ property: 'og:image:alt', content: seo.ogImageAlt }),
    meta({ name: 'twitter:card', content: 'summary_large_image' }),
    meta({ name: 'twitter:title', content: seo.title }),
    meta({ name: 'twitter:description', content: seo.description }),
    meta({ name: 'twitter:image', content: abs(seo.ogImage) }),
    {
      tag: 'script',
      attrs: { type: 'application/ld+json' },
      // `<` zamieniony, żeby tekst nie mógł zamknąć znacznika <script>.
      children: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
      injectTo: 'head',
    },
  ];
};

// Treść w #root przed startem Reacta (createRoot ją podmienia). Ten sam tekst co na stronie,
// ukryty wizualnie, żeby nie mignął przed załadowaniem aplikacji.
const fallbackHtml = () => {
  const li = (items: readonly string[]) => items.map(i => `<li>${esc(i)}</li>`).join('');
  return `<div class="sr-only">
      <h1>Fotobudka na wesela w ${esc(business.mainCityLocative)} – ${esc(business.name)}</h1>
      <p>${esc(seo.summary)}</p>
      <h2>Co dostajesz</h2>
      <ul>${li(seo.highlights)}</ul>
      <h2>Pakiety</h2>
      <ul>${packages.map(p => `<li>${esc(`${p.name} (${p.duration}): ${p.features.join(', ')}`)}</li>`).join('')}</ul>
      <p>${esc(seo.pricing)}</p>
      <h2>Gdzie dojeżdżamy</h2>
      <p>${esc(`Dojeżdżamy ${business.area}: ${business.cities.join(', ')}.`)}</p>
      <h2>Częste pytania</h2>
      ${faq.map(f => `<h3>${esc(f.question)}</h3><p>${esc(f.answer)}</p>`).join('\n      ')}
      <h2>Kontakt</h2>
      <p>Telefon: <a href="${business.phoneHref}">${esc(business.phone)}</a>,
        e-mail: <a href="mailto:${business.email}">${esc(business.email)}</a>.</p>
    </div>`;
};

// Boty AI wymienione z nazwy, żeby jednoznacznie wiedziały, że mogą czytać i cytować stronę (GEO).
// Bot z własną grupą ignoruje grupę `*`, więc grupa AI powtarza te same reguły.
const aiBots = [
  // OpenAI
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  // Anthropic
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'anthropic-ai',
  // Perplexity
  'PerplexityBot', 'Perplexity-User',
  // Google (Gemini, AI Overviews) i Apple (Apple Intelligence)
  'Google-Extended', 'GoogleOther', 'Applebot', 'Applebot-Extended',
  // Microsoft (Copilot korzysta z Binga), Meta, Amazon, DuckDuckGo
  'Bingbot', 'meta-externalagent', 'meta-externalfetcher', 'FacebookBot', 'Amazonbot', 'DuckAssistBot',
  // Pozostałe modele i zbiory danych
  'MistralAI-User', 'cohere-ai', 'cohere-training-data-crawler', 'Bytespider', 'CCBot', 'YouBot',
  'Diffbot', 'AI2Bot', 'Timpibot',
];

const rules = ['Allow: /', 'Disallow: /api/'];

const robotsTxt = (noindex: boolean) =>
  noindex
    ? 'User-agent: *\nDisallow: /\n'
    : [
        'User-agent: *',
        ...rules,
        '',
        '# Asystenci i wyszukiwarki AI: zapraszamy do czytania i cytowania strony.',
        ...aiBots.map(bot => `User-agent: ${bot}`),
        ...rules,
        '',
        `Sitemap: ${abs('/sitemap.xml')}`,
        '',
      ].join('\n');

const sitemapXml = () => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${homeUrl}</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
  </url>
</urlset>
`;

// https://llmstxt.org — zwięzły opis firmy dla modeli AI.
const llmsTxt = () => `# ${business.name}

> ${seo.summary}

## Oferta
${seo.highlights.map(h => `- ${h}`).join('\n')}

Okazje: ${seo.occasions.join(', ')}.

## Pakiety
${packages.map(p => `- ${p.name} (${p.duration}): ${p.features.join(', ')}`).join('\n')}

${seo.pricing}

## Obszar działania
Główne miasto: ${business.mainCity}. Dojeżdżamy ${business.area} (${business.region}).
Miasta: ${business.cities.join(', ')}.
Firma dojazdowa: przyjeżdżamy z fotobudką na miejsce imprezy.

## Częste pytania
${faq.map(f => `### ${f.question}\n${f.answer}`).join('\n\n')}

## Kontakt
- Strona: ${homeUrl}
- Telefon: ${business.phone}
- E-mail: ${business.email}
- Formularz wyceny: ${abs('/#contact')}
${[...Object.values(business.social), ...Object.values(business.google)].map(url => `- ${url}`).join('\n')}
`;

// Samodzielna strona 404 (nginx), bez JS i zewnętrznych zasobów.
const notFoundHtml = () => `<!doctype html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex">
<title>Nie znaleziono strony | ${esc(business.name)}</title>
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1rem;
    background:linear-gradient(135deg,#0A1128 0%,#1A2A4F 100%);color:#fff;
    font-family:Montserrat,system-ui,sans-serif;text-align:center}
  h1{font-family:'Playfair Display',Georgia,serif;font-size:2.25rem;margin:0 0 1rem}
  h1 span{color:#D4AF37}
  p{opacity:.85;max-width:32rem;margin:0 auto 2rem;line-height:1.6}
  nav{display:flex;flex-wrap:wrap;gap:1rem;justify-content:center}
  a{display:inline-block;padding:.75rem 1.5rem;border-radius:.5rem;font-weight:600;text-decoration:none;
    border:2px solid #D4AF37;color:#D4AF37}
  a.primary{background:#D4AF37;color:#0A1128}
  a:focus-visible{outline:2px solid #D4AF37;outline-offset:2px}
</style>
</head>
<body>
<main>
  <h1>Nie ma takiej <span>strony</span></h1>
  <p>Ten adres nie istnieje. Zajrzyj na stronę główną albo napisz do nas — przygotujemy wycenę fotobudki na Twoją imprezę.</p>
  <nav>
    <a class="primary" href="/">Strona główna</a>
    <a href="/#pricing">Sprawdź pakiety</a>
    <a href="/#contact">Poproś o wycenę</a>
  </nav>
</main>
</body>
</html>
`;

export default function seoPlugin(): Plugin {
  const noindex = process.env.SEO_NOINDEX === 'true';
  return {
    name: 'twojabudka-seo',
    transformIndexHtml: {
      order: 'pre',
      handler: html => ({
        html: html.replace('<!--seo-fallback-->', fallbackHtml()),
        tags: headTags(noindex),
      }),
    },
    generateBundle() {
      const files: Record<string, string> = {
        'robots.txt': robotsTxt(noindex),
        'sitemap.xml': sitemapXml(),
        'llms.txt': llmsTxt(),
        '404.html': notFoundHtml(),
      };
      for (const [fileName, source] of Object.entries(files)) {
        this.emitFile({ type: 'asset', fileName, source });
      }
    },
  };
}
