export default function ModalWrapper({ children, isOpen }) {
  if (!isOpen) return null;

  return (
    <div className="bg-black/60 backdrop-blur-sm fixed top-0 left-0 outline-none w-screen h-screen flex items-center justify-center z-30">
      {children}
    </div>
  );
}
