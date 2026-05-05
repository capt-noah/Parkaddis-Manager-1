/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#064e3b",
        "primary-container": "#064e3b",
        "on-primary": "#ffffff",
        "on-primary-container": "#ecfdf5",
        secondary: "#475569",
        tertiary: "#d97706",
        background: "#f8fafc",
        surface: "#ffffff",
        "surface-container": "#f1f5f9",
      },
      fontFamily: {
        headline: ["PlusJakartaSans-Bold", "sans-serif"],
        body: ["Inter-Regular", "sans-serif"],
      },
    },
  },
  plugins: [],
};
