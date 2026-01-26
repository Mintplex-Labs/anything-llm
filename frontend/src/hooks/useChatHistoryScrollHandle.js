import { useImperativeHandle } from "react";

/**
 * Exposes scroll control methods (scrollToTop, scrollToBottom) via a forwarded ref.
 * This allows parent components to programmatically scroll the chat history.
 *
 * @param {React.Ref} ref - The forwarded ref from the parent component
 * @param {React.RefObject} chatHistoryRef - Ref to the scrollable chat history DOM element
 * @param {Object} options - Configuration options
 * @param {Function} options.setIsUserScrolling - Setter to mark user-initiated scrolling
 * @param {boolean} options.isStreaming - Whether chat is currently streaming a response
 * @param {Function} options.scrollToBottom - Internal scroll to bottom function
 */
export default function useChatHistoryScrollHandle(
  ref,
  chatHistoryRef,
  { setIsUserScrolling, isStreaming, scrollToBottom }
) {
  useImperativeHandle(
    ref,
    () => ({
      scrollToTop() {
        if (chatHistoryRef.current) {
          setIsUserScrolling(true);
          chatHistoryRef.current.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      },
      scrollToBottom() {
        setIsUserScrolling(true);
        scrollToBottom(isStreaming ? false : true);
      },
    }),
    [isStreaming]
  );
}
