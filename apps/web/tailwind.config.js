/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0A1128',
          800: '#1A2A4F',
          700: '#2A3B62',
        },
        gold: {
          500: '#D4AF37',
          600: '#C09C2C',
          700: '#A88A1F',
          ink: '#8A6D12', // złoty tekst na jasnym tle (kontrast 4,9:1)
        },
        pink: {
          500: '#FF6B81',
          600: '#FF475F',
          700: '#FF223E',
        },
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
      },
      boxShadow: {
        // Cienie w odcieniu granatu marki zamiast czarnych
        card: '0 12px 32px -12px rgba(10, 17, 40, 0.16)',
        'card-hover': '0 24px 48px -16px rgba(10, 17, 40, 0.24)',
        print: '0 18px 40px -12px rgba(0, 0, 0, 0.45)',
      },
      transitionTimingFunction: {
        brand: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};