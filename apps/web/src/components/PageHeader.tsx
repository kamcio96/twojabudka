import React from 'react';
import { ChevronRight } from 'lucide-react';
import { homePage, type PageMeta } from '../content/pages';

interface PageHeaderProps {
  page: PageMeta;
  // Nadtytuł nad H1, np. „Fotobudka na wesele”.
  eyebrow?: string;
  // H1 we wzorze dwóch tonów: wyróżnione słowo w <span className="text-gold-500">.
  title: React.ReactNode;
  lead: React.ReactNode;
  // Drugi przycisk; domyślnie pakiety na stronie głównej.
  secondary?: { href: string; label: string };
}

// Nagłówek podstrony (okazja, miasto, poradnik): okruszki, H1, lead i CTA na `bg-gradient-navy`,
// pod przezroczystym menu. Okruszki odpowiadają `BreadcrumbList` z src/lib/head.ts.
const PageHeader: React.FC<PageHeaderProps> = ({ page, eyebrow, title, lead, secondary = { href: '/#pricing', label: 'Sprawdź pakiety' } }) => (
  <section id="top" className="relative bg-gradient-navy text-white overflow-hidden">
    <div
      className="absolute -top-40 -right-40 w-[36rem] h-[36rem] rounded-full bg-gold-500/10 blur-3xl pointer-events-none"
      aria-hidden="true"
    />
    <div className="container mx-auto px-4 relative pt-28 pb-14 md:pt-36 md:pb-20">
      <nav aria-label="Okruszki" className="hero-reveal mb-8 text-sm">
        <ol className="flex flex-wrap items-center gap-1.5 opacity-80">
          <li>
            <a href={homePage.path} className="focus-ring rounded hover:text-gold-500 transition-colors duration-300">
              {homePage.label}
            </a>
          </li>
          <li className="flex items-center gap-1.5">
            <ChevronRight size={14} aria-hidden="true" />
            <span aria-current="page">{page.label}</span>
          </li>
        </ol>
      </nav>
      <div className="max-w-3xl">
        {eyebrow && <p className="hero-reveal eyebrow text-gold-500 mb-5">{eyebrow}</p>}
        <h1 className="hero-reveal text-4xl md:text-5xl lg:text-6xl font-bold font-playfair tracking-tight mb-6">
          {title}
        </h1>
        <p className="hero-reveal text-lg md:text-xl opacity-90 mb-8">{lead}</p>
        <div className="hero-reveal flex flex-wrap gap-4">
          <a
            href="#contact"
            className="btn-primary"
            data-umami-event="cta-click"
            data-umami-event-place={`header-${page.kind}`}
          >
            Poproś o wycenę
          </a>
          <a href={secondary.href} className="btn-secondary">
            {secondary.label}
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default PageHeader;
