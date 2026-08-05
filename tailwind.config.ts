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
      fontSize: {
        "fluid-2xs": ["clamp(0.5625rem, 0.25vw + 0.4rem, 0.6875rem)", { lineHeight: "1.4" }],
        "fluid-xs": ["clamp(0.625rem, 0.35vw + 0.35rem, 0.75rem)", { lineHeight: "1.4" }],
        "fluid-sm": ["clamp(0.75rem, 0.4vw + 0.45rem, 0.875rem)", { lineHeight: "1.5" }],
        "fluid-base": ["clamp(0.8125rem, 0.5vw + 0.5rem, 1rem)", { lineHeight: "1.6" }],
        "fluid-lg": ["clamp(0.9375rem, 0.75vw + 0.5rem, 1.125rem)", { lineHeight: "1.6" }],
        "fluid-xl": ["clamp(1rem, 1vw + 0.5rem, 1.25rem)", { lineHeight: "1.5" }],
        "fluid-2xl": ["clamp(1.125rem, 1.5vw + 0.5rem, 1.5rem)", { lineHeight: "1.4" }],
        "fluid-3xl": ["clamp(1.25rem, 2vw + 0.5rem, 1.875rem)", { lineHeight: "1.3" }],
        "fluid-4xl": ["clamp(1.5rem, 2.5vw + 0.5rem, 2.25rem)", { lineHeight: "1.2" }],
        "fluid-5xl": ["clamp(1.75rem, 3vw + 0.5rem, 3rem)", { lineHeight: "1.15" }],
        "fluid-6xl": ["clamp(1.65rem, 4vw + 0.5rem, 3.75rem)", { lineHeight: "1.1" }],
        "fluid-stat": ["clamp(1.25rem, 3vw + 0.5rem, 3rem)", { lineHeight: "1.1" }],
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
