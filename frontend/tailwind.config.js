/** @type {import('tailwindcss').Config} */
export default {
  content: {
    relative: true,
    files: [
      "./src/components/**/*.{js,jsx}",
      "./src/hooks/**/*.js",
      "./src/models/**/*.js",
      "./src/pages/**/*.{js,jsx}",
      "./src/utils/**/*.js",
      "./src/*.jsx",
      "./index.html"
    ]
  },
  theme: {
    extend: {
      colors: {
        "black-900": "#141414"
      }
    }
  },
  plugins: []
}
