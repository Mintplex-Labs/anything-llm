import { useState } from "react";
import {
  formatDate,
  getFileExtension,
  truncate,
} from "../../../../../../utils/directories";
import { ArrowUUpLeft, File } from "@phosphor-icons/react";
import Workspace from "../../../../../../models/workspace";
import debounce from "lodash.debounce";

/**
 * Renders a row in the workspace files list.
 * Displays file name, published date, and actions.
 * Handles tooltip, loading state, and removing file on click.
 */
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
      <div className="col-span-4 flex gap-x-[4px] items-center">
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
            {truncate(item.title, 20)}
          </p>
          {showTooltip && (
            <div className="absolute left-0 bg-white text-black p-1.5 rounded shadow-lg whitespace-nowrap">
              {item.title}
            </div>
          )}
        </div>
      </div>
      <p className="col-span-3 pl-7 whitespace-nowrap">
        {formatDate(item.publishedAt, "MM/dd/yy")}
      </p>
      {/* <p className="col-span-2 pl-3">{item?.size || "---"}</p> */}
      <p className="col-span-2 pl-2 relative">
        <select className="bg-gray-800">
         <option>--  Select Tag  --</option>
          <option>RFP Issuer Research</option>
          <option>Responder Portfoilio</option>
          <option>Quarterly Report</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </p>
      <div className="col-span-3 flex justify-end items-center">
        {item?.cached && (
          <div className="bg-white/10 rounded-3xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 mx-auto"
            >
              <path
                fillRule="evenodd"
                d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                clipRule="evenodd"
              />
            </svg>
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


