// Keys listed here are used dynamically (e.g. t(variable)) and should never
// be flagged as unused or deleted by findUnusedTranslations.mjs.
//
// When you add a dynamic t() call, add the affected key(s) here so the
// pruning script knows they are intentionally referenced at runtime.
const DYNAMIC_KEY_ALLOWLIST = [
  // Used dynamically in KeyboardShortcutsHelp via t(`keyboard-shortcuts.shortcuts.${shortcut.translationKey}`)
  "keyboard-shortcuts.shortcuts.settings",
  "keyboard-shortcuts.shortcuts.home",
  "keyboard-shortcuts.shortcuts.workspaces",
  "keyboard-shortcuts.shortcuts.apiKeys",
  "keyboard-shortcuts.shortcuts.llmPreferences",
  "keyboard-shortcuts.shortcuts.chatSettings",
  "keyboard-shortcuts.shortcuts.help",
  "keyboard-shortcuts.shortcuts.showLLMSelector",
  "keyboard-shortcuts.shortcuts.workspaceSettings",
];

export default DYNAMIC_KEY_ALLOWLIST;
