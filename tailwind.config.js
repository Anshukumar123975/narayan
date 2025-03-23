/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "neon-green": "#39ff14",
        "neon-orange": "#ff7300",
      },
    },
  },
  plugins: [],
};
