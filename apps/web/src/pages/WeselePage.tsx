import React, { useRef } from 'react';
import { Printer, Palette, UserRound, Sparkles, Infinity as InfinityIcon, Images, Check } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Pricing from '../components/Pricing';
import ServiceArea from '../components/ServiceArea';
import Faq from '../components/Faq';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { business } from '../content/business';
import { listPl, packages, priceFactors } from '../content/packages';
import { findPage } from '../content/pages';
import { weseleFaq } from '../content/wesele';
import { photo } from '../lib/images';

// /fotobudka-na-wesele — frazy: fotobudka na wesele, … koszt, … cena, … Szczecin (docs/seo.md).
// Tylko fakty z oferty (packages.ts, business.ts). Do pary młodej zwracamy się na „Wy”.
// TODO (docs/TODO.md): więcej zdjęć z wesel (sala, para młoda, wydruki), opinia pary młodej.
const page = findPage('/fotobudka-na-wesele')!;

const benefits = [
  {
    icon: Printer,
    title: 'Pamiątka dla każdego gościa',
    description:
      'Zdjęcia drukujemy od razu, w dwóch rodzajach wydruków. Goście wracają z wesela z własną odbitką.',
  },
  {
    icon: Palette,
    title: 'Szablon z motywem Waszego wesela',
    description: 'Każdy wydruk ma personalizowany szablon dopasowany do Waszego wesela.',
  },
  {
    icon: UserRound,
    title: 'Asystent, a Wy się bawicie',
    description:
      'Asystent obsługuje fotobudkę przez cały czas trwania pakietu, podaje rekwizyty i pomaga gościom. ' +
      'Nikt z rodziny nie musi pilnować sprzętu.',
  },
  {
    icon: Sparkles,
    title: 'Rekwizyty dla wszystkich pokoleń',
    description:
      'Kapelusze, okulary, maski i tabliczki z napisami, np. „Gorzko, gorzko!”. Przy fotobudce bawią się ' +
      'razem młodzi i dziadkowie.',
  },
  {
    icon: InfinityIcon,
    title: 'Zdjęcia bez limitu',
    description: 'Goście robią tyle zdjęć, ile chcą, przez cały czas trwania pakietu.',
  },
  {
    icon: Images,
    title: 'Wszystkie zdjęcia po weselu',
    description: `W pakietach ${listPl(
      packages.filter(p => p.features.includes('Galeria online')).map(p => p.name)
    )} zdjęcia trafiają też do galerii online.`,
  },
];

