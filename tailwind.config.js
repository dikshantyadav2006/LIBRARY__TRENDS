/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },

      /* 🔥 ANIMATIONS */
      animation: {
        gradientMove: "gradientMove 3s ease infinite",
        previewIn: "previewIn 0.25s ease-out",
      },

      keyframes: {
        gradientMove: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        previewIn: {
          "0%": {
            opacity: "0",
            transform: "scale(0.9) translateY(-6px)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1) translateY(0)",
          },
        },
      },
    },
  },
  plugins: [],
};
