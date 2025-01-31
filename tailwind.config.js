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
        agenda_web_primary: {
          DEFAULT: '#EA573F',
          dark: '#BD4531',
        }
      }
    },
  },
  plugins: [],
}
