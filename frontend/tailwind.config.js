/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        senai: {
          red: '#ED1C24',
          darkRed: '#C1121F',
          lightRed: '#FEE2E2',
        }
      }
    },
  },
  plugins: [],
}

