import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        ink: {
          DEFAULT: "#15132B",
          soft: "#4A4762",
        },
        violet: {
          50: "#F1EFFE",
          100: "#E2DEFD",
          200: "#C4BAFB",
          300: "#A093F7",
          400: "#8172F2",
          500: "#6552EA",
          600: "#5340D6",
          700: "#4230AD",
          800: "#332584",
          900: "#241A5C",
          950: "#14102F",
        },
        ember: {
          50: "#FFF3ED",
          100: "#FFE3D3",
          200: "#FFC5A6",
          300: "#FF9E6E",
          400: "#FF7A3D",
          500: "#F9611F",
          600: "#E24A0F",
          700: "#BB3A0C",
          800: "#8F2D0C",
          900: "#69220C",
        },
        cloud: {
          DEFAULT: "#FAF9FF",
          100: "#F4F2FF",
          200: "#EAE7FB",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(20px, -30px) scale(1.05)" },
          "66%": { transform: "translate(-15px, 15px) scale(0.97)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.25s ease-out",
        "accordion-up": "accordion-up 0.25s ease-out",
        blob: "blob 12s infinite ease-in-out",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
