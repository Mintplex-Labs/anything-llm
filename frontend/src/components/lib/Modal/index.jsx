import { useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * Single, reusable modal shell for the app. Renders a centered, blurred
 * backdrop and portals its content to the app root. The component is
 * intentionally unopinionated about the modal's inner layout - pass whatever
 * JSX you need as `children`.
 *
 * @param {Object} props - Component props
 * @param {import("react").ReactNode} props.children - The DOM/JSX to render inside the modal
 * @param {boolean} props.isOpen - Renders the modal when true
 * @param {() => void} [props.onClose] - Called when the modal requests to close (e.g. Escape key)
 * @param {boolean} [props.closeOnEsc=true] - Whether pressing Escape calls `onClose`. Some modals require a forced choice and should opt out.
 * @param {boolean} [props.noPortal=false] - Render inline instead of portaling to #root. Used for sub-DOM modals that must render as a child element.
 *   Note: this can impact the backdrop presentation due to conflicting DOM positions, so double check it renders as desired.
 */
export default function Modal({
  children,
  isOpen,
  onClose,
  closeOnEsc = true,
  noPortal = false,
}) {
  useEffect(() => {
    if (!isOpen || !closeOnEsc || !onClose) return;
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  if (!isOpen) return null;

  const content = (
    <div className="bg-black/60 backdrop-blur-sm fixed top-0 left-0 outline-none w-screen h-screen flex items-center justify-center z-99">
      {children}
    </div>
  );

  if (noPortal) return content;
  return createPortal(content, document.getElementById("root"));
}
