// Umami (własna instancja). Adres i ID strony z env w czasie buildu; bez nich nic się nie ładuje
// (np. lokalnie). Umami nie używa cookies, więc nie wymaga zgody w bannerze.
// Kliknięcia linków śledzimy atrybutami data-umami-event (obsługuje je sam skrypt Umami).

declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string | number>) => void };
  }
}

export function loadUmami() {
  const url = import.meta.env.VITE_UMAMI_URL?.replace(/\/$/, '');
  const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
  if (!url || !websiteId) return;

  const script = document.createElement('script');
  script.defer = true;
  script.src = `${url}/script.js`;
  script.dataset.websiteId = websiteId;
  const domains = import.meta.env.VITE_UMAMI_DOMAINS;
  if (domains) script.dataset.domains = domains;
  document.head.appendChild(script);
}

export function track(event: string, data?: Record<string, string | number>) {
  try {
    window.umami?.track(event, data);
  } catch {
    // analityka nie może psuć strony
  }
}
