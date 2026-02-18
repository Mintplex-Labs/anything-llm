import { useEffect, useRef } from "react";

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
    if (isActive) {
      ref.current.scrollIntoView({
        behavior,
        block,
      });
    }
  }, [isActive]);

  return {
    ref,
  };
}
