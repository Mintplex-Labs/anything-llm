import React from "react";
import { X } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

const SHORTCUTS = [
  { key: "⌘ + ,", translationKey: "settings" },
  { key: "⌘ + H", translationKey: "home" },
  { key: "⌘ + W", translationKey: "workspaces" },
  { key: "⌘ + K", translationKey: "apiKeys" },
  { key: "⌘ + L", translationKey: "llmPreferences" },
  { key: "⌘ + V", translationKey: "vectorDatabase" },
  { key: "⌘ + S", translationKey: "security" },
  { key: "⌘ + U", translationKey: "userManagement" },
  { key: "⌘ + Shift + C", translationKey: "chatSettings" },
  { key: "⌘ + Shift + ? or F1", translationKey: "help" },
];

export default function KeyboardShortcutsHelp({ isOpen, onClose }) {
  const { t } = useTranslation();
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-theme-bg-secondary rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            {t("keyboard-shortcuts.title")}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SHORTCUTS.map((shortcut) => (
            <div
              key={shortcut.key}
              className="flex items-center justify-between p-3 bg-theme-bg-hover rounded-lg"
            >
              <span className="text-white">
                {t(`keyboard-shortcuts.shortcuts.${shortcut.translationKey}`)}
              </span>
              <kbd className="px-2 py-1 bg-theme-bg-secondary text-white rounded border border-gray-600">
                {isMac ? shortcut.key : shortcut.key.replace("⌘", "Ctrl")}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
