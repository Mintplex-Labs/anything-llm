import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, CaretRight } from "@phosphor-icons/react";
import useLoginMode from "@/hooks/useLoginMode";
import { useTranslation } from "react-i18next";
import { useMemoriesSidebar, useSourcesSidebar } from "../ChatSidebar";

const TEXT_SIZES = [
  { key: "small", labelKey: "chat_window.small" },
  { key: "normal", labelKey: "chat_window.normal" },
  { key: "large", labelKey: "chat_window.large" },
];

export default function ChatSettingsMenu() {
  const mode = useLoginMode();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!showMenu) return;
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  // User icon is visible when login mode is active (single with password or multi-user)
  const hasUserIcon = mode !== null;

  return (
    <div
      className={`absolute top-3 md:top-5 z-30 ${hasUserIcon ? "right-[55px] md:right-[67px]" : "right-4 md:right-6"}`}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        className={`group border-none cursor-pointer flex items-center justify-center w-[35px] h-[35px] rounded-full transition-all ${
          showMenu
            ? "bg-zinc-700 light:bg-slate-200"
            : "hover:bg-zinc-700 light:hover:bg-slate-200"
        }`}
      >
        <SlidersHorizontal
          size={18}
          className={
            showMenu
              ? "text-white light:text-slate-800"
              : "text-zinc-300 light:text-slate-600 group-hover:text-white light:group-hover:text-slate-800"
          }
        />
      </button>

      {showMenu && (
        <div
          ref={menuRef}
          className="absolute right-0 top-[42px] bg-zinc-800 light:bg-slate-50 border border-zinc-700 light:border-slate-300 rounded-lg p-3.5 w-[226px] flex flex-col gap-1.5 shadow-lg"
        >
          <TextSizeRow />
          <MemoriesRow onClose={() => setShowMenu(false)} />
        </div>
      )}
    </div>
  );
}

function TextSizeRow() {
  const { t } = useTranslation();
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [selectedSize, setSelectedSize] = useState(
    window.localStorage.getItem("anythingllm_text_size") || "normal"
  );

  function handleTextSizeChange(size) {
    setSelectedSize(size);
    window.localStorage.setItem("anythingllm_text_size", size);
    window.dispatchEvent(new CustomEvent("textSizeChange", { detail: size }));
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowSubmenu(true)}
      onMouseLeave={() => setShowSubmenu(false)}
    >
      <div
        className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer ${
          showSubmenu
            ? "bg-zinc-700 light:bg-slate-200"
            : "hover:bg-zinc-700 light:hover:bg-slate-200"
        }`}
      >
        <span className="text-sm font-normal text-zinc-50 light:text-slate-800">
          {t("chat_window.text_size_label")}
        </span>
        <CaretRight
          size={14}
          weight="bold"
          className="text-zinc-50 light:text-slate-800"
        />
      </div>
      {showSubmenu && (
        <TextSizeSubmenu
          selectedSize={selectedSize}
          onSizeChange={handleTextSizeChange}
        />
      )}
    </div>
  );
}

function TextSizeSubmenu({ selectedSize, onSizeChange }) {
  const { t } = useTranslation();

  return (
    <div className="absolute right-full top-0 -mr-2 pr-2 pt-0">
      <div className="bg-zinc-800 light:bg-slate-50 border border-zinc-700 light:border-slate-300 rounded-lg p-3.5 w-[98px] flex flex-col gap-1.5 shadow-lg">
        {TEXT_SIZES.map(({ key, labelKey }) => (
          <div
            key={key}
            onClick={() => onSizeChange(key)}
            className={`px-2 py-1 rounded cursor-pointer text-sm font-normal text-white light:text-slate-800 ${
              selectedSize === key
                ? "bg-zinc-700 light:bg-slate-200"
                : "hover:bg-zinc-700/50 light:hover:bg-slate-100"
            }`}
          >
            {t(labelKey)}
          </div>
        ))}
      </div>
    </div>
  );
}

function MemoriesRow({ onClose }) {
  const { toggleSidebar } = useMemoriesSidebar();
  const { closeSidebar } = useSourcesSidebar();

  function handleClick() {
    closeSidebar();
    toggleSidebar();
    onClose();
  }

  return (
    <div
      onClick={handleClick}
      className="flex items-center px-2 py-1 rounded cursor-pointer hover:bg-zinc-700 light:hover:bg-slate-200"
    >
      <span className="text-sm font-normal text-white light:text-slate-800">
        Memories
      </span>
    </div>
  );
}
