import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';

const galleryImages = [
  {
    src: "/images/1.webp",
    alt: "Zdjęcie z fotobudki 1",
  },
  {
    src: "/images/2.webp",
    alt: "Zdjęcie z fotobudki 2",
  },
  {
    src: "/images/3.webp",
    alt: "Zdjęcie z fotobudki 3",
  },
  {
    src: "/images/4.webp",
    alt: "Zdjęcie z fotobudki 4",
  },
  {
    src: "/images/5.webp",
    alt: "Zdjęcie z fotobudki 5",
  }
];

// Keep in sync with the duration-500 class on the slide track
const SLIDE_DURATION_MS = 500;

// Matches the Tailwind breakpoints used for slide widths: w-full / sm:w-1/2 / md:w-1/3
const getSlidesPerView = () => {
  if (window.matchMedia('(min-width: 768px)').matches) return 3;
  if (window.matchMedia('(min-width: 640px)').matches) return 2;
  return 1;
};

const Gallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [slidesPerView, setSlidesPerView] = useState(getSlidesPerView);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const isTransitioning = useRef(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollAnimation(sectionRef, 0.1);

  useEffect(() => {
    const handleResize = () => setSlidesPerView(getSlidesPerView());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const slide = useCallback((direction: 1 | -1) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setAnimate(true);
    setCurrentIndex(prev => prev + direction);
    setTimeout(() => {
      isTransitioning.current = false;
    }, SLIDE_DURATION_MS);
  }, []);

  // Past either end of the real images: once the slide finishes, jump without animation
  // to the equivalent position in the middle copy
  useEffect(() => {
    if (currentIndex >= 0 && currentIndex < galleryImages.length) return;
    const timer = setTimeout(() => {
      setAnimate(false);
      setCurrentIndex((currentIndex + galleryImages.length) % galleryImages.length);
    }, SLIDE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Autoplay; restarts after every slide change, so manual navigation resets the timer
  useEffect(() => {
    if (lightboxOpen) return;
    const timer = setTimeout(() => slide(1), 5000);
    return () => clearTimeout(timer);
  }, [currentIndex, lightboxOpen, slide]);

  // Re-enable the transition one frame after an instant jump
  useEffect(() => {
    if (animate) return;
    const frame = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(frame);
  }, [animate]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const nextLightboxImage = useCallback(() => {
    setLightboxIndex((prevIndex) => 
      (prevIndex + 1) % galleryImages.length
    );
  }, []);

  const prevLightboxImage = useCallback(() => {
    setLightboxIndex((prevIndex) => 
      (prevIndex - 1 + galleryImages.length) % galleryImages.length
    );
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightboxImage();
      if (e.key === 'ArrowLeft') prevLightboxImage();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxOpen, closeLightbox, nextLightboxImage, prevLightboxImage]);

  // Create a circular array of images for infinite scrolling
  const displayImages = [...galleryImages, ...galleryImages, ...galleryImages];
  const offset = galleryImages.length;

  return (
    <section id="gallery" className="section-padding bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold font-playfair mb-4 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Galeria <span className="text-gold-500">Wspomnień</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto text-gray-600 transition-all duration-700 delay-1 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Zobacz jak nasi klienci bawią się przy naszej fotobudce
          </p>
        </div>

        <div className={`relative ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
          <div className="relative overflow-hidden">
            <div 
              className={`flex ${animate ? 'transition-transform duration-500 ease-in-out' : ''}`}
              style={{ 
                transform: `translateX(-${(currentIndex + offset) * (100 / slidesPerView)}%)`,
              }}
            >
              {displayImages.map((image, index) => (
                <div 
                  key={index} 
                  className="w-full sm:w-1/2 md:w-1/3 flex-shrink-0 p-2"
                  onClick={() => openLightbox(index % galleryImages.length)}
                >
                  <div className="relative overflow-hidden rounded-lg cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 h-64 md:h-80">
                    <img 
                      src={image.src} 
                      alt={image.alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-in-out" 
                    />
                    <div className="absolute inset-0 bg-navy-900 bg-opacity-30 hover:bg-opacity-10 transition-all duration-300"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white text-navy-900 p-2 rounded-full shadow-md hover:bg-gold-500 hover:text-white transition-colors duration-300"
            onClick={() => slide(-1)}
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white text-navy-900 p-2 rounded-full shadow-md hover:bg-gold-500 hover:text-white transition-colors duration-300"
            onClick={() => slide(1)}
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex justify-center items-center">
          <button 
            className="absolute top-4 right-4 text-white hover:text-gold-500 transition-colors duration-300"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <X size={32} />
          </button>
          
          <button 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gold-500 transition-colors duration-300"
            onClick={prevLightboxImage}
            aria-label="Previous image"
          >
            <ChevronLeft size={40} />
          </button>
          
          <div className="max-w-4xl max-h-[80vh] w-full h-full flex justify-center items-center">
            <img 
              src={galleryImages[lightboxIndex].src} 
              alt={galleryImages[lightboxIndex].alt}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          
          <button 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gold-500 transition-colors duration-300"
            onClick={nextLightboxImage}
            aria-label="Next image"
          >
            <ChevronRight size={40} />
          </button>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
            {lightboxIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
