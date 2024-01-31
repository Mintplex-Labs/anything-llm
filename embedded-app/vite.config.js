// vite.config.js
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import image from "@rollup/plugin-image"

export default defineConfig({
  plugins: [react(), image()],
  define: {
    // In dev, we need to disable this, but in prod, we need to enable it
    "process.env.NODE_ENV": JSON.stringify("production")
  },
  build: {
    lib: {
      entry: "src/main.jsx",
      name: "EmbeddedAnythingLLM",
      formats: ["umd"],
      fileName: (format) => `embedded-anything-llm.${format}.js`
    },
    rollupOptions: {
      external: []
    },
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    minify: "esbuild",
    outDir: "dist",
    emptyOutDir: true,
    inlineDynamicImports: true,
    assetsDir: ""
  }
})
