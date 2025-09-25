/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        robotoSlab: ["RobotoSlab-Regular"],
        robotoSlabBold: ["RobotoSlab-Bold"],
        robotoSlabExtraBold: ["RobotoSlab-ExtraBold"],
        robotoSlabMedium: ["RobotoSlab-Medium"],
        robotoSlabLight: ["RobotoSlab-Light"],
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