/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      container: {
        padding: '1rem', 
        center: true,
      },
      rotate: {
        'y-180': 'rotateY(180deg)',
      },
      perspective: {
        '1000': '1000px',
      },
      backfaceVisibility: {
        'hidden': 'hidden',
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to right, rgba(252, 214, 255, 0.7), rgba(41, 216, 255, .7), rgba(255, 253, 128, .7), rgba(248, 154, 191, .7), rgba(252, 214, 255, .7))',
        'hero-gradient': 'linear-gradient(to bottom, #000, rgba(32, 13, 66, 0.34), rgba(79, 33, 161, 0.65), rgba(164, 110, 216, 0.82))',
        'radial-gradient': 'radial-gradient(closest-side, #000 82%, #9560EB)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
        },
        '.transform-style-preserve': {
          transformStyle: 'preserve-3d',
        },
        '.rotate-y-180': {
          transform: 'rotateY(180deg)',
        },
      });
    },
  ],
};
