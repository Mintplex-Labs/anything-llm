import { useRef, useState } from "react";
import {
  formatDate,
  getFileExtension,
  middleTruncate,
} from "@/utils/directories";
import { File } from "@phosphor-icons/react";

export default function FileRow({ item, selected, toggleSelection }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 800);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    setShowTooltip(false);
  };
  return (
    <tr
      onClick={() => toggleSelection(item)}
      className={`text-white/80 text-xs grid grid-cols-12 py-2 pl-3.5 pr-8 hover:bg-sky-500/20 cursor-pointer file-row ${
        selected ? "selected" : ""
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="col-span-10 flex gap-x-[4px] items-center relative">
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
        <p className="whitespace-nowrap overflow-hidden text-ellipsis">
          {middleTruncate(item.title, 60)}
        </p>
        {showTooltip && (
          <div className="absolute left-0 top-full mt-2 p-2 bg-white text-black rounded shadow-lg z-10 max-w-[560px]">
            <p className="font-bold">{item.title}</p>
            <div className="flex mt-1 gap-x-2">
              <p className="text-xs">
                Date: <b>{formatDate(item?.published)}</b>
              </p>
              <p className="text-xs uppercase">
                Type: <b>{getFileExtension(item.url)}</b>
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="col-span-2 flex justify-end items-center">
        {item?.cached && (
          <div className="bg-white/10 rounded-3xl">
            <p className="text-xs px-2 py-0.5">Cached</p>
          </div>
        )}
      </div>
    </tr>
  );
}