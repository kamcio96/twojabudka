// FAQ strony głównej — tylko fakty z oferty (packages.ts, business.ts). Odpowiedzi trafiają też do
// danych strukturalnych FAQPage i llms.txt (vite-seo.ts), więc piszemy je jako pełne zdania.
// TODO: pytania czekające na odpowiedzi właściciela (docs/TODO.md): czas montażu, potrzebne miejsce,
// formaty wydruków, faktura VAT.
import { business } from './business';
import { packages } from './packages';

const travel = packages
  .map(p => `${p.name} – ${p.features.find(f => f.startsWith('Dojazd'))?.toLowerCase()}`)
  .join(', ');

export interface FaqItem {
  question: string;
  answer: string;
}

export const faq: FaqItem[] = [
  {
    question: 'Ile kosztuje wynajem fotobudki na wesele?',
    answer:
      'Cenę ustalamy indywidualnie, zależy m.in. od czasu wynajmu i odległości. ' +
      'Wyślij formularz z datą, miejscem i okazją, a przygotujemy wycenę wybranego pakietu.',
  },
  {
    question: 'Gdzie dojeżdżacie z fotobudką?',
    answer:
      `Działamy głównie w ${business.mainCityLocative} i okolicach, dojeżdżamy ${business.area}. ` +
      `Obsługujemy m.in. miasta: ${business.cities.slice(1, 8).join(', ')}. ` +
      `Pakiety obejmują dojazd: ${travel}.`,
  },
  {
    question: 'Czy liczba zdjęć jest ograniczona?',
    answer: 'Nie. Goście robią tyle zdjęć, ile chcą, przez cały czas trwania pakietu.',
  },
  {
    question: 'Czy goście dostają wydruki od razu?',
    answer:
      'Tak. Zdjęcia drukujemy na miejscu, w dwóch rodzajach wydruków, na personalizowanym ' +
      'szablonie dopasowanym do Twojej imprezy.',
  },
  {
    question: 'Czy zdjęcia trafią do galerii online?',
    answer: 'Tak, w pakietach Premium i Exclusive wszystkie zdjęcia trafiają też do galerii online.',
  },
  {
    question: 'Kto obsługuje fotobudkę podczas imprezy?',
    answer:
      'Przez cały czas jest z Wami asystent. Obsługuje fotobudkę, podaje rekwizyty ' +
      'i pomaga gościom przy zdjęciach.',
  },
  {
    question: 'Jak zarezerwować termin?',
    answer:
      `Wyślij formularz kontaktowy albo zadzwoń: ${business.phone}. ` +
      'Sprawdzimy, czy termin jest wolny, i prześlemy wycenę.',
  },
];
