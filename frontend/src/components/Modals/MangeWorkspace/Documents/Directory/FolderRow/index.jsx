import { useState } from "react";
import FileRow from "../FileRow";
import { CaretDown, FolderNotch } from "@phosphor-icons/react";
import { middleTruncate } from "@/utils/directories";

export default function FolderRow({
  item,
  selected,
  onRowClick,
  toggleSelection,
  isSelected,
  fetchKeys,
  setLoading,
  setLoadingMessage,
}) {
  const [expanded, setExpanded] = useState(true);

  const handleExpandClick = (event) => {
    event.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <>
      <div
        onClick={onRowClick}
        className={`transition-all duration-200 text-white/80 text-xs grid grid-cols-12 py-2 pl-3.5 pr-8 border-b border-white/20 hover:bg-sky-500/20 cursor-pointer w-full ${
          selected ? "bg-sky-500/20" : ""
        }`}
      >
        <div className="col-span-4 flex gap-x-[4px] items-center">
          <div
            className="w-3 h-3 rounded border-[1px] border-white flex justify-center items-center cursor-pointer"
            role="checkbox"
            aria-checked={selected}
            tabIndex={0}
          >
            {selected && <div className="w-2 h-2 bg-white rounded-[2px]" />}
          </div>
          <div
            onClick={handleExpandClick}
            className={`transform transition-transform duration-200 ${
              expanded ? "rotate-360" : " rotate-270"
            }`}
          >
            <CaretDown className="text-base font-bold w-4 h-4" />
          </div>
          <FolderNotch
            className="text-base font-bold w-4 h-4 mr-[3px]"
            weight="fill"
          />
          <p className="whitespace-nowrap overflow-show">
            {middleTruncate(item.name, 40)}
          </p>
        </div>
        <p className="col-span-2 pl-3.5" />
        <p className="col-span-2 pl-3" />
        <p className="col-span-2 pl-2" />
        <div className="col-span-2 flex justify-end items-center" />
      </div>
      {expanded && (
        <div className="col-span-full">
          {item.items.map((fileItem) => (
            <FileRow
              key={fileItem.id}
              item={fileItem}
              folderName={item.name}
              selected={isSelected(fileItem.id)}
              expanded={expanded}
              toggleSelection={toggleSelection}
              fetchKeys={fetchKeys}
              setLoading={setLoading}
              setLoadingMessage={setLoadingMessage}
            />
          ))}
        </div>
      )}
    </>
  );
}
