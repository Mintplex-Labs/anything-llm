import globals from "./server/node_modules/globals/index.js"
import eslintRecommended from "./server/node_modules/@eslint/js/src/index.js"
import eslintConfigPrettier from "./server/node_modules/eslint-config-prettier/index.js"
import prettier from "./server/node_modules/eslint-plugin-prettier/eslint-plugin-prettier.js"
import react from "./server/node_modules/eslint-plugin-react/index.js"
import reactRefresh from "./server/node_modules/eslint-plugin-react-refresh/index.js"
import reactHooks from "./server/node_modules/eslint-plugin-react-hooks/index.js"
import ftFlow from "./server/node_modules/eslint-plugin-ft-flow/dist/index.js"
import hermesParser from "./server/node_modules/hermes-eslint/dist/index.js"

const reactRecommended = react.configs.recommended
const jsxRuntime = react.configs["jsx-runtime"]

export default [
  eslintRecommended.configs.recommended,
  eslintConfigPrettier,
  {
    ignores: ["**/*.test.js"],
    languageOptions: {
      parser: hermesParser,
      parserOptions: {
        ecmaFeatures: { jsx: true }
      },
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2020,
        ...globals.node
      }
    },
    linterOptions: { reportUnusedDisableDirectives: true },
    settings: { react: { version: "18.2" } },
    plugins: {
      ftFlow,
      react,
      "jsx-runtime": jsxRuntime,
      "react-hooks": reactHooks,
      prettier
    },
    rules: {
      ...reactRecommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...ftFlow.recommended,
      "no-unused-vars": "warn",
      "no-undef": "warn",
      "no-empty": "warn",
      "no-extra-boolean-cast": "warn",
      "prettier/prettier": "warn"
    }
  },
  {
    files: ["frontend/src/**/*.js"],
    plugins: {
      ftFlow,
      prettier
    },
    rules: {
      "prettier/prettier": "warn"
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
  },
  {
    files: ["frontend/src/**/*.jsx"],
    plugins: {
      ftFlow,
      react,
      "jsx-runtime": jsxRuntime,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier
    },
    rules: {
      ...jsxRuntime.rules,
      "react/prop-types": "off", // FIXME
      "react-refresh/only-export-components": "warn"
    }
  }
]
