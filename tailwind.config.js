/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Calmer, slightly warmer slate. Less contrast, more breathing room.
        bg: {
          DEFAULT: "#0f1117",  // base canvas
          soft:    "#161922",  // panels / cards
          panel:   "#1c2030",  // raised
          border:  "#252a3a",  // subtle dividers
        },
        ink: {
          DEFAULT: "#e8e8f0",
          muted:   "#9a9eb0",
          dim:     "#6a6e80",
        },
        accent: {
          DEFAULT: "#a78bfa",
          soft:    "#7c5cf2",
          glow:    "#c4b5fd",
        },
        success: "#86efac",
        warn:    "#fbbf24",
        danger:  "#f87171",
      },
      fontFamily: {
        mono: ["ui-monospace", "SF Mono", "Menlo", "monospace"],
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },
      animation: {
        "fade-in":     "fadeIn 0.4s ease-out",
        "bounce-in":   "bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "pulse-glow":  "pulseGlow 2s ease-in-out infinite",
        "slide-down":  "slideDown 0.3s ease-out",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        bounceIn: {
          "0%":   { opacity: 0, transform: "scale(0.7)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(167, 139, 250, 0.3)" },
          "50%":      { boxShadow: "0 0 30px rgba(167, 139, 250, 0.55)" },
        },
        slideDown: {
          "0%":   { opacity: 0, transform: "translateY(-10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
