import { middleTruncate } from "@/utils/directories";
import { CaretDown, FolderNotch, Pencil } from "@phosphor-icons/react";
import { useState } from "react";
import FileRow from "../FileRow";
import { folderColumns } from "../utils";

export default function FolderRow({
  item,
  selected,
  onRowClick,
  toggleSelection,
  isSelected,
  openFolderModal,
  autoExpanded = false,
}) {
  const [expanded, setExpanded] = useState(autoExpanded);

  const handleExpandClick = (event) => {
    event.stopPropagation();
    setExpanded(!expanded);
  };

  // Check if there are any files in the folder
  const hasFiles = item.items && item.items.length > 0;
  return (
    <>
      <div
        onClick={onRowClick}
        className={`text-white/80 text-xs flex gap-3 py-2 pl-3.5 pr-8 bg-dark-highlight hover:bg-sky-500/20 cursor-pointer w-full file-row ${selected ? "selected" : ""
          }`}
      >
        <div
          className={`flex ${hasFiles ? "gap-x-[4px]" : "gap-5"} items-center w-44`}
        >
          <div
            className="shrink-0 w-3 h-3 rounded border-[1px] border-white flex justify-center items-center cursor-pointer"
            role="checkbox"
            aria-checked={selected}
            tabIndex={0}
            onClick={(event) => {
              event.stopPropagation();
              toggleSelection(item);
            }}
          >
            {selected && <div className="w-2 h-2 bg-white rounded-[2px]" />}
          </div>
          {hasFiles && (
            <>
              <div
                onClick={handleExpandClick}
                className={`transform transition-transform duration-200 ${expanded ? "rotate-360" : " rotate-270"
                  }`}
              >
                <CaretDown className="text-base font-bold w-4 h-4" />
              </div>
              <FolderNotch
                className="shrink-0 text-base font-bold w-4 h-4 mr-[3px]"
                weight="fill"
              />
            </>
          )}
          <p className="whitespace-pre-wrap break-all">
            {middleTruncate(item.name, 35)}
          </p>
        </div>
        {Object.keys(folderColumns).map((key, index) => {
          return (
            <div
              key={key}
              className="flex gap-x-[4px] items-center justify-start w-44"
            >
              <p className="whitespace-pre-wrap break-all">
                {item?.metadata?.[key]}
              </p>
              {index === Object.keys(folderColumns).length - 1 && (
                <button
                  onClick={openFolderModal}
                  className="text-base font-bold w-4 h-4"
                >
                  <Pencil size={18} weight="bold" />
                </button>
              )}
            </div>
          );
        })}
      </div>
      {expanded && (
        <>
          {item.items.map((fileItem) => (
            <FileRow
              key={fileItem.id}
              item={fileItem}
              selected={isSelected(fileItem.id)}
              toggleSelection={toggleSelection}
            />
          ))}
        </>
      )}
    </>
  );
}
