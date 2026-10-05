// Prosty limiter w pamięci (okno przesuwne). Wystarcza dla jednej instancji API.
export function createRateLimiter(max: number, windowMs: number, now: () => number = Date.now) {
  const hits = new Map<string, number[]>();

  // Sprzątanie starych wpisów, żeby mapa nie rosła bez końca.
  const sweep = setInterval(() => {
    const cutoff = now() - windowMs;
    for (const [key, times] of hits) {
      const fresh = times.filter((t) => t > cutoff);
      if (fresh.length) hits.set(key, fresh);
      else hits.delete(key);
    }
  }, Math.max(windowMs, 60_000));
  sweep.unref();

  return {
    /** Rejestruje próbę; zwraca false, gdy limit został przekroczony. */
    hit(key: string): boolean {
      const t = now();
      const fresh = (hits.get(key) ?? []).filter((x) => x > t - windowMs);
      if (fresh.length >= max) {
        hits.set(key, fresh);
        return false;
      }
      fresh.push(t);
      hits.set(key, fresh);
      return true;
    },
  };
}
