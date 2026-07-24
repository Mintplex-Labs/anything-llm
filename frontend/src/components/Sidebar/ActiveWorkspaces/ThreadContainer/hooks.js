import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether ctrl/meta is held while the mouse is over the referenced container.
 * Returns { containerRef, ctrlPressed } — attach containerRef to the wrapper element.
 */
export default function useHoverMetaKey(setThreads, ready = true) {
  const [ctrlPressed, setCtrlPressed] = useState(false);
  const containerRef = useRef(null);
  const isHovering = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !ready) return;

    const resetThreadDeletions = () =>
      setThreads((prev) => prev.map((t) => ({ ...t, deleted: false })));

    const handleMouseEnter = (event) => {
      isHovering.current = true;
      if (event.ctrlKey || event.metaKey) {
        setCtrlPressed(true);
      }
    };
    const handleMouseLeave = () => {
      isHovering.current = false;
      setCtrlPressed((was) => {
        if (was) resetThreadDeletions();
        return false;
      });
    };

    const handleKeyDown = (event) => {
      if (!isHovering.current) return;
      if (["Control", "Meta"].includes(event.key)) {
        setCtrlPressed(true);
      }
    };

    const handleKeyUp = (event) => {
      if (["Control", "Meta"].includes(event.key)) {
        setCtrlPressed(false);
        resetThreadDeletions();
      }
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [ready]);

  return { containerRef, ctrlPressed };
}
