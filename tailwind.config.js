/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        playfair: '"Playfair Display", serif',
      },
      colors: {
        primary: "#32302B",
        secondary: "#F3E9DF",
        tertiary: "#4946FF",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".flex-center": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      });
    }),
  ],
};
