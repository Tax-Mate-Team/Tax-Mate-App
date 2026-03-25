const { colors } = require("./src/theme/tokens.js");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        danger: colors.danger,
        success: colors.success,
        warning: colors.warning,
        purple: colors.purple,
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#1A1A2E",
        },
        background: {
          DEFAULT: "#F9FAFB",
          dark: "#0F0F1E",
        },
        card: {
          DEFAULT: "#FFFFFF",
          dark: "#1E1E36",
        },
      },
    },
  },
  plugins: [],
};
