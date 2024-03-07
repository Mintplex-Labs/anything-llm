import { ICON_COMPONENTS } from "@/components/Footer";
import React, { useEffect, useRef, useState } from "react";
import { Plus, X } from "@phosphor-icons/react";

export default function NewIconForm({ icon, url, onSave, onRemove }) {
  const [selectedIcon, setSelectedIcon] = useState(icon || "Plus");
  const [selectedUrl, setSelectedUrl] = useState(url || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSelectedIcon(icon || "Plus");
    setSelectedUrl(url || "");
    setIsEdited(false);
  }, [icon, url]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedIcon !== "Plus" && selectedUrl) {
      onSave(selectedIcon, selectedUrl);
      setIsEdited(false);
    }
  };

  const handleRemove = () => {
    onRemove();
    setSelectedIcon("Plus");
    setSelectedUrl("");
    setIsEdited(false);
  };

  const handleIconChange = (iconName) => {
    setSelectedIcon(iconName);
    setIsDropdownOpen(false);
    setIsEdited(true);
  };

  const handleUrlChange = (e) => {
    setSelectedUrl(e.target.value);
    setIsEdited(true);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-x-1.5">
      <div className="relative" ref={dropdownRef}>
        <div
          className="h-[34px] w-[34px] bg-[#1C1E21] rounded-full flex items-center justify-center cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {React.createElement(ICON_COMPONENTS[selectedIcon] || Plus, {
            className: "h-5 w-5 text-white",
            weight: selectedIcon === "Plus" ? "bold" : "fill",
          })}
        </div>
        {isDropdownOpen && (
          <div className="absolute z-10 grid grid-cols-4 bg-[#41444C] mt-2 rounded-md w-[150px] h-[78px] overflow-y-auto border border-white/20 shadow-lg">
            {Object.keys(ICON_COMPONENTS).map((iconName) => (
              <button
                key={iconName}
                type="button"
                className="flex justify-center items-center border border-transparent hover:bg-[#1C1E21] hover:border-slate-100 rounded-full p-2"
                onClick={() => handleIconChange(iconName)}
              >
                {React.createElement(ICON_COMPONENTS[iconName], {
                  className: "h-5 w-5 text-white",
                  weight: "fill",
                })}
              </button>
            ))}
          </div>
        )}
      </div>
      <input
        type="url"
        value={selectedUrl}
        onChange={handleUrlChange}
        placeholder="https://example.com"
        className="bg-zinc-900 text-white placeholder-white/20 text-sm rounded-md p-2.5 w-[300px] h-[32px]"
        required
      />
      {selectedIcon !== "Plus" && (
        <>
          {isEdited ? (
            <button
              type="submit"
              className="text-sky-400 px-2 py-2 rounded-md text-sm font-bold hover:text-sky-500"
            >
              Save
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRemove}
              className="hover:text-red-500 text-white/80 px-2 py-2 rounded-md text-sm font-bold"
            >
              <X size={20} />
            </button>
          )}
        </>
      )}
    </form>
  );
}
