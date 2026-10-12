import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F6F1E7",
          soft: "#FDFBF6",
          deep: "#EADFC8",
        },
        ink: {
          DEFAULT: "#15120D",
          soft: "#2B2520",
        },
        gold: {
          DEFAULT: "#A8824F",
          deep: "#7D5E34",
          light: "#CBA876",
        },
        rule: "rgba(21,18,13,0.12)",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-jost)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
