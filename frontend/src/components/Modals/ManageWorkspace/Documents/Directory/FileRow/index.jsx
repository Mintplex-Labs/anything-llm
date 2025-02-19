import React from "react";
import {
  formatDate,
  getFileExtension,
  middleTruncate,
} from "@/utils/directories";
import { File, GoogleLogo } from "@phosphor-icons/react";

export default function FileRow({ item, selected, toggleSelection }) {
  // Get the display name - prefer title over name
  const displayName = item.title || item.name || item.metadata?.name;
  
  // Check for Google Doc in multiple places to ensure we catch all cases
  const isGoogleDoc = 
    item.metadata?.source === 'google_docs' ||
    item.metadata?.type === 'google_document' ||
    item.type === 'google_document' ||
    (item.docId && item.docId.startsWith('googledoc-')) ||
    (item.chunkSource && item.chunkSource.startsWith('googledocs://'));

  // Get proper display type
  const getDisplayType = () => {
    if (isGoogleDoc) return 'GOOGLE DOC';
    return getFileExtension(displayName).toUpperCase();
  };

  // Get proper file type for tooltip
  const getFileType = () => {
    if (isGoogleDoc) return 'Google Document';
    return item.metadata?.type || item.type || 'file';
  };

  // Get token count from either direct property or metadata
  const tokenCount = item.token_count_estimate || item.metadata?.tokenCount || item.metadata?.token_count_estimate;

  // Get last modified date
  const lastModified = item.metadata?.updatedAt || item.metadata?.lastUpdated || item.lastModified || new Date().toISOString();

  return (
    <div
      onClick={() => toggleSelection(item)}
      className={`text-theme-text-primary text-xs grid grid-cols-12 py-2 pl-3.5 pr-8 hover:bg-theme-file-picker-hover cursor-pointer file-row ${
        selected ? "selected light:text-white" : ""
      }`}
    >
      <div
        data-tooltip-id="directory-item"
        className="col-span-10 w-fit flex gap-x-[4px] items-center relative"
        data-tooltip-content={JSON.stringify({
          title: displayName,
          date: formatDate(lastModified),
          extension: getDisplayType(),
          type: getFileType()
        })}
      >
        <div
          className={`shrink-0 w-3 h-3 rounded border-[1px] border-solid border-white ${
            selected ? "text-white" : "text-theme-text-primary light:invert"
          } flex justify-center items-center cursor-pointer`}
          role="checkbox"
          aria-checked={selected}
          tabIndex={0}
        >
          {selected && <div className="w-2 h-2 bg-white rounded-[2px]" />}
        </div>
        {isGoogleDoc ? (
          <GoogleLogo
            className="shrink-0 text-base font-bold w-4 h-4 mr-[3px]"
            weight="fill"
          />
        ) : (
          <File
            className="shrink-0 text-base font-bold w-4 h-4 mr-[3px]"
            weight="fill"
          />
        )}
        <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[400px]">
          {middleTruncate(displayName, 55)}
        </span>
        <span className="ml-2 text-xs opacity-50">
          {getDisplayType()}
        </span>
      </div>
      <div className="col-span-2 flex justify-end items-center gap-2">
        {item?.metadata?.cached && (
          <div className="bg-theme-settings-input-active rounded-3xl">
            <span className="text-xs px-2 py-0.5">Cached</span>
          </div>
        )}
        {tokenCount > 0 && (
          <div className="text-xs opacity-50">
            {Math.round(tokenCount / 1000)}k tokens
          </div>
        )}
      </div>
    </div>
  );
}
