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
        brand: {
          neon: "#00F5A0",    // acento principal
          dark: "#0C1F1C",    // fondo principal
          charcoal: "#101010",// superficie (cards)
          light: "#F5F5F5",   // texto claro
        },
      },
      fontFamily: {
        // si luego usas next/font con Inter, aquí queda el alias
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        // por si lo usas en algún lugar con clase bg-hero-gradient
        "hero-gradient":
          "radial-gradient(900px 480px at 50% 0%, rgba(0,245,160,0.10), transparent 60%), radial-gradient(700px 420px at 85% 0%, rgba(0,245,160,0.07), transparent 60%), linear-gradient(180deg, #0C1F1C 0%, #0C1F1C 50%, #0C1F1C 100%)",
      },
    },
  },
  plugins: [],
};
