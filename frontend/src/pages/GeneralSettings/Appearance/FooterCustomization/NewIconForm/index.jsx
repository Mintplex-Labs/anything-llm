import { ICON_COMPONENTS } from "@/components/Footer";
import React, { useEffect, useRef, useState } from "react";

export default function NewIconForm({ handleSubmit, showing }) {
  const [selectedIcon, setSelectedIcon] = useState("Info");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  if (!showing) return null;
  return (
    <form onSubmit={handleSubmit} className="flex justify-start">
      <div className="mt-6 mb-6 flex flex-col bg-zinc-900 rounded-lg px-6 py-4">
        <div className="flex gap-x-4 items-center">
          <div
            className="relative flex flex-col items-center gap-y-4"
            ref={dropdownRef}
          >
            <input type="hidden" name="icon" value={selectedIcon} />
            <label className="text-sm font-medium text-white">Icon</label>
            <button
              type="button"
              className={`${
                isDropdownOpen
                  ? "bg-menu-item-selected-gradient border-slate-100/50"
                  : ""
              }border-transparent transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border`}
              onClick={(e) => {
                e.preventDefault();
                setIsDropdownOpen(!isDropdownOpen);
              }}
            >
              {React.createElement(ICON_COMPONENTS[selectedIcon], {
                className: "h-5 w-5 text-white",
                weight: "fill",
              })}
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 grid grid-cols-4 gap-4 bg-zinc-800 -mt-20 ml-44 p-1 rounded-md w-56 h-28 overflow-y-auto border border-slate-100/10">
                {Object.keys(ICON_COMPONENTS).map((iconName) => (
                  <button
                    key={iconName}
                    type="button"
                    className="flex justify-center items-center border border-transparent hover:bg-menu-item-selected-gradient hover:border-slate-100 rounded-full"
                    onClick={() => {
                      setSelectedIcon(iconName);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {React.createElement(ICON_COMPONENTS[iconName], {
                      className: "h-5 w-5 text-white m-2.5",
                      weight: "fill",
                    })}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-y-4">
            <label className="text-sm font-medium text-white">Link</label>
            <input
              type="url"
              name="url"
              required={true}
              placeholder="https://example.com"
              className="bg-sidebar text-white placeholder-white/60 rounded-md p-2"
            />
          </div>
          {selectedIcon !== "" && (
            <div className="flex flex-col gap-y-4">
              <label className="text-sm font-medium text-white invisible">
                Submit
              </label>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
