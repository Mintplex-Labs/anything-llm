import { useImperativeHandle } from "react";

/**
 * Exposes scroll control methods (scrollToTop, scrollToBottom) via a forwarded ref.
 * This allows parent components to programmatically scroll the chat history.
 *
 * @param {React.Ref} ref - The forwarded ref from the parent component
 * @param {React.RefObject} chatHistoryRef - Ref to the scrollable chat history DOM element
 * @param {Object} options - Configuration options
 * @param {Function} options.setAutoFollow - Setter for the auto-follow lock (true = keep view pinned to the streaming tail)
 * @param {boolean} options.isStreaming - Whether chat is currently streaming a response
 * @param {Function} options.scrollToBottom - Internal scroll to bottom function
 */
export default function useChatHistoryScrollHandle(
  ref,
  chatHistoryRef,
  { setAutoFollow, isStreaming, scrollToBottom }
) {
  useImperativeHandle(
    ref,
    () => ({
      scrollToTop() {
        if (chatHistoryRef.current) {
          setAutoFollow(false);
          chatHistoryRef.current.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      },
      scrollToBottom() {
        setAutoFollow(true);
        scrollToBottom(isStreaming ? false : true);
      },
    }),
    [isStreaming]
  );
}
