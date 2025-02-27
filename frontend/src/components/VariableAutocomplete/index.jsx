import React, { useState, useEffect, useRef } from "react";
import { X } from "@phosphor-icons/react";

export default function VariableAutocomplete({
  variables = [],
  onSelect,
  position,
  onClose,
}) {
  const [filteredVariables, setFilteredVariables] = useState(variables);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef(null);
  const selectedRef = useRef(null);

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredVariables.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter" && filteredVariables.length > 0) {
        e.preventDefault();
        onSelect(filteredVariables[selectedIndex]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredVariables, selectedIndex, onSelect, onClose]);

  return (
    <div
      className="absolute z-50 bg-theme-settings-input-bg border border-theme-border rounded-lg shadow-lg overflow-hidden"
      style={{
        top: position?.top || 0,
        left: position?.left || 0,
        width: "300px",
        maxHeight: "200px",
      }}
    >
      <div className="flex justify-between items-center p-2 border-b border-theme-border">
        <span className="text-sm font-medium text-theme-text-primary">
          Variables
        </span>
        <button
          onClick={onClose}
          className="text-theme-text-secondary hover:text-theme-text-primary"
        >
          <X size={16} />
        </button>
      </div>
      <div
        ref={listRef}
        className="overflow-y-auto"
        style={{ maxHeight: "160px" }}
      >
        {filteredVariables.length > 0 ? (
          <ul className="py-1">
            {filteredVariables.map((variable, index) => (
              <li
                key={variable.key}
                ref={index === selectedIndex ? selectedRef : null}
                className={`px-3 py-2 cursor-pointer text-sm ${
                  index === selectedIndex
                    ? "bg-theme-action-menu-item-hover text-theme-text-primary"
                    : "text-theme-text-secondary hover:bg-theme-action-menu-item-hover"
                }`}
                onClick={() => onSelect(variable)}
              >
                <div className="font-medium">{`{${variable.key}}`}</div>
                {variable.description && (
                  <div className="text-xs opacity-70">{variable.description}</div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-3 text-sm text-theme-text-secondary">
            No variables found
          </div>
        )}
      </div>
    </div>
  );
}