import React, { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen
          ? 'bg-white shadow-md py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <a
            href="#"
            className="flex items-center space-x-2 text-2xl font-semibold"
          >
            <Camera 
              size={32} 
              className={`${scrolled || mobileMenuOpen ? 'text-gold-500' : 'text-white'} transition-colors duration-300`} 
            />
            <span 
              className={`${
                scrolled || mobileMenuOpen ? 'text-navy-900' : 'text-white'
              } font-playfair transition-colors duration-300`}
            >
              Twoja Budka
            </span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="#features" scrolled={scrolled || mobileMenuOpen}>Zalety</NavLink>
            <NavLink href="#gallery" scrolled={scrolled || mobileMenuOpen}>Galeria</NavLink>
            <NavLink href="#pricing" scrolled={scrolled || mobileMenuOpen}>Cennik</NavLink>
            <NavLink href="#contact" scrolled={scrolled || mobileMenuOpen}>Kontakt</NavLink>
            <a
              href="#contact"
              className="btn-primary"
            >
              Zarezerwuj
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gold-500"
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            <svg
              className={`w-8 h-8 ${scrolled || mobileMenuOpen ? 'text-navy-900' : 'text-white'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4 px-4">
              <MobileNavLink href="#features" onClick={toggleMobileMenu}>Zalety</MobileNavLink>
              <MobileNavLink href="#gallery" onClick={toggleMobileMenu}>Galeria</MobileNavLink>
              <MobileNavLink href="#pricing" onClick={toggleMobileMenu}>Cennik</MobileNavLink>
              <MobileNavLink href="#contact" onClick={toggleMobileMenu}>Kontakt</MobileNavLink>
              <a
                href="#contact"
                className="btn-primary text-center"
                onClick={toggleMobileMenu}
              >
                Zarezerwuj teraz
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  scrolled: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, scrolled }) => (
  <a
    href={href}
    className={`relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-gold-500 hover:after:w-full after:transition-all after:duration-300 font-medium 
    ${scrolled ? 'text-navy-900' : 'text-white'} 
    hover:text-gold-500 transition-colors duration-300`}
  >
    {children}
  </a>
);

interface MobileNavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ href, children, onClick }) => (
  <a
    href={href}
    className="block py-2 text-navy-900 hover:text-gold-500 transition-colors duration-300"
    onClick={onClick}
  >
    {children}
  </a>
);

export default Navbar;