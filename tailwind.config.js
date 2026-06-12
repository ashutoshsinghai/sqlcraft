/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0c0d10",  // near-black, not pure
          soft:    "#14161b",
          panel:   "#1a1d24",
          border:  "#22262f",
        },
        ink: {
          DEFAULT: "#e8e8ea",
          muted:   "#8b8e96",
          dim:     "#5a5d65",
        },
        accent: {
          DEFAULT: "#ff9a3c",  // amber — distinct, warm
          soft:    "#cc7a30",
          glow:    "#ffb05c",
        },
        success: "#86efac",
        warn:    "#fbbf24",
        danger:  "#f87171",
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', "ui-monospace", "SF Mono", "Menlo", "monospace"],
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },
      animation: {
        "fade-in":     "fadeIn 0.3s ease-out",
        "bounce-in":   "bounceIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "slide-down":  "slideDown 0.2s ease-out",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        bounceIn: {
          "0%":   { opacity: 0, transform: "scale(0.7)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        slideDown: {
          "0%":   { opacity: 0, transform: "translateY(-6px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      borderRadius: {
        // Tighter, sharper
        DEFAULT: "4px",
        md: "5px",
        lg: "7px",
      },
    },
  },
  plugins: [],
};
