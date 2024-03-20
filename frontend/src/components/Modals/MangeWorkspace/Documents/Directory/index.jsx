import UploadFile from "../UploadFile";
import PreLoader from "@/components/Preloader";
import { memo, useEffect, useState } from "react";
import FolderRow from "./FolderRow";
import System from "@/models/system";
import { Plus, Trash } from "@phosphor-icons/react";
import Document from "@/models/document";
import showToast from "@/utils/toast";
import FolderSelectionPopup from "./FolderSelectionPopup";

function Directory({
  files,
  setFiles,
  loading,
  setLoading,
  workspace,
  fetchKeys,
  selectedItems,
  setSelectedItems,
  setHighlightWorkspace,
  moveToWorkspace,
  setLoadingMessage,
  loadingMessage,
}) {
  const [amountSelected, setAmountSelected] = useState(0);
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [showFolderSelection, setShowFolderSelection] = useState(false);

  useEffect(() => {
    setAmountSelected(Object.keys(selectedItems).length);
  }, [selectedItems]);

  const deleteFiles = async (event) => {
    event.stopPropagation();
    if (
      !window.confirm(
        "Are you sure you want to delete these files and folders?\nThis will remove the files from the system and remove them from any existing workspaces automatically.\nThis action is not reversible."
      )
    ) {
      return false;
    }

    try {
      const toRemove = [];
      const foldersToRemove = [];

      for (const itemId of Object.keys(selectedItems)) {
        for (const folder of files.items) {
          const foundItem = folder.items.find((file) => file.id === itemId);
          if (foundItem) {
            toRemove.push(`${folder.name}/${foundItem.name}`);
            break;
          }
        }
      }
      for (const folder of files.items) {
        if (folder.name === "custom-documents") {
          continue;
        }

        if (isSelected(folder.id, folder)) {
          foldersToRemove.push(folder.name);
        }
      }

      setLoading(true);
      setLoadingMessage(
        `Removing ${toRemove.length} documents and ${foldersToRemove.length} folders. Please wait.`
      );
      await System.deleteDocuments(toRemove);
      for (const folderName of foldersToRemove) {
        await System.deleteFolder(folderName);
      }

      await fetchKeys(true);
      setSelectedItems({});
    } catch (error) {
      console.error("Failed to delete files and folders:", error);
    } finally {
      setLoading(false);
      setSelectedItems({});
    }
  };

  const toggleSelection = (item) => {
    setSelectedItems((prevSelectedItems) => {
      const newSelectedItems = { ...prevSelectedItems };

      if (item.type === "folder") {
        if (newSelectedItems[item.name]) {
          delete newSelectedItems[item.name];
          item.items.forEach((file) => delete newSelectedItems[file.id]);
        } else {
          newSelectedItems[item.name] = true;
          item.items.forEach((file) => (newSelectedItems[file.id] = true));
        }
      } else {
        if (newSelectedItems[item.id]) {
          delete newSelectedItems[item.id];
        } else {
          newSelectedItems[item.id] = true;
        }
      }

      return newSelectedItems;
    });
  };

  const isFolderCompletelySelected = (folder) => {
    if (!selectedItems[folder.name]) {
      return false;
    }
    return folder.items.every((file) => selectedItems[file.id]);
  };

  const isSelected = (id, item) => {
    if (item && item.type === "folder") {
      return isFolderCompletelySelected(item);
    }

    return !!selectedItems[id];
  };

  const createNewFolder = () => {
    setShowNewFolderInput(true);
  };

  const confirmNewFolder = async () => {
    if (newFolderName.trim() !== "") {
      const newFolder = {
        name: newFolderName,
        type: "folder",
        items: [],
      };

      // If folder failed to create - silently fail.
      const { success } = await Document.createFolder(newFolderName);
      if (success) {
        setFiles({
          ...files,
          items: [...files.items, newFolder],
        });
      }

      setNewFolderName("");
      setShowNewFolderInput(false);
    }
  };

  const moveToFolder = async (folder) => {
    const toMove = [];
    for (const itemId of Object.keys(selectedItems)) {
      for (const currentFolder of files.items) {
        const foundItem = currentFolder.items.find(
          (file) => file.id === itemId
        );
        if (foundItem) {
          toMove.push({ ...foundItem, folderName: currentFolder.name });
          break;
        }
      }
    }
    setLoading(true);
    setLoadingMessage(`Moving ${toMove.length} documents. Please wait.`);
    const { success, message } = await Document.moveToFolder(
      toMove,
      folder.name
    );
    if (!success) {
      showToast(`Error moving files: ${message}`, "error");
      setLoading(false);
      return;
    }

    if (success && message) {
      showToast(message, "info");
    } else {
      showToast(`Successfully moved ${toMove.length} documents.`, "success");
    }
    await fetchKeys(true);
    setSelectedItems({});
    setLoading(false);
  };

  return (
    <div className="px-8 pb-8">
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center justify-between w-[560px] px-5 relative">
          <h3 className="text-white text-base font-bold">My Documents</h3>
          {showNewFolderInput ? (
            <div className="flex items-center gap-x-2 z-50">
              <input
                type="text"
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="bg-zinc-900 text-white placeholder-white/20 text-sm rounded-md p-2.5 w-[150px] h-[32px]"
              />
              <div className="flex gap-x-2">
                <button
                  onClick={confirmNewFolder}
                  className="text-sky-400 rounded-md text-sm font-bold hover:text-sky-500"
                >
                  Create
                </button>
              </div>
            </div>
          ) : (
            <button
              className="flex items-center gap-x-2 cursor-pointer z-50 px-[14px] py-[7px] -mr-[14px] rounded-lg hover:bg-[#222628]/60"
              onClick={createNewFolder}
            >
              <Plus size={18} weight="bold" color="#D3D4D4" />
              <div className="text-[#D3D4D4] text-xs font-bold leading-[18px]">
                New Folder
              </div>
            </button>
          )}
        </div>

        <div className="relative w-[560px] h-[310px] bg-zinc-900 rounded-2xl">
          <div className="rounded-t-2xl text-white/80 text-xs grid grid-cols-12 py-2 px-8 border-b border-white/20 shadow-lg bg-zinc-900 sticky top-0 z-10">
            <p className="col-span-6">Name</p>
            <p className="col-span-3">Date</p>
            <p className="col-span-2">Kind</p>
          </div>

          <div
            className="overflow-y-auto pb-9"
            style={{ height: "calc(100% - 40px)" }}
          >
            {loading ? (
              <div className="w-full h-full flex items-center justify-center flex-col gap-y-5">
                <PreLoader />
                <p className="text-white/80 text-sm font-semibold animate-pulse text-center w-1/3">
                  {loadingMessage}
                </p>
              </div>
            ) : files.items ? (
              files.items.map(
                (item, index) =>
                  item.type === "folder" && (
                    <FolderRow
                      key={index}
                      item={item}
                      selected={isSelected(
                        item.id,
                        item.type === "folder" ? item : null
                      )}
                      onRowClick={() => toggleSelection(item)}
                      toggleSelection={toggleSelection}
                      isSelected={isSelected}
                      autoExpanded={index === 0}
                    />
                  )
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white text-opacity-40 text-sm font-medium">
                  No Documents
                </p>
              </div>
            )}
          </div>

          {amountSelected !== 0 && (
            <div className="w-full justify-center absolute bottom-[12px] flex">
              <div className="justify-center flex flex-row items-center bg-white/40 rounded-lg py-1 px-2 gap-x-2">
                <button
                  onClick={moveToWorkspace}
                  onMouseEnter={() => setHighlightWorkspace(true)}
                  onMouseLeave={() => setHighlightWorkspace(false)}
                  className="border-none text-sm font-semibold bg-white h-[30px] px-2.5 rounded-lg hover:text-white hover:bg-neutral-800/80"
                >
                  Move to Workspace
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowFolderSelection(!showFolderSelection)}
                    className="border-none text-sm font-semibold bg-white h-[32px] w-[32px] rounded-lg text-[#222628] hover:bg-neutral-800/80 flex justify-center items-center group"
                  >
                    {/* Folder Icon */}
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 17 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-[#222628] group-hover:text-white"
                    >
                      <path
                        d="M1.46092 17.9754L3.5703 12.7019C3.61238 12.5979 3.68461 12.5088 3.7777 12.4462C3.8708 12.3836 3.98051 12.3502 4.09272 12.3504H7.47897C7.59001 12.3502 7.69855 12.3174 7.79116 12.2562L9.19741 11.3196C9.29001 11.2583 9.39855 11.2256 9.50959 11.2254H15.5234C15.6126 11.2254 15.7004 11.2465 15.7798 11.2872C15.8591 11.3278 15.9277 11.3867 15.9798 11.459C16.0319 11.5313 16.0661 11.6149 16.0795 11.703C16.093 11.7912 16.0853 11.8812 16.0571 11.9658L14.0532 17.9754H1.46092Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M2.25331 6.53891H2.02342C1.67533 6.53891 1.34149 6.67719 1.09534 6.92333C0.849204 7.16947 0.710922 7.50331 0.710922 7.85141V17.9764C0.710922 18.3906 1.04671 18.7264 1.46092 18.7264C1.87514 18.7264 2.21092 18.3906 2.21092 17.9764V8.03891H2.25331V6.53891ZM13.0859 9.98714V11.2264C13.0859 11.6406 13.4217 11.9764 13.8359 11.9764C14.2501 11.9764 14.5859 11.6406 14.5859 11.2264V9.53891C14.5859 9.19081 14.4476 8.85698 14.2015 8.61083C13.9554 8.36469 13.6215 8.22641 13.2734 8.22641H13.0863V9.98714H13.0859Z"
                        fill="currentColor"
                      />
                      <path
                        d="M7.53416 1.62906L7.53416 7.70406"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.6411 5.21854L7.53456 7.70376L4.42803 5.21854"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {showFolderSelection && (
                    <FolderSelectionPopup
                      folders={files.items.filter(
                        (item) => item.type === "folder"
                      )}
                      onSelect={moveToFolder}
                      onClose={() => setShowFolderSelection(false)}
                    />
                  )}
                </div>
                <button
                  onClick={deleteFiles}
                  className="border-none text-sm font-semibold bg-white h-[32px] w-[32px] rounded-lg text-[#222628] hover:text-white hover:bg-neutral-800/80 flex justify-center items-center"
                >
                  <Trash size={18} weight="bold" />
                </button>
              </div>
            </div>
          )}
        </div>
        <UploadFile
          workspace={workspace}
          fetchKeys={fetchKeys}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
}

export default memo(Directory);
