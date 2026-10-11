// Linki do sekcji strony głównej z dowolnej podstrony. Formularz (#contact) jest na każdej stronie
// (App.tsx), więc do niego prowadzi kotwica bez zmiany adresu.
export const sectionHref = (id: string, isHome: boolean) =>
  isHome || id === 'contact' ? `#${id}` : `/#${id}`;
