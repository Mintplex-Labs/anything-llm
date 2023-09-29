/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        'black-900': '#141414',
        'sidebar': '#25272C',
        'accent': '#3D4147',
      },
      backgroundImage: {
        'main-gradient': 'linear-gradient(180deg, #3D4147 0%, #2C2F35 100%)',
      },
    },
  },
  plugins: [],
}
