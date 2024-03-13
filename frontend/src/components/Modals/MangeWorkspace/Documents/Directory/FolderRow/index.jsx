import { useState } from "react";
import FileRow from "../FileRow";
import { CaretDown, FolderNotch, Trash } from "@phosphor-icons/react";
import { middleTruncate } from "@/utils/directories";
import System from "@/models/system";

export default function FolderRow({
  item,
  selected,
  onRowClick,
  toggleSelection,
  isSelected,
  fetchKeys,
  setLoading,
  setLoadingMessage,
  autoExpanded = false,
}) {
  const [expanded, setExpanded] = useState(autoExpanded);

  const onTrashClick = async (event) => {
    event.stopPropagation();
    if (
      !window.confirm(
        "Are you sure you want to delete this folder?\nThis will require you to re-upload and re-embed it.\nAny documents in this folder will be removed from any workspace that is currently referencing it.\nThis action is not reversible."
      )
    ) {
      return false;
    }

    try {
      setLoading(true);
      setLoadingMessage("This may take a while for large folders");
      await System.deleteFolder(item.name);
      await fetchKeys(true);
    } catch (error) {
      console.error("Failed to delete the document:", error);
    }

    if (selected) toggleSelection(item);
    setLoading(false);
  };

  const handleExpandClick = (event) => {
    event.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <>
      <tr
        onClick={onRowClick}
        className={`transition-all duration-200 text-white/80 text-xs grid grid-cols-12 py-2 pl-3.5 pr-8 bg-[#2C2C2C] hover:bg-sky-500/20 cursor-pointer w-full file-row:0 ${
          selected ? "selected" : ""
        }`}
      >
        <div className="col-span-6 flex gap-x-[4px] items-center">
          <div
            className="shrink-0 w-3 h-3 rounded border-[1px] border-white flex justify-center items-center cursor-pointer"
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
            className="shrink-0 text-base font-bold w-4 h-4 mr-[3px]"
            weight="fill"
          />
          <p className="whitespace-nowrap overflow-show">
            {middleTruncate(item.name, 40)}
          </p>
        </div>
        <p className="col-span-2 pl-3.5" />
        <p className="col-span-2 pl-2" />
        <div className="col-span-2 flex justify-end items-center">
          {item.name !== "custom-documents" && (
            <Trash
              onClick={onTrashClick}
              className="text-base font-bold w-4 h-4 ml-2 flex-shrink-0 cursor-pointer"
            />
          )}
        </div>
      </tr>
      {expanded && (
        <div className="col-span-full">
          {item.items.map((fileItem) => (
            <FileRow
              key={fileItem.id}
              item={fileItem}
              folderName={item.name}
              selected={isSelected(fileItem.id)}
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
