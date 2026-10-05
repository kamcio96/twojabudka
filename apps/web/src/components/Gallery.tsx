import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { business } from '../content/business';

// TODO: więcej zdjęć z realizacji (10–15, różne okazje) — patrz docs/TODO.md
const galleryImages = [
  {
    src: '/images/1.webp',
    alt: 'Goście wesela w maskach, kapeluszach i okularach pozują z rekwizytami',
    // Układ mozaiki: duże zdjęcie na początku
    tile: 'col-span-2 lg:row-span-2',
  },
  {
    src: '/images/4.webp',
    alt: 'Stolik z kwiatami, ulotkami i tabliczką Twoja Budka przy fotobudce',
    tile: 'row-span-2',
  },
  {
    src: '/images/2.webp',
    alt: 'Para młoda całuje się w fotobudce, w rękach tabliczki „Gorzko, gorzko!”',
    tile: '',
  },
  {
    src: '/images/3.webp',
    alt: 'Starsza para w kapeluszach i okularach-serduszkach pozuje w fotobudce',
    tile: '',
  },
  {
    src: '/images/5.webp',
    alt: 'Roześmiani znajomi w okularach-serduszkach na osiemnastce',
    tile: 'col-span-2 lg:col-span-1',
  },
];

const Gallery: React.FC = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useScrollAnimation(sectionRef, 0.1);

  const lightboxOpen = lightboxIndex !== null;

  const openLightbox = (index: number, opener: HTMLButtonElement) => {
    openerRef.current = opener;
    setLightboxIndex(index);
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    openerRef.current?.focus();
  }, []);

  const showNext = useCallback(() => {
    setLightboxIndex(i => (i === null ? i : (i + 1) % galleryImages.length));
  }, []);

  const showPrev = useCallback(() => {
    setLightboxIndex(i => (i === null ? i : (i - 1 + galleryImages.length) % galleryImages.length));
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxOpen, closeLightbox, showNext, showPrev]);

  return (
    <section
      id="gallery"
      className={`section-padding bg-gray-50 ${isVisible ? 'is-visible' : ''}`}
      ref={sectionRef}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <h2 className="reveal text-3xl md:text-4xl font-bold font-playfair tracking-tight mb-4">
              Galeria <span className="text-gold-ink">wspomnień</span>
            </h2>
            <p className="reveal text-lg text-gray-600 max-w-xl" style={{ transitionDelay: '0.1s' }}>
              Tak bawią się goście przy naszej fotobudce: na weselach, osiemnastkach
              i imprezach rodzinnych.
            </p>
          </div>
          <a
            href={business.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="reveal btn-secondary-light self-start md:self-auto"
            style={{ transitionDelay: '0.2s' }}
          >
            Więcej na Instagramie
          </a>
        </div>

        <ul className="grid grid-cols-2 lg:grid-cols-3 auto-rows-[160px] sm:auto-rows-[220px] lg:auto-rows-[230px] gap-3 md:gap-4">
          {galleryImages.map((image, index) => (
            <li
              key={image.src}
              className={`reveal ${image.tile}`}
              style={{ transitionDelay: `${0.1 + index * 0.08}s` }}
            >
              <button
                type="button"
                onClick={e => openLightbox(index, e.currentTarget)}
                className="focus-ring group relative block w-full h-full overflow-hidden rounded-xl shadow-card"
                aria-label={`Powiększ zdjęcie: ${image.alt}`}
              >
                <img
                  src={image.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 ease-brand group-hover:scale-105"
                />
                <span
                  className="absolute right-3 bottom-3 w-9 h-9 rounded-full bg-white/90 text-navy-900 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300"
                  aria-hidden="true"
                >
                  <Expand size={16} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Galeria zdjęć"
          className="fixed inset-0 z-[60] bg-navy-900/95 flex justify-center items-center"
          onClick={e => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            className="focus-ring absolute top-4 right-4 p-2 rounded-full text-white hover:text-gold-500 transition-colors duration-300"
            onClick={closeLightbox}
            aria-label="Zamknij galerię"
          >
            <X size={32} />
          </button>

          <button
            type="button"
            className="focus-ring absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full text-white hover:text-gold-500 transition-colors duration-300"
            onClick={showPrev}
            aria-label="Poprzednie zdjęcie"
          >
            <ChevronLeft size={40} />
          </button>

          <figure className="max-w-5xl w-full px-14 flex flex-col items-center">
            <img
              src={galleryImages[lightboxIndex].src}
              alt={galleryImages[lightboxIndex].alt}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <figcaption className="mt-4 text-white/80 text-sm text-center">
              {lightboxIndex + 1} / {galleryImages.length} · {galleryImages[lightboxIndex].alt}
            </figcaption>
          </figure>

          <button
            type="button"
            className="focus-ring absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full text-white hover:text-gold-500 transition-colors duration-300"
            onClick={showNext}
            aria-label="Następne zdjęcie"
          >
            <ChevronRight size={40} />
          </button>
        </div>
      )}
    </section>
  );
};

export default Gallery;