const Benefits: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useScrollAnimation(sectionRef, 0.1);

  return (
    <section id="korzysci" className={`section-padding bg-white ${isVisible ? 'is-visible' : ''}`} ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-x-16 gap-y-10 lg:gap-y-0">
          <div className="lg:col-start-6 lg:col-span-7">
            <h2 className="reveal text-3xl md:text-4xl font-bold font-playfair tracking-tight mb-4">
              Co fotobudka daje na <span className="text-gold-ink">weselu</span>
            </h2>
            <p className="reveal text-lg text-gray-600 max-w-2xl lg:mb-12" style={{ transitionDelay: '0.1s' }}>
              Fotobudka to atrakcja, przy której goście sami się rozkręcają. Między tańcami robią zdjęcia
              z rodziną i znajomymi, a Wy macie pamiątkę z całego wieczoru.
            </p>
          </div>

          <figure className="reveal lg:col-start-1 lg:col-span-5 lg:row-start-1 lg:row-span-2 lg:self-start lg:sticky lg:top-28">
            <img
              {...photo('/images/2.webp', '(min-width: 1024px) 480px, 100vw')}
              alt="Para młoda całuje się w fotobudce, w rękach tabliczki „Gorzko, gorzko!”"
              loading="lazy"
              decoding="async"
              className="w-full aspect-[4/3] lg:aspect-[4/5] object-cover rounded-2xl shadow-card"
            />
            <figcaption className="mt-4 text-gray-600">Para młoda w fotobudce Twoja Budka.</figcaption>
          </figure>

          <ul className="lg:col-start-6 lg:col-span-7 grid sm:grid-cols-2 gap-x-10">
            {benefits.map(({ icon: Icon, title, description }, index) => (
              <li
                key={title}
                className="reveal border-t border-gray-200 py-5 sm:py-7 flex gap-4 sm:block"
                style={{ transitionDelay: `${0.15 + index * 0.08}s` }}
              >
                <Icon
                  className="text-gold-ink flex-shrink-0 mt-0.5 sm:mt-0 sm:mb-4 w-7 h-7 sm:w-8 sm:h-8"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">{title}</h3>
                  <p className="text-gray-600">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

const PriceAndTime: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useScrollAnimation(sectionRef, 0.1);

  return (
    <section id="cena" className={`section-padding bg-white ${isVisible ? 'is-visible' : ''}`} ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <h2 className="reveal text-3xl md:text-4xl font-bold font-playfair tracking-tight mb-4">
              Ile kosztuje fotobudka na <span className="text-gold-ink">wesele</span>?
            </h2>
            <p className="reveal text-lg text-gray-600 mb-6" style={{ transitionDelay: '0.1s' }}>
              Cenę ustalamy indywidualnie, bo każde wesele jest inne. Na wycenę wpływają:
            </p>
            <ul className="reveal space-y-3 mb-8" style={{ transitionDelay: '0.15s' }}>
              {priceFactors.map(factor => (
                <li key={factor.name} className="flex items-start gap-3">
                  <Check className="text-gold-ink mt-1 flex-shrink-0" size={18} aria-hidden="true" />
                  <span>{factor.name}</span>
                </li>
              ))}
            </ul>
            <p className="reveal text-gray-600 mb-8" style={{ transitionDelay: '0.2s' }}>
              Napiszcie, kiedy i gdzie jest wesele. Sprawdzimy termin i prześlemy wycenę wybranego pakietu
              z dojazdem.
            </p>
            <a
              href="#contact"
              className="reveal btn-primary"
              style={{ transitionDelay: '0.25s' }}
              data-umami-event="cta-click"
              data-umami-event-place="wesele-cena"
            >
              Poproś o wycenę
            </a>
          </div>

          <div>
            <h2 className="reveal text-3xl md:text-4xl font-bold font-playfair tracking-tight mb-4">
              Na ile <span className="text-gold-ink">godzin</span>?
            </h2>
            <p className="reveal text-lg text-gray-600 mb-6" style={{ transitionDelay: '0.1s' }}>
              Pakiety różnią się czasem pracy fotobudki i dodatkami. Asystent jest z Wami przez cały czas
              trwania pakietu.
            </p>
            <ul className="reveal border-t border-gray-200" style={{ transitionDelay: '0.15s' }}>
              {packages.map(pkg => (
                <li key={pkg.name} className="border-b border-gray-200 py-4 flex items-baseline justify-between gap-4">
                  <span className="font-playfair text-xl font-semibold">
                    {pkg.name}
                    {pkg.isPopular && <span className="block sm:inline sm:ml-2 text-sm font-montserrat font-medium text-gold-ink">najczęściej wybierany</span>}
                  </span>
                  <span className="font-semibold whitespace-nowrap">{pkg.duration}</span>
                </li>
              ))}
            </ul>
            <p className="reveal text-gray-600 mt-6" style={{ transitionDelay: '0.2s' }}>
              Na wesela dojeżdżamy {business.area}: do sal w {business.mainCityLocative}, Stargardzie,
              Kołobrzegu, Koszalinie i mniejszych miejscowościach po drodze.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

function WeselePage() {
  return (
    <>
      <PageHeader
        page={page}
        eyebrow={`Fotobudka na wesele · ${business.mainCity} i okolice`}
        title={
          <>
            Fotobudka na <span className="text-gold-500">wesele</span>
          </>
        }
        lead={
          <>
            Zdjęcia bez limitu, wydruki od ręki i asystent przez całą zabawę. Goście wracają do domu
            z pamiątką, a Wy możecie spokojnie się bawić. Dojeżdżamy {business.area}.
          </>
        }
        secondary={{ href: '#pricing', label: 'Sprawdź pakiety' }}
      />
      <Benefits />
      <Pricing showPriceNote={false} />
      <PriceAndTime />
      <ServiceArea />
      <Faq items={weseleFaq} />
    </>
  );
}

export default WeselePage;
