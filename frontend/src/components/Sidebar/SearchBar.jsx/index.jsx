import React, { useState } from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react";

export default function SearchBar({ searchTerm, setSearchTerm }) {
  const [isFocused, setIsFocused] = useState(false);

  const clearSearch = () => {
    setSearchTerm("");
  };

  const hasValue = searchTerm && searchTerm.length > 0;
  const isActive = isFocused || hasValue;

  return (
    <div className="relative mb-2">
      <div
        className={`flex items-center gap-x-2 transition-all duration-300 rounded-[8px] border ${
          isActive
            ? "border-white/30 bg-white/15 light:border-slate-300 light:bg-white shadow-sm"
            : "border-white/10 bg-white/8 light:border-slate-200 light:bg-slate-50 hover:border-white/20 hover:bg-white/12 light:hover:border-slate-300 light:hover:bg-slate-100"
        }`}
      >
        <div className="flex items-center pl-3">
          <MagnifyingGlass
            size={16}
            className={`transition-colors duration-200 ${
              isActive
                ? "text-white light:text-slate-600"
                : "text-white/70 light:text-slate-500"
            }`}
          />
        </div>

        <input
          className="w-full h-[44px] bg-transparent border-none outline-none px-2 py-2 text-sm text-white light:text-slate-800 placeholder:text-white/60 light:placeholder:text-slate-500"
          type="text"
          placeholder="Search workspaces..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {hasValue && (
          <button
            onClick={clearSearch}
            className="flex items-center justify-center w-6 h-6 mr-3 rounded-full hover:bg-white/15 light:hover:bg-slate-200 transition-colors duration-200 group"
            aria-label="Clear search"
          >
            <X
              size={14}
              className="text-white/70 light:text-slate-500 group-hover:text-white light:group-hover:text-slate-700 transition-colors duration-200"
            />
          </button>
        )}
      </div>
    </div>
  );
}
