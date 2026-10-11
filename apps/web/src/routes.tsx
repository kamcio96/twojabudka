// Komponent dla każdego adresu z src/content/pages.ts. prerender.mjs przerywa build, gdy podstrona
// z rejestru nie ma tu komponentu (albo odwrotnie).
import type { ComponentType } from 'react';
import HomePage from './pages/HomePage';
import WeselePage from './pages/WeselePage';

export const routes: Record<string, ComponentType> = {
  '/': HomePage,
  '/fotobudka-na-wesele': WeselePage,
};
