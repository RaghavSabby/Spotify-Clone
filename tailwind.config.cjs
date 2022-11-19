/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    colors: {
        "green": "#1DB954",
        "black": "#191414",
        "black-base": "#121212",
        "black-primary": "#191414",
        "black-secondary": "#171818",
        "light-black": "#282828",
        "primary": "#FFFFFF",
        "secondary": "#b3b3b3",
        "gray": "#535353"
    },
    gridTemplateColumns: {
      "auto-fill-cards": "repeat(auto-fill, minmax(178px, 1fr))"
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
