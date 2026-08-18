/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./assets/js/**/*.js"],
  prefix: "ec-",
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      screens: {
        xs: "420px",
      },
    },
  },
  plugins: [],
};
