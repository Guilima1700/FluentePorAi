/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta extraída dos arquivos de identidade visual (public/logo-*.jpg e feed-6.jpg)
        brand: {
          cream: "#FEF0D5",
          paper: "#FFF8EA",
          sky: "#669BBB",
          navy: "#01304A",
          red: "#C1121F",
          redDeep: "#A30E19",
          wine: "#780001",
        },
      },
      fontFamily: {
        serif: ["Instrument Serif", "Georgia", "Times New Roman", "serif"],
        sans: ["Urbanist", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
