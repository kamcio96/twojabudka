import React, { useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { faq } from '../content/faq';

// Natywne <details>: działa bez JS i z klawiatury; treść odpowiedzi jest w HTML także po zwinięciu.
const Faq: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useScrollAnimation(sectionRef, 0.1);

  return (
    <section
      id="faq"
      className={`section-padding bg-white ${isVisible ? 'is-visible' : ''}`}
      ref={sectionRef}
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="reveal text-3xl md:text-4xl font-bold font-playfair tracking-tight mb-4">
          Częste <span className="text-gold-ink">pytania</span>
        </h2>
        <p className="reveal text-lg text-gray-600 mb-10" style={{ transitionDelay: '0.1s' }}>
          Nie ma tu Twojego pytania? Napisz albo zadzwoń.
        </p>

        <div className="reveal border-t border-gray-200" style={{ transitionDelay: '0.2s' }}>
          {faq.map(item => (
            <details key={item.question} className="group border-b border-gray-200">
              <summary className="focus-ring rounded flex items-center justify-between gap-4 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <h3 className="text-lg font-semibold">{item.question}</h3>
                <ChevronDown
                  size={22}
                  className="flex-shrink-0 text-gold-ink transition-transform duration-300 ease-brand group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="pb-5 text-gray-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
