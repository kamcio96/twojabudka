// Podstrona /fotobudka-na-wesele (frazy: fotobudka na wesele, … koszt, … cena, … Szczecin;
// docs/seo.md). Tylko fakty z oferty (packages.ts, business.ts, faq.ts). Pytania trafiają też do
// `FAQPage` (src/lib/head.ts), więc odpowiedzi to pełne zdania.
// TODO (docs/TODO.md): pytania o czas montażu i potrzebne miejsce na sali — po odpowiedzi właściciela.
import { business } from './business';
import type { FaqItem } from './faq';
import { listPl, packages, priceFactors } from './packages';

const durations = listPl(packages.map(p => `${p.name} (${p.duration})`));
const popular = packages.find(p => p.isPopular)?.name;
const travel = listPl(
  packages.map(p => `${p.name} – ${p.features.find(f => f.startsWith('Dojazd'))?.toLowerCase()}`)
);
const withGallery = listPl(packages.filter(p => p.features.includes('Galeria online')).map(p => p.name));

export const weseleFaq: FaqItem[] = [
  {
    question: 'Ile kosztuje fotobudka na wesele?',
    answer:
      `Cenę fotobudki na wesele ustalamy indywidualnie. Zależy od ${listPl(priceFactors.map(f => f.of))}. ` +
      'Wyślijcie formularz z datą i miejscem wesela, a przygotujemy wycenę.',
  },
  {
    question: 'Na ile godzin wynająć fotobudkę na wesele?',
    answer:
      `Mamy trzy pakiety: ${durations}.` + (popular ? ` Najczęściej wybierany jest ${popular}.` : '') +
      ' W każdym goście robią zdjęcia bez limitu, a asystent jest na miejscu przez cały czas trwania pakietu.',
  },
  {
    question: 'Czy goście dostaną wydruki od razu?',
    answer:
      'Tak. Zdjęcia drukujemy na miejscu, w dwóch rodzajach wydruków, na szablonie z motywem Waszego wesela. ' +
      'Goście zabierają je do domu jako pamiątkę.',
  },
  {
    question: 'Czy dostaniemy wszystkie zdjęcia z fotobudki?',
    answer: `Tak, w pakietach ${withGallery} wszystkie zdjęcia trafiają też do galerii online.`,
  },
  {
    question: 'Czy przyjedziecie na wesele poza Szczecinem?',
    answer:
      `Tak. Działamy głównie w ${business.mainCityLocative} i okolicach, a na wesela dojeżdżamy ${business.area}. ` +
      `Pakiety obejmują dojazd: ${travel}. Napiszcie, gdzie jest sala, a podamy szczegóły w wycenie.`,
  },
  {
    question: 'Jak zarezerwować fotobudkę na wesele?',
    answer:
      `Wyślijcie formularz z datą i miejscem wesela albo zadzwońcie: ${business.phone}. ` +
      'Sprawdzimy, czy termin jest wolny, i prześlemy wycenę. Termin rezerwujemy po Waszym potwierdzeniu.',
  },
];
