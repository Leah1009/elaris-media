import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F3E8D6",
          soft: "#FBF6EA",
          deep: "#E9DAC0",
        },
        ink: {
          DEFAULT: "#16130F",
          soft: "#2A241C",
        },
        gold: {
          DEFAULT: "#B08A54",
          deep: "#8C6C3A",
          light: "#D9BE8E",
        },
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
