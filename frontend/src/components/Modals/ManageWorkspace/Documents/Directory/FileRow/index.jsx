import React from "react";
import {
  formatDate,
  getFileExtension,
  middleTruncate,
} from "@/utils/directories";
import { File } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";

export default function FileRow({ item, selected, toggleSelection }) {
  return (
    <tr
      onClick={() => toggleSelection(item)}
      className={`text-white/80 text-xs grid grid-cols-12 py-2 pl-3.5 pr-8 hover:bg-sky-500/20 cursor-pointer file-row ${
        selected ? "selected" : ""
      }`}
    >
      <div
        data-tooltip-id={`directory-item-${item.url}`}
        className="col-span-10 w-fit flex gap-x-[4px] items-center relative"
      >
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
      </div>
      <div className="col-span-2 flex justify-end items-center">
        {item?.cached && (
          <div className="bg-white/10 rounded-3xl">
            <p className="text-xs px-2 py-0.5">Cached</p>
          </div>
        )}
      </div>
      <Tooltip
        id={`directory-item-${item.url}`}
        place="bottom"
        delayShow={800}
        className="tooltip invert z-99"
      >
        <div className="text-xs ">
          <p className="text-white">{item.title}</p>
          <div className="flex mt-1 gap-x-2">
            <p className="">
              Date: <b>{formatDate(item?.published)}</b>
            </p>
            <p className="">
              Type: <b>{getFileExtension(item.url).toUpperCase()}</b>
            </p>
          </div>
        </div>
      </Tooltip>
    </tr>
  );
}
