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
      padding: {
        DEFAULT: "1.5rem",
        lg: "2rem",
      },
      screens: { "2xl": "1200px" },
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
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        display: ["var(--font-inter)", "Inter", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      fontSize: {
        "fluid-2xs": ["clamp(0.6875rem, 0.2vw + 0.65rem, 0.75rem)", { lineHeight: "1.4" }], // 11-12px
        "fluid-xs": ["clamp(0.75rem, 0.25vw + 0.7rem, 0.8125rem)", { lineHeight: "1.4" }], // 12-13px
        "fluid-sm": ["clamp(0.875rem, 0.25vw + 0.8rem, 0.9375rem)", { lineHeight: "1.5" }], // 14-15px
        "fluid-base": ["clamp(0.9375rem, 0.35vw + 0.85rem, 1rem)", { lineHeight: "1.6" }], // 15-16px
        "fluid-lg": ["clamp(1rem, 0.5vw + 0.9rem, 1.125rem)", { lineHeight: "1.6" }], // 16-18px
        "fluid-xl": ["clamp(1.125rem, 0.75vw + 0.95rem, 1.25rem)", { lineHeight: "1.4" }], // 18-20px
        "fluid-2xl": ["clamp(1.25rem, 1vw + 1rem, 1.5rem)", { lineHeight: "1.3" }], // 20-24px
        "fluid-3xl": ["clamp(1.375rem, 1.5vw + 1rem, 1.625rem)", { lineHeight: "1.3" }], // 22-26px
        "fluid-4xl": ["clamp(1.75rem, 2vw + 1.2rem, 2.5rem)", { lineHeight: "1.2" }], // 28-40px
        "fluid-5xl": ["clamp(1.75rem, 2.5vw + 1.25rem, 2.625rem)", { lineHeight: "1.2" }], // 28-42px
        "fluid-6xl": ["clamp(2.25rem, 3.5vw + 1.5rem, 3.5rem)", { lineHeight: "1.1" }], // 36-56px
        "fluid-stat": ["40px", { lineHeight: "1.1" }],
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.3)",
        md: "0 8px 24px rgba(0, 0, 0, 0.25)",
        lg: "0 24px 60px rgba(0, 0, 0, 0.35)",
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
