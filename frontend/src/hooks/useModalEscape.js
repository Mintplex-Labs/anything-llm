import { useEffect, useRef } from "react";

/**
 * Shared stack of open modals that close on Escape. Only the top-most (most
 * recently opened) modal handles Escape, so stacked/nested modals close one at
 * a time from the top down instead of all at once.
 * @type {{ onClose: () => void }[]}
 */
const escapeStack = [];

function handleEscape(event) {
  if (event.key !== "Escape") return;
  const top = escapeStack[escapeStack.length - 1];
  top?.onClose?.();
}

/**
 * Close a modal on Escape while respecting nesting. While `active`, the modal
 * joins a shared stack and only fires `onClose` when it is the top-most open
 * modal. A single window listener is shared across all modals.
 *
 * @param {boolean} active - Whether the modal is open and should close on Escape
 * @param {() => void} [onClose] - Called when Escape closes this modal
 */
export function useModalEscape(active, onClose) {
  // Stable entry so re-renders (e.g. a new inline `onClose`) update the handler
  // in place rather than reordering the stack.
  const entryRef = useRef({ onClose });
  useEffect(() => {
    entryRef.current.onClose = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!active) return;
    const entry = entryRef.current;
    escapeStack.push(entry);
    if (escapeStack.length === 1)
      window.addEventListener("keydown", handleEscape);
    return () => {
      const idx = escapeStack.indexOf(entry);
      if (idx !== -1) escapeStack.splice(idx, 1);
      if (escapeStack.length === 0)
        window.removeEventListener("keydown", handleEscape);
    };
  }, [active]);
}
