/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./apps/**/*.{js,ts,jsx,tsx}", "./packages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-primary": "#6366f1",
        "brand-secondary": "#8b5cf6",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
