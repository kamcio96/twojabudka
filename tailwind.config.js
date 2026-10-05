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
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
};