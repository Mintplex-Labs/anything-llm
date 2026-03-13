import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import pluginPrettier from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";
import unusedImports from "eslint-plugin-unused-imports";
import pluginImport from "eslint-plugin-import";

export default defineConfig([
  { ignores: ["__tests__/**", "**/syncStaticLists.mjs"] },
  {
    files: ["**/*.js"],
    plugins: {
      js,
      prettier: pluginPrettier,
      "unused-imports": unusedImports,
      import: pluginImport,
    },
    extends: ["js/recommended"],
    languageOptions: {
      sourceType: "commonjs",
      globals: { ...globals.node, ...globals.browser },
    },
    rules: {
      ...configPrettier.rules,
      "prettier/prettier": "error",
      "no-case-declarations": "off",
      "no-prototype-builtins": "off",
      "no-async-promise-executor": "off",
      "no-extra-boolean-cast": "off",
      "no-empty": "off",
      "no-unused-private-class-members": "warn",
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "import/no-unresolved": [
        "error",
        { commonjs: true, ignore: ["^@modelcontextprotocol/sdk"] },
      ],
      "import/named": "error",
    },
    settings: {
      "import/resolver": {
        node: true,
      },
      "import/core-modules": ["eslint/config"],
    },
  },
  {
    files: ["**/*.mjs"],
    plugins: {
      js,
      prettier: pluginPrettier,
      "unused-imports": unusedImports,
      import: pluginImport,
    },
    extends: ["js/recommended"],
    languageOptions: {
      sourceType: "module",
      globals: { ...globals.node },
    },
    rules: {
      ...configPrettier.rules,
      "prettier/prettier": "error",
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "import/no-unresolved": [
        "error",
        { ignore: ["^@modelcontextprotocol/sdk"] },
      ],
      "import/named": "error",
    },
    settings: {
      "import/resolver": {
        node: true,
      },
      "import/core-modules": ["eslint/config"],
    },
  },
]);
