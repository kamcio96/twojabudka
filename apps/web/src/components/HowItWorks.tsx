import React, { useRef } from 'react';
import { MessageSquareText, CalendarCheck, PartyPopper } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';

const steps = [
  {
    icon: MessageSquareText,
    title: 'Napisz lub zadzwoń',
    description: 'Podaj datę, miejsce i okazję. Wystarczy krótki formularz albo telefon.',
  },
  {
    icon: CalendarCheck,
    title: 'Otrzymaj wycenę',
    description: 'Sprawdzimy termin i przygotujemy wycenę wybranego pakietu z dojazdem.',
  },
  {
    icon: PartyPopper,
    title: 'Baw się z gośćmi',
    description: 'Przyjeżdżamy z fotobudką i rekwizytami. Asystent zajmuje się resztą.',
  },
];

const HowItWorks: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useScrollAnimation(sectionRef, 0.15);

  return (
    <section
      id="how-it-works"
      className={`section-padding bg-white ${isVisible ? 'is-visible' : ''}`}
      ref={sectionRef}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-14">
          <h2 className="reveal text-3xl md:text-4xl font-bold font-playfair tracking-tight mb-4">
            Jak to <span className="text-gold-ink">działa</span>
          </h2>
          <p className="reveal text-lg text-gray-600" style={{ transitionDelay: '0.1s' }}>
            Od pierwszej wiadomości do ostatniego wydruku — trzy proste kroki.
          </p>
        </div>

        <ol className="grid md:grid-cols-3 gap-10 md:gap-8">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <li
              key={title}
              className="reveal relative"
              style={{ transitionDelay: `${0.15 + index * 0.1}s` }}
            >
              <div className="flex items-center gap-4 mb-5">
                <span
                  className="font-playfair text-5xl font-bold text-gold-ink leading-none"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <span className="h-px flex-1 bg-gray-200" aria-hidden="true" />
                <Icon className="text-navy-900" size={28} strokeWidth={1.75} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600">{description}</p>
            </li>
          ))}
        </ol>

        <div className="reveal mt-14" style={{ transitionDelay: '0.5s' }}>
          <a
            href="#contact"
            className="btn-primary"
            data-umami-event="cta-click"
            data-umami-event-place="how-it-works"
          >
            Sprawdź termin
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
