import {
  ArrowsInSimple,
  ArrowsOutSimple,
  Check,
  X,
} from "@phosphor-icons/react";
import React, { useEffect, useRef, useState } from "react";

export default function TextArea({
  required = true,
  placeholder = "Place your text here...",
  onChange,
  name = "text-area",
  disabled = false,
  initialRows = 5,
  className = "",
  autoComplete = "off",
  wrap = "soft",
  code = false,
  onSave,
  value,
}) {
  const [rows, setRows] = useState(initialRows);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExpandIcon, setShowExpandIcon] = useState(false);
  const [content, setContent] = useState(value || "");
  const [showSaveButton, setShowSaveButton] = useState(false);
  const textAreaRef = useRef(null);

  useEffect(() => {
    setContent(value);
    adjustRowsToFitContent();
    // Initial check to determine if the expand icon should be shown
    checkForOverflow();
  }, [value]);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      adjustRowsToFitContent(true);
    } else {
      setRows(initialRows);
    }
    // After toggling, check again to see if the content overflows
    setTimeout(checkForOverflow, 0); // Timeout ensures the DOM updates are applied
  };

  const adjustRowsToFitContent = (forceExpand = false) => {
    const textarea = textAreaRef.current;
    if (textarea) {
      const lineHeight = 17.5; // Match this with your CSS
      if (forceExpand || isExpanded) {
        const currentRows = Math.ceil(textarea.scrollHeight / lineHeight);
        setRows(currentRows);
      }
      checkForOverflow();
    }
  };

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
    adjustRowsToFitContent();
    setContent(e.target.value);
    setShowSaveButton(true);
  };

  // Function to determine if the expand/collapse icon should be shown
  const checkForOverflow = () => {
    const textarea = textAreaRef.current;
    if (textarea) {
      // Check if the content overflows
      const isOverflowing = textarea.scrollHeight > textarea.clientHeight;
      setShowExpandIcon(isOverflowing);
    }
  };

  // Handle save action
  const handleSave = () => {
    if (onSave) {
      onSave(content);
      setShowSaveButton(false);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    setContent(value);
    setShowSaveButton(false);
  };

  const textColorClass = disabled ? "text-white/40" : "text-white/60";
  const codeClass = code ? "font-mono text-xs" : "text-sm";

  return (
    <div className={`relative ${isExpanded ? "w-full" : ""}`}>
      <textarea
        ref={textAreaRef}
        name={name}
        rows={rows}
        // defaultValue={defaultValue}
        value={content}
        className={`resize-none bg-zinc-900 placeholder:text-white/20 ${codeClass} rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-2 ${textColorClass} ${className}`}
        placeholder={placeholder}
        required={required}
        wrap={wrap}
        autoComplete={autoComplete}
        onChange={handleChange}
        disabled={disabled}
      />
      {showSaveButton && (
        <div className="flex flex-row justify-end px-8 sticky bottom-4 right-6 gap-4">
          <button
            onClick={handleSave}
            className="flex items-center mt-4 gap-x-2 cursor-pointer px-[14px] py-[7px] -mr-[14px] rounded-lg  hover:bg-[#222628]/60 transition-all duration-150 ease-in-out "
            disabled={disabled}
          >
            <Check size={18} weight="bold" color="#D3D4D4" />
            <div className="text-[#D3D4D4] text-xs font-bold leading-[18px]">
              Save
            </div>
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center mt-4 gap-x-2 cursor-pointer px-[14px] py-[7px] -mr-[14px] rounded-lg  hover:bg-[#222628]/60 transition-all duration-150 ease-in-out "
          >
            <X size={18} weight="bold" color="#D3D4D4" />
            <div className="text-[#D3D4D4] text-xs font-bold leading-[18px]">
              Cancel
            </div>
          </button>
        </div>
      )}
      {showExpandIcon && (
        <button
          type="button"
          onClick={toggleExpansion}
          className={`absolute bottom-1 right-1 text-lg ${
            isExpanded ? "text-2xl" : "text-xl"
          } text-white/60 hover:text-white transition-all duration-150 ease-in-out`}
          aria-label={isExpanded ? "Contract" : "Expand"}
          disabled={disabled}
        >
          {isExpanded ? (
            <span className="hover:scale-110 active:scale-125 transition-all duration-150 ease-in-out">
              <ArrowsInSimple />
            </span>
          ) : (
            <span className="hover:scale-110 active:scale-125 transition-all duration-150 ease-in-out">
              <ArrowsOutSimple />
            </span>
          )}
        </button>
      )}
    </div>
  );
}
