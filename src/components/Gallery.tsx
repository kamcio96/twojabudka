import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';

const galleryImages = [
  {
    src: "https://twojabudka.pl/images/1.png",
    alt: "Zdjęcie z fotobudki 1",
  },
  {
    src: "https://twojabudka.pl/images/2.png",
    alt: "Zdjęcie z fotobudki 2",
  },
  {
    src: "https://twojabudka.pl/images/3.png",
    alt: "Zdjęcie z fotobudki 3",
  },
  {
    src: "https://twojabudka.pl/images/4.png",
    alt: "Zdjęcie z fotobudki 4",
  },
  {
    src: "https://twojabudka.pl/images/5.png",
    alt: "Zdjęcie z fotobudki 5",
  }
];

const Gallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout>();
  const isVisible = useScrollAnimation(sectionRef, 0.1);

  const startAutoPlay = () => {
    autoPlayRef.current = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setCurrentIndex(prev => prev + 1);
      }
    }, 5000);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, []);

  const handleTransitionEnd = () => {
    if (currentIndex >= galleryImages.length) {
      setIsTransitioning(false);
      setCurrentIndex(0);
    } else if (currentIndex < 0) {
      setIsTransitioning(false);
      setCurrentIndex(galleryImages.length - 1);
    } else {
      setIsTransitioning(false);
    }
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    stopAutoPlay();
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + 1);
    startAutoPlay();
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    stopAutoPlay();
    setIsTransitioning(true);
    setCurrentIndex(prev => prev - 1);
    startAutoPlay();
  };

  const openLightbox = (index: number) => {
    stopAutoPlay();
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
    startAutoPlay();
  };

  const nextLightboxImage = () => {
    setLightboxIndex((prevIndex) => 
      (prevIndex + 1) % galleryImages.length
    );
  };

  const prevLightboxImage = () => {
    setLightboxIndex((prevIndex) => 
      (prevIndex - 1 + galleryImages.length) % galleryImages.length
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightboxImage();
      if (e.key === 'ArrowLeft') prevLightboxImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

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
              className="flex transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(-${(currentIndex + offset) * (100 / 3)}%)`,
              }}
              onTransitionEnd={handleTransitionEnd}
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
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white text-navy-900 p-2 rounded-full shadow-md hover:bg-gold-500 hover:text-white transition-colors duration-300"
            onClick={nextSlide}
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
