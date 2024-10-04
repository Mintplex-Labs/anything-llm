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
import { Tooltip } from "react-tooltip";

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
      className={`items-center h-[34px] text-white/80 text-xs grid grid-cols-12 py-2 pl-3.5 pr-8 ${
        !disableSelection ? "hover:bg-sky-500/20 cursor-pointer" : ""
      } ${isMovedItem ? "bg-green-800/40" : "file-row"} ${selected ? "selected" : ""}`}
      onClick={toggleRowSelection}
    >
      <div
        className="col-span-10 w-fit flex gap-x-[2px] items-center relative"
        data-tooltip-id={`ws-directory-item-${item.url}`}
      >
        <div className="shrink-0 w-3 h-3">
          {!disableSelection ? (
            <div
              className="w-full h-full rounded border-[1px] border-white flex justify-center items-center cursor-pointer"
              role="checkbox"
              aria-checked={selected}
              tabIndex={0}
              onClick={handleRowSelection}
            >
              {selected && <div className="w-2 h-2 bg-white rounded-[2px]" />}
            </div>
          ) : null}
        </div>
        <File
          className="shrink-0 text-base font-bold w-4 h-4 mr-[3px] ml-1"
          weight="fill"
        />
        <p className="whitespace-nowrap overflow-hidden text-ellipsis">
          {middleTruncate(item.title, 50)}
        </p>
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
      <Tooltip
        id={`ws-directory-item-${item.url}`}
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
      className="flex gap-x-2 items-center hover:bg-main-gradient p-[2px] rounded ml-2"
    >
      <PushPin
        data-tooltip-id={`pin-${item.id}`}
        data-tooltip-content={
          pinned ? "Un-Pin from workspace" : "Pin to workspace"
        }
        size={16}
        onClick={updatePinStatus}
        weight={hover || pinned ? "fill" : "regular"}
        className="outline-none text-base font-bold flex-shrink-0 cursor-pointer"
      />
      <Tooltip
        id={`pin-${item.id}`}
        place="bottom"
        delayShow={300}
        className="tooltip invert !text-xs"
      />
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
      className="flex gap-x-2 items-center hover:bg-main-gradient p-[2px] rounded ml-2"
    >
      <Eye
        data-tooltip-id={`watch-changes-${item.id}`}
        data-tooltip-content={
          watched ? "Stop watching for changes" : "Watch document for changes"
        }
        size={16}
        onClick={updateWatchStatus}
        weight={hover || watched ? "fill" : "regular"}
        className="outline-none text-base font-bold flex-shrink-0 cursor-pointer"
      />
      <Tooltip
        id={`watch-changes-${item.id}`}
        place="bottom"
        delayShow={300}
        className="tooltip invert !text-xs"
      />
    </div>
  );
});

const RemoveItemFromWorkspace = ({ item, onClick }) => {
  return (
    <div>
      <ArrowUUpLeft
        data-tooltip-id={`remove-${item.id}`}
        data-tooltip-content="Remove document from workspace"
        onClick={onClick}
        className="text-base font-bold w-4 h-4 ml-2 flex-shrink-0 cursor-pointer"
      />
      <Tooltip
        id={`remove-${item.id}`}
        place="bottom"
        delayShow={300}
        className="tooltip invert !text-xs"
      />
    </div>
  );
};
