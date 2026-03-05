// Keys listed here are used dynamically (e.g. t(variable)) and should never
// be flagged as unused or deleted by findUnusedTranslations.mjs.
//
// When you add a dynamic t() call, add the affected key(s) here so the
// pruning script knows they are intentionally referenced at runtime.
const DYNAMIC_KEY_ALLOWLIST = [
  // Example:
  // "some.dynamic.key",
];

export default DYNAMIC_KEY_ALLOWLIST;
