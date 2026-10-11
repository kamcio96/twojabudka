// SEO/GEO: <head> w trybie dev i pliki dla botów (robots, sitemap, llms.txt, 404).
// Przy buildzie <head> i treść każdej podstrony wstawia prerender (src/entry-server.tsx +
// prerender.mjs); generator <head>: src/lib/head.ts, lista podstron: src/content/pages.ts.
// Dane wyłącznie z src/content (business, seo, packages, pages) — bez ręcznie wpisanych kontaktów.
// SEO_NOINDEX=true (np. środowisko testowe) → meta noindex i robots.txt blokujący wszystko.
import type { Plugin } from 'vite';
import { business } from './src/content/business';
import { faq } from './src/content/faq';
import { packages } from './src/content/packages';
import { findPage, homePage, pages } from './src/content/pages';
import { seo } from './src/content/seo';
import { abs, esc, headHtml, homeUrl } from './src/lib/head';

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

const sitemapXml = () => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = pages.map(p => `  <url>
    <loc>${abs(p.path)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
};

const subpages = pages.filter(p => p.kind !== 'home');

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
- [Strona Twoja Budka](${homeUrl}): oferta, pakiety, galeria
${subpages.map(p => `- [${p.label}](${abs(p.path)}): ${p.description}\n`).join('')}- [Formularz wyceny](${abs('/#contact')}): data, miejsce i okazja
- [Telefon ${business.phone}](${business.phoneHref})
- [E-mail ${business.email}](mailto:${business.email})

## Profile
- [Facebook](${business.social.facebook})
- [Instagram](${business.social.instagram})
- [Wesele z Klasą](${business.social.weselezklasa})
- [Opinie w Google — Koszalin](${business.google.koszalin})
- [Opinie w Google — Szczecin](${business.google.szczecin})
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
  let ssrBuild = false;
  return {
    name: 'twojabudka-seo',
    configResolved(config) {
      ssrBuild = Boolean(config.build.ssr);
    },
    // Dev: <head> strony z adresu (Vite serwuje index.html dla każdej ścieżki).
    // Build: znacznik zostaje, prerender.mjs wstawia <head> osobno dla każdej podstrony.
    transformIndexHtml: {
      order: 'pre',
      handler: (html, ctx) =>
        ctx.server
          ? html.replace('<!--app-head-->', headHtml(findPage(ctx.originalUrl ?? ctx.path) ?? homePage, { noindex }))
          : html,
    },
    generateBundle() {
      // Build SSR (prerender) nie publikuje plików — tylko build klienta.
      if (ssrBuild) return;
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
