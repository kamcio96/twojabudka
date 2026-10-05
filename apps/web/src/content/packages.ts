// Pakiety (dawniej /packages.json na starym hostingu). Bez cen — wycena przez formularz.
export type PackageIcon = 'Clock' | 'Star' | 'Gift';

export interface Package {
  name: string;
  duration: string;
  isPopular: boolean;
  icon: PackageIcon;
  features: string[];
}

// Wszystkie pakiety wymieniają cechy w tej samej kolejności, żeby dało się je porównać wzrokiem.
export const packages: Package[] = [
  {
    name: 'Standard',
    duration: '2 godziny',
    isPopular: false,
    icon: 'Clock',
    features: [
      'Obsługa asystenta',
      'Nielimitowana liczba zdjęć',
      'Dwa rodzaje wydruków',
      'Stylowe rekwizyty',
      'Personalizowane szablony wydruków',
      'Dojazd do 40 km',
    ],
  },
  {
    name: 'Premium',
    duration: '3 godziny',
    isPopular: true,
    icon: 'Star',
    features: [
      'Obsługa asystenta',
      'Nielimitowana liczba zdjęć',
      'Dwa rodzaje wydruków',
      'Stylowe rekwizyty',
      'Personalizowane szablony wydruków',
      'Personalizacja zdjęć',
      'Wybór tła',
      'Galeria online',
      'Dojazd do 60 km',
    ],
  },
  {
    name: 'Exclusive',
    duration: '4 godziny',
    isPopular: false,
    icon: 'Gift',
    features: [
      'Obsługa asystenta',
      'Nielimitowana liczba zdjęć',
      'Dwa rodzaje wydruków',
      'Stylowe rekwizyty',
      'Personalizowane szablony wydruków',
      'Personalizacja zdjęć',
      'Wybór tła',
      'Galeria online',
      'Dojazd do 100 km',
    ],
  },
];
