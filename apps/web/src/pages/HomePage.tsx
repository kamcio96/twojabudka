import Hero from '../components/Hero';
import Features from '../components/Features';
import Gallery from '../components/Gallery';
import HowItWorks from '../components/HowItWorks';
import Pricing from '../components/Pricing';
import Reviews from '../components/Reviews';
import ServiceArea from '../components/ServiceArea';
import Faq from '../components/Faq';

// Formularz kontaktowy dokłada App.tsx na końcu każdej strony.
function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Gallery />
      <HowItWorks />
      <Pricing />
      <Reviews />
      <ServiceArea />
      <Faq />
    </>
  );
}

export default HomePage;
