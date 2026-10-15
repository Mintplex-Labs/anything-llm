import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  buildQuestionIndex,
  resolveCurrentQuestion,
} from "@/utils/chat/questionIndex";

// A jumped-to question lands this far below the top of the scroll container, so
// its answer - not the tail of the previous one - fills the viewport.
const JUMP_ANCHOR_OFFSET = 24;
// A smooth jump reports a scroll position every frame; once the target is
// reached (or this long has passed) the jump stops overriding the reading
// position. The timeout only covers a jump that cannot arrive - a container
// resized mid-animation, or an interrupted smooth scroll.
const JUMP_SETTLE_TIMEOUT = 900;
// Scroll positions within this many pixels of the jump target count as arrived.
const JUMP_ARRIVAL_EPSILON = 2;

/**
 * Connects the question index to the chat scroller.
 *
 * The scroll container is owned by `useAutoScroll`; this hook only measures the
 * rendered anchors (`[data-question-index]`) and reports which question the
 * reader is on. Measuring from the DOM keeps the rail correct through
 * everything that changes message heights - streaming, images, code blocks.
 *
 * @param {Array<Object>} history - the chat history as rendered
 * @param {{current: HTMLElement|null}} scrollRef - the scroll container ref
 * @param {(top: number) => void} [scrollToOffset] - scrolls the container, used
 *   for jumps so the caller can also disengage its follow-the-stream behaviour
 * @param {boolean} [enabled] - when false the index reports nothing and attaches
 *   no listeners, so the feature can be switched off without touching the chat
 * @returns {{items: Array, currentIndex: number, jumpTo: (index: number) => void}}
 */
export default function useQuestionIndex(
  history,
  scrollRef,
  scrollToOffset,
  enabled = true
) {
  const items = useMemo(
    () => (enabled ? buildQuestionIndex(history) : []),
    [history, enabled]
  );
  const offsetsRef = useRef([]);
  const jumpRef = useRef(null);
  const settleTimerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  /** Reads every anchor's top in scroll-container content coordinates. */
  const readOffsets = useCallback(() => {
    const container = scrollRef?.current;
    if (!container) return [];
    const containerTop = container.getBoundingClientRect().top;
    const offsets = [];
    container.querySelectorAll("[data-question-index]").forEach((anchor) => {
      const order = Number(anchor.dataset.questionIndex);
      if (Number.isNaN(order)) return;
      offsets[order] =
        anchor.getBoundingClientRect().top - containerTop + container.scrollTop;
    });
    // A question can be momentarily unrendered - while its turn is being
    // edited, for instance - which would leave a hole in the list. Carrying the
    // previous position forward keeps the reading line monotonic through it.
    for (let index = 0; index < offsets.length; index++) {
      if (offsets[index] === undefined)
        offsets[index] = index === 0 ? 0 : offsets[index - 1];
    }
    return offsets;
  }, [scrollRef]);

  const syncCurrent = useCallback(() => {
    const container = scrollRef?.current;
    if (!container) return;

    // While a jump is animating, the clicked question stays current: without
    // this the reading line can pick the following question on the way in.
    if (jumpRef.current) {
      const { index, top } = jumpRef.current;
      setCurrentIndex(index);
      if (Math.abs(container.scrollTop - top) <= JUMP_ARRIVAL_EPSILON)
        jumpRef.current = null;
      return;
    }

    if (!offsetsRef.current.length) offsetsRef.current = readOffsets();
    setCurrentIndex(
      resolveCurrentQuestion(offsetsRef.current, {
        scrollTop: container.scrollTop,
        viewportHeight: container.clientHeight,
        scrollHeight: container.scrollHeight,
      })
    );
  }, [readOffsets, scrollRef]);

  // Re-measure when the thread's questions change (new prompt, edited or
  // deleted turn) so the rail tracks the messages actually on screen.
  useEffect(() => {
    if (!enabled) return;
    offsetsRef.current = readOffsets();
    syncCurrent();
  }, [enabled, items.length, readOffsets, syncCurrent]);

  useEffect(() => {
    const container = scrollRef?.current;
    if (!enabled || !container) return;

    let frame = null;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        syncCurrent();
      });
    };
    // A manual scroll cancels an in-flight jump's ownership of the highlight.
    const cancelJump = () => {
      jumpRef.current = null;
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    };
    const onResize = () => {
      offsetsRef.current = readOffsets();
      syncCurrent();
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    container.addEventListener("wheel", cancelJump, { passive: true });
    container.addEventListener("touchstart", cancelJump, { passive: true });
    const observer = new ResizeObserver(onResize);
    observer.observe(container);
    // Messages keep changing height after mount - markdown renders, images
    // load, code blocks highlight - and the transcript's own size is what moves
    // a question's position. Watching the content keeps the stored offsets
    // honest; jumps also re-measure, so a stale reading can never misdirect one.
    const content = container.firstElementChild;
    if (content) observer.observe(content);

    return () => {
      container.removeEventListener("scroll", onScroll);
      container.removeEventListener("wheel", cancelJump);
      container.removeEventListener("touchstart", cancelJump);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    };
  }, [enabled, readOffsets, syncCurrent, scrollRef]);

  const jumpTo = useCallback(
    (index) => {
      if (!enabled) return;
      const container = scrollRef?.current;
      if (!container) return;
      // Measure at click time: the transcript may have reflowed since the last
      // measurement, and a jump must land on the question as it is now.
      offsetsRef.current = readOffsets();
      const target = offsetsRef.current[index];
      if (target == null) return;

      const maxTop = Math.max(
        container.scrollHeight - container.clientHeight,
        0
      );
      const top = Math.min(Math.max(target - JUMP_ANCHOR_OFFSET, 0), maxTop);
      jumpRef.current = { index, top };
      setCurrentIndex(index);
      scrollToOffset?.(top);

      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      settleTimerRef.current = setTimeout(() => {
        const settled = jumpRef.current;
        jumpRef.current = null;
        // If something else moved the view during the jump - the "scroll to
        // bottom" button, a layout shift - re-read the position now that the
        // jump no longer owns it. Staying put on the clicked question is the
        // correct outcome otherwise, so no re-read happens then.
        if (
          settled &&
          Math.abs(container.scrollTop - settled.top) > JUMP_ARRIVAL_EPSILON
        )
          syncCurrent();
      }, JUMP_SETTLE_TIMEOUT);
    },
    [enabled, scrollRef, scrollToOffset, syncCurrent]
  );

  return { items, currentIndex, jumpTo };
}
