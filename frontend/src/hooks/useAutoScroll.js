import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useImperativeHandle,
} from "react";

export default function useAutoScroll(history, imperativeRef) {
  const chatHistoryRef = useRef(null);
  const followRef = useRef(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = useCallback((smooth = false) => {
    if (!chatHistoryRef.current) return;
    chatHistoryRef.current.scrollTo({
      top: chatHistoryRef.current.scrollHeight,
      ...(smooth ? { behavior: "smooth" } : {}),
    });
  }, []);

  useEffect(() => {
    const lastMsg = history[history.length - 1];
    if (lastMsg?.pending) followRef.current = true;
    if (followRef.current) scrollToBottom(false);
  }, [history, scrollToBottom]);

  const handleScroll = useCallback(() => {
    if (!chatHistoryRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatHistoryRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 2;
    setIsAtBottom(atBottom);
    if (atBottom) followRef.current = true;
  }, []);

  const handleWheel = useCallback((e) => {
    if (e.deltaY < 0) followRef.current = false;
  }, []);

  const handleTouchStart = useCallback((e) => {
    chatHistoryRef.current._touchY = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e) => {
    const startY = chatHistoryRef.current?._touchY;
    if (startY != null && e.touches[0].clientY > startY) {
      followRef.current = false;
    }
  }, []);

  const scrollToBottomAndFollow = useCallback(() => {
    followRef.current = true;
    scrollToBottom(true);
  }, [scrollToBottom]);

  useImperativeHandle(
    imperativeRef,
    () => ({
      scrollToTop() {
        if (chatHistoryRef.current) {
          chatHistoryRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
      },
      scrollToBottom() {
        scrollToBottom(true);
      },
    }),
    [scrollToBottom]
  );

  return {
    chatHistoryRef,
    isAtBottom,
    scrollToBottomAndFollow,
    scrollHandlers: {
      onScroll: handleScroll,
      onWheel: handleWheel,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
    },
  };
}
