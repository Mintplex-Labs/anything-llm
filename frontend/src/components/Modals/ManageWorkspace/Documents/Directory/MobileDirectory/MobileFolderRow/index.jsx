import { memo } from "react";
import { useTranslation } from "react-i18next";
import {
  CaretRight,
  CircleNotch,
  File,
  FolderNotch,
} from "@phosphor-icons/react";
import {
  formatDateTimeAsMoment,
  getFileExtension,
  middleTruncate,
} from "@/utils/directories";
import MobileCheckbox from "../../../MobileCheckbox";

/**
 * @param {Object} props
 * @param {number} props.inWorkspaceCount - Documents of this folder already in workspace
 * @param {"none"|"some"|"all"} props.selectionState
 */
export default function MobileFolderRow({
  row,
  inWorkspaceCount,
  selectionState,
  isFileSelected,
  onToggleExpanded,
  onToggleFolder,
  onToggleFile,
  onLoadMore,
}) {
  const { t } = useTranslation();
  const { item, files, expanded, loading, hasMore, totalCount, displayCount } =
    row;
  const availableCount =
    inWorkspaceCount > 0
      ? Math.max(0, totalCount - inWorkspaceCount)
      : displayCount;

  return (
    <div>
      <div
        onClick={() => onToggleExpanded(item.name)}
        className="flex items-center h-14 pr-3 rounded-xl cursor-pointer transition-colors duration-150 active:bg-zinc-800 light:active:bg-slate-100"
      >
        <MobileCheckbox
          state={selectionState}
          label={item.name}
          onToggle={() => onToggleFolder(item, files)}
        />
        <FolderNotch
          weight="fill"
          className="w-5 h-5 shrink-0 text-zinc-400 light:text-slate-400"
        />
        <div className="flex-1 min-w-0 ml-3">
          <p className="text-sm font-medium truncate text-slate-50 light:text-slate-900">
            {item.name}
          </p>
          <p className="text-xs text-zinc-400 light:text-slate-500">
            {t("connectors.directory.total-documents", {
              count: availableCount,
            })}
            {inWorkspaceCount > 0 && (
              <span className="lowercase">
                {" · "}
                {inWorkspaceCount} {t("connectors.directory.in-workspace")}
              </span>
            )}
          </p>
        </div>
        {loading && files.length > 0 && (
          <CircleNotch
            size={14}
            weight="bold"
            className="animate-spin shrink-0 mr-2 text-zinc-400 light:text-slate-500"
          />
        )}
        <CaretRight
          size={16}
          weight="bold"
          className={`shrink-0 text-zinc-500 light:text-slate-400 transition-transform duration-200 ease-in-out ${
            expanded ? "rotate-90" : ""
          }`}
        />
      </div>

      {expanded && (
        <div className="pl-5">
          {loading && files.length === 0 && (
            <div className="flex items-center gap-x-2 h-12 pl-4 text-xs text-zinc-400 light:text-slate-500">
              <CircleNotch size={14} weight="bold" className="animate-spin" />
              {t("common.loading")}...
            </div>
          )}
          {!loading && files.length === 0 && (
            <p className="h-12 pl-4 flex items-center text-xs text-zinc-400 light:text-slate-500">
              {t("connectors.directory.no-documents")}
            </p>
          )}
          {files.map((file) => (
            <MobileFileRow
              key={file.id}
              file={file}
              folderName={item.name}
              selected={isFileSelected(file.id)}
              onToggle={onToggleFile}
            />
          ))}
          {hasMore && (
            <button
              type="button"
              disabled={loading}
              onClick={() => onLoadMore(item.name)}
              className="border-none bg-transparent h-11 pl-4 text-sm font-medium text-sky-400 light:text-sky-700 disabled:opacity-50"
            >
              {loading
                ? `${t("common.loading")}...`
                : `Load more (${files.length} of ${totalCount})`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const MobileFileRow = memo(
  function MobileFileRow({ file, folderName, selected, onToggle }) {
    return (
      <div
        onClick={() => onToggle(file, folderName)}
        className="flex items-center min-h-[52px] pr-3 rounded-xl cursor-pointer transition-colors duration-150 active:bg-zinc-800 light:active:bg-slate-100"
      >
        <MobileCheckbox state={selected ? "all" : "none"} />
        <File
          weight="fill"
          className="w-5 h-5 shrink-0 text-zinc-500 light:text-slate-400"
        />
        <div className="flex-1 min-w-0 ml-3 py-1.5">
          <p className="text-sm truncate text-slate-50 light:text-slate-900">
            {middleTruncate(file.title, 40)}
          </p>
          <p className="text-xs truncate text-zinc-400 light:text-slate-500">
            {getFileExtension(file.url)} ·{" "}
            {formatDateTimeAsMoment(file.published, "ll")}
            {file.cached && " · Cached"}
          </p>
        </div>
      </div>
    );
  },
  (prev, next) =>
    prev.file.id === next.file.id && prev.selected === next.selected
);
