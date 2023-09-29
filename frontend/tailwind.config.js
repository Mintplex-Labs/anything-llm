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
      backgroundImage: {
        'modal-gradient': 'linear-gradient(180deg, #3D4147 0%, #2C2F35 100%)',
        'sidebar-gradient': 'linear-gradient(90deg, #5B616A 0%, #3F434B 100%)',
      },
      fontFamily: {
        'sans': ['plus-jakarta-sans', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      },
      animation: {
        'slow-pulse': 'subtlePulse 20s infinite',
        'slow-shift': 'subtleShift 20s infinite',
      }
    },
  },
  plugins: [],
}
