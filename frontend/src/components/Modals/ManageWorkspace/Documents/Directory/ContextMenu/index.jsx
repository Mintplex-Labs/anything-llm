import { useRef, useEffect } from "react";

export default function ContextMenu({
  contextMenu,
  closeContextMenu,
  allSelected,
  onSelectAll,
  onClearSelection,
}) {
  const contextMenuRef = useRef(null);

  useEffect(() => {
    if (!contextMenu.visible) return;
    const handleClickOutside = (event) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target)
      ) {
        closeContextMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [contextMenu.visible, closeContextMenu]);

  if (!contextMenu.visible) return null;

  const toggleSelectAll = () => {
    allSelected ? onClearSelection() : onSelectAll();
    closeContextMenu();
  };

  return (
    <div
      ref={contextMenuRef}
      style={{
        position: "fixed",
        top: `${contextMenu.y}px`,
        left: `${contextMenu.x}px`,
        zIndex: 1000,
      }}
      className="bg-theme-bg-secondary border border-theme-modal-border rounded-md shadow-lg"
    >
      <button
        onClick={toggleSelectAll}
        className="block w-full text-left px-4 py-2 text-sm text-theme-text-primary hover:bg-theme-file-picker-hover"
      >
        {allSelected ? "Unselect All" : "Select All"}
      </button>
      <button
        onClick={closeContextMenu}
        className="block w-full text-left px-4 py-2 text-sm text-theme-text-primary hover:bg-theme-file-picker-hover"
      >
        Cancel
      </button>
    </div>
  );
}
