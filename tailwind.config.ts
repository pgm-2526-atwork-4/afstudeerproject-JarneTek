import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          navy: "#0f172a", // Dark background
          "navy-light": "#1e293b", // Lighter navy for buttons/sidebar
          green: "#10b981", // Emerald 500 equivalent for accents
          "green-dark": "#059669", // Hover state
        }
      }
    },
  },
  plugins: [],
};
export default config;
