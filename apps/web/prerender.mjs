// Dla każdej podstrony z src/content/pages.ts wstawia <head> (w miejsce <!--app-head-->) i treść
// (w miejsce <!--app-html-->) do szablonu dist/index.html. Strona główna → dist/index.html,
// pozostałe → dist/{adres}.html (nginx: try_files $uri.html, adres bez .html i bez ukośnika).
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';

const { render, head, pages, routes } = await import('./dist-ssr/entry-server.js');
const dist = new URL('./dist/', import.meta.url);
const template = await readFile(new URL('index.html', dist), 'utf8');
for (const marker of ['<!--app-head-->', '<!--app-html-->']) {
  if (!template.includes(marker)) throw new Error(`Brak ${marker} w dist/index.html`);
}

// Rejestr i komponenty muszą się zgadzać — inaczej podstrona wyrenderowałaby się jako strona główna.
const paths = pages.map(p => p.path);
const missing = paths.filter(p => !routes[p]);
const orphans = Object.keys(routes).filter(p => !paths.includes(p));
if (missing.length || orphans.length) {
  throw new Error(`pages.ts ≠ routes.tsx — bez komponentu: ${missing.join(', ') || '—'}; bez wpisu: ${orphans.join(', ') || '—'}`);
}
if (new Set(paths).size !== paths.length) throw new Error('Powtórzony adres w src/content/pages.ts');
for (const path of paths) {
  if (path !== '/' && !/^(\/[a-z0-9-]+)+$/.test(path)) throw new Error(`Niepoprawny adres podstrony: ${path}`);
}

const noindex = process.env.SEO_NOINDEX === 'true';
for (const path of paths) {
  const file = path === '/' ? 'index.html' : `${path.slice(1)}.html`;
  const target = new URL(file, dist);
  await mkdir(new URL('.', target), { recursive: true });
  // Funkcje zastępujące — `$` w treści nie jest traktowany jako wzorzec.
  const html = template
    .replace('<!--app-head-->', () => head(path, noindex))
    .replace('<!--app-html-->', () => render(path));
  await writeFile(target, html);
  console.log(`prerender: dist/${file}`);
}
await rm(new URL('./dist-ssr', import.meta.url), { recursive: true, force: true });
