import React, { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'features', label: 'Zalety' },
  { id: 'gallery', label: 'Galeria' },
  { id: 'how-it-works', label: 'Jak to działa' },
  { id: 'pricing', label: 'Pakiety' },
  { id: 'contact', label: 'Kontakt' },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Podświetla w menu sekcję, która zajmuje środek ekranu
  useEffect(() => {
    const sections = NAV_ITEMS
      .map(item => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const solid = scrolled || mobileMenuOpen;

  return (
    <nav
      aria-label="Menu główne"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-brand ${
        solid ? 'bg-white shadow-card py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <a
            href="#top"
            className="focus-ring rounded-lg flex items-center space-x-2 text-2xl font-semibold"
          >
            <Camera
              size={32}
              aria-hidden="true"
              className={`${solid ? 'text-gold-ink' : 'text-gold-500'} transition-colors duration-300`}
            />
            <span
              className={`${solid ? 'text-navy-900' : 'text-white'} font-playfair transition-colors duration-300`}
            >
              Twoja Budka
            </span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {NAV_ITEMS.map(item => (
              <NavLink key={item.id} href={`#${item.id}`} solid={solid} active={activeId === item.id}>
                {item.label}
              </NavLink>
            ))}
            <a
              href="#contact"
              className="btn-primary py-2.5"
              data-umami-event="cta-click"
              data-umami-event-place="navbar"
            >
              Poproś o wycenę
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className={`lg:hidden focus-ring rounded-lg p-1 ${solid ? 'text-navy-900' : 'text-white'}`}
            onClick={() => setMobileMenuOpen(open => !open)}
            aria-label={mobileMenuOpen ? 'Zamknij menu' : 'Menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden mt-4 py-4 bg-white rounded-xl shadow-card">
            <div className="flex flex-col space-y-1 px-4">
              {NAV_ITEMS.map(item => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={closeMobileMenu}
                  aria-current={activeId === item.id ? 'true' : undefined}
                  className={`focus-ring rounded-lg block py-3 font-medium transition-colors duration-300 hover:text-gold-ink ${
                    activeId === item.id ? 'text-gold-ink' : 'text-navy-900'
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contact"
                className="btn-primary mt-2"
                data-umami-event="cta-click"
                data-umami-event-place="navbar-mobile"
                onClick={closeMobileMenu}
              >
                Poproś o wycenę
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
  solid: boolean;
  active: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, solid, active }) => {
  const hoverColor = solid ? 'hover:text-gold-ink' : 'hover:text-gold-500';
  const underline = solid ? 'after:bg-gold-ink' : 'after:bg-gold-500';
  return (
    <a
      href={href}
      aria-current={active ? 'true' : undefined}
      className={`focus-ring rounded relative font-medium transition-colors duration-300 ${hoverColor}
      after:absolute after:-bottom-1 after:left-0 after:h-[2px] ${underline} after:transition-all after:duration-300 after:ease-brand
      ${active ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
      ${solid ? 'text-navy-900' : 'text-white'}`}
    >
      {children}
    </a>
  );
};

export default Navbar;
