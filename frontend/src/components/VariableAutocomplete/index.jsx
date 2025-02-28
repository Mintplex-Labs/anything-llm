import React, { useState, useEffect, useRef } from "react";
import { X, MagnifyingGlass } from "@phosphor-icons/react";

export default function VariableAutocomplete({
  variables = [],
  onSelect,
  position,
  onClose,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVariables, setFilteredVariables] = useState(variables);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef(null);
  const selectedRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter variables based on search term
  useEffect(() => {
    const filtered = variables.filter((variable) =>
      variable.key.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVariables(filtered);
    setSelectedIndex(0); // Reset selection when filter changes
  }, [searchTerm, variables]);

  // Auto-focus search input when component mounts
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredVariables.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredVariables.length > 0) {
          onSelect(filteredVariables[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        onClose();
        break;
      case "Tab":
        e.preventDefault();
        if (filteredVariables.length > 0) {
          onSelect(filteredVariables[selectedIndex]);
        }
        break;
    }
  };

  return (
    <div
      className="absolute z-50 bg-theme-settings-input-bg border border-theme-border rounded-lg shadow-lg overflow-hidden"
      style={{
        top: position?.top || 0,
        left: position?.left || 0,
        width: "300px",
        maxHeight: "300px",
      }}
    >
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-2 border-b border-theme-border">
          <span className="text-sm font-medium text-theme-text-primary">
            Insert Variable
          </span>
          <button
            onClick={onClose}
            className="text-theme-text-secondary hover:text-theme-text-primary"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search input */}
        <div className="p-2 border-b border-theme-border">
          <div className="relative">
            <MagnifyingGlass
              size={16}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-theme-text-secondary"
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search variables..."
              className="w-full pl-8 pr-3 py-1.5 bg-theme-settings-input-bg text-theme-text-primary text-sm rounded border border-theme-border focus:outline-none focus:border-primary-button"
              autoComplete="off"
            />
          </div>
        </div>

        {/* Variables list */}
        <div className="overflow-y-auto max-h-[200px]">
          {filteredVariables.length > 0 ? (
            <ul className="py-1">
              {filteredVariables.map((variable, index) => (
                <li
                  key={variable.key}
                  ref={index === selectedIndex ? selectedRef : null}
                  className={`px-3 py-2 cursor-pointer hover:bg-theme-action-menu-item-hover ${
                    index === selectedIndex
                      ? "bg-theme-action-menu-item-hover text-theme-text-primary"
                      : "text-theme-text-secondary"
                  }`}
                  onClick={() => onSelect(variable)}
                >
                  <div className="flex items-center">
                    <span className="font-medium text-sm">{`{${variable.key}}`}</span>
                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-theme-border text-theme-text-secondary">
                      {variable.type}
                    </span>
                  </div>
                  {variable.description && (
                    <div className="text-xs text-theme-text-secondary mt-0.5">
                      {variable.description}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 text-sm text-theme-text-secondary text-center">
              No matching variables found
            </div>
          )}
        </div>

        {/* Keyboard shortcuts help */}
        <div className="p-2 border-t border-theme-border bg-theme-bg-secondary text-xs text-theme-text-secondary">
          <div className="flex justify-between">
            <span>↑↓ to navigate</span>
            <span>↵ or Tab to select</span>
            <span>Esc to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
