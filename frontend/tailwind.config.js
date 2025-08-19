export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        elev: "var(--elev)",
        border: "var(--border)",
        "fg-1": "var(--fg-1)",
        "fg-2": "var(--fg-2)",
        muted: "var(--muted)",
        brand: "var(--brand)"
      },
      spacing: {
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        6: "var(--space-6)",
        8: "var(--space-8)"
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        lg: "var(--radius-lg)"
      }
    }
  },
  plugins: []
}
