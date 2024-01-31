export default function OpenButton({ isOpen, toggleOpen }) {
  if (isOpen) return null;
  return (
    <button
      onClick={toggleOpen}
      className="w-16 h-16 rounded-full bg-blue-500 text-white text-2xl"
      aria-label="Toggle Menu"
    >
      +
    </button>
  );
}
