/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // ADD THESE FOR PREMIUM TYPOGRAPHY
      letterSpacing: {
        widest: '0.25em',
        tightest: '-0.02em',
      },
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      colors: {
        ink: {
          950: "#0C0A09",
          900: "#1C1917",
          800: "#44403C",
          700: "#A8A29E",
          600: "#E7E5E4",
        },
        volt: { DEFAULT: "#CA8A04", dark: "#A16207" },
        cyan: { neon: "#0F766E" },
        rose: { neon: "#9F1239" },
        emerald: { neon: "#15803D" },
      },
      // ... keep your existing keyframes and animations
    },
  },
  plugins: [],
};