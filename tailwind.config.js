/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{ts,tsx,js,jsx}",
    "./src/components/**/*.{ts,tsx,js,jsx}",
    "./src/lib/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        night: { 900: "#0B1324", 850: "#0D182A", 800: "#0F1B2D", 700: "#142339" },
        emerald: { 400: "#34D399", 500: "#22C55E", 600: "#16A34A" },
      },
      borderRadius: { xl: "0.875rem", "2xl": "1.25rem" },
      boxShadow: {
        card: "0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.02)",
        "btn-emerald": "0 8px 24px rgba(34,197,94,0.35)",
      },
      fontSize: {
        hero: ["56px", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "hero-lg": ["68px", { lineHeight: "1.03", letterSpacing: "-0.02em" }],
      },
      container: { center: true, padding: "1.5rem", screens: { "2xl": "1200px" } },
    },
  },
  plugins: [],
};
