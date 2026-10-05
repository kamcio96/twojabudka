import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Gallery from './components/Gallery';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import { hotjar } from 'react-hotjar';

hotjar.initialize({id: 6409555, sv: 6});

function App() {
  return (
    <div className="font-montserrat text-navy-900">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] btn-primary"
      >
        Przejdź do treści
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Features />
        <Gallery />
        <HowItWorks />
        <Pricing />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}

export default App;
