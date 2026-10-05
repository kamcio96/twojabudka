import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Gallery from './components/Gallery';
import Pricing from './components/Pricing';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import { hotjar } from 'react-hotjar';

hotjar.initialize({id: 6409555, sv: 6});

function App() {
  return (
    <div className="font-montserrat text-navy-900">
      <Navbar />
      <Hero />
      <Features />
      <Gallery />
      <Pricing />
      <ContactForm />
      <Footer />
    </div>
  );
}

export default App;
