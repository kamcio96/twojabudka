// Opinie z Profili Firmy w Google (stan 2026-10-05): dosłowne fragmenty, skrócone, bez emoji.
// TODO: potwierdzić z właścicielem zgodę na publikację (docs/TODO.md) przed wdrożeniem na produkcję.
// Bez AggregateRating w danych strukturalnych (wytyczne Google dla opinii o własnej firmie).
export interface Review {
  author: string;
  occasion?: string;
  text: string;
}

export const reviews: Review[] = [
  {
    author: 'Agata L.',
    occasion: 'Osiemnastka',
    text:
      'Cudowną pamiątkę z 18 urodzin mojej siostry, wszyscy goście rewelacyjnie się bawili. ' +
      'Właściciel fotobudki niezastąpiony. Jeśli szukasz ciekawego urozmaicenia swojej imprezy, ' +
      'to właśnie tutaj to znajdziesz. Polecam z całego serca.',
  },
  {
    author: 'Magdalena D.',
    text:
      'Profesjonalne podejście do klienta, sympatyczni i zaangażowani prowadzący oraz mnóstwo ' +
      'wyjątkowych akcesoriów, które urozmaicą każdą imprezę.',
  },
  {
    author: 'Iwona S.',
    text: 'Polecam! 100% zadowolenia. Wszystko dopięte. Goście mega zadowoleni z przemiłej obsługi, my również.',
  },
  {
    author: 'Ania P.',
    text: 'Pan obsługujący jest stworzony do pracy z ludźmi. Super wspomnienia, bardzo ciepło polecam.',
  },
  {
    author: 'Gosia S.',
    text: 'Świetna zabawa nawet dla najmłodszych imprezowiczów.',
  },
  {
    author: 'Adrian B.',
    text: 'Zdjęcia wychodzą świetnej jakości, polecam.',
  },
];
