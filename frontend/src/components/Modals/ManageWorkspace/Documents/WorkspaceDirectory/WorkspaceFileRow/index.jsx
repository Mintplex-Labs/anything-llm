import { memo, useState } from "react";
import {
  formatDate,
  getFileExtension,
  middleTruncate,
} from "@/utils/directories";
import { ArrowUUpLeft, Eye, File, PushPin } from "@phosphor-icons/react";
import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";
import System from "@/models/system";
import TagManager from "../TagManager";

export default function WorkspaceFileRow({
  item,
  folderName,
  workspace,
  setLoading,
  setLoadingMessage,
  fetchKeys,
  hasChanges,
  movedItems,
  selected,
  toggleSelection,
  disableSelection,
  setSelectedItems,
}) {
  const onRemoveClick = async (e) => {
    e.stopPropagation();
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
    setSelectedItems({});
    setLoadingMessage("");
    setLoading(false);
  };

  const handleUpdateTags = async (documentId, tags) => {
    try {
      await Workspace.updateDocumentTags(workspace.slug, documentId, tags);
      await fetchKeys(true);
    } catch (error) {
      console.error("Failed to update document tags:", error);
      showToast("Failed to update document tags", "error");
    }
  };

  function toggleRowSelection(e) {
    if (disableSelection) return;
    e.stopPropagation();
    toggleSelection();
  }

  function handleRowSelection(e) {
    e.stopPropagation();
    toggleSelection();
  }

  const isMovedItem = movedItems?.some((movedItem) => movedItem.id === item.id);

  return (
    <div
      className={`grid grid-cols-12 py-2 px-3.5 border-b border-white/20 hover:bg-theme-sidebar-subitem-hover ${
        isMovedItem ? "bg-theme-sidebar-subitem-hover" : ""
      }`}
      onClick={handleRowSelection}
    >
      <div className="col-span-10 flex items-center gap-x-[4px]">
        {!hasChanges && (
          <div
            className={`shrink-0 w-3 h-3 rounded border-[1px] border-solid border-white text-theme-text-primary light:invert flex justify-center items-center cursor-pointer`}
            role="checkbox"
            aria-checked={selected}
            tabIndex={0}
            onClick={toggleRowSelection}
          >
            {selected && <div className="w-2 h-2 bg-white rounded-[2px]" />}
          </div>
        )}
        <div className="flex items-center gap-x-2">
          <File size={16} className="text-theme-text-primary" />
          <div className="flex flex-col">
            <p className="text-theme-text-primary text-sm">
              {middleTruncate(item.name, 30)}
            </p>
            <div className="flex items-center gap-x-2">
              <span className="text-theme-text-primary text-xs">
                {formatDate(item.createdAt)}
              </span>
              <span className="text-theme-text-primary text-xs">
                {getFileExtension(item.name)}
              </span>
            </div>
          </div>
        </div>
        <div className="ml-4">
          <TagManager document={item} onUpdateTags={handleUpdateTags} />
        </div>
      </div>
      <div className="col-span-2 flex justify-end items-center">
        {hasChanges ? (
          <div className="w-4 h-4 ml-2 flex-shrink-0" />
        ) : (
          <div className="flex gap-x-2 items-center">
            <WatchForChanges
              workspace={workspace}
              docPath={`${folderName}/${item.name}`}
              item={item}
            />
            <PinItemToWorkspace
              workspace={workspace}
              docPath={`${folderName}/${item.name}`}
              item={item}
            />
            <RemoveItemFromWorkspace item={item} onClick={onRemoveClick} />
          </div>
        )}
      </div>
    </div>
  );
}

const PinItemToWorkspace = memo(({ workspace, docPath, item }) => {
  const [pinned, setPinned] = useState(
    item?.pinnedWorkspaces?.includes(workspace.id) || false
  );
  const [hover, setHover] = useState(false);
  const pinEvent = new CustomEvent("pinned_document");

  const updatePinStatus = async (e) => {
    try {
      e.stopPropagation();
      if (!pinned) window.dispatchEvent(pinEvent);
      const success = await Workspace.setPinForDocument(
        workspace.slug,
        docPath,
        !pinned
      );

      if (!success) {
        showToast(`Failed to ${!pinned ? "pin" : "unpin"} document.`, "error", {
          clear: true,
        });
        return;
      }

      showToast(
        `Document ${!pinned ? "pinned to" : "unpinned from"} workspace`,
        "success",
        { clear: true }
      );
      setPinned(!pinned);
    } catch (error) {
      showToast(`Failed to pin document. ${error.message}`, "error", {
        clear: true,
      });
      return;
    }
  };

  if (!item) return <div className="w-[16px] p-[2px] ml-2" />;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={updatePinStatus}
      className="flex items-center ml-2 cursor-pointer"
      data-tooltip-id="pin-document"
      data-tooltip-content={
        pinned ? "Un-pin from workspace" : "Pin to workspace"
      }
    >
      {pinned ? (
        <div
          className={`bg-theme-settings-input-active rounded-3xl whitespace-nowrap ${hover ? "bg-red-500/20" : ""}`}
        >
          <p className={`text-xs px-2 py-0.5 ${hover ? "text-red-500" : ""}`}>
            {hover ? "Un-pin" : "Pinned"}
          </p>
        </div>
      ) : (
        <PushPin
          size={16}
          weight="regular"
          className="outline-none text-base font-bold flex-shrink-0"
        />
      )}
    </div>
  );
});

const WatchForChanges = memo(({ workspace, docPath, item }) => {
  const [watched, setWatched] = useState(item?.watched || false);
  const [hover, setHover] = useState(false);
  const watchEvent = new CustomEvent("watch_document_for_changes");

  const updateWatchStatus = async () => {
    try {
      if (!watched) window.dispatchEvent(watchEvent);
      const success =
        await System.experimentalFeatures.liveSync.setWatchStatusForDocument(
          workspace.slug,
          docPath,
          !watched
        );

      if (!success) {
        showToast(
          `Failed to ${!watched ? "watch" : "unwatch"} document.`,
          "error",
          {
            clear: true,
          }
        );
        return;
      }

      showToast(
        `Document ${
          !watched
            ? "will be watched for changes"
            : "will no longer be watched for changes"
        }.`,
        "success",
        { clear: true }
      );
      setWatched(!watched);
    } catch (error) {
      showToast(`Failed to watch document. ${error.message}`, "error", {
        clear: true,
      });
      return;
    }
  };

  if (!item || !item.canWatch) return <div className="w-[16px] p-[2px] ml-2" />;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex gap-x-2 items-center hover:bg-theme-file-picker-hover p-[2px] rounded ml-2"
    >
      <Eye
        data-tooltip-id="watch-changes"
        data-tooltip-content={
          watched ? "Stop watching for changes" : "Watch document for changes"
        }
        size={16}
        onClick={updateWatchStatus}
        weight={hover || watched ? "fill" : "regular"}
        className="outline-none text-base font-bold flex-shrink-0 cursor-pointer"
      />
    </div>
  );
});

const RemoveItemFromWorkspace = ({ item, onClick }) => {
  return (
    <div>
      <ArrowUUpLeft
        data-tooltip-id="remove-document"
        data-tooltip-content="Remove document from workspace"
        onClick={onClick}
        className="text-base font-bold w-4 h-4 ml-2 flex-shrink-0 cursor-pointer"
      />
    </div>
  );
};
