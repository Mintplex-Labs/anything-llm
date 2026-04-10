import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Portal-rendered dropdown menu for a memory card.
 * Uses fixed positioning so it is not clipped by any scrollable parent.
 * @param {Object} props
 * @param {React.RefObject} props.menuRef
 * @param {React.RefObject} props.buttonRef
 * @param {boolean} props.isWorkspace
 * @param {function} props.onEdit
 * @param {function} props.onMove
 * @param {function} props.onDelete
 */
export default function CardMenu({
  menuRef,
  buttonRef,
  isWorkspace,
  onEdit,
  onMove,
  onDelete,
}) {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 4, left: rect.right - 160 });
  }, []);

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-[9999] bg-zinc-800 light:bg-slate-50 border border-zinc-700 light:border-slate-300 rounded-lg p-3 flex flex-col gap-1.5 shadow-lg w-[160px]"
      style={{ top: pos.top, left: pos.left }}
    >
      <MenuItem label="Edit" onClick={onEdit} />
      <MenuItem
        label={isWorkspace ? "Move to Global" : "Move to Workspace"}
        onClick={onMove}
      />
      <MenuItem label="Delete" onClick={onDelete} />
    </div>,
    document.body
  );
}

function MenuItem({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left text-sm font-medium text-zinc-50 light:text-slate-700 border-none bg-transparent cursor-pointer hover:bg-zinc-700 light:hover:bg-slate-200 rounded px-2 py-1 transition-colors"
    >
      {label}
    </button>
  );
}
