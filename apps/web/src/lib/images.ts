// Zdjęcia z public/images mają warianty 480 i 960 px (`{nazwa}-480.webp`, `{nazwa}-960.webp`)
// obok oryginału. srcSet pozwala telefonom pobrać mniejszy plik, width/height zapobiegają
// przesunięciom układu (CLS).
const ORIGINALS: Record<string, { width: number; height: number }> = {
  '/images/1.webp': { width: 1600, height: 1066 },
  '/images/2.webp': { width: 1440, height: 960 },
  '/images/3.webp': { width: 1600, height: 1066 },
  '/images/4.webp': { width: 1200, height: 1600 },
  '/images/5.webp': { width: 1600, height: 1066 },
};

// Atrybuty <img> dla zdjęcia z realizacji: src, srcSet, sizes, width, height.
export function photo(src: string, sizes: string) {
  const original = ORIGINALS[src];
  if (!original) return { src };
  const base = src.replace(/\.webp$/, '');
  return {
    src,
    srcSet: `${base}-480.webp 480w, ${base}-960.webp 960w, ${src} ${original.width}w`,
    sizes,
    width: original.width,
    height: original.height,
  };
}
