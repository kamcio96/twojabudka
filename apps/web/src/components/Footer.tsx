import React from 'react';
import { Camera, Facebook, Instagram, Heart } from 'lucide-react';
import { business } from '../content/business';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-navy text-white">
      <div className="container mx-auto px-4">
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Camera size={32} className="text-gold-500" />
                <span className="text-2xl font-playfair font-semibold">Twoja Budka</span>
              </div>
              <p className="opacity-80 mb-6">
                Tworzymy magiczne wspomnienia dla wyjątkowych wydarzeń. Nasza fotobudka zapewni rozrywkę i niezapomniane chwile dla wszystkich gości.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <SocialIcon icon={<Facebook size={20} />} href={business.social.facebook} label="Twoja Budka na Facebooku" />
                <SocialIcon icon={<Instagram size={20} />} href={business.social.instagram} label="Twoja Budka na Instagramie" />
                <a 
                  href="https://www.weselezklasa.pl/ogloszenia-weselne/twoja-budka,57901/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity duration-300"
                >
                  <img 
                    src="https://www.weselezklasa.pl/banery/Weselezklasa/button230x50bialetlo.png" 
                    alt="Wesele z Klasą" 
                    className="h-[50px] w-auto"
                  />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Szybkie linki</h3>
              <ul className="space-y-3">
                <FooterLink href="#features">Zalety</FooterLink>
                <FooterLink href="#gallery">Galeria</FooterLink>
                <FooterLink href="#pricing">Pakiety</FooterLink>
                <FooterLink href="#contact">Kontakt</FooterLink>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Kontakt</h3>
              <div className="space-y-4 opacity-80">
                <p>
                  <a 
                    href={`mailto:${business.email}`}
                    className="hover:text-gold-500 transition-colors duration-300"
                  >
                    {business.email}
                  </a>
                </p>
                <p>
                  <a 
                    href={business.phoneHref}
                    className="hover:text-gold-500 transition-colors duration-300"
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
            Stworzone z <Heart size={14} className="inline-block text-pink-500 mx-1" /> dla wyjątkowych momentów.
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
    className="bg-white/10 hover:bg-gold-500 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
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
      className="opacity-80 hover:opacity-100 hover:text-gold-500 transition-colors duration-300 inline-block"
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  </li>
);

export default Footer;