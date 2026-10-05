import React, { useRef } from 'react';
import { Star, Quote } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { reviews } from '../content/reviews';
import { business } from '../content/business';

const Reviews: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useScrollAnimation(sectionRef, 0.1);

  return (
    <section
      id="reviews"
      className={`section-padding bg-white ${isVisible ? 'is-visible' : ''}`}
      ref={sectionRef}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-12">
          <div className="max-w-2xl">
            <h2 className="reveal text-3xl md:text-4xl font-bold font-playfair tracking-tight mb-4">
              Co mówią <span className="text-gold-ink">goście</span>
            </h2>
            <p className="reveal text-lg text-gray-600" style={{ transitionDelay: '0.1s' }}>
              Fragmenty opinii z naszych profili w Google.
            </p>
          </div>
          <a
            href={business.google.koszalin}
            target="_blank"
            rel="noopener noreferrer"
            className="reveal btn-secondary-light self-start md:self-auto"
            style={{ transitionDelay: '0.2s' }}
          >
            Zobacz w Google
          </a>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((review, index) => (
            <li
              key={review.author}
              className="reveal"
              style={{ transitionDelay: `${0.1 + index * 0.08}s` }}
            >
              <figure className="h-full flex flex-col bg-gray-50 rounded-xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-0.5 text-gold-ink" role="img" aria-label="Ocena 5 na 5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} size={16} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                    ))}
                  </div>
                  <Quote size={28} strokeWidth={1.75} className="text-gold-500/40" aria-hidden="true" />
                </div>
                <blockquote className="text-navy-900 flex-1">„{review.text}”</blockquote>
                <figcaption className="mt-5 text-sm text-gray-600">
                  <span className="font-semibold text-navy-900">{review.author}</span>
                  {review.occasion && <> · {review.occasion}</>}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Reviews;
