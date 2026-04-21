/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      colors: {
        ink: {
          950: "#07070d",
          900: "#0e0e18",
          800: "#16161f",
          700: "#1f1f2e",
          600: "#2a2a3a",
        },
        volt: { DEFAULT: "#e8ff47", dark: "#c8df20" },
        cyan: { neon: "#47ffe8" },
        rose: { neon: "#ff4778" },
        emerald: { neon: "#47ff8e" },
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        pulseDot: {
          "0%,100%": { opacity: 1 },
          "50%": { opacity: 0.3 },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite",
        fadeUp: "fadeUp 0.25s ease forwards",
        pulseDot: "pulseDot 2s infinite",
      },
    },
  },
  plugins: [],
};