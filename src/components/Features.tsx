import React, { useEffect, useRef } from 'react';
import { Camera, Heart, Clock, Award, Zap, Users } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';

const Features: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollAnimation(sectionRef, 0.1);

  const features = [
    {
      icon: <Camera className="text-gold-500" size={40} />,
      title: 'Najwyższa jakość',
      description: 'Profesjonalny sprzęt i wydruki studyjnej jakości'
    },
    {
      icon: <Zap className="text-gold-500" size={40} />,
      title: 'Akcesoria do Twoich zdjęć',
      description: 'Nasi asystenci zapewnią akcesoria, które dodadzą blasku i oryginalności każdemu zdjęciu. '
    },
    {
      icon: <Heart className="text-gold-500" size={40} />,
      title: 'Personalizacja',
      description: 'Dostosowanie do motywu Twojej imprezy'
    },
    {
      icon: <Users className="text-gold-500" size={40} />,
      title: 'Dla każdego',
      description: 'Zabawa dla gości w każdym wieku'
    },
    {
      icon: <Award className="text-gold-500" size={40} />,
      title: 'Doświadczenie',
      description: 'Setki zadowolonych klientów'
    },
    {
      icon: <Clock className="text-gold-500" size={40} />,
      title: 'Niezawodność',
      description: 'Zawsze na czas, zawsze sprawnie'
    }
  ];

  return (
    <section 
      id="features" 
      className="section-padding bg-gray-50 relative overflow-hidden"
      ref={sectionRef}
    >
      {/* Parallax Background */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div 
          className="parallax-bg"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/2910295/pexels-photo-2910295.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold font-playfair mb-4 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Dlaczego nasza <span className="text-gold-500">FotoBudka</span>?
          </h2>
          <p className={`text-lg max-w-2xl mx-auto text-gray-600 transition-all duration-700 delay-1 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Oferujemy wyjątkowe doświadczenie fotograficzne, które zachwyci Twoich gości i stworzy niezapomniane wspomnienia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-2 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;