/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amazon: {
          orange: '#FF9900',
          dark: '#131921',
          blue: '#146EB4',
          light: '#232F3E',
          yellow: '#F7CA00',
        }
      }
    },
  },
  plugins: [],
}
