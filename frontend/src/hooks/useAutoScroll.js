/* eslint-disable react-hooks/refs */
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import debounce from "lodash.debounce";

/**
 * Auto-scroll ("follow") behavior for the chat history pane.
 *
 * One rule set, one enforcer:
 * - A follow lock decides whether the view should stay pinned to the bottom.
 *   User gestures flip it: sending a prompt, the scroll-to-bottom arrow,
 *   Cmd/Ctrl+ArrowDown, or scrolling back down to the bottom lock it; any
 *   upward scroll (wheel, touch, scrollbar drag) unlocks it.
 * - While locked, a ResizeObserver on the message list re-pins the view on
 *   every content height change (new messages, streamed tokens, images and
 *   markdown settling). It is the only thing that ever auto-scrolls.
 *
 * The lock is a ref, not state: it changes on every streamed token and
 * nothing renders from it. Scroll position is never used to decide whether
 * to follow - during streaming that measurement is stale by the time it is
 * read, which is what caused the follow bugs this hook replaces (#5846).
 *
 * @param {React.Ref} ref - Forwarded ref; exposes { scrollToTop, scrollToBottom } so parents (send handlers, Cmd+Arrow shortcuts) can drive the scroll
 * @param {Object} options
 * @param {boolean} options.isStreaming - Whether a response is currently streaming; bottom scrolls are instant mid-stream, smooth otherwise
 * @returns {{
 *   chatHistoryRef: React.RefObject,
 *   chatContentRef: React.RefObject,
 *   isAtBottom: boolean,
 *   scrollToBottom: Function,
 *   handlers: Object,
 * }} chatHistoryRef goes on the scrollable pane, chatContentRef on the
 * message list inside it, handlers is spread onto the scrollable pane,
 * isAtBottom drives the scroll-to-bottom arrow, and scrollToBottom locks
 * follow and scrolls down.
 */
export default function useAutoScroll(ref, { isStreaming }) {
  const chatHistoryRef = useRef(null);
  const chatContentRef = useRef(null);
  const autoFollowRef = useRef(true);
  const lastScrollTopRef = useRef(0);
  const lastScrollHeightRef = useRef(0);
  const lastTouchYRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const pinToBottom = useCallback((smooth = false) => {
    if (!chatHistoryRef.current) return;
    chatHistoryRef.current.scrollTo({
      top: chatHistoryRef.current.scrollHeight,
      ...(smooth ? { behavior: "smooth" } : {}),
    });
  }, []);

  const scrollToBottom = useCallback(() => {
    autoFollowRef.current = true;
    pinToBottom(isStreaming ? false : true);
  }, [isStreaming, pinToBottom]);

  // While locked, re-pin whenever the message list changes height: on mount,
  // new messages, every streamed token, and late layout shifts (message
  // re-renders, images/markdown settling). ResizeObserver fires after layout
  // for every height change, so the pin holds through all of them.
  useEffect(() => {
    if (!chatContentRef.current) return;
    const observer = new ResizeObserver(() => {
      if (autoFollowRef.current) pinToBottom(false);
    });
    observer.observe(chatContentRef.current);
    return () => observer.disconnect();
  }, [pinToBottom]);

  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isBottom = scrollHeight - scrollTop - clientHeight < 2;

    // Programmatic scrolls only ever move down, so upward movement is the
    // user scrolling away - unlock follow (covers scrollbar drags, which
    // fire no wheel/touch events). Reaching the bottom re-locks it. When
    // content shrinks, the browser clamps scrollTop down too - that drop is
    // not a user scroll, so it must not unlock.
    const contentShrank = scrollHeight < lastScrollHeightRef.current;
    if (scrollTop < lastScrollTopRef.current - 10 && !contentShrank) {
      autoFollowRef.current = false;
    } else if (isBottom) {
      autoFollowRef.current = true;
    }

    setIsAtBottom(isBottom);
    lastScrollTopRef.current = scrollTop;
    lastScrollHeightRef.current = scrollHeight;
  }, []);

  const debouncedScroll = useMemo(
    () => debounce(handleScroll, 50),
    [handleScroll]
  );

  useEffect(() => {
    return () => debouncedScroll.cancel();
  }, [debouncedScroll]);

  // Wheel/touch-up immediately unlocks follow - unlike scroll events, these
  // never fire from programmatic scrolls and are not debounced, so the
  // opt-out cannot be swallowed by the streaming pin race
  const handleWheel = useCallback((e) => {
    if (e.deltaY < 0) autoFollowRef.current = false;
  }, []);

  const handleTouchStart = useCallback((e) => {
    lastTouchYRef.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e) => {
    const y = e.touches[0].clientY;
    if (lastTouchYRef.current !== null && y > lastTouchYRef.current)
      autoFollowRef.current = false;
    lastTouchYRef.current = y;
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      scrollToTop() {
        if (!chatHistoryRef.current) return;
        autoFollowRef.current = false;
        chatHistoryRef.current.scrollTo({ top: 0, behavior: "smooth" });
      },
      scrollToBottom,
    }),
    [scrollToBottom]
  );

  const handlers = useMemo(
    () => ({
      onScroll: debouncedScroll,
      onWheel: handleWheel,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
    }),
    [debouncedScroll, handleWheel, handleTouchStart, handleTouchMove]
  );

  return {
    chatHistoryRef,
    chatContentRef,
    isAtBottom,
    scrollToBottom,
    handlers,
  };
}
