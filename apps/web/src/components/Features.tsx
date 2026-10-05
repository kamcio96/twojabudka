import React, { useRef } from 'react';
import { Printer, Palette, UserRound, Sparkles, Infinity as InfinityIcon, Images } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';

// Tylko fakty z oferty (src/content/packages.ts); bez liczb, których nie podał właściciel
const features = [
  {
    icon: Printer,
    title: 'Wydruki na miejscu',
    description: 'Zdjęcia drukujemy od razu, w dwóch rodzajach wydruków. Goście zabierają je do domu.',
  },
  {
    icon: Palette,
    title: 'Szablon z motywem imprezy',
    description: 'Personalizowany szablon wydruku dopasowany do Twojej imprezy.',
  },
  {
    icon: UserRound,
    title: 'Asystent przez cały czas',
    description: 'Obsługuje fotobudkę, podaje rekwizyty i pomaga gościom przy zdjęciach.',
  },
  {
    icon: Sparkles,
    title: 'Stylowe rekwizyty',
    description: 'Kapelusze, okulary, maski i tabliczki z napisami, które dodają zdjęciom charakteru.',
  },
  {
    icon: InfinityIcon,
    title: 'Zdjęcia bez limitu',
    description: 'Goście robią tyle zdjęć, ile chcą, przez cały czas trwania pakietu.',
  },
  {
    icon: Images,
    title: 'Galeria online',
    description: 'W pakietach Premium i Exclusive wszystkie zdjęcia trafiają też do galerii online.',
  },
];

const Features: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useScrollAnimation(sectionRef, 0.1);

  return (
    <section
      id="features"
      className={`section-padding bg-white ${isVisible ? 'is-visible' : ''}`}
      ref={sectionRef}
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <figure className="reveal lg:col-span-5 lg:sticky lg:top-28">
            <img
              src="/images/3.webp"
              alt="Starsza para w kapeluszach i okularach-serduszkach pozuje w fotobudce"
              width={1600}
              height={1066}
              loading="lazy"
              decoding="async"
              className="w-full aspect-[4/3] lg:aspect-[4/5] object-cover rounded-2xl shadow-card"
            />
            <figcaption className="mt-4 text-gray-600">
              Zabawa dla gości w każdym wieku — od dzieci po dziadków.
            </figcaption>
          </figure>

          <div className="lg:col-span-7">
            <h2 className="reveal text-3xl md:text-4xl font-bold font-playfair tracking-tight mb-4">
              Dlaczego <span className="text-gold-ink">Twoja Budka</span>?
            </h2>
            <p className="reveal text-lg text-gray-600 max-w-2xl mb-12" style={{ transitionDelay: '0.1s' }}>
              Zajmujemy się wszystkim, co dzieje się przy fotobudce. Ty i Twoi goście po prostu
              się bawicie.
            </p>

            <ul className="grid sm:grid-cols-2 gap-x-10">
              {features.map(({ icon: Icon, title, description }, index) => (
                <li
                  key={title}
                  className="reveal border-t border-gray-200 py-7"
                  style={{ transitionDelay: `${0.15 + index * 0.08}s` }}
                >
                  <Icon className="text-gold-ink mb-4" size={32} strokeWidth={1.75} aria-hidden="true" />
                  <h3 className="text-xl font-semibold mb-2">{title}</h3>
                  <p className="text-gray-600">{description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
