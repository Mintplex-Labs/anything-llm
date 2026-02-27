import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal } from "@phosphor-icons/react";
import useLoginMode from "@/hooks/useLoginMode";

const TEXT_SIZES = [
  { key: "small", label: "Small", textClass: "text-xs" },
  { key: "normal", label: "Normal", textClass: "text-sm" },
  { key: "large", label: "Large", textClass: "text-base" },
];

export default function TextSizeMenu() {
  const mode = useLoginMode();
  const [showMenu, setShowMenu] = useState(false);
  const [selectedSize, setSelectedSize] = useState(
    window.localStorage.getItem("anythingllm_text_size") || "normal"
  );
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

  function handleTextSizeChange(size) {
    setSelectedSize(size);
    window.localStorage.setItem("anythingllm_text_size", size);
    window.dispatchEvent(new CustomEvent("textSizeChange", { detail: size }));
  }

  // User icon is visible when login mode is active (single with password or multi-user)
  const hasUserIcon = mode !== null;

  return (
    <div
      className={`absolute top-3 md:top-5 z-30 ${hasUserIcon ? "right-[55px] md:right-[67px]" : "right-3 md:right-4"}`}
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
          className="absolute right-0 top-[42px] bg-zinc-800 light:bg-white border border-zinc-700 light:border-slate-300 rounded-lg p-3 w-[200px] flex flex-col gap-1 shadow-lg"
        >
          <p className="text-[10px] font-medium text-zinc-400 light:text-slate-500 px-2 mb-0.5">
            Text Size
          </p>
          {TEXT_SIZES.map(({ key, label, textClass }) => (
            <div
              key={key}
              onClick={() => handleTextSizeChange(key)}
              className={`flex items-center px-2 py-1 rounded cursor-pointer ${
                selectedSize === key
                  ? "bg-zinc-700 light:bg-slate-200"
                  : "hover:bg-zinc-700/50 light:hover:bg-slate-100"
              }`}
            >
              <span className={`${textClass} text-white light:text-slate-900`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
