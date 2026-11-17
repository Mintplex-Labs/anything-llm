import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CircleNotch,
  FolderNotch,
  FolderPlus,
  MagnifyingGlass,
  Trash,
} from "@phosphor-icons/react";
import PreLoader from "@/components/Preloader";
import UploadFile from "../../UploadFile";
import MoveToFolderIcon from "../MoveToFolderIcon";
import MobileFolderRow from "./MobileFolderRow";
import MobileSheet, { MobileSheetOption } from "../../MobileSheet";
import MobileActionBar, {
  MobileActionButton,
  MobileActionIconButton,
} from "../../MobileActionBar";

/**
 * Touch layout of the "My Documents" picker. State and mutations come from `Directory`.
 *
 * @param {Object} props
 * @param {ReturnType<import("../../hooks/useDocumentPicker").default>} props.picker
 * @param {Record<string, number>} props.embeddedCounts - Per folder, documents already in workspace
 * @param {number} props.documentCount - Total documents, or matches while searching
 */
export default function MobileDirectory({
  picker,
  workspace,
  rows,
  embeddedCounts,
  documentCount,
  allSelected,
  uploadQueue,
  onSearch,
  onSelectAll,
  onMoveToWorkspace,
  onMoveToFolder,
  onDelete,
  onNewFolder,
}) {
  const { t } = useTranslation();
  const [showFolderSheet, setShowFolderSheet] = useState(false);
  const {
    status,
    busyMessage,
    folders,
    searching,
    searchResults,
    hasSelection,
    selectedCount,
    selectedFolderNames,
    isFileSelected,
    folderSelectionState,
    toggleExpanded,
    toggleFolder,
    toggleFile,
    loadMore,
    clearSelection,
    syncAfterUpload,
    contents,
  } = picker;

  // Until a selected folder is fully loaded its count comes from the server,
  // which still includes documents already in the workspace.
  const alreadyEmbedded = selectedFolderNames.reduce((sum, name) => {
    const entry = contents[name];
    const exact = entry?.status === "loaded" && !entry.hasMore;
    return exact ? sum : sum + (embeddedCounts[name] ?? 0);
  }, 0);
  const movableCount = Math.max(0, selectedCount - alreadyEmbedded);
  const hasFiles = movableCount > 0;

  return (
    <div className="relative flex flex-col flex-1 min-h-0">
      <div className="shrink-0 flex flex-col gap-y-3 px-4 pb-3">
        <UploadFile
          variant="mobile"
          workspace={workspace}
          queue={uploadQueue}
          onUploadComplete={syncAfterUpload}
          onLinkScraped={syncAfterUpload}
        />
        <div className="flex gap-x-2">
          <div className="relative flex-1 min-w-0">
            <input
              type="search"
              placeholder={t("connectors.directory.search-document")}
              onChange={onSearch}
              className="search-input w-full h-11 pl-10 pr-3 rounded-xl text-base outline-none border border-transparent bg-zinc-800 light:bg-slate-100 text-slate-50 light:text-slate-900 placeholder:text-zinc-500 light:placeholder:text-slate-400 focus:border-sky-500"
            />
            {searching ? (
              <CircleNotch
                size={16}
                weight="bold"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 animate-spin text-zinc-400 light:text-slate-500"
              />
            ) : (
              <MagnifyingGlass
                size={16}
                weight="bold"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 light:text-slate-500"
              />
            )}
          </div>
          <MobileActionIconButton
            label={t("connectors.directory.new-folder")}
            onClick={onNewFolder}
          >
            <FolderPlus size={20} />
          </MobileActionIconButton>
        </div>
      </div>

      <div className="shrink-0 flex items-center justify-between h-9 px-4 text-xs text-zinc-400 light:text-slate-500">
        <p>
          {searchResults
            ? t("connectors.directory.search-results", {
                count: documentCount,
              })
            : t("connectors.directory.total-documents", {
                count: documentCount,
              })}
        </p>
        {rows.length > 0 && (
          <button
            type="button"
            onClick={allSelected ? clearSelection : onSelectAll}
            className="border-none bg-transparent h-9 -mr-2 px-2 text-xs font-semibold text-sky-400 light:text-sky-700"
          >
            {allSelected
              ? t("connectors.directory.deselect_all")
              : t("connectors.directory.select_all")}
          </button>
        )}
      </div>

      {!!busyMessage && (
        <div className="shrink-0 flex items-center gap-x-2 mx-4 mb-2 px-3 py-2 rounded-xl text-xs font-medium bg-zinc-800 light:bg-slate-100 text-slate-50 light:text-slate-900">
          <CircleNotch size={14} weight="bold" className="animate-spin" />
          {busyMessage}
        </div>
      )}

      <div
        className={`flex-1 min-h-0 overflow-y-auto px-2 select-none ${
          hasSelection ? "pb-40" : "pb-6"
        }`}
      >
        <DirectoryContent
          status={status}
          rows={rows}
          embeddedCounts={searchResults ? {} : embeddedCounts}
          folderSelectionState={folderSelectionState}
          isFileSelected={isFileSelected}
          onToggleExpanded={toggleExpanded}
          onToggleFolder={toggleFolder}
          onToggleFile={toggleFile}
          onLoadMore={loadMore}
        />
      </div>

      <MobileActionBar
        show={hasSelection}
        label={
          hasFiles
            ? t("connectors.directory.selected-count", { count: movableCount })
            : selectedFolderNames.join(", ")
        }
      >
        <MobileActionButton disabled={!hasFiles} onClick={onMoveToWorkspace}>
          {t("connectors.directory.move-workspace")}
        </MobileActionButton>
        <MobileActionIconButton
          label={t("connectors.directory.move-to-folder")}
          disabled={!hasFiles}
          onClick={() => setShowFolderSheet(true)}
        >
          <MoveToFolderIcon width={20} height={20} />
        </MobileActionIconButton>
        <MobileActionIconButton
          danger
          label={t("chat_window.delete")}
          onClick={onDelete}
        >
          <Trash size={20} />
        </MobileActionIconButton>
      </MobileActionBar>

      <MobileSheet
        open={showFolderSheet}
        onClose={() => setShowFolderSheet(false)}
        title={t("connectors.directory.move-to-folder")}
      >
        {folders.map((folder) => (
          <MobileSheetOption
            key={folder.name}
            icon={FolderNotch}
            label={folder.name}
            onClick={() => {
              setShowFolderSheet(false);
              onMoveToFolder(folder);
            }}
          />
        ))}
      </MobileSheet>
    </div>
  );
}

function DirectoryContent({
  status,
  rows,
  embeddedCounts,
  folderSelectionState,
  isFileSelected,
  ...handlers
}) {
  const { t } = useTranslation();

  if (status === "initializing")
    return (
      <div className="h-full flex items-center justify-center">
        <PreLoader />
      </div>
    );

  if (rows.length === 0)
    return (
      <p className="h-full flex items-center justify-center text-sm text-zinc-400 light:text-slate-500">
        {t("connectors.directory.no-documents")}
      </p>
    );

  return rows.map((row) => (
    <MobileFolderRow
      key={row.item.name}
      row={row}
      inWorkspaceCount={embeddedCounts[row.item.name] ?? 0}
      selectionState={folderSelectionState(row.item.name, row.files)}
      isFileSelected={(id) => isFileSelected(row.item.name, id)}
      {...handlers}
    />
  ));
}
