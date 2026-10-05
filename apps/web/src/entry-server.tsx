// Prerender: build SSR (`vite build --ssr`) renderuje stronę do HTML, a prerender.mjs wstawia go
// do dist/index.html. Treść, nagłówek i lead są w HTML od razu (SEO, GEO, LCP), React hydratuje.
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
