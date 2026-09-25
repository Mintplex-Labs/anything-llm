import { useEffect, useRef } from "react";

/**
 * Hook that returns focus to a trigger element once the menu it opened closes,
 * so the keyboard is not stranded on document.body.
 * @param {boolean} isOpen - Whether the menu is currently open.
 * @returns {React.RefObject<HTMLElement>} Ref to attach to the trigger element.
 */
export default function useRefocusOnClose(isOpen) {
  const ref = useRef(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (wasOpen.current && !isOpen) ref.current?.focus();
    wasOpen.current = isOpen;
  }, [isOpen]);

  return ref;
}
