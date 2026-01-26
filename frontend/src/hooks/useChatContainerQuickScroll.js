import { useEffect, useRef } from "react";
import { isMac } from "@/utils/keyboardShortcuts";

/**
 * Hook for scrolling the chat container using keyboard shortcuts.
 * @returns {Object} - An object containing the chat history ref and the scroll to top and bottom functions.
 */
export default function useChatContainerQuickScroll() {
  const chatHistoryRef = useRef(null);

  const scrollToTop = (event) => {
    event.preventDefault();
    chatHistoryRef.current.scrollToTop();
  };

  const scrollToBottom = (event) => {
    event.preventDefault();
    chatHistoryRef.current.scrollToBottom();
  };

  useEffect(() => {
    function handleScrollShortcuts(event) {
      const modifierPressed = isMac ? event.metaKey : event.ctrlKey;
      if (!modifierPressed || !chatHistoryRef.current) return;
      if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;

      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          scrollToTop(event);
          break;
        case "ArrowDown":
          event.preventDefault();
          scrollToBottom(event);
          break;
        default:
          break;
      }
    }

    window.addEventListener("keydown", handleScrollShortcuts);
    return () => window.removeEventListener("keydown", handleScrollShortcuts);
  }, []);

  return { chatHistoryRef };
}
