// Jedno źródło danych firmy dla całej strony (stopka, kontakt, docelowo dane strukturalne).
// Bez adresu i cen — firma dojazdowa, wycena przez formularz.
export const business = {
  name: 'Twoja Budka',
  phone: '+48 789 772 289',
  phoneHref: 'tel:+48789772289',
  email: 'kontakt@twojabudka.pl',
  area: 'od Szczecina do Koszalina',
  social: {
    facebook: 'https://www.facebook.com/koszalinfotobudka',
    instagram: 'https://www.instagram.com/twojabudka/',
  },
} as const;
