import React, { useState, useEffect, useRef } from "react";
import { Trash, DotsThreeVertical, TreeView } from "@phosphor-icons/react";

function ActionMenu({ chatId, forkThread, isEditing, role }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setOpen(!open);

  const handleFork = () => {
    forkThread(chatId);
    setOpen(false);
  };

  const handleDelete = () => {
    window.dispatchEvent(
      new CustomEvent("delete-message", { detail: { chatId } })
    );
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!chatId || isEditing || role === "user") return null;

  return (
    <div className="mt-2 -ml-0.5 relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="border-none text-[var(--theme-sidebar-footer-icon-fill)] hover:text-[var(--theme-sidebar-footer-icon-fill)] transition-colors duration-200"
        data-tooltip-id="action-menu"
        data-tooltip-content="More actions"
        aria-label="More actions"
      >
        <DotsThreeVertical size={24} weight="bold" />
      </button>
      {open && (
        <div className="absolute -top-1 left-7 mt-1 border-[1.5px] border-white/40 rounded-lg bg-theme-action-menu-bg flex flex-col shadow-[0_4px_14px_rgba(0,0,0,0.25)] text-white z-99 md:z-10">
          <button
            onClick={handleFork}
            className="border-none rounded-t-lg flex items-center text-white gap-x-2 hover:bg-theme-action-menu-item-hover py-1.5 px-2 transition-colors duration-200 w-full text-left"
          >
            <TreeView size={18} />
            <span className="text-sm">Fork</span>
          </button>
          <button
            onClick={handleDelete}
            className="border-none flex rounded-b-lg items-center text-white gap-x-2 hover:bg-theme-action-menu-item-hover py-1.5 px-2 transition-colors duration-200 w-full text-left"
          >
            <Trash size={18} />
            <span className="text-sm">Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ActionMenu;
