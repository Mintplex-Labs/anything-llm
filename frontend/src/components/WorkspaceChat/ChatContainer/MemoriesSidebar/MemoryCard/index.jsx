import { useEffect, useRef, useState } from "react";
import { DotsThreeVertical } from "@phosphor-icons/react";
import { useMemoriesContext } from "../MemoriesContext";
import CardMenu from "./CardMenu";

export default function MemoryCard({ memory }) {
  const {
    activeTab,
    handleDelete,
    openEditModal,
    handlePromote,
    handleDemote,
  } = useMemoriesContext();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const isWorkspace = activeTab === "workspace";

  return (
    <div className="relative shrink-0 bg-zinc-900 light:bg-white light:border light:border-slate-300 rounded-lg p-3 flex gap-0.5 items-start">
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-5 text-zinc-50 light:text-slate-900">
          {memory.content}
        </p>
        <p className="text-xs leading-4 text-zinc-400 light:text-slate-500 mt-1.5">
          {new Date(memory.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className="shrink-0 border-none bg-transparent cursor-pointer text-zinc-400 light:text-slate-400 hover:text-zinc-50 light:hover:text-slate-900 transition-colors p-0"
      >
        <DotsThreeVertical size={20} weight="bold" />
      </button>
      {menuOpen && (
        <CardMenu
          menuRef={menuRef}
          buttonRef={buttonRef}
          isWorkspace={isWorkspace}
          onEdit={() => {
            setMenuOpen(false);
            openEditModal(memory);
          }}
          onMove={() => {
            setMenuOpen(false);
            if (isWorkspace) handlePromote(memory.id);
            else handleDemote(memory.id);
          }}
          onDelete={() => {
            setMenuOpen(false);
            handleDelete(memory.id);
          }}
        />
      )}
    </div>
  );
}
