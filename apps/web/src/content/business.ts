// Jedno źródło danych firmy dla całej strony (stopka, kontakt, dane strukturalne, robots/sitemap/llms.txt).
// Bez adresu i cen — firma dojazdowa, wycena przez formularz.
export const business = {
  name: 'Twoja Budka',
  url: 'https://twojabudka.pl',
  phone: '+48 789 772 289',
  phoneHref: 'tel:+48789772289',
  email: 'kontakt@twojabudka.pl',
  // Główne miasto (frazy „fotobudka Szczecin”); obszar dojazdu sięga do Koszalina.
  mainCity: 'Szczecin',
  mainCityLocative: 'Szczecinie',
  area: 'od Szczecina do Koszalina',
  region: 'województwo zachodniopomorskie',
  // Obsługiwane miasta, od największego (lista potwierdzona 2026-10-05, docs/TODO.md).
  cities: [
    'Szczecin', 'Koszalin', 'Słupsk', 'Stargard', 'Kołobrzeg', 'Świnoujście', 'Szczecinek',
    'Police', 'Białogard', 'Goleniów', 'Nowogard', 'Gryfice', 'Świdwin', 'Łobez', 'Trzebiatów',
    'Kamień Pomorski', 'Połczyn-Zdrój', 'Sianów', 'Międzyzdroje', 'Karlino', 'Wolin', 'Resko',
    'Płoty', 'Mielno',
  ],
  social: {
    facebook: 'https://www.facebook.com/koszalinfotobudka',
    instagram: 'https://www.instagram.com/twojabudka/',
    weselezklasa: 'https://www.weselezklasa.pl/ogloszenia-weselne/twoja-budka,57901/',
  },
  // Profile Firmy w Google (opinie). Dwa profile: Koszalin (więcej opinii) i Szczecin.
  google: {
    koszalin: 'https://www.google.com/maps?cid=5537469298980723778',
    szczecin: 'https://www.google.com/maps?cid=12147635623992589658',
  },
} as const;
