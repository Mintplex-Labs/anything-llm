module.exports = {
  "env": { "browser": true, "es2020": true },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended"
  ],
  "files": ["**/*.js", "**/*.jsx"],
  "linterOptions": { "reportUnusedDisableDirectives": true },
  "parserOptions": { "ecmaVersion": "latest", "sourceType": "module", "ecmaFeatures": { "jsx": true } },
  "settings": { "react": { "version": '18.2' } },
  "plugins": [
    "react-refresh",
    "react-hooks"
  ],
  "rules": {
    "react-refresh/only-export-components": "warn"
  }
}
