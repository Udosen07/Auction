/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./auth/**/*.html",
    "./post/**/*.html",
    "./profile/**/*.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        custom: ["TechnaSans-Regular", "sans-serif"],
      },
    },
  },
  plugins: [],
};
