/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        Figtree: ['Figtree-Regular','sans-serif'],
        "Figtree-Bold": ['Figtree-Bold','sans-serif'],
        "Figtree-ExtraBold": ['Figtree-ExtraBold','sans-serif'],
        "Figtree-Medium": ['Figtree-Medium','sans-serif'],
        "Figtree-Light": ['Figtree-Light','sans-serif'],
      },
      colors: {
        "primary": "#112D4E",
        "secondary":"#3F72AF",
        "dark":"#112D4E",
        "light":"#F9F7F7",
        "white":"#fafafa",
        "black":"#000000"
      }
    },
  },
  plugins: [],
}