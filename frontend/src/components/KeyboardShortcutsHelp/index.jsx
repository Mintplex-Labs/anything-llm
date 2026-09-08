import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal, { ModalHeader, ModalBody } from "@/components/lib/Modal";
import {
  SHORTCUTS,
  isMac,
  KEYBOARD_SHORTCUTS_HELP_EVENT,
} from "@/utils/keyboardShortcuts";

export default function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    window.addEventListener(KEYBOARD_SHORTCUTS_HELP_EVENT, () =>
      setIsOpen((prev) => !prev)
    );
    return () => {
      window.removeEventListener(KEYBOARD_SHORTCUTS_HELP_EVENT, () =>
        setIsOpen(false)
      );
    };
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="lg">
      <ModalHeader
        title={t("keyboard-shortcuts.title")}
        onClose={() => setIsOpen(false)}
      />
      <ModalBody>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(SHORTCUTS).map(([key, shortcut]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 rounded-lg bg-zinc-800 light:bg-slate-100"
            >
              <span className="text-zinc-100 light:text-slate-900">
                {t(`keyboard-shortcuts.shortcuts.${shortcut.translationKey}`)}
              </span>
              <kbd className="px-2 py-1 rounded text-zinc-100 light:text-slate-900 bg-zinc-900 light:bg-white border border-zinc-700 light:border-slate-300">
                {isMac ? key : key.replace("⌘", "Ctrl")}
              </kbd>
            </div>
          ))}
        </div>
      </ModalBody>
    </Modal>
  );
}
