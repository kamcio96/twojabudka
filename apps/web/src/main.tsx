import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { hotjar } from 'react-hotjar';
import App from './App.tsx';
// Fonty z własnego serwera (bez Google Fonts), font-display: swap; tylko używane grubości;
// przeglądarka pobiera tylko podzbiory znaków z unicode-range (latin + latin-ext dla polskich liter).
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/playfair-display/600.css';
import '@fontsource/playfair-display/700.css';
import './index.css';
import { loadUmami } from './lib/analytics';

loadUmami();
hotjar.initialize({ id: 6409555, sv: 6 });

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// W buildzie #root zawiera HTML wyrenderowany przez prerender.mjs — React go przejmuje (hydracja).
// W trybie dev #root jest pusty.
if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
