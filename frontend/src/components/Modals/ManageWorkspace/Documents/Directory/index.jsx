import UploadFile from "../UploadFile";
import PreLoader from "@/components/Preloader";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import FolderRow from "./FolderRow";
import System from "@/models/system";
import {
  CircleNotch,
  MagnifyingGlass,
  Plus,
  Trash,
} from "@phosphor-icons/react";
import Document from "@/models/document";
import showToast from "@/utils/toast";
import FolderSelectionPopup from "./FolderSelectionPopup";
import MoveToFolderIcon from "./MoveToFolderIcon";
import { useModal } from "@/hooks/useModal";
import NewFolderModal from "./NewFolderModal";
import debounce from "lodash.debounce";
import ContextMenu from "./ContextMenu";
import { Tooltip } from "react-tooltip";
import { safeJsonParse } from "@/utils/request";
import useUploadQueue from "../hooks/useUploadQueue";
import { getFilesFromUploadEvent } from "@/utils/folderUpload";

const NO_FILES = [];

export default function Directory({
  picker,
  workspace,
  hiddenPaths,
  setHighlightWorkspace,
  moveToWorkspace,
}) {
  const { t } = useTranslation();
  const [showFolderSelection, setShowFolderSelection] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const {
    isOpen: isFolderModalOpen,
    openModal: openFolderModal,
    closeModal: closeFolderModal,
  } = useModal();

  const {
    status,
    busyMessage,
    folders,
    contents,
    expanded,
    searchResults,
    searching,
    hasSelection,
    selectedFolderNames,
    isFileSelected,
    folderSelectionState,
    refresh,
    search,
    syncAfterUpload,
    toggleExpanded,
    prefetchFolder,
    loadMore,
    toggleFile,
    toggleFolder,
    selectAll,
    clearSelection,
    resolveSelection,
    removeFiles,
    addFolder,
    setBusy,
  } = picker;

  /**
   * One flattened view model per visible folder. Search replaces the folder
   * list with the backend's matches (always open); otherwise rows are driven
   * by the lazily-fetched pages held in the picker.
   */
  const rows = useMemo(() => {
    const hide = (folderName, files) =>
      hiddenPaths?.size
        ? files.filter((f) => !hiddenPaths.has(`${folderName}/${f.name}`))
        : files;

    if (searchResults) {
      return searchResults.map((folder) => {
        const files = hide(folder.name, folder.items ?? []);
        return {
          item: folder,
          files,
          expanded: true,
          loading: false,
          hasMore: false,
          totalCount: files.length,
          // The badge counts matches, not the folder's size - showing "(200)"
          // next to three visible rows reads as a bug.
          displayCount: files.length,
        };
      });
    }

    return folders.map((folder) => {
      const entry = contents[folder.name];
      const files = entry ? hide(folder.name, entry.items) : NO_FILES;
      const hasMore = entry?.hasMore ?? false;
      // totalCount is the server's raw count and drives "Load more (x of y)".
      const totalCount = entry?.totalCount ?? folder.fileCount ?? 0;
      return {
        item: folder,
        files,
        expanded: expanded.has(folder.name),
        loading: entry?.status === "loading",
        hasMore,
        totalCount,
        // Once a folder is fully fetched we know exactly how many rows it can
        // show - embedded files are filtered out of the page, so a folder with
        // everything embedded must read as empty rather than still claiming
        // its on-disk count.
        displayCount:
          entry?.status === "loaded" && !hasMore ? files.length : totalCount,
      };
    });
  }, [folders, contents, expanded, searchResults, hiddenPaths]);

  const totalDocCount = useMemo(
    () => folders.reduce((acc, folder) => acc + (folder.fileCount ?? 0), 0),
    [folders]
  );

  // While searching, the library-wide total is misleading next to a filtered
  // list, so the header reports how many matches are on screen instead.
  const searchResultCount = useMemo(
    () =>
      searchResults ? rows.reduce((acc, row) => acc + row.files.length, 0) : 0,
    [searchResults, rows]
  );

  /* --------------------------------- search -------------------------------- */

  const handleSearch = useMemo(
    () => debounce((event) => search(event.target.value), 400),
    [search]
  );
  useEffect(() => () => handleSearch.cancel(), [handleSearch]);

  /* -------------------------------- mutations ------------------------------ */

  const deleteFiles = async (event) => {
    event.stopPropagation();
    if (!window.confirm(t("connectors.directory.delete-confirmation"))) return;

    const selected = await resolveSelection();
    const toRemove = selected.map((file) => `${file.folderName}/${file.name}`);
    const foldersToRemove = selectedFolderNames.filter(
      (name) => name !== "custom-documents"
    );

    setBusy(
      t("connectors.directory.removing-message", {
        count: toRemove.length,
        folderCount: foldersToRemove.length,
      })
    );
    try {
      if (toRemove.length > 0) await System.deleteDocuments(toRemove);
      for (const folderName of foldersToRemove)
        await System.deleteFolder(folderName);
      removeFiles(selected.map((file) => file.id));
      clearSelection();
      await refresh();
    } catch (error) {
      console.error("Failed to delete files and folders:", error);
      showToast(`Failed to delete: ${error.message}`, "error");
    } finally {
      setBusy(null);
    }
  };

  const moveToFolder = async (folder) => {
    setShowFolderSelection(false);
    const toMove = await resolveSelection();
    if (toMove.length === 0) return;

    setBusy(`Moving ${toMove.length} documents. Please wait.`);
    const { success, message } = await Document.moveToFolder(
      toMove,
      folder.name
    );
    if (!success) {
      showToast(`Error moving files: ${message}`, "error");
      setBusy(null);
      return;
    }

    // A partial success returns a message explaining which files were skipped.
    if (message) showToast(message, "info");
    else
      showToast(
        t("connectors.directory.move-success", { count: toMove.length }),
        "success"
      );

    clearSelection();
    await refresh();
    setBusy(null);
  };

  /**
   * Dropping files onto a folder row uploads them straight into that folder,
   * so the user does not have to upload and then move. Progress is reported
   * in the shared uploader below the picker.
   */
  const uploadQueue = useUploadQueue();
  const { enqueueIntoFolder } = uploadQueue;
  const handleFolderDrop = useCallback(
    async (folderName, event) => {
      // Must be called before anything awaits: a drop's DataTransferItems are
      // only readable while the drop event is being dispatched.
      const dropped = await getFilesFromUploadEvent(event.nativeEvent ?? event);
      const { queued, skipped } = enqueueIntoFolder(dropped, folderName);

      if (queued === 0)
        return showToast(
          skipped > 0
            ? `Drop files onto ${folderName}, not folders - a folder can only be dropped on the uploader below.`
            : "Nothing in that drop could be uploaded.",
          "warning"
        );

      // The progress list lives in the uploader below the picker, which may be
      // scrolled out of view - confirm the drop landed so it does not look
      // like nothing happened.
      showToast(`Uploading ${queued} file(s) to ${folderName}`, "info");
      if (skipped > 0)
        showToast(
          `${skipped} file(s) inside folders were skipped - drop a folder on the uploader below to add it as its own folder.`,
          "warning"
        );
    },
    [enqueueIntoFolder]
  );

  const handleFolderCreated = useCallback(
    (name) => {
      addFolder(name);
      closeFolderModal();
    },
    [addFolder, closeFolderModal]
  );

  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu({ visible: true, x: event.clientX, y: event.clientY });
  };
  const closeContextMenu = useCallback(
    () => setContextMenu({ visible: false, x: 0, y: 0 }),
    []
  );

  return (
    <>
      <div className="px-8 pb-8" onContextMenu={handleContextMenu}>
        <div className="flex flex-col gap-y-6">
          <div className="flex items-center justify-between w-[560px] px-5 relative">
            <h3 className="text-white text-base font-bold">
              {t("connectors.directory.my-documents")}
            </h3>
            <div className="relative">
              <input
                type="search"
                placeholder={t("connectors.directory.search-document")}
                onChange={handleSearch}
                className="border-none search-input bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder focus:outline-primary-button active:outline-primary-button outline-none text-sm rounded-lg pl-9 pr-2.5 py-2 w-[250px] h-[32px] light:border-theme-modal-border light:border"
              />
              {searching ? (
                <CircleNotch
                  size={14}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white animate-spin"
                  weight="bold"
                />
              ) : (
                <MagnifyingGlass
                  size={14}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
                  weight="bold"
                />
              )}
            </div>
            <button
              className="border-none flex items-center gap-x-2 cursor-pointer px-[14px] py-[7px] -mr-[14px] rounded-lg hover:bg-theme-sidebar-subitem-hover z-20 relative"
              onClick={openFolderModal}
            >
              <Plus
                size={18}
                weight="bold"
                className="text-theme-text-primary light:text-[#0ba5ec]"
              />
              <div className="text-theme-text-primary light:text-[#0ba5ec] text-xs font-bold leading-[18px]">
                {t("connectors.directory.new-folder")}
              </div>
            </button>
          </div>

          <div className="relative w-[560px] h-[310px] bg-theme-settings-input-bg rounded-2xl overflow-hidden border border-theme-modal-border">
            <div className="absolute top-0 left-0 right-0 z-10 rounded-t-2xl text-theme-text-primary text-xs grid grid-cols-12 py-2 px-8 border-b border-white/20 light:border-theme-modal-border bg-theme-settings-input-bg">
              <p className="col-span-6">Name</p>
              {searchResults ? (
                <p className="col-span-6 text-right text-theme-text-secondary">
                  {t(`connectors.directory.search-results`, {
                    count: searchResultCount,
                  })}
                </p>
              ) : (
                totalDocCount > 0 && (
                  <p className="col-span-6 text-right text-theme-text-secondary">
                    {t(`connectors.directory.total-documents`, {
                      count: totalDocCount,
                    })}
                  </p>
                )
              )}
            </div>

            <div className="overflow-y-auto h-full pt-8">
              {status === "initializing" ? (
                <div className="w-full h-full flex items-center justify-center flex-col gap-y-5">
                  <PreLoader />
                </div>
              ) : rows.length > 0 ? (
                rows.map((row) => (
                  <FolderRow
                    key={row.item.name}
                    item={row.item}
                    files={row.files}
                    expanded={row.expanded}
                    loading={row.loading}
                    hasMore={row.hasMore}
                    totalCount={row.totalCount}
                    displayCount={row.displayCount}
                    selectionState={folderSelectionState(
                      row.item.name,
                      row.files
                    )}
                    isFileSelected={(id) => isFileSelected(row.item.name, id)}
                    onToggleExpanded={toggleExpanded}
                    onToggleFolder={(folder) => toggleFolder(folder, row.files)}
                    onToggleFile={toggleFile}
                    onPrefetch={prefetchFolder}
                    onLoadMore={loadMore}
                    acceptsDrops={uploadQueue.ready}
                    onDropFiles={handleFolderDrop}
                  />
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-white text-opacity-40 text-sm font-medium">
                    {t("connectors.directory.no-documents")}
                  </p>
                </div>
              )}
            </div>

            {/* Non-blocking status strip - mutations never blank the tree. */}
            {!!busyMessage && (
              <div className="absolute top-8 left-0 right-0 z-20 flex items-center justify-center gap-x-2 bg-theme-bg-secondary/95 border-b border-theme-modal-border py-1.5">
                <CircleNotch size={12} className="animate-spin" weight="bold" />
                <p className="text-theme-text-primary text-xs font-medium">
                  {busyMessage}
                </p>
              </div>
            )}

            {hasSelection && (
              <div className="absolute bottom-[12px] left-0 right-0 flex justify-center pointer-events-none">
                <div className="mx-auto bg-white/40 light:bg-white rounded-lg py-1 px-2 pointer-events-auto light:shadow-lg">
                  <div className="flex flex-row items-center gap-x-2">
                    <button
                      onClick={moveToWorkspace}
                      onMouseEnter={() => setHighlightWorkspace(true)}
                      onMouseLeave={() => setHighlightWorkspace(false)}
                      className="border-none text-sm font-semibold bg-white light:bg-[#E0F2FE] h-[30px] px-2.5 rounded-lg hover:bg-neutral-800/80 hover:text-white light:text-[#026AA2] light:hover:bg-[#026AA2] light:hover:text-white"
                    >
                      {t("connectors.directory.move-workspace")}
                    </button>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowFolderSelection(!showFolderSelection)
                        }
                        className="border-none text-sm font-semibold bg-white light:bg-[#E0F2FE] h-[32px] w-[32px] rounded-lg text-dark-text hover:bg-neutral-800/80 hover:text-white light:text-[#026AA2] light:hover:bg-[#026AA2] light:hover:text-white flex justify-center items-center group"
                      >
                        <MoveToFolderIcon className="text-dark-text light:text-[#026AA2] group-hover:text-white" />
                      </button>
                      {showFolderSelection && (
                        <FolderSelectionPopup
                          folders={folders}
                          onSelect={moveToFolder}
                          onClose={() => setShowFolderSelection(false)}
                        />
                      )}
                    </div>
                    <button
                      onClick={deleteFiles}
                      className="border-none text-sm font-semibold bg-white light:bg-[#E0F2FE] h-[32px] w-[32px] rounded-lg text-dark-text hover:bg-neutral-800/80 hover:text-white light:text-[#026AA2] light:hover:bg-[#026AA2] light:hover:text-white flex justify-center items-center"
                    >
                      <Trash size={18} weight="bold" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <UploadFile
            workspace={workspace}
            queue={uploadQueue}
            onUploadComplete={syncAfterUpload}
            onLinkScraped={syncAfterUpload}
          />
        </div>
        {isFolderModalOpen && (
          <div className="bg-black/60 backdrop-blur-sm fixed top-0 left-0 outline-none w-screen h-screen flex items-center justify-center z-30">
            <NewFolderModal
              closeModal={closeFolderModal}
              onCreated={handleFolderCreated}
            />
          </div>
        )}
        <ContextMenu
          contextMenu={contextMenu}
          closeContextMenu={closeContextMenu}
          allSelected={
            hasSelection && selectedFolderNames.length === folders.length
          }
          onSelectAll={selectAll}
          onClearSelection={clearSelection}
        />
      </div>
      <DirectoryTooltips />
    </>
  );
}

/**
 * Tooltips for the directory components. Renders when the directory is shown
 * or updated so that tooltips are attached as the items are changed.
 */
function DirectoryTooltips() {
  return (
    <Tooltip
      id="directory-item"
      place="bottom"
      delayShow={800}
      className="tooltip invert light:invert-0 z-99 max-w-[300px]"
      render={({ content }) => {
        const data = safeJsonParse(content, null);
        if (!data) return null;
        return (
          <div className="text-xs">
            <p className="text-white light:invert font-medium break-all">
              {data.title}
            </p>
            <div className="flex flex-col mt-1">
              <p className="">
                Date: <b>{data.date}</b>
              </p>
              <p className="">
                Type: <b>{data.extension}</b>
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
