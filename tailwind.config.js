/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Warmer dark palette — feels more "study room", less "terminal"
        bg: { DEFAULT: "#13131e", soft: "#1a1a28", panel: "#222234", border: "#2d2d44" },
        ink: { DEFAULT: "#f0f0f5", muted: "#a0a0b8", dim: "#70708a" },
        accent: { DEFAULT: "#a78bfa", soft: "#7c5cf2", glow: "#c4b5fd" },
        success: "#86efac",
        warn: "#fbbf24",
        danger: "#f87171",
      },
      fontFamily: {
        mono: ["ui-monospace", "SF Mono", "Menlo", "monospace"],
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "bounce-in": "bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        bounceIn: {
          "0%": { opacity: 0, transform: "scale(0.7)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(167, 139, 250, 0.4)" },
          "50%": { boxShadow: "0 0 30px rgba(167, 139, 250, 0.7)" },
        },
      },
    },
  },
  plugins: [],
};
