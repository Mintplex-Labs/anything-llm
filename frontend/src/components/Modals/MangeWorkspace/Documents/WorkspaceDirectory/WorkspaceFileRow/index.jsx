import { useState } from "react";
import {
  formatDate,
  getFileExtension,
  middleTruncate,
} from "@/utils/directories";
import { ArrowUUpLeft, File } from "@phosphor-icons/react";
import Workspace from "@/models/workspace";
import debounce from "lodash.debounce";

export default function WorkspaceFileRow({
  item,
  folderName,
  workspace,
  setLoading,
  setLoadingMessage,
  fetchKeys,
  hasChanges,
  movedItems,
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const onRemoveClick = async () => {
    setLoading(true);

    try {
      setLoadingMessage(`Removing file from workspace`);
      await Workspace.modifyEmbeddings(workspace.slug, {
        adds: [],
        deletes: [`${folderName}/${item.name}`],
      });
      await fetchKeys(true);
    } catch (error) {
      console.error("Failed to remove document:", error);
    }

    setLoadingMessage("");
    setLoading(false);
  };

  const handleShowTooltip = () => {
    setShowTooltip(true);
  };

  const handleHideTooltip = () => {
    setShowTooltip(false);
  };

  const isMovedItem = movedItems?.some((movedItem) => movedItem.id === item.id);
  const handleMouseEnter = debounce(handleShowTooltip, 500);
  const handleMouseLeave = debounce(handleHideTooltip, 500);
  return (
    <div
      className={`items-center transition-all duration-200 text-white/80 text-xs grid grid-cols-12 py-2 pl-3.5 pr-8 border-b border-white/20 hover:bg-sky-500/20 cursor-pointer
          ${isMovedItem ? "bg-green-800/40" : ""}`}
    >
      <div className="col-span-5 flex gap-x-[4px] items-center">
        <File
          className="text-base font-bold w-4 h-4 ml-3 mr-[3px]"
          weight="fill"
        />
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <p className="whitespace-nowrap overflow-hidden">
            {middleTruncate(item.title, 17)}
          </p>
          {showTooltip && (
            <div className="absolute left-0 bg-white text-black p-1.5 rounded shadow-lg whitespace-nowrap">
              {item.title}
            </div>
          )}
        </div>
      </div>
      <p className="col-span-3 pl-3.5 whitespace-nowrap">
        {formatDate(item?.published)}
      </p>
      <p className="col-span-2 pl-2 uppercase overflow-x-hidden">
        {getFileExtension(item.url)}
      </p>
      <div className="col-span-2 flex justify-end items-center">
        {item?.cached && (
          <div className="bg-white/10 rounded-3xl">
            <p className="text-xs px-2 py-0.5">Cached</p>
          </div>
        )}
        {hasChanges ? (
          <div className="w-4 h-4 ml-2 flex-shrink-0" />
        ) : (
          <ArrowUUpLeft
            onClick={onRemoveClick}
            className="text-base font-bold w-4 h-4 ml-2 flex-shrink-0 cursor-pointer"
          />
        )}
      </div>
    </div>
  );
}
