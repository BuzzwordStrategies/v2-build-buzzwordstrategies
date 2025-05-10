/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amber: {
          400: '#FFBA38',
          500: '#FFB020',
          600: '#E69B00',
          700: '#CC8800',
          800: '#B37700',
          900: '#996600'
        }
      }
    },
  },
  plugins: [],
}
