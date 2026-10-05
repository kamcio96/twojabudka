import React, { useRef, useState, useEffect } from 'react';
import { Camera, Check, Clock, Star, Users, Gift } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';

// Mapowanie nazw ikon na komponenty
const iconMap: Record<string, JSX.Element> = {
  Clock: <Clock className="text-gold-500" size={32} />,
  Star: <Star className="text-white" size={32} />,
  Gift: <Gift className="text-gold-500" size={32} />,
};

interface Package {
  name: string;
  duration: string;
  isPopular: boolean;
  features: string[];
  gradient: string;
  icon: string;
}

const Pricing: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollAnimation(sectionRef, 0.1);

  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://twojabudka.pl/packages.json')
        .then((res) => {
          if (!res.ok) throw new Error('Błąd ładowania danych');
          return res.json();
        })
        .then((data) => {
          setPackages(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError('Nie udało się załadować pakietów.');
          setLoading(false);
        });
  }, []);

  return (
      <section id="pricing" className="section-padding bg-gray-50" ref={sectionRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2
                className={`text-3xl md:text-4xl font-bold font-playfair mb-4 transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
              Nasze <span className="text-gold-500">Pakiety</span>
            </h2>
            <p
                className={`text-lg max-w-2xl mx-auto text-gray-600 transition-all duration-700 delay-1 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
              Wybierz pakiet idealnie dopasowany do Twoich potrzeb
            </p>
          </div>

          {loading && <p className="text-center text-gray-500">Ładowanie pakietów...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {packages.map((pkg, index) => (
                    <div
                        key={index}
                        className={`flex flex-col rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:-translate-y-2 ${
                            pkg.isPopular ? 'md:scale-105 z-10' : ''
                        } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                        style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
                    >
                      {pkg.isPopular && (
                          <div className="bg-pink-500 text-white text-center py-2 font-semibold">
                            Najczęściej wybierany
                          </div>
                      )}

                      <div className={`flex flex-col flex-grow p-8 ${pkg.gradient}`}>
                        <div className="flex justify-between items-center mb-6">
                          <h3
                              className={`text-2xl font-bold font-playfair ${
                                  pkg.isPopular ? 'text-white' : 'text-navy-900'
                              }`}
                          >
                            {pkg.name}
                          </h3>
                          <div>{iconMap[pkg.icon] || <Camera size={32} />}</div>
                        </div>

                        <div className="mb-6">
                    <span
                        className={`text-4xl font-bold ${
                            pkg.isPopular ? 'text-white' : 'text-navy-900'
                        }`}
                    >
                        <Users className="inline-block mr-2" size={16} />
                        <span>{pkg.duration}</span>
                    </span>
                          {/*<div className={`mt-1 ${pkg.isPopular ? 'text-white/90' : 'text-gray-600'}`}>*/}
                          {/*  <Users className="inline-block mr-2" size={16} />*/}
                          {/*  <span>{pkg.duration}</span>*/}
                          {/*</div>*/}
                        </div>

                        <ul className="space-y-3 mb-8 flex-grow">
                          {pkg.features.map((feature, fIndex) => (
                              <li
                                  key={fIndex}
                                  className={`flex items-start ${
                                      pkg.isPopular ? 'text-white/90' : 'text-gray-600'
                                  }`}
                              >
                                <Check
                                    className={`${
                                        pkg.isPopular ? 'text-white' : 'text-gold-500'
                                    } mt-1 mr-2 flex-shrink-0`}
                                    size={16}
                                />
                                <span>{feature}</span>
                              </li>
                          ))}
                        </ul>

                        <a
                            href="#contact"
                            className={`block text-center py-3 px-6 rounded-lg transition-all duration-300 font-medium mt-auto ${
                                pkg.isPopular
                                    ? 'bg-white text-gold-500 hover:bg-gray-100'
                                    : 'bg-gold-500 text-white hover:bg-gold-600'
                            }`}
                        >
                          Zarezerwuj teraz
                        </a>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>
      </section>
  );
};

export default Pricing;
