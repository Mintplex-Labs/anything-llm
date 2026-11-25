import js from "@eslint/js"
import globals from "globals"
import pluginReact from "eslint-plugin-react"
import pluginReactHooks from "eslint-plugin-react-hooks"
import pluginPrettier from "eslint-plugin-prettier"
import configPrettier from "eslint-config-prettier"
import unusedImports from "eslint-plugin-unused-imports"

export default [
  {
    ignores: ["**/*.min.js", "src/media/**/*"]
  },

  // Base JS recommended rules
  js.configs.recommended,

  // Your React/JSX files
  {
    files: ["src/**/*.{js,jsx,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true }
      },
      globals: globals.browser
    },
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "unused-imports": unusedImports,
      prettier: pluginPrettier
    },
    settings: {
      react: { version: "detect" }
    },
    rules: {
      // React recommended rules (inline, since we're not "extending" in flat config)
      ...pluginReact.configs.flat.recommended.rules,

      // If you want hooks rules, add these (recommended)
      ...pluginReactHooks.configs.recommended.rules,

      // Prettier: disable conflicting stylistic rules + optionally enforce formatting
      ...configPrettier.rules,
      "prettier/prettier": "error",

      // Your overrides
      "react/react-in-jsx-scope": "off",
      "react-hooks/exhaustive-deps": "off",
      "react/prop-types": "off",
      "react-hooks/set-state-in-effect": "off",
      "react/jsx-no-target-blank": "error",
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",
      "react-hooks/immutability": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "no-extra-boolean-cast": "off",
      "no-prototype-builtins": "off",
      "no-empty": "off",
      "no-useless-escape": "off",
      "no-undef": "error",
      "no-unsafe-optional-chaining": "off",
      "no-constant-binary-expression": "off",

      // Unused cleanup
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_"
        }
      ]
    }
  }
]
