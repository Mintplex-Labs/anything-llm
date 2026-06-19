import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

/**
 * Portal-rendered dropdown menu for a memory card.
 * Uses fixed positioning so it is not clipped by any scrollable parent.
 * @param {Object} props
 * @param {React.RefObject} props.menuRef
 * @param {React.RefObject} props.buttonRef
 * @param {boolean} props.isWorkspace
 * @param {boolean} props.canMove - hide the move option when the target scope is full
 * @param {function} props.onEdit
 * @param {function} props.onMove
 * @param {function} props.onDelete
 */
export default function CardMenu({
  menuRef,
  buttonRef,
  isWorkspace,
  canMove,
  onEdit,
  onMove,
  onDelete,
}) {
  const { t } = useTranslation();
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 4, left: rect.right - 200 });
  }, []);

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-[9999] bg-zinc-800 light:bg-slate-50 border border-zinc-700 light:border-slate-300 rounded-lg py-3 px-2 flex flex-col shadow-lg w-[175px]"
      style={{ top: pos.top, left: pos.left }}
    >
      <MenuItem label={t("chat_window.memories.menu.edit")} onClick={onEdit} />
      {canMove && (
        <MenuItem
          label={
            isWorkspace
              ? t("chat_window.memories.menu.move_to_global")
              : t("chat_window.memories.menu.move_to_workspace")
          }
          onClick={onMove}
        />
      )}
      <MenuItem
        label={t("chat_window.memories.menu.delete")}
        onClick={onDelete}
      />
    </div>,
    document.body
  );
}

function MenuItem({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left text-sm font-medium text-zinc-50 light:text-slate-800 border-none bg-transparent cursor-pointer hover:bg-zinc-700 light:hover:bg-slate-200 rounded px-2.5 py-1 transition-colors"
    >
      {label}
    </button>
  );
}
