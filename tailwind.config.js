/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: "#0a0e14", soft: "#0f141a", panel: "#151c25", border: "#1f2933" },
        ink: { DEFAULT: "#e6edf3", muted: "#8b95a3", dim: "#6e7681" },
        accent: { DEFAULT: "#7aa2f7", soft: "#3d59a1" },
        success: "#9ece6a",
        warn: "#e0af68",
        danger: "#f7768e",
      },
      fontFamily: {
        mono: ["ui-monospace", "SF Mono", "Menlo", "monospace"],
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
