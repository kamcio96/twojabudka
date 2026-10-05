import React, { useRef } from 'react';
import { Check, Clock, Star, Gift } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { packages, type PackageIcon } from '../content/packages';

// Mapowanie nazw ikon na komponenty
const iconMap: Record<PackageIcon, JSX.Element> = {
  Clock: <Clock className="text-gold-500" size={32} />,
  Star: <Star className="text-navy-900" size={32} />,
  Gift: <Gift className="text-gold-500" size={32} />,
};

const Pricing: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollAnimation(sectionRef, 0.1);


  return (
      <section id="pricing" className="section-padding bg-gray-50" ref={sectionRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2
                className={`text-3xl md:text-4xl font-bold font-playfair mb-4 transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
              Nasze <span className="text-gold-ink">Pakiety</span>
            </h2>
            <p
                className={`text-lg max-w-2xl mx-auto text-gray-600 transition-all duration-700 delay-1 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
              Wybierz pakiet idealnie dopasowany do Twoich potrzeb
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
                <div
                    key={pkg.name}
                    className={`flex flex-col rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:-translate-y-2 ${
                        pkg.isPopular ? 'md:scale-105 z-10' : ''
                    } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
                >
                  {pkg.isPopular && (
                      <div className="bg-pink-500 text-navy-900 text-center py-2 font-semibold">
                        Najczęściej wybierany
                      </div>
                  )}

                  <div className={`flex flex-col flex-grow p-8 ${pkg.isPopular ? 'bg-gradient-gold h-full' : 'bg-white'}`}>
                    <div className="flex justify-between items-center mb-6">
                      <h3
                          className="text-2xl font-bold font-playfair text-navy-900"
                      >
                        {pkg.name}
                      </h3>
                      <div>{iconMap[pkg.icon]}</div>
                    </div>

                    <div className="mb-6 flex items-center text-3xl font-bold text-navy-900">
                      <Clock className="mr-2" size={24} aria-hidden="true" />
                      <span>{pkg.duration}</span>
                    </div>

                    <ul className="space-y-3 mb-8 flex-grow">
                      {pkg.features.map((feature, fIndex) => (
                          <li
                              key={fIndex}
                              className={`flex items-start ${
                                  pkg.isPopular ? 'text-navy-900' : 'text-gray-600'
                              }`}
                          >
                            <Check
                                className={`${
                                    pkg.isPopular ? 'text-navy-900' : 'text-gold-ink'
                                } mt-1 mr-2 flex-shrink-0`}
                                size={16}
                            />
                            <span>{feature}</span>
                          </li>
                      ))}
                    </ul>

                    <a
                        href="#contact"
                        data-umami-event="cta-click"
                        data-umami-event-place={`pakiet-${pkg.name}`}
                        className={`block text-center py-3 px-6 rounded-lg transition-all duration-300 font-medium mt-auto ${
                            pkg.isPopular
                                ? 'bg-navy-900 text-white hover:bg-navy-800'
                                : 'bg-gold-500 text-navy-900 hover:bg-gold-600'
                        }`}
                    >
                      Poproś o wycenę
                    </a>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </section>
  );
};

export default Pricing;
