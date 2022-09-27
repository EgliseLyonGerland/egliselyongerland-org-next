/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        suez: "'Suez One', serif",
        lora: "'Lora', serif",
      },
      colors: {
        chaos: "#32302B",
        sand: "#F3E9DF",
        pop: "#4946FF",
      },
    },
  },
  plugins: [
    require("@headlessui/tailwindcss")({ prefix: "ui" }),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".flex-center": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        ".inline-flex-center": {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        },
      });
    }),
  ],
};
