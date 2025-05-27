import paths from "./paths";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Event to show/hide keyboard shortcuts help
export const KEYBOARD_SHORTCUTS_HELP_EVENT = "keyboard-shortcuts-help";

// Map of keyboard shortcuts to their actions
const SHORTCUTS = {
  // Settings
  "meta+,": () => {
    window.location.href = paths.settings.interface();
  },
  // Home
  "meta+h": () => {
    window.location.href = paths.home();
  },
  // Workspaces
  "meta+w": () => {
    window.location.href = paths.settings.workspaces();
  },
  // API Keys
  "meta+k": () => {
    window.location.href = paths.settings.apiKeys();
  },
  // LLM Preferences
  "meta+l": () => {
    window.location.href = paths.settings.llmPreference();
  },
  // Vector Database
  "meta+v": () => {
    window.location.href = paths.settings.vectorDatabase();
  },
  // Security Settings
  "meta+s": () => {
    window.location.href = paths.settings.security();
  },
  // User Management
  "meta+u": () => {
    window.location.href = paths.settings.users();
  },
  // Chat Settings
  "meta+shift+c": () => {
    window.location.href = paths.settings.chat();
  },
  // Help
  "meta+?": () => {
    window.dispatchEvent(new CustomEvent(KEYBOARD_SHORTCUTS_HELP_EVENT, { detail: { show: true } }));
  },
  "f1": () => {
    window.dispatchEvent(new CustomEvent(KEYBOARD_SHORTCUTS_HELP_EVENT, { detail: { show: true } }));
  }
};

// Convert keyboard event to shortcut key
function getShortcutKey(event) {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modifier = isMac ? 'meta' : 'ctrl';
  
  let key = '';
  if (event.metaKey || event.ctrlKey) key += modifier + '+';
  if (event.shiftKey) key += 'shift+';
  if (event.altKey) key += 'alt+';
  
  // Handle special keys
  if (event.key === ',') key += ',';
  else if (event.key === '?') key += '?';
  else key += event.key.toLowerCase();
  
  return key;
}

// Initialize keyboard shortcuts
export function initKeyboardShortcuts() {
  function handleKeyDown(event) {
    const shortcutKey = getShortcutKey(event);
    const action = SHORTCUTS[shortcutKey];
    
    if (action) {
      event.preventDefault();
      action();
    }
  }

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}

// Hook for using keyboard shortcuts in components
export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);
  
  useEffect(() => {
    function handleHelpEvent(e) {
      setShowHelp(e.detail.show);
    }
    
    window.addEventListener(KEYBOARD_SHORTCUTS_HELP_EVENT, handleHelpEvent);
    const cleanup = initKeyboardShortcuts();
    
    return () => {
      cleanup();
      window.removeEventListener(KEYBOARD_SHORTCUTS_HELP_EVENT, handleHelpEvent);
    };
  }, []);
  
  return { showHelp, setShowHelp };
} 