import React, { useRef } from 'react';
import { Check, Clock, Star, Gift } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { packages, type PackageIcon } from '../content/packages';

const iconMap: Record<PackageIcon, typeof Clock> = { Clock, Star, Gift };

// Cechy pakietu bazowego; pozostałe w wyższych pakietach wyróżniamy jako dodatki
const baseFeatures = new Set(packages[0].features);

const PRICE_FACTORS = ['czasu trwania pakietu', 'terminu', 'odległości dojazdu', 'wybranych dodatków'];

const Pricing: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useScrollAnimation(sectionRef, 0.1);

  return (
    <section
      id="pricing"
      className={`section-padding bg-gray-50 ${isVisible ? 'is-visible' : ''}`}
      ref={sectionRef}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="reveal text-3xl md:text-4xl font-bold font-playfair tracking-tight mb-4">
            Nasze <span className="text-gold-ink">pakiety</span>
          </h2>
          <p className="reveal text-lg max-w-2xl mx-auto text-gray-600" style={{ transitionDelay: '0.1s' }}>
            Wybierz czas zabawy. W każdym pakiecie masz asystenta, rekwizyty i zdjęcia bez limitu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
          {packages.map((pkg, index) => {
            const Icon = iconMap[pkg.icon];
            const popular = pkg.isPopular;
            return (
              <article
                key={pkg.name}
                className={`reveal relative flex flex-col rounded-2xl p-8 ${
                  popular
                    ? 'bg-gradient-gold shadow-card-hover md:-my-4 md:py-12 z-10'
                    : 'bg-white shadow-card'
                }`}
                style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
              >
                {popular && (
                  <p className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-pink-500 text-navy-900 text-sm font-semibold px-4 py-1.5 rounded-full shadow-card">
                    Najczęściej wybierany
                  </p>
                )}

                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold font-playfair text-navy-900">{pkg.name}</h3>
                  <Icon
                    className={popular ? 'text-navy-900' : 'text-gold-ink'}
                    size={28}
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </div>

                <p className="text-3xl font-bold text-navy-900 mb-6">{pkg.duration}</p>

                <ul className={`space-y-3 mb-8 flex-grow ${popular ? 'text-navy-900' : 'text-gray-600'}`}>
                  {pkg.features.map(feature => {
                    const extra = index > 0 && !baseFeatures.has(feature);
                    return (
                      <li key={feature} className="flex items-start">
                        <Check
                          className={`${popular ? 'text-navy-900' : 'text-gold-ink'} mt-1 mr-2 flex-shrink-0`}
                          size={16}
                          aria-hidden="true"
                        />
                        <span className={extra ? 'font-semibold text-navy-900' : ''}>{feature}</span>
                      </li>
                    );
                  })}
                </ul>

                <a
                  href="#contact"
                  data-umami-event="cta-click"
                  data-umami-event-place={`pakiet-${pkg.name}`}
                  className={
                    popular
                      ? 'focus-ring inline-flex items-center justify-center py-3 px-6 rounded-lg font-semibold bg-navy-900 text-white hover:bg-navy-800 active:scale-[0.98] transition-all duration-300 ease-brand'
                      : 'btn-primary'
                  }
                >
                  Poproś o wycenę
                </a>
              </article>
            );
          })}
        </div>

        <p className="reveal text-center text-gray-600 max-w-2xl mx-auto mt-14" style={{ transitionDelay: '0.4s' }}>
          <span className="font-semibold text-navy-900">Od czego zależy cena?</span> Od{' '}
          {PRICE_FACTORS.join(', ').replace(/, ([^,]*)$/, ' i $1')}. Wyślij zapytanie, a przygotujemy
          wycenę dla Twojej imprezy.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
