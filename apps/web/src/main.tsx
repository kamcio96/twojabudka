import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
