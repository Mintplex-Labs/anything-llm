import paths from "./paths";
import { useEffect } from "react";
import { userFromStorage } from "./request";
import { TOGGLE_LLM_SELECTOR_EVENT } from "@/components/WorkspaceChat/ChatContainer/PromptInput/LLMSelector/action";

export const KEYBOARD_SHORTCUTS_HELP_EVENT = "keyboard-shortcuts-help";
export const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
export const SHORTCUTS = {
  "⌘ + ,": {
    translationKey: "settings",
    action: () => {
      window.location.href = paths.settings.interface();
    },
  },
  "⌘ + H": {
    translationKey: "home",
    action: () => {
      window.location.href = paths.home();
    },
  },
  "⌘ + I": {
    translationKey: "workspaces",
    action: () => {
      window.location.href = paths.settings.workspaces();
    },
  },
  "⌘ + K": {
    translationKey: "apiKeys",
    action: () => {
      window.location.href = paths.settings.apiKeys();
    },
  },
  "⌘ + L": {
    translationKey: "llmPreferences",
    action: () => {
      window.location.href = paths.settings.llmPreference();
    },
  },
  "⌘ + Shift + C": {
    translationKey: "chatSettings",
    action: () => {
      window.location.href = paths.settings.chat();
    },
  },
  "⌘ + Shift + ?": {
    translationKey: "help",
    action: () => {
      window.dispatchEvent(
        new CustomEvent(KEYBOARD_SHORTCUTS_HELP_EVENT, {
          detail: { show: true },
        })
      );
    },
  },
  F1: {
    translationKey: "help",
    action: () => {
      window.dispatchEvent(
        new CustomEvent(KEYBOARD_SHORTCUTS_HELP_EVENT, {
          detail: { show: true },
        })
      );
    },
  },
  "⌘ + Shift + L": {
    translationKey: "showLLMSelector",
    action: () => {
      window.dispatchEvent(new Event(TOGGLE_LLM_SELECTOR_EVENT));
    },
  },
};

const LISTENERS = {};
const modifier = isMac ? "meta" : "ctrl";
for (const key in SHORTCUTS) {
  const listenerKey = key
    .replace("⌘", modifier)
    .replaceAll(" ", "")
    .toLowerCase();
  LISTENERS[listenerKey] = SHORTCUTS[key].action;
}

// Convert keyboard event to shortcut key
function getShortcutKey(event) {
  let key = "";
  if (event.metaKey || event.ctrlKey) key += modifier + "+";
  if (event.shiftKey) key += "shift+";
  if (event.altKey) key += "alt+";

  // Handle special keys
  if (event.key === ",") key += ",";
  // Handle question mark or slash for help shortcut
  else if (event.key === "?" || event.key === "/") key += "?";
  else if (event.key === "Control")
    return ""; // Ignore Control key by itself
  else if (event.key === "Shift")
    return ""; // Ignore Shift key by itself
  else key += event.key.toLowerCase();
  return key;
}

// Initialize keyboard shortcuts
export function initKeyboardShortcuts() {
  function handleKeyDown(event) {
    const shortcutKey = getShortcutKey(event);
    if (!shortcutKey) return;

    const action = LISTENERS[shortcutKey];
    if (action) {
      event.preventDefault();
      action();
    }
  }

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}

function useKeyboardShortcuts() {
  useEffect(() => {
    // If there is a user and the user is not an admin do not register the event listener
    // since some of the shortcuts are only available in multi-user mode as admin
    const user = userFromStorage();
    if (!!user && user?.role !== "admin") return;
    const cleanup = initKeyboardShortcuts();

    return () => cleanup();
  }, []);
  return;
}

export function KeyboardShortcutWrapper({ children }) {
  useKeyboardShortcuts();
  return children;
}
