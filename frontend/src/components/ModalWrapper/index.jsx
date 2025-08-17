import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";
import FocusTrap from "focus-trap-react";
/**
 * @typedef {Object} ModalWrapperProps
 * @property {import("react").ReactComponentElement} children - The DOM/JSX to render
 * @property {boolean} isOpen - Option that renders the modal
 * @property {boolean} noPortal - (default: false) Used for creating sub-DOM modals that need to be rendered as a child element instead of a modal placed at the root
 * Note: This can impact the bg-overlay presentation due to conflicting DOM positions so if using this property you should
   double check it renders as desired.
 */

/**
 *
 * @param {ModalWrapperProps} props - ModalWrapperProps to pass
 * @returns {import("react").ReactNode}
 *
 * Modal wrapper that provides a consistent overlay with focus trapping and ESC/overlay dismissal.
 */
export default function ModalWrapper({
  children,
  isOpen,
  noPortal = false,
  onClose,
}) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!onClose) return;
    function handleKeydown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [onClose]);

  if (!isOpen) return null;

  const overlay = (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50 flex items-center justify-center"
      onMouseDown={(e) => {
        if (e.target === overlayRef.current && onClose) onClose();
      }}
    >
      <FocusTrap>{children}</FocusTrap>
    </div>
  );

  if (noPortal) return overlay;
  return createPortal(overlay, document.getElementById("root"));
}
