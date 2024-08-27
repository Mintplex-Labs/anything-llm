import { defineConfig } from "vite"
import { fileURLToPath, URL } from "url"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html"
      }
    },
    outDir: "dist"
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url))
      },
    ]
  }
})
