/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        btn: "#0284c7",
        btnHover: "#3ab0e2",
      },
      fontFamily: {
        sans: ["Mulish", "sans-serif"],
      },
    },
  },
  plugins: [],
}

