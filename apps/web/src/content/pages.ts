// Rejestr podstron: adres, teksty SEO i okruszki. Jedno źródło dla prerendera (osobny plik HTML
// na stronę), <head> i JSON-LD (src/lib/head.ts), sitemap.xml i llms.txt (vite-seo.ts) oraz
// linków wewnętrznych (stopka, „Gdzie dojeżdżamy”). Komponenty stron: src/routes.tsx.
// Plan podstron i frazy: docs/seo.md, sekcja „Plan rozbudowy podstron”.
import type { FaqItem } from './faq';
import { seo } from './seo';
import { weseleFaq } from './wesele';

// home — strona główna; occasion — fotobudka na okazję; city — fotobudka w mieście;
// guide — poradnik; info — pozostałe (np. pakiety).
export type PageKind = 'home' | 'occasion' | 'city' | 'guide' | 'info';

export interface PageMeta {
  // Bez końcowego ukośnika, np. '/fotobudka-na-wesele'.
  path: string;
  kind: PageKind;
  // <title> do ~60 znaków, fraza główna na początku; wzór: `{Fraza główna} | Twoja Budka`.
  title: string;
  // meta description do ~155 znaków.
  description: string;
  // Nazwa w okruszkach i linkach wewnętrznych.
  label: string;
  ogImage?: string;
  ogImageAlt?: string;
  // Usługa opisana na stronie (JSON-LD `Service` z `areaServed`) — dla okazji i miast.
  service?: { name: string; description: string; city?: string };
  // Pytania tej podstrony (sekcja FAQ + `FAQPage`).
  faq?: FaqItem[];
  // Okazja wybrana z góry w formularzu kontaktowym (wartość z listy w ContactForm.tsx).
  eventType?: string;
}

export const pages: PageMeta[] = [
  {
    path: '/',
    kind: 'home',
    title: seo.title,
    description: seo.description,
    label: 'Strona główna',
  },
  {
    path: '/fotobudka-na-wesele',
    kind: 'occasion',
    title: 'Fotobudka na wesele Szczecin i okolice | Twoja Budka',
    description:
      'Fotobudka na wesele w Szczecinie i okolicach: zdjęcia bez limitu, wydruki na miejscu, ' +
      'asystent i rekwizyty. Dojazd do Koszalina. Poproś o wycenę.',
    label: 'Fotobudka na wesele',
    service: {
      name: 'Fotobudka na wesele',
      description:
        'Wynajem fotobudki na wesele z asystentem, rekwizytami, wydrukami na miejscu i zdjęciami bez limitu.',
    },
    faq: weseleFaq,
    eventType: 'Wesele',
  },
];

export const homePage = pages[0];

// '/fotobudka-na-wesele/' i '/fotobudka-na-wesele.html' → '/fotobudka-na-wesele'.
export const normalizePath = (path: string) =>
  path.split(/[?#]/)[0].replace(/\.html$/, '').replace(/\/+$/, '') || '/';

export const findPage = (path: string) => pages.find(p => p.path === normalizePath(path));

export const pagesOfKind = (kind: PageKind) => pages.filter(p => p.kind === kind);
