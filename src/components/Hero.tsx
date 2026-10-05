import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative h-[75vh]">
      {/* Background Image with Ken Burns Effect */}
      <div 
        className="absolute inset-0 z-0 ken-burns"
        style={{
          backgroundImage: `linear-gradient(rgba(10, 17, 40, 0.5), rgba(10, 17, 40, 0.7)), url(https://twojabudka.pl/images/background.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Content Container */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center text-white px-4">
        <div 
          className={`max-w-3xl mx-auto transition-all duration-1000 ease-out transform ${
            isVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-12 opacity-0'
          }`}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-playfair leading-tight text-shadow">
            <span className="block">Wyjątkowe wspomnienia</span>
            <span className="block mt-2 text-gold-500">Twoja Budka Na Twoją imprezę</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-shadow opacity-90">
            Najwyższej jakości fotobudka na niezapomniane imprezy, 
            wesela i wydarzenia firmowe
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <a 
              href="#contact" 
              className="btn-primary text-lg"
            >
              Zarezerwuj teraz
            </a>
            <a 
              href="#gallery" 
              className="btn-secondary text-lg"
            >
              Zobacz galerię
            </a>
          </div>

          {/* Scroll Down Indicator */}
          <div className="flex justify-center">
            <a 
              href="#features" 
              className="text-white animate-bounce rounded-full border-2 border-white/50 p-2 hover:bg-white/10 transition-all duration-300"
              aria-label="Scroll down"
            >
              <ChevronDown size={24} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
