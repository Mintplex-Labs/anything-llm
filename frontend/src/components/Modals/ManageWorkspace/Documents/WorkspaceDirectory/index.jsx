import PreLoader from "@/components/Preloader";
import WorkspaceFileRow from "./WorkspaceFileRow";
import { memo, useEffect, useState } from "react";
import ModalWrapper from "@/components/ModalWrapper";
import {
  Eye,
  PushPin,
  CheckCircle,
  XCircle,
  CircleNotch,
  Clock,
  X,
} from "@phosphor-icons/react";
import { SEEN_DOC_PIN_ALERT, SEEN_WATCH_ALERT } from "@/utils/constants";
import paths from "@/utils/paths";
import { Link } from "react-router-dom";
import Workspace from "@/models/workspace";
import { Tooltip } from "react-tooltip";
import { safeJsonParse } from "@/utils/request";
import { useTranslation } from "react-i18next";
import { middleTruncate } from "@/utils/directories";
import { useEmbeddingProgress } from "@/EmbeddingProgressContext";

function WorkspaceDirectory({
  workspace,
  files,
  highlightWorkspace,
  loading,
  loadingMessage,
  setLoadingMessage,
  setLoading,
  fetchKeys,
  hasChanges,
  saveChanges,
  movedItems,
}) {
  const { t } = useTranslation();
  const { embeddingProgressMap, removeQueuedFile } = useEmbeddingProgress();
  const embeddingProgress = embeddingProgressMap[workspace.slug] || null;
  const [selectedItems, setSelectedItems] = useState({});
  const embeddedDocCount = (files?.items ?? []).reduce(
    (sum, folder) => sum + (folder.items?.length ?? 0),
    0
  );

  const toggleSelection = (item) => {
    setSelectedItems((prevSelectedItems) => {
      const newSelectedItems = { ...prevSelectedItems };
      if (newSelectedItems[item.id]) {
        delete newSelectedItems[item.id];
      } else {
        newSelectedItems[item.id] = true;
      }
      return newSelectedItems;
    });
  };

  const toggleSelectAll = () => {
    const allItems = files.items.flatMap((folder) => folder.items);
    const allSelected = allItems.every((item) => selectedItems[item.id]);
    if (allSelected) {
      setSelectedItems({});
    } else {
      const newSelectedItems = {};
      allItems.forEach((item) => {
        newSelectedItems[item.id] = true;
      });
      setSelectedItems(newSelectedItems);
    }
  };

  const removeSelectedItems = async () => {
    setLoading(true);
    setLoadingMessage("Removing selected files from workspace");

    const itemsToRemove = Object.keys(selectedItems).map((itemId) => {
      const folder = files.items.find((f) =>
        f.items.some((i) => i.id === itemId)
      );
      const item = folder.items.find((i) => i.id === itemId);
      return `${folder.name}/${item.name}`;
    });

    try {
      await Workspace.modifyEmbeddings(workspace.slug, {
        adds: [],
        deletes: itemsToRemove,
      });
      await fetchKeys(true);
      setSelectedItems({});
    } catch (error) {
      console.error("Failed to remove documents:", error);
    }

    setLoadingMessage("");
    setLoading(false);
  };

  const handleSaveChanges = (e) => {
    setSelectedItems({});
    saveChanges(e);
  };

  if (loading) {
    return (
      <div className="px-8">
        <div className="flex items-center justify-start w-[560px]">
          <h3 className="text-white text-base font-bold ml-5">
            {workspace.name}
          </h3>
        </div>
        <div className="relative w-[560px] h-[445px] bg-theme-settings-input-bg rounded-2xl mt-5 border border-theme-modal-border">
          <div className="w-full h-[calc(100%-40px)] flex items-center justify-center flex-col gap-y-5">
            <PreLoader />
            <p className="text-theme-text-primary text-sm font-semibold animate-pulse text-center w-1/3">
              {loadingMessage}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (embeddingProgress) {
    return (
      <div className="px-8">
        <div className="flex items-center justify-start w-[560px]">
          <h3 className="text-white text-base font-bold ml-5">
            {workspace.name}
          </h3>
        </div>
        <div className="relative w-[560px] h-[445px] bg-theme-settings-input-bg rounded-2xl mt-5 border border-theme-modal-border">
          <div className="text-white/80 text-xs grid grid-cols-12 py-2 px-3.5 border-b border-white/20 light:border-theme-modal-border bg-theme-settings-input-bg sticky top-0 z-10 rounded-t-2xl">
            <div className="col-span-8 flex items-center gap-x-[4px]">
              <div className="shrink-0 w-3 h-3" />
              <p className="ml-[7px] text-theme-text-primary">Name</p>
            </div>
            <p className="col-span-4 text-right text-theme-text-primary pr-1">
              Status
            </p>
          </div>
          <div className="overflow-y-auto h-[calc(100%-40px)]">
            {Object.entries(embeddingProgress).map(([filename, fileStatus]) => (
              <EmbeddingFileRow
                key={filename}
                filename={filename}
                status={fileStatus}
                onRemove={
                  fileStatus.status === "pending"
                    ? () => removeQueuedFile(workspace.slug, filename)
                    : null
                }
              />
            ))}
          </div>
        </div>
        {hasChanges && movedItems.length > 0 && (
          <div className="flex items-center justify-between w-[560px] mt-3">
            <p className="text-theme-text-secondary text-sm">
              {movedItems.length} additional file(s) ready to embed
            </p>
            <button
              onClick={handleSaveChanges}
              className="border border-slate-200 px-5 py-1.5 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
            >
              Add to queue
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="px-8">
        <div className="flex items-center justify-start w-[560px]">
          <h3 className="text-white text-base font-bold ml-5">
            {workspace.name}
          </h3>
        </div>
        <div className="relative w-[560px] h-[445px] mt-5">
          <div
            className={`absolute inset-0 rounded-2xl  ${
              highlightWorkspace ? "border-4 border-cyan-300/80 z-[999]" : ""
            }`}
          />
          <div className="relative w-full h-full bg-theme-settings-input-bg rounded-2xl overflow-hidden border border-theme-modal-border">
            <div className="text-white/80 text-xs grid grid-cols-12 py-2 px-3.5 border-b border-white/20 light:border-theme-modal-border bg-theme-settings-input-bg sticky top-0 z-10">
              <div className="col-span-10 flex items-center gap-x-[4px]">
                {!hasChanges &&
                files.items.some((folder) => folder.items.length > 0) ? (
                  <div
                    className={`shrink-0 w-3 h-3 rounded border-[1px] border-solid border-white text-theme-text-primary light:invert flex justify-center items-center cursor-pointer`}
                    role="checkbox"
                    aria-checked={
                      Object.keys(selectedItems).length ===
                      files.items.reduce(
                        (sum, folder) => sum + folder.items.length,
                        0
                      )
                    }
                    tabIndex={0}
                    onClick={toggleSelectAll}
                  >
                    {Object.keys(selectedItems).length ===
                      files.items.reduce(
                        (sum, folder) => sum + folder.items.length,
                        0
                      ) && <div className="w-2 h-2 bg-white rounded-[2px]" />}
                  </div>
                ) : (
                  <div className="shrink-0 w-3 h-3" />
                )}
                <p className="ml-[7px] text-theme-text-primary">Name</p>
              </div>
              {embeddedDocCount > 0 && (
                <p className="col-span-2 text-right text-theme-text-secondary pr-2">
                  {t(`connectors.directory.total-documents`, {
                    count: embeddedDocCount,
                  })}
                </p>
              )}
            </div>
            <div className="overflow-y-auto h-[calc(100%-40px)]">
              {files.items.some((folder) => folder.items.length > 0) ||
              movedItems.length > 0 ? (
                <RenderFileRows
                  files={files}
                  movedItems={movedItems}
                  workspace={workspace}
                >
                  {({ item, folder }) => (
                    <WorkspaceFileRow
                      key={item.id}
                      item={item}
                      folderName={folder.name}
                      workspace={workspace}
                      setLoading={setLoading}
                      setLoadingMessage={setLoadingMessage}
                      fetchKeys={fetchKeys}
                      hasChanges={hasChanges}
                      movedItems={movedItems}
                      selected={selectedItems[item.id]}
                      toggleSelection={() => toggleSelection(item)}
                      disableSelection={hasChanges}
                      setSelectedItems={setSelectedItems}
                    />
                  )}
                </RenderFileRows>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-white text-opacity-40 text-sm font-medium">
                    {t("connectors.directory.no_docs")}
                  </p>
                </div>
              )}
            </div>

            {Object.keys(selectedItems).length > 0 && !hasChanges && (
              <div className="absolute bottom-[12px] left-0 right-0 flex justify-center pointer-events-none">
                <div className="mx-auto bg-white/40 light:bg-white rounded-lg py-1 px-2 pointer-events-auto light:shadow-lg">
                  <div className="flex flex-row items-center gap-x-2">
                    <button
                      onClick={toggleSelectAll}
                      className="border-none text-sm font-semibold bg-white light:bg-[#E0F2FE] h-[30px] px-2.5 rounded-lg hover:bg-neutral-800/80 hover:text-white light:text-[#026AA2] light:hover:bg-[#026AA2] light:hover:text-white"
                    >
                      {Object.keys(selectedItems).length ===
                      files.items.reduce(
                        (sum, folder) => sum + folder.items.length,
                        0
                      )
                        ? t("connectors.directory.deselect_all")
                        : t("connectors.directory.select_all")}
                    </button>
                    <button
                      onClick={removeSelectedItems}
                      className="border-none text-sm font-semibold bg-white light:bg-[#E0F2FE] h-[30px] px-2.5 rounded-lg hover:bg-neutral-800/80 hover:text-white light:text-[#026AA2] light:hover:bg-[#026AA2] light:hover:text-white"
                    >
                      {t("connectors.directory.remove_selected")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {hasChanges && (
          <div className="flex items-center justify-end py-6">
            <button
              onClick={(e) => handleSaveChanges(e)}
              className="border border-slate-200 px-5 py-2.5 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
            >
              {t("connectors.directory.save_embed")}
            </button>
          </div>
        )}
      </div>
      <PinAlert />
      <DocumentWatchAlert />
      <WorkspaceDocumentTooltips />
    </>
  );
}

const PinAlert = memo(() => {
  const { t } = useTranslation();
  const [showAlert, setShowAlert] = useState(false);
  function dismissAlert() {
    setShowAlert(false);
    window.localStorage.setItem(SEEN_DOC_PIN_ALERT, "1");
    window.removeEventListener(handlePinEvent);
  }

  function handlePinEvent() {
    if (!!window?.localStorage?.getItem(SEEN_DOC_PIN_ALERT)) return;
    setShowAlert(true);
  }

  useEffect(() => {
    if (!window || !!window?.localStorage?.getItem(SEEN_DOC_PIN_ALERT)) return;
    window?.addEventListener("pinned_document", handlePinEvent);
  }, []);

  return (
    <ModalWrapper isOpen={showAlert} noPortal={true}>
      <div className="w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border overflow-hidden">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="flex items-center gap-2">
            <PushPin
              className="text-theme-text-primary text-lg w-6 h-6"
              weight="regular"
            />
            <h3 className="text-xl font-semibold text-white">
              {t("connectors.pinning.what_pinning")}
            </h3>
          </div>
        </div>
        <div className="py-7 px-9 space-y-2 flex-col">
          <div className="w-full text-white text-md flex flex-col gap-y-2">
            <p>
              <span
                dangerouslySetInnerHTML={{
                  __html: t("connectors.pinning.pin_explained_block1"),
                }}
              />
            </p>
            <p>
              <span
                dangerouslySetInnerHTML={{
                  __html: t("connectors.pinning.pin_explained_block2"),
                }}
              />
            </p>
            <p>{t("connectors.pinning.pin_explained_block3")}</p>
          </div>
        </div>
        <div className="flex w-full justify-end items-center p-6 space-x-2 border-t border-theme-modal-border rounded-b">
          <button
            onClick={dismissAlert}
            className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm"
          >
            {t("connectors.pinning.accept")}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
});

const DocumentWatchAlert = memo(() => {
  const { t } = useTranslation();
  const [showAlert, setShowAlert] = useState(false);
  function dismissAlert() {
    setShowAlert(false);
    window.localStorage.setItem(SEEN_WATCH_ALERT, "1");
    window.removeEventListener(handlePinEvent);
  }

  function handlePinEvent() {
    if (!!window?.localStorage?.getItem(SEEN_WATCH_ALERT)) return;
    setShowAlert(true);
  }

  useEffect(() => {
    if (!window || !!window?.localStorage?.getItem(SEEN_WATCH_ALERT)) return;
    window?.addEventListener("watch_document_for_changes", handlePinEvent);
  }, []);

  return (
    <ModalWrapper isOpen={showAlert} noPortal={true}>
      <div className="w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border overflow-hidden">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="flex items-center gap-2">
            <Eye
              className="text-theme-text-primary text-lg w-6 h-6"
              weight="regular"
            />
            <h3 className="text-xl font-semibold text-white">
              {t("connectors.watching.what_watching")}
            </h3>
          </div>
        </div>
        <div className="py-7 px-9 space-y-2 flex-col">
          <div className="w-full text-white text-md flex flex-col gap-y-2">
            <p>
              <span
                dangerouslySetInnerHTML={{
                  __html: t("connectors.watching.watch_explained_block1"),
                }}
              />
            </p>
            <p>{t("connectors.watching.watch_explained_block2")}</p>
            <p>
              {t("connectors.watching.watch_explained_block3_start")}
              <Link
                to={paths.experimental.liveDocumentSync.manage()}
                className="text-blue-600 underline"
              >
                {t("connectors.watching.watch_explained_block3_link")}
              </Link>
              {t("connectors.watching.watch_explained_block3_end")}
            </p>
          </div>
        </div>
        <div className="flex w-full justify-end items-center p-6 space-x-2 border-t border-theme-modal-border rounded-b">
          <button
            onClick={dismissAlert}
            className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm"
          >
            {t("connectors.watching.accept")}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
});

function RenderFileRows({ files, movedItems, children, workspace }) {
  function sortMovedItemsAndFiles(a, b) {
    const aIsMovedItem = movedItems.some((movedItem) => movedItem.id === a.id);
    const bIsMovedItem = movedItems.some((movedItem) => movedItem.id === b.id);
    if (aIsMovedItem && !bIsMovedItem) return -1;
    if (!aIsMovedItem && bIsMovedItem) return 1;

    // Sort pinned items to the top
    const aIsPinned = a.pinnedWorkspaces?.includes(workspace.id);
    const bIsPinned = b.pinnedWorkspaces?.includes(workspace.id);
    if (aIsPinned && !bIsPinned) return -1;
    if (!aIsPinned && bIsPinned) return 1;

    return 0;
  }

  return files.items
    .flatMap((folder) => folder.items)
    .sort(sortMovedItemsAndFiles)
    .map((item) => {
      const folder = files.items.find((f) => f.items.includes(item));
      return children({ item, folder });
    });
}

/**
 * Tooltips for the workspace directory components. Renders when the workspace directory is shown
 * or updated so that tooltips are attached as the items are changed.
 */
function WorkspaceDocumentTooltips() {
  return (
    <>
      <Tooltip
        id="ws-directory-item"
        place="bottom"
        delayShow={800}
        className="tooltip invert light:invert-0 z-99 max-w-[200px]"
        render={({ content }) => {
          const data = safeJsonParse(content, null);
          if (!data) return null;
          return (
            <div className="text-xs">
              <p className="text-white light:invert font-medium break-all">
                {data.title}
              </p>
              <div className="flex mt-1 gap-x-2">
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
      <Tooltip
        id="watch-changes"
        place="bottom"
        delayShow={300}
        className="tooltip invert !text-xs"
      />
      <Tooltip
        id="pin-document"
        place="bottom"
        delayShow={300}
        className="tooltip invert !text-xs"
      />
      <Tooltip
        id="remove-document"
        place="bottom"
        delayShow={300}
        className="tooltip invert !text-xs"
      />
    </>
  );
}

/**
 * @param {string} filename
 */
const getDisplayName = (filename) => {
  const base = filename.split("/").pop() || filename;
  return base.replace(
    /-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.json$/,
    ""
  );
};

const STATUS_STYLES = {
  pending: {
    icon: (
      <Clock
        size={16}
        className="text-slate-100 light:text-slate-900/40 shrink-0"
        weight="regular"
      />
    ),
    textColor: "text-slate-100 light:text-slate-900/70",
    label: "Queued",
  },
  embedding: {
    icon: (
      <CircleNotch
        size={16}
        className="text-slate-100 light:text-slate-900/40 animate-spin shrink-0"
        weight="bold"
      />
    ),
    textColor: "text-slate-100 light:text-slate-900/70",
    label: "Embedding",
  },
  complete: {
    icon: (
      <CheckCircle
        size={16}
        className="text-green-400 light:text-green-600 shrink-0"
        weight="fill"
      />
    ),
    textColor: "text-green-400 light:text-green-600",
    label: "Complete",
  },
  failed: {
    icon: (
      <XCircle
        size={16}
        className="text-red-400 light:text-red-600 shrink-0"
        weight="fill"
      />
    ),
    textColor: "text-red-400 light:text-red-600",
    label: "Failed",
  },
};

function EmbeddingFileRow({ filename, status: fileStatus, onRemove }) {
  const { status, chunksProcessed = 0, totalChunks = 0 } = fileStatus;
  const displayName = getDisplayName(filename);
  const isEmbedding = status === "embedding";
  const pct =
    isEmbedding && totalChunks > 0
      ? Math.round((chunksProcessed / totalChunks) * 100)
      : 0;

  return (
    <div className="text-slate-100 light:text-slate-900 text-xs grid grid-cols-12 py-2 pl-3.5 pr-3.5 h-[34px] items-center border-b border-white/5">
      <div className="col-span-7 flex items-center gap-x-2 overflow-hidden">
        {STATUS_STYLES[status]?.icon || STATUS_STYLES.pending.icon}
        <p
          className={`whitespace-nowrap overflow-hidden text-ellipsis ${
            status === "failed" ? "text-red-400" : ""
          }`}
          title={displayName}
        >
          {middleTruncate(displayName, 40)}
        </p>
      </div>
      <div className="col-span-5 flex justify-end items-center gap-x-2">
        {isEmbedding ? (
          <div className="flex items-center gap-x-2 w-full justify-end">
            <div className="w-20 h-[1.5px] bg-white/10 light:bg-sky-900/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-white light:bg-sky-400 rounded-full transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs whitespace-nowrap w-8 text-right">{pct}%</p>
          </div>
        ) : (
          <div className="flex items-center gap-x-2">
            <p
              className={`text-xs italic whitespace-nowrap flex gap-2 justify-center items-center ${STATUS_STYLES[status]?.textColor}`}
            >
              {STATUS_STYLES[status]?.label || "Queued"}
            </p>
            {onRemove && (
              <button
                onClick={onRemove}
                className="border-none hover:bg-white/10 light:hover:bg-sky-900/10 rounded p-0.5 transition-colors"
                title="Remove from queue"
              >
                <X
                  size={14}
                  className="text-slate-100 light:text-slate-900/40 hover:text-slate-100 light:hover:text-slate-900"
                />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(WorkspaceDirectory);
