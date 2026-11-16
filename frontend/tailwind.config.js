export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
      colors: {
        olive: {
          50: "#f3f5ef",
          100: "#e4e9dc",
          200: "#c8d1bb",
          300: "#a3b091",
          400: "#7d8c6b",
          500: "#5f6f4f",
          600: "#4b5a3e",
          700: "#3d4a33",
          800: "#323d2a",
          900: "#27301f",
        },
        clay: {
          50: "#fbf3ee",
          100: "#f5e3d7",
          200: "#eac3a9",
          300: "#dd9f7a",
          400: "#c9825a",
          500: "#b06d48",
          600: "#9a5b3b",
          700: "#7f4a30",
        },
        cream: "#faf7f2",
        ink: {
          DEFAULT: "#1f2421",
          muted: "#5b6170",
          subtle: "#8e95a3",
        },
        line: "#e7e1d6",
      },
      boxShadow: {
        card: "0 1px 2px rgba(31,36,33,.04), 0 8px 24px -12px rgba(61,74,51,.18)",
      },
    },
  },
  plugins: [],
};