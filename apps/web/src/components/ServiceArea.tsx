import React, { useRef } from 'react';
import { MapPin } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { business } from '../content/business';

const [mainCity, ...otherCities] = business.cities;

const ServiceArea: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useScrollAnimation(sectionRef, 0.1);

  return (
    <section
      id="area"
      className={`section-padding bg-gray-50 ${isVisible ? 'is-visible' : ''}`}
      ref={sectionRef}
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="reveal text-3xl md:text-4xl font-bold font-playfair tracking-tight mb-4">
              Gdzie <span className="text-gold-ink">dojeżdżamy</span>
            </h2>
            <p className="reveal text-lg text-gray-600 mb-6" style={{ transitionDelay: '0.1s' }}>
              Fotobudka na wesela, urodziny i imprezy firmowe w {business.mainCityLocative} i okolicach.
              Dojeżdżamy {business.area}, także do mniejszych miejscowości po drodze.
            </p>
            <a
              href="#contact"
              className="reveal btn-primary"
              style={{ transitionDelay: '0.2s' }}
              data-umami-event="cta-click"
              data-umami-event-place="area"
            >
              Sprawdź termin
            </a>
          </div>

          <div className="lg:col-span-7">
            <p
              className="reveal flex items-center gap-3 font-playfair text-2xl font-semibold mb-6"
              style={{ transitionDelay: '0.15s' }}
            >
              <MapPin className="text-gold-ink flex-shrink-0" size={28} strokeWidth={1.75} aria-hidden="true" />
              Fotobudka {mainCity} i okolice
            </p>
            <ul
              className="reveal flex flex-wrap gap-2"
              style={{ transitionDelay: '0.25s' }}
              aria-label="Obsługiwane miasta"
            >
              {otherCities.map(city => (
                <li
                  key={city}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-navy-900"
                >
                  {city}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceArea;
