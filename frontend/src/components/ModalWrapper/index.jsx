import { createPortal } from "react-dom";

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
