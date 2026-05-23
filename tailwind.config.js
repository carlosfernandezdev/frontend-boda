/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta cálida tierra/champagne para una estética de boda
        crema: '#F7F1E8',
        arena: '#EDE3D3',
        champagne: '#D9C4A9',
        terracota: '#B5683E',
        vino: '#6E3A34',
        oliva: '#7C7A4F',
        tinta: '#2E2A26',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        suave: '0 4px 24px -8px rgba(46, 42, 38, 0.18)',
      },
    },
  },
  plugins: [],
};
