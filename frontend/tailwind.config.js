/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      rotate: {
        '270': '270deg',
        '360': '360deg',
      },
      colors: {
        'black-900': '#141414',
        'accent': '#3D4147',
        'sidebar-button': '#31353A',
        'sidebar': '#25272C',
        'historical-msg-system': 'rgba(255, 255, 255, 0.05);',
        'historical-msg-user': '#2C2F35',
      },
      backgroundImage: {
        'preference-gradient': 'linear-gradient(180deg, #5A5C63 0%, rgba(90, 92, 99, 0.28) 100%);',
        'chat-msg-user-gradient': 'linear-gradient(180deg, #3D4147 0%, #2C2F35 100%);',
        'selected-preference-gradient': 'linear-gradient(180deg, #313236 0%, rgba(63.40, 64.90, 70.13, 0) 100%);',
        'main-gradient': 'linear-gradient(180deg, #3D4147 0%, #2C2F35 100%)',
        'modal-gradient': 'linear-gradient(180deg, #3D4147 0%, #2C2F35 100%)',
        'sidebar-gradient': 'linear-gradient(90deg, #5B616A 0%, #3F434B 100%)',
        'menu-item-gradient': 'linear-gradient(90deg, #3D4147 0%, #2C2F35 100%)',
        'menu-item-selected-gradient': 'linear-gradient(90deg, #5B616A 0%, #3F434B 100%)',
        'workspace-item-gradient': 'linear-gradient(90deg, #3D4147 0%, #2C2F35 100%)',
        'workspace-item-selected-gradient': 'linear-gradient(90deg, #5B616A 0%, #3F434B 100%)',
        'switch-selected': 'linear-gradient(146deg, #5B616A 0%, #3F434B 100%)',
      },
      fontFamily: {
        'sans': ['plus-jakarta-sans', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      },
      animation: {
        sweep: 'sweep 0.5s ease-in-out',
      },
      keyframes: {
        sweep: {
          '0%': { transform: 'scaleX(0)', transformOrigin: 'bottom left' },
          '100%': { transform: 'scaleX(1)', transformOrigin: 'bottom left' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      }
    },
  },
  plugins: [],
}
