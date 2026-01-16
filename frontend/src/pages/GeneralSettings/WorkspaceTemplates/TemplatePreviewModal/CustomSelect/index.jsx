import { useState, useRef, useEffect } from "react";
import { CaretDown } from "@phosphor-icons/react";

/**
 * custom select to allow for themed scrollbar
 */
export default function CustomSelect({
  value,
  options = [], // [{ value: string, label: string }]
  onChange,
  placeholder = "Select...",
  disabled = false,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // close on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // close on escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption?.label || placeholder;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full bg-theme-settings-input-bg text-theme-text-primary text-sm rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary-button border border-theme-modal-border h-8 flex items-center justify-between gap-x-1 ${
          disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <span className={`truncate ${!selectedOption ? "opacity-60" : ""}`}>
          {displayLabel}
        </span>
        <CaretDown size={12} weight="bold" className="shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-theme-settings-input-bg border border-theme-modal-border rounded shadow-lg max-h-48 overflow-y-auto show-scrollbar">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value === "" ? null : opt.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-theme-sidebar-item-hover ${
                opt.value === value
                  ? "text-theme-text-primary bg-theme-sidebar-item-hover"
                  : "text-theme-text-primary opacity-80"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
