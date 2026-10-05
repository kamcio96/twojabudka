// Pakiety (dawniej /packages.json na starym hostingu). Bez cen — wycena przez formularz.
export type PackageIcon = 'Clock' | 'Star' | 'Gift';

export interface Package {
  name: string;
  duration: string;
  isPopular: boolean;
  icon: PackageIcon;
  features: string[];
}

export const packages: Package[] = [
  {
    name: 'Standard',
    duration: '2 godziny',
    isPopular: false,
    icon: 'Clock',
    features: [
      'Nielimitowana liczba zdjęć',
      'Personalizowane szablony wydruków',
      'Stylowe rekwizyty',
      'Dwa rodzaje wydruków',
      'Obsługa asystenta',
      'Dojazd do 40 km',
    ],
  },
  {
    name: 'Premium',
    duration: '3 godziny',
    isPopular: true,
    icon: 'Star',
    features: [
      'Nielimitowana liczba zdjęć',
      'Obsługa asystenta',
      'Dwa rodzaje wydruków',
      'Stylowe rekwizyty',
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
      'Nielimitowana liczba zdjęć',
      'Obsługa asystenta',
      'Dwa rodzaje wydruków',
      'Stylowe rekwizyty',
      'Personalizacja zdjęć',
      'Wybór tła',
      'Galeria online',
      'Personalizowane szablony wydruków',
      'Dojazd do 100 km',
    ],
  },
];
