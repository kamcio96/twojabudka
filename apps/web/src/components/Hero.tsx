import React from 'react';
import { Check } from 'lucide-react';
import { business } from '../content/business';
import { photo } from '../lib/images';

const HIGHLIGHTS = ['Nielimitowana liczba zdjęć', 'Wydruki na miejscu', 'Asystent i rekwizyty'];

// Zdjęcia z realizacji ułożone jak odbitki z fotobudki (tylko od lg)
const PRINTS = [
  { src: '/images/2.webp', alt: 'Para młoda całuje się w fotobudce, w rękach tabliczki „Gorzko, gorzko!”', className: 'left-0 top-10 w-[58%] -rotate-6 z-10' },
  { src: '/images/5.webp', alt: 'Roześmiani znajomi w okularach-serduszkach na osiemnastce', className: 'right-0 top-0 w-[58%] rotate-3 z-20' },
  { src: '/images/1.webp', alt: 'Goście wesela w maskach i kapeluszach pozują z rekwizytami', className: 'left-[18%] bottom-0 w-[64%] -rotate-1 z-30' },
];

const Hero: React.FC = () => {
  return (
    <section
      id="top"
      className="relative bg-gradient-navy text-white overflow-hidden"
    >
      {/* Delikatna złota poświata, bez dodatkowych kolorów */}
      <div
        className="absolute -top-40 -right-40 w-[36rem] h-[36rem] rounded-full bg-gold-500/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 relative pt-28 pb-16 md:pt-32 md:pb-24 lg:min-h-[100svh] lg:flex lg:items-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          <div className="max-w-xl">
            <p className="hero-reveal eyebrow text-gold-500 mb-5">
              <span className="hidden sm:inline">{business.name} · </span>
              {business.area}
            </p>

            <h1
              className="hero-reveal font-playfair font-bold tracking-tight leading-[1.08] text-4xl md:text-6xl lg:text-7xl mb-6"
              style={{ animationDelay: '0.1s' }}
            >
              Fotobudka na wesela{' '}
              <span className="text-gold-500">w {business.mainCityLocative}</span>
            </h1>

            <p
              className="hero-reveal text-lg md:text-xl text-white/85 mb-8 max-w-lg"
              style={{ animationDelay: '0.2s' }}
            >
              Wyjątkowe wspomnienia dla gości w każdym wieku. Na wesela, urodziny, studniówki
              i imprezy firmowe przywozimy fotobudkę, rekwizyty i asystenta, a Ty bawisz się
              razem z gośćmi.
            </p>

            <ul
              className="hero-reveal flex flex-wrap gap-x-6 gap-y-2 mb-10 text-white/90"
              style={{ animationDelay: '0.3s' }}
            >
              {HIGHLIGHTS.map(item => (
                <li key={item} className="flex items-center gap-2">
                  <Check size={18} className="text-gold-500 flex-shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <div
              className="hero-reveal flex flex-col sm:flex-row gap-4"
              style={{ animationDelay: '0.4s' }}
            >
              <a
                href="#contact"
                className="btn-primary text-lg"
                data-umami-event="cta-click"
                data-umami-event-place="hero"
              >
                Poproś o wycenę
              </a>
              <a href="#gallery" className="btn-secondary text-lg">
                Zobacz galerię
              </a>
            </div>
          </div>

          {/* Mobile i tablet: jedno zdjęcie pod tekstem */}
          <div className="hero-reveal lg:hidden" style={{ animationDelay: '0.5s' }}>
            <div className="bg-white p-2 pb-8 rounded-sm shadow-print max-w-md mx-auto">
              <img
                {...photo(PRINTS[2].src, '(min-width: 480px) 448px, calc(100vw - 48px)')}
                alt={PRINTS[2].alt}
                className="w-full aspect-[3/2] object-cover"
              />
            </div>
          </div>

          {/* Desktop: odbitki ułożone jedna na drugiej */}
          <div className="hidden lg:block relative aspect-[1/1] max-h-[640px] w-full">
            {PRINTS.map((print, index) => (
              <div
                key={print.src}
                className={`hero-reveal absolute ${print.className} bg-white p-2.5 pb-10 rounded-sm shadow-print`}
                style={{ animationDelay: `${0.3 + index * 0.15}s` }}
              >
                <img
                  {...photo(print.src, '360px')}
                  alt={print.alt}
                  className="w-full aspect-[3/2] object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
