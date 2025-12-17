import js from "@eslint/js"
import globals from "globals"
import pluginReact from "eslint-plugin-react"
import pluginReactHooks from "eslint-plugin-react-hooks"
import pluginPrettier from "eslint-plugin-prettier"
import configPrettier from "eslint-config-prettier"
import { defineConfig } from "eslint/config"

export default defineConfig([
  {
    ignores: ["**/*.min.js"]
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser }
  },
  {
    ...pluginReact.configs.flat.recommended,
    plugins: {
      "react-hooks": pluginReactHooks,
      prettier: pluginPrettier
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      ...configPrettier.rules,
      "prettier/prettier": "warn",
      "react/react-in-jsx-scope": "off",
      "react-hooks/exhaustive-deps": "off",
      "no-extra-boolean-cast": "off",
      "no-prototype-builtins": "off",
      "no-unused-vars": "off",
      "no-empty": "off",
      "no-useless-escape": "off",
      "no-undef": "off",
      "no-unsafe-optional-chaining": "off",
      "no-constant-binary-expression": "off"
    }
  }
])
