import { useState, useRef, useEffect } from "react";
import { DotsThree } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

export default function SlashCommandRow({
  command,
  description,
  onClick,
  onEdit,
  onPublish,
  showMenu = false,
  highlighted = false,
}) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuBtnRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        menuBtnRef.current &&
        !menuBtnRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer group relative ${
        highlighted
          ? "bg-zinc-700/50 light:bg-slate-100"
          : "hover:bg-zinc-700/50 light:hover:bg-slate-100"
      }`}
    >
      <div className="flex gap-1.5 items-center text-xs min-w-0 flex-1">
        <span className="text-white light:text-slate-900 shrink-0">
          {command}
        </span>
        <span className="text-doctor/55 light:text-[rgba(7,16,55,0.55)] italic truncate">
          {description}
        </span>
      </div>

      {showMenu && (
        <div className="relative shrink-0 ml-1">
          <button
            ref={menuBtnRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="border-none cursor-pointer text-doctor/55 light:text-[rgba(7,16,55,0.55)] p-0.5 hover:text-white light:hover:text-slate-900 rounded opacity-0 group-hover:opacity-100"
          >
            <DotsThree size={16} weight="bold" />
          </button>

          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 top-full z-50 bg-zinc-800 light:bg-white border border-zinc-700 light:border-slate-300 rounded-lg shadow-lg min-w-[120px] flex flex-col overflow-hidden"
            >
              <button
                type="button"
                className="border-none px-3 py-1.5 text-xs text-white light:text-slate-900 hover:bg-zinc-700 light:hover:bg-slate-100 cursor-pointer text-left"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onEdit?.();
                }}
              >
                {t("chat_window.edit")}
              </button>
              <button
                type="button"
                className="border-none px-3 py-1.5 text-xs text-white light:text-slate-900 hover:bg-zinc-700 light:hover:bg-slate-100 cursor-pointer text-left"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onPublish?.();
                }}
              >
                {t("chat_window.publish")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
