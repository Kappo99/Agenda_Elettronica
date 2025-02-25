/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'sm': '576px',
      'md': '768px',
      'lg': '992px',
      'xl': '1200px',
      '2xl': '1400px'
    },
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        agenda_primary: {
          DEFAULT: '#0096D4',
          dark: '#1273eb',
        }
      }
    },
  },
  plugins: [],
}
