import { useState } from "react";
import FileRow from "../FileRow";
import { CaretDown, FolderNotch, CircleNotch } from "@phosphor-icons/react";
import { middleTruncate } from "@/utils/directories";
import { useTranslation } from "react-i18next";

/**
 * A folder in the document picker. Purely presentational - every piece of
 * state (which files are loaded, whether it is open, what is selected) is
 * owned by `useDocumentPicker` so the row can never drift out of sync with
 * the rest of the picker.
 *
 * @param {object} props
 * @param {{name: string, fileCount: number}} props.item folder shell
 * @param {Array<object>} props.files files currently fetched for this folder
 * @param {boolean} props.expanded
 * @param {boolean} props.loading a page request is in flight
 * @param {boolean} props.hasMore more pages remain on the server
 * @param {number} props.totalCount server-side count, shown in "Load more"
 * @param {number} props.displayCount the badge next to the folder name; the
 * caller resolves this because it differs by context (matches while searching,
 * listable rows once fully fetched, the raw count before that)
 * @param {'none'|'some'|'all'} props.selectionState folder checkbox tri-state
 * @param {(id: string) => boolean} props.isFileSelected
 * @param {boolean} props.acceptsDrops whether files can be dropped onto this
 * row right now (false while the document processor is offline)
 * @param {(folderName: string, event: React.DragEvent) => void} props.onDropFiles
 */
export default function FolderRow({
  item,
  files = [],
  expanded = false,
  loading = false,
  hasMore = false,
  totalCount = 0,
  displayCount = 0,
  selectionState = "none",
  isFileSelected,
  onToggleExpanded,
  onToggleFolder,
  onToggleFile,
  onPrefetch,
  onLoadMore,
  acceptsDrops = false,
  onDropFiles,
}) {
  const { t } = useTranslation();
  const [isDropTarget, setIsDropTarget] = useState(false);
  const selected = selectionState === "all";
  const partial = selectionState === "some";

  // Only react to drags carrying files - dragging text or a link over the
  // picker should not light every folder up.
  const dragHasFiles = (event) =>
    Array.from(event.dataTransfer?.types ?? []).includes("Files");

  const handleDragOver = (event) => {
    if (!acceptsDrops || !dragHasFiles(event)) return;
    // Both required, or the browser refuses the drop and opens the file.
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy";
    if (!isDropTarget) setIsDropTarget(true);
  };

  const handleDragLeave = (event) => {
    // dragleave also fires when moving onto a child element, so ignore any
    // leave that lands somewhere still inside this row.
    if (event.currentTarget.contains(event.relatedTarget)) return;
    setIsDropTarget(false);
  };

  const handleDrop = (event) => {
    setIsDropTarget(false);
    if (!acceptsDrops || !dragHasFiles(event)) return;
    // preventDefault stops the browser from navigating to the dropped file;
    // stopPropagation keeps the drop from also being handled as an untargeted
    // one by anything above this row.
    event.preventDefault();
    event.stopPropagation();
    onDropFiles(item.name, event);
  };

  return (
    <>
      {/* Clicking the row opens the folder. Selection is the checkbox's job -
          a whole-row click is too easy to hit by accident for something that
          can stage hundreds of files for embedding. */}
      <tr
        onClick={() => onToggleExpanded(item.name)}
        onMouseEnter={() => onPrefetch(item.name)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`text-theme-text-primary text-xs grid grid-cols-12 py-2 pl-3.5 pr-8 hover:bg-theme-file-picker-hover cursor-pointer file-row ${
          selected || partial ? "selected light:text-white !text-white" : ""
        } ${
          isDropTarget
            ? "outline-dashed outline-2 -outline-offset-2 outline-sky-400 bg-sky-400/10"
            : ""
        }`}
      >
        <div
          className={`col-span-6 flex gap-x-[4px] items-center ${
            selected || partial ? "!text-white" : "text-theme-text-primary"
          }`}
        >
          <div
            className={`shrink-0 w-3 h-3 rounded border-[1px] border-solid border-white ${
              selected || partial
                ? "text-white"
                : "text-theme-text-primary light:invert"
            } flex justify-center items-center cursor-pointer`}
            role="checkbox"
            aria-checked={partial ? "mixed" : selected}
            tabIndex={0}
            onClick={(event) => {
              event.stopPropagation();
              onToggleFolder(item);
            }}
          >
            {selected && <div className="w-2 h-2 bg-white rounded-[2px]" />}
            {partial && <div className="w-2 h-[2px] bg-white rounded-[2px]" />}
          </div>
          {/* No handler of its own - the row click already expands. */}
          <div
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
          <p className="whitespace-nowrap overflow-show max-w-[400px]">
            {middleTruncate(item.name, 35)}
          </p>
          {displayCount > 0 && (
            <span
              className={`text-theme-text-secondary text-[10px] font-medium ml-1.5 shrink-0 ${
                selected || partial ? "light:!text-white" : ""
              }`}
            >
              ({displayCount})
            </span>
          )}
          {loading && files.length > 0 && (
            <CircleNotch
              size={12}
              className="animate-spin ml-1 shrink-0"
              weight="bold"
            />
          )}
        </div>
        <p className="col-span-2 pl-3.5" />
        <p className="col-span-2 pl-2" />
      </tr>
      {expanded && loading && files.length === 0 && (
        <tr className="text-theme-text-secondary text-xs py-2 pl-8 pr-8">
          <td className="flex items-center gap-x-2 py-2 pl-8">
            <CircleNotch size={14} className="animate-spin" weight="bold" />
            <span>{t("common.loading")}...</span>
          </td>
        </tr>
      )}
      {expanded &&
        files.map((file) => (
          <FileRow
            key={file.id}
            item={file}
            selected={isFileSelected(file.id)}
            folderName={item.name}
            toggleSelection={onToggleFile}
          />
        ))}
      {expanded && hasMore && (
        <tr className="text-theme-text-secondary text-xs py-1 pl-8 pr-8">
          <td className="py-1 pl-8">
            <button
              onClick={(event) => {
                event.stopPropagation();
                onLoadMore(item.name);
              }}
              disabled={loading}
              className="border-none bg-transparent text-xs text-theme-text-secondary hover:text-white cursor-pointer underline disabled:opacity-50 p-0"
            >
              {loading
                ? `${t("common.loading")}...`
                : `Load more (${files.length} of ${totalCount})`}
            </button>
          </td>
        </tr>
      )}
    </>
  );
}
