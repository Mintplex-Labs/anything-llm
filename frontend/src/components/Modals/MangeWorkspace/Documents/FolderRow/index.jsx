import { FolderNotch, CaretDown, File, Trash } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

export default function FolderRow({ document, isSelected, onToggleSelection }) {
  const handleRowClick = () => {
    onToggleSelection(document.id);
  };

  const handleTrashClick = (event) => {
    event.stopPropagation();
    console.log("trash clicked");
  };

  return document.kind === "Folder" ? (
    <FolderRow
      document={document}
      selected={isSelected}
      onRowClick={handleRowClick}
      onTrashClick={handleTrashClick}
    />
  ) : (
    <FileRow
      document={document}
      selected={isSelected}
      onRowClick={handleRowClick}
      onTrashClick={handleTrashClick}
    />
  );
}

function FolderRow({ document, selected, onRowClick, onTrashClick }) {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = (event) => {
    event.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <div
      onClick={onRowClick}
      className={`transition-all duration-200 text-white/80 text-xs grid grid-cols-12 py-2 pl-3.5 pr-8 border-b border-white/20 hover:bg-sky-500/20 cursor-pointer ${
        selected ? "bg-sky-500/20" : ""
      }`}
    >
      <div className="col-span-4 flex gap-x-[4px] items-center">
        <SelectedCheckbox selected={selected} />
        <div
          onClick={handleExpandClick}
          className={`transform transition-transform duration-200 ${
            expanded ? "rotate-90" : ""
          }`}
        >
          <CaretDown className="text-base font-bold w-4 h-4" />
        </div>
        <FolderNotch
          className="text-base font-bold w-4 h-4 mr-[3px]"
          weight="fill"
        />
        <p>{truncate(document.name, 17)}</p>
      </div>
      <p className="col-span-2 pl-3.5">{document.date}</p>
      <p className="col-span-2 pl-3">{document.size}</p>
      <p className="col-span-2 pl-2">{document.kind}</p>
      <div className="col-span-2 flex justify-end items-center">
        {document.cached && (
          <div className="bg-white/10 rounded-3xl">
            <p className="text-xs px-2 py-0.5">Cached</p>
          </div>
        )}
        <Trash
          onClick={onTrashClick}
          className="text-base font-bold w-4 h-4 ml-2 flex-shrink-0 cursor-pointer"
        />
      </div>
      {expanded && (
        <div className="col-span-full">{/* Render folder items */}</div>
      )}
    </div>
  );
}

function FileRow({ document, selected, onRowClick, onTrashClick }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    tooltipTimeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    clearTimeout(tooltipTimeoutRef.current);
    setShowTooltip(false);
  };

  useEffect(() => {
    return () => {
      clearTimeout(tooltipTimeoutRef.current);
    };
  }, []);

  return (
    <div
      onClick={onRowClick}
      className={`transition-all duration-200 text-white/80 text-xs grid grid-cols-12 py-2 pl-3.5 pr-8 border-b border-white/20 hover:bg-sky-500/20 cursor-pointer ${
        selected ? "bg-sky-500/20" : ""
      }`}
    >
      <div className="col-span-4 flex gap-x-[4px] items-center">
        <SelectedCheckbox selected={selected} />
        <File className="text-base font-bold w-4 h-4 mr-[3px]" weight="fill" />
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <p>{truncate(document.name, 17)}</p>
          {showTooltip && (
            <div className="absolute left-full ml-2 bg-white text-black p-1.5 rounded shadow-lg whitespace-nowrap shadow">
              {document.name}
            </div>
          )}
        </div>
      </div>
      <p className="col-span-2 pl-3.5">{document.date}</p>
      <p className="col-span-2 pl-3">{document.size}</p>
      <p className="col-span-2 pl-2">{document.kind}</p>
      <div className="col-span-2 flex justify-end items-center">
        {document.cached && (
          <div className="bg-white/10 rounded-3xl">
            <p className="text-xs px-2 py-0.5">Cached</p>
          </div>
        )}
        <Trash
          onClick={onTrashClick}
          className="text-base font-bold w-4 h-4 ml-2 flex-shrink-0 cursor-pointer"
        />
      </div>
    </div>
  );
}

function SelectedCheckbox({ selected }) {
  return (
    <div
      className="w-3 h-3 rounded border-[1px] border-white flex justify-center items-center cursor-pointer"
      role="checkbox"
      aria-checked={selected}
      tabIndex={0}
    >
      {selected && <div className="w-2 h-2 bg-white rounded-[2px]" />}
    </div>
  );
}

function truncate(str, n) {
  const fileExtensionPattern = /(\..+)$/;
  const extensionMatch = str.match(fileExtensionPattern);

  if (extensionMatch && extensionMatch[1]) {
    const extension = extensionMatch[1];
    const nameWithoutExtension = str.replace(fileExtensionPattern, "");
    const truncationPoint = Math.max(0, n - extension.length - 4);
    const truncatedName =
      nameWithoutExtension.substr(0, truncationPoint) +
      "..." +
      nameWithoutExtension.slice(-4);

    return truncatedName + extension;
  } else {
    return str.length > n ? str.substr(0, n - 8) + "..." + str.slice(-4) : str;
  }
}
