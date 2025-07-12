/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#93c5fd',
          DEFAULT: '#3b82f6',
          dark: '#1e40af',
        },
        slate: {
          950: '#0f172a',
          900: '#1e293b',
          800: '#334155',
        },
        neutral: {
          100: '#f5f5f5',
          200: '#e5e5e5',
          800: '#1f2937',
        },
      },
    },
  },
  plugins: [
    require('@midudev/tailwind-animations'),
  ],
};
