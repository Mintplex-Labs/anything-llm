import globals from "globals"
import eslintRecommended from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier"
import prettier from "eslint-plugin-prettier"
import react from "eslint-plugin-react"
import reactRefresh from "eslint-plugin-react-refresh"
import reactHooks from "eslint-plugin-react-hooks"
import babelParser from "@babel/eslint-parser"

const reactRecommended = react.configs.recommended
const jsxRuntime = react.configs["jsx-runtime"]

export default [
  eslintRecommended.configs.recommended,
  eslintConfigPrettier,
  {
    ignores: ["**/*.test.js"],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          presets: ["@babel/preset-env"]
        },
        ecmaFeatures: { jsx: true }
      },
      ecmaVersion: 2020,
      sourceType: "module",
      globals: { ...globals.browser, ...globals.es2020 }
    },
    linterOptions: { reportUnusedDisableDirectives: true },
    settings: { react: { version: "18.2" } },
    plugins: {
      react,
      "jsx-runtime": jsxRuntime,
      "react-hooks": reactHooks,
      prettier
    },
    rules: {
      ...reactRecommended.rules,
      ...jsxRuntime.rules,
      ...reactHooks.configs.recommended.rules,
      "no-unused-vars": "warn",
      "no-undef": "warn",
      "no-empty": "warn",
      "no-extra-boolean-cast": "warn"
      // "prettier/prettier": "warn",
    }
  },
  {
    files: ["frontend/src/**/*.js"],
    plugins: {
      prettier
    },
    rules: {
      "prettier/prettier": "warn"
    }
  },
  {
    files: ["frontend/src/**/*.jsx"],
    plugins: {
      "react-refresh": reactRefresh
    },
    rules: {
      "react-refresh/only-export-components": "warn"
    }
  },
  {
    files: [
      "server/endpoints/**/*.js",
      "server/models/**/*.js",
      "server/swagger/**/*.js",
      "server/utils/**/*.js",
      "server/index.js"
    ],
    rules: {
      "no-undef": "warn"
    }
  }
]
