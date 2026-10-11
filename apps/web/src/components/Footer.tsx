import React from 'react';
import { Camera, Facebook, Instagram, Heart } from 'lucide-react';
import { business } from '../content/business';
import { pages } from '../content/pages';
import { sectionHref } from '../lib/nav';

const SECTIONS = [
  { id: 'features', label: 'Zalety' },
  { id: 'gallery', label: 'Galeria' },
  { id: 'how-it-works', label: 'Jak to działa' },
  { id: 'pricing', label: 'Pakiety' },
  { id: 'reviews', label: 'Opinie' },
  { id: 'faq', label: 'Częste pytania' },
  { id: 'contact', label: 'Kontakt' },
];

// Podstrony ofertowe (okazje, pakiety, poradniki) — linkowanie wewnętrzne; miasta linkuje „Gdzie dojeżdżamy”.
const OFFER_PAGES = pages.filter(p => p.kind === 'occasion' || p.kind === 'info' || p.kind === 'guide');

interface FooterProps {
  isHome: boolean;
}

const Footer: React.FC<FooterProps> = ({ isHome }) => {
  return (
    <footer className="bg-gradient-navy text-white">
      <div className="container mx-auto px-4">
        <div className="py-12 md:py-16">
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${OFFER_PAGES.length > 0 ? 'lg:grid-cols-4' : 'md:grid-cols-3'} gap-x-6 gap-y-10`}>
            <div className={`sm:col-span-2 ${OFFER_PAGES.length > 0 ? 'lg:col-span-1' : 'md:col-span-1'}`}>
              <div className="flex items-center space-x-2 mb-6">
                <Camera size={32} className="text-gold-500" aria-hidden="true" />
                <span className="text-2xl font-playfair font-semibold">Twoja Budka</span>
              </div>
              <p className="opacity-80 mb-6">
                Wynajem fotobudki z wydrukami i asystentem w {business.mainCityLocative} i okolicach:
                wesela, urodziny, studniówki i imprezy firmowe. Dojeżdżamy {business.area}.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <SocialIcon icon={<Facebook size={20} />} href={business.social.facebook} label="Twoja Budka na Facebooku" />
                <SocialIcon icon={<Instagram size={20} />} href={business.social.instagram} label="Twoja Budka na Instagramie" />
                <a 
                  href={business.social.weselezklasa}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="focus-ring rounded hover:opacity-80 transition-opacity duration-300"
                >
                  <img 
                    src="https://www.weselezklasa.pl/banery/Weselezklasa/button230x50bialetlo.png" 
                    alt="Twoja Budka w katalogu Wesele z Klasą"
                    width={230}
                    height={50}
                    loading="lazy"
                    className="h-[50px] w-auto"
                  />
                </a>
              </div>
            </div>
            
            {OFFER_PAGES.length > 0 && (
              <div>
                <h3 className="eyebrow text-gold-500 mb-5">Oferta</h3>
                <ul className="flex flex-wrap gap-x-6 gap-y-3 sm:block sm:space-y-3">
                  {OFFER_PAGES.map(p => (
                    <FooterLink key={p.path} href={p.path}>{p.label}</FooterLink>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="eyebrow text-gold-500 mb-5">Na stronie</h3>
              <ul className="flex flex-wrap gap-x-6 gap-y-3 sm:block sm:space-y-3">
                {SECTIONS.map(section => (
                  <FooterLink key={section.id} href={sectionHref(section.id, isHome)}>{section.label}</FooterLink>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="eyebrow text-gold-500 mb-5">Kontakt</h3>
              <div className="space-y-3 sm:space-y-4 opacity-80">
                <p>
                  <a 
                    href={`mailto:${business.email}`}
                    data-umami-event="mail-click"
                    data-umami-event-place="footer"
                    className="focus-ring rounded hover:text-gold-500 transition-colors duration-300"
                  >
                    {business.email}
                  </a>
                </p>
                <p>
                  <a 
                    href={business.phoneHref}
                    data-umami-event="tel-click"
                    data-umami-event-place="footer"
                    className="focus-ring rounded hover:text-gold-500 transition-colors duration-300"
                  >
                    {business.phone}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 py-6 text-center opacity-80">
          <p>
            &copy; {new Date().getFullYear()} Twoja Budka. Wszystkie prawa zastrzeżone. 
            Stworzone z <Heart size={14} className="inline-block text-pink-500 mx-1" role="img" aria-label="sercem" /> dla wyjątkowych momentów.
          </p>
        </div>
      </div>
    </footer>
  );
};

interface SocialIconProps {
  icon: React.ReactNode;
  href: string;
  label: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ icon, href, label }) => (
  <a 
    href={href} 
    className="focus-ring bg-white/10 hover:bg-gold-500 hover:text-navy-900 w-11 h-11 rounded-full flex items-center justify-center transition-colors duration-300"
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
  >
    {icon}
  </a>
);

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  isExternal?: boolean;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, children, isExternal }) => (
  <li>
    <a 
      href={href} 
      className="focus-ring rounded opacity-80 hover:opacity-100 hover:text-gold-500 transition-colors duration-300 inline-block"
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  </li>
);

export default Footer;