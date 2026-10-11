import Navbar from './components/Navbar';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import { findPage, homePage } from './content/pages';
import { routes } from './routes';

interface AppProps {
  // Adres strony: przy prerenderze z src/content/pages.ts, w przeglądarce location.pathname.
  path: string;
}

function App({ path }: AppProps) {
  const page = findPage(path) ?? homePage;
  const Page = routes[page.path];
  const isHome = page.kind === 'home';

  return (
    <div className="font-montserrat text-navy-900">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] btn-primary"
      >
        Przejdź do treści
      </a>
      <Navbar isHome={isHome} />
      <main id="main">
        <Page />
        <ContactForm eventType={page.eventType} />
      </main>
      <Footer isHome={isHome} />
    </div>
  );
}

export default App;
