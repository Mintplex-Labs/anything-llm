import React, { useState, useEffect } from "react";
import { X } from "@phosphor-icons/react";

export default function KeyboardShortcutsModal() {
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    const showModal = () => setShowing(true);
    const hideModal = () => setShowing(false);

    // Listen for custom event to show modal
    window.addEventListener('show-keyboard-shortcuts-help', showModal);

    // Handle escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showing) {
        hideModal();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('show-keyboard-shortcuts-help', showModal);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [showing]);

  if (!showing) return null;

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  const shortcuts = [
    {
      category: 'Settings & Navigation',
      items: [
        { keys: [`${modKey} + ,`], description: 'Open Settings' },
        { keys: ['Win + I'], description: 'Open Settings (Windows alternative)', windows: true },
        { keys: [`${modKey} + H`], description: 'Go to Home' },
        { keys: [`${modKey} + W`], description: 'Manage Workspaces' },
      ]
    },
    {
      category: 'Configuration',
      items: [
        { keys: [`${modKey} + K`], description: 'API Keys Settings' },
        { keys: [`${modKey} + L`], description: 'LLM Preferences' },
        { keys: [`${modKey} + V`], description: 'Vector Database Settings' },
        { keys: [`${modKey} + S`], description: 'Security Settings' },
        { keys: [`${modKey} + U`], description: 'User Management' },
        { keys: [`${modKey} + Shift + C`], description: 'Chat Settings' },
      ]
    },
    {
      category: 'Help',
      items: [
        { keys: [`${modKey} + ?`, 'F1'], description: 'Show this help' },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative w-full max-w-3xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border overflow-hidden">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
              Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={() => setShowing(false)}
            type="button"
            className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
          >
            <X size={24} weight="bold" className="text-white" />
          </button>
        </div>
        
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-6">
            {shortcuts.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h4 className="text-lg font-semibold text-white mb-3 border-b border-theme-modal-border pb-2">
                  {category.category}
                </h4>
                <div className="space-y-2">
                  {category.items.map((shortcut, index) => {
                    // Skip Windows-specific shortcuts on non-Windows platforms
                    if (shortcut.windows && isMac) return null;
                    
                    return (
                      <div key={index} className="flex items-center justify-between py-2">
                        <span className="text-white/80 text-sm">
                          {shortcut.description}
                        </span>
                        <div className="flex gap-1">
                          {shortcut.keys.map((key, keyIndex) => (
                            <span key={keyIndex} className="flex items-center gap-1">
                              {keyIndex > 0 && <span className="text-white/40 text-xs">or</span>}
                              <kbd className="px-2 py-1 text-xs font-semibold text-white bg-theme-modal-border rounded">
                                {key}
                              </kbd>
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            
            <div className="mt-6 p-4 bg-theme-modal-border/30 rounded-lg">
              <p className="text-white/60 text-sm">
                <strong>Note:</strong> Keyboard shortcuts are disabled when typing in input fields or text areas.
                {!isMac && (
                  <span className="block mt-1">
                    On Windows/Linux, use <kbd className="px-1 py-0.5 text-xs bg-theme-modal-border rounded">Ctrl</kbd> instead of <kbd className="px-1 py-0.5 text-xs bg-theme-modal-border rounded">⌘</kbd>.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex w-full justify-end items-center p-6 space-x-2 border-t border-theme-modal-border rounded-b">
          <button
            onClick={() => setShowing(false)}
            type="button"
            className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
