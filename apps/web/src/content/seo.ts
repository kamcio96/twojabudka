// Teksty SEO strony głównej (title, description, krótki opis dla wyszukiwarek i modeli AI).
// Używane przez plugin `vite-seo.ts`: <head>, dane strukturalne, treść bez JS, llms.txt.
import { business } from './business';

export const seo = {
  // Do ~60 znaków; fraza główna na początku.
  title: `Fotobudka ${business.mainCity} – wesela i imprezy | ${business.name}`,
  // Do ~155 znaków.
  description:
    `Wynajem fotobudki w ${business.mainCityLocative} i okolicach: zdjęcia bez limitu, wydruki na miejscu, ` +
    'asystent, rekwizyty. Wesela, urodziny, studniówki. Dojazd do Koszalina.',
  // Odpowiedź wprost na pytanie „co to za firma” — pierwsze zdanie cytowane przez wyszukiwarki i AI.
  summary:
    `${business.name} to wynajem fotobudki z wydrukami i asystentem w ${business.mainCityLocative} i okolicach. ` +
    'Obsługujemy wesela, urodziny i osiemnastki, komunie, studniówki i imprezy firmowe. ' +
    `Dojeżdżamy ${business.area} (${business.region}).`,
  occasions: ['wesela', 'urodziny i osiemnastki', 'komunie', 'studniówki', 'imprezy firmowe'],
  highlights: [
    'Nielimitowana liczba zdjęć przez cały czas trwania pakietu',
    'Wydruki na miejscu, w dwóch rodzajach',
    'Asystent obsługujący fotobudkę',
    'Stylowe rekwizyty',
    'Personalizowany szablon wydruku',
  ],
  pricing:
    // TODO: pełna lista czynników ceny od właściciela (docs/TODO.md).
    'Cenę ustalamy indywidualnie, zależy m.in. od czasu wynajmu i odległości. ' +
    'Wycenę przygotowujemy po wysłaniu formularza kontaktowego.',
  ogImage: '/images/og-fotobudka-szczecin.jpg',
  ogImageAlt: 'Goście wesela w maskach, kapeluszach i okularach pozują z rekwizytami w fotobudce Twoja Budka',
} as const;
