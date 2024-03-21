import { useState } from "react";
import {
  formatDate,
  getFileExtension,
  middleTruncate,
} from "@/utils/directories";
import { File } from "@phosphor-icons/react";
import debounce from "lodash.debounce";

export default function FileRow({ item, selected, toggleSelection }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleShowTooltip = () => {
    setShowTooltip(true);
  };

  const handleHideTooltip = () => {
    setShowTooltip(false);
  };

  const handleMouseEnter = debounce(handleShowTooltip, 500);
  const handleMouseLeave = debounce(handleHideTooltip, 500);

  return (
    <tr
      onClick={() => toggleSelection(item)}
      className={`text-white/80 text-xs grid grid-cols-12 py-2 pl-3.5 pr-8 hover:bg-sky-500/20 cursor-pointer file-row ${
        selected ? "selected" : ""
      }`}
    >
      <div className="pl-2 col-span-6 flex gap-x-[4px] items-center">
        <div
          className="shrink-0 w-3 h-3 rounded border-[1px] border-white flex justify-center items-center cursor-pointer"
          role="checkbox"
          aria-checked={selected}
          tabIndex={0}
        >
          {selected && <div className="w-2 h-2 bg-white rounded-[2px]" />}
        </div>
        <File
          className="shrink-0 text-base font-bold w-4 h-4 mr-[3px]"
          weight="fill"
        />
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <p className="whitespace-nowrap overflow-hidden max-w-[165px] text-ellipsis">
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
      <div className="-col-span-2 flex justify-end items-center">
        {item?.cached && (
          <div className="bg-white/10 rounded-3xl">
            <p className="text-xs px-2 py-0.5">Cached</p>
          </div>
        )}
      </div>
    </tr>
  );
}
