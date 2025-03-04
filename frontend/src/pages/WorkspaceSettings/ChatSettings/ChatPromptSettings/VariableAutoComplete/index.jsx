import React, { useEffect, useRef } from "react";

export default function VariableAutoComplete({
  variables = [],
  onSelect,
  position,
  onClose,
  searchTerm = "",
}) {
  const listRef = useRef(null);
  const selectedRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const filteredVariables = variables.filter((variable) =>
    variable.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (!["ArrowDown", "ArrowUp", "Enter", "Tab", "Escape"].includes(e.key))
        return;
      handleKeyDown(e);
    };

    window.addEventListener("keydown", handleGlobalKeyDown, true);
    return () =>
      window.removeEventListener("keydown", handleGlobalKeyDown, true);
  }, [selectedIndex, filteredVariables]);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex((prev) =>
          prev < filteredVariables.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
      case "Tab":
        e.preventDefault();
        e.stopPropagation();
        if (filteredVariables.length > 0) {
          onSelect(filteredVariables[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        e.stopPropagation();
        onClose();
        break;
    }
  };

  if (filteredVariables.length === 0) return null;

  return (
    <div
      className="absolute z-[9999] bg-theme-action-menu-bg rounded-lg shadow-md"
      style={{
        top: `calc(${(position.line + 1) * position.lineHeight}px + 4px)`,
        left: `${position.charOffset}px`,
        maxHeight: "200px",
        minWidth: "200px",
        maxWidth: "400px",
      }}
      onKeyDown={handleKeyDown}
    >
      <ul className="overflow-y-auto max-h-[200px] p-2" ref={listRef}>
        {filteredVariables.map((variable, index) => (
          <li
            key={variable.key}
            ref={index === selectedIndex ? selectedRef : null}
            className={`px-2 py-1 cursor-pointer rounded-md flex items-center gap-2 ${
              index === selectedIndex
                ? "bg-theme-action-menu-item-hover"
                : "hover:bg-theme-action-menu-item-hover"
            }`}
            onClick={() => onSelect(variable)}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm text-theme-text-primary whitespace-nowrap">
                {variable.key}
              </span>
              {variable.description && (
                <span className="text-xs text-theme-text-secondary truncate">
                  {variable.description}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
