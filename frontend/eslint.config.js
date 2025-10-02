import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    "public/**",
  ]),
  {
    files: ["src/**/*.js"],
    plugins: {
      js,
    },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.browser
    },
  },
  pluginReact.configs.flat.recommended,
]);
