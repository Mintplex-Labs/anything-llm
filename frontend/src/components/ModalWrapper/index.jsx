import { createPortal } from "react-dom";
/**
 * @typedef {Object} ModalWrapperProps
 * @property {import("react").ReactComponentElement} children - The DOM/JSX to render 
 * @property {boolean} isOpen - Option that renders the modal
 * @property {boolean} noPortal - (default: false) Used for creating sub-DOM modals that need to be rendered as a child element instead of a modal placed at the root
 * Note: This can impact the bg-overlay presentation due to conflicting DOM positions so if using this property you should
   double check it renders as desired.
 */

/**
 * @param {ModalWrapperProps} props - ModalWrapperProps to pass
 * @returns {import("react").ReactNode}
 */
export default function ModalWrapper({ children, isOpen, noPortal = false }) {
  if (!isOpen) return null;

  if (noPortal) {
    return (
      <div className="bg-black/60 backdrop-blur-sm fixed top-0 left-0 outline-none w-screen h-screen flex items-center justify-center z-30">
        {children}
      </div>
    );
  }

  return createPortal(
    <div className="bg-black/60 backdrop-blur-sm fixed top-0 left-0 outline-none w-screen h-screen flex items-center justify-center z-30">
      {children}
    </div>,
    document.getElementById("root")
  );
}
