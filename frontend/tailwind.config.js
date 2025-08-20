export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-0": "var(--bg-0)",
        "bg-1": "var(--bg-1)",
        "bg-2": "var(--bg-2)",
        "text-0": "var(--text-0)",
        "text-1": "var(--text-1)",
        "stroke-0": "var(--stroke-0)",
        "stroke-1": "var(--stroke-1)",
        "brand-blue-600": "var(--brand-blue-600)",
        "brand-violet-600": "var(--brand-violet-600)",
        "success-600": "var(--success-600)",
        "danger-600": "var(--danger-600)"
      },
      backgroundImage: {
        onenew: "linear-gradient(135deg, var(--brand-blue-600), var(--brand-violet-600))"
      },
      borderRadius: {
        xl: "var(--radius)",
        "2xl": "calc(var(--radius) + 8px)"
      },
      spacing: {
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        6: "var(--space-6)",
        8: "var(--space-8)"
      }
    }
  },
  plugins: []
}
