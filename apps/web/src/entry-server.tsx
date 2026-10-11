// Prerender: build SSR (`vite build --ssr`) renderuje każdą podstronę z src/content/pages.ts do HTML,
// a prerender.mjs zapisuje ją jako osobny plik. Treść, nagłówek i lead są w HTML od razu (SEO, GEO,
// LCP), React hydratuje.
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { pages } from './content/pages';
import { headHtml } from './lib/head';
import { routes } from './routes';

export { pages, routes };

export function render(path: string): string {
  return renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>
  );
}

export function head(path: string, noindex: boolean): string {
  const page = pages.find(p => p.path === path);
  if (!page) throw new Error(`Brak podstrony ${path} w src/content/pages.ts`);
  return headHtml(page, { noindex });
}
