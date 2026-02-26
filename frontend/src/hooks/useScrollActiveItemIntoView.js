import { useEffect, useRef } from "react";

/**
 * Walks up the DOM tree from `el` to find the nearest ancestor
 * that is actually scrollable (i.e. its content overflows).
 */
function findScrollableParent(el) {
  let node = el.parentElement;
  while (node && node !== document.body) {
    if (node.scrollHeight > node.clientHeight) return node;
    node = node.parentElement;
  }
  return null;
}

/**
 * Hook that scrolls an element into view when it becomes active.
 * @param {Object} options - The options for the hook.
 * @param {boolean} options.isActive - Whether the element is currently active.
 * @param {"smooth" | "instant" | "auto"} options.behavior - The scroll behavior.
 * @param {"start" | "center" | "end" | "nearest"} options.block - The vertical alignment of the element within the scrollable container.
 * @returns {{ ref: React.RefObject<HTMLElement> }} An object containing the ref to attach to the target element.
 */
export default function useScrollActiveItemIntoView({
  isActive,
  behavior,
  block,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (isActive && ref.current) {
      const el = ref.current;

      // Skip scrolling if the element is already fully visible within its
      // scrollable container. This prevents the sidebar from jumping when
      // the active item is already in view.
      // Walk up the DOM to find the nearest ancestor that actually scrolls
      // (scrollHeight > clientHeight), rather than matching by class name,
      // so this works regardless of how the scroll container is styled.
      const scrollParent = findScrollableParent(el);
      if (scrollParent) {
        const parentRect = scrollParent.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const isVisible =
          elRect.top >= parentRect.top && elRect.bottom <= parentRect.bottom;
        if (isVisible) return;
      }

      el.scrollIntoView({
        behavior,
        block,
      });
    }
  }, [isActive]);

  return {
    ref,
  };
}
