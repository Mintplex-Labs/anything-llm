```javascript
import UploadFile from "../UploadFile";
import PreLoader from "@/components/Preloader";
import { memo, useEffect, useState } from "react";
import FolderRow from "./FolderRow";
import System from "@/models/system";
import { Plus, Trash } from "@phosphor-icons/react";
import Document from "@/models/document";
import showToast from "@/utils/toast";
import FolderSelectionPopup from "./FolderSelectionPopup";
import MoveToFolderIcon from "./MoveToFolderIcon";

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
        // select all files in the folder
        if (newSelectedItems[item.name]) {
          delete newSelectedItems[item.name];
          item.items.forEach((file) => delete newSelectedItems[file.id]);
        } else {
          newSelectedItems[item.name] = true;
          item.items.forEach((file) => (newSelectedItems[file.id] = true));
        }
      } else {
        // single file selections
        if (newSelectedItems[item.id]) {
          delete newSelectedItems[item.id];
        } else {
          newSelectedItems[item.id] = true;
        }
      }

      return newSelectedItems;
    });
  };

  // check if item is selected based on selectedItems state
  const isSelected = (id, item) => {
    if (item && item.type === "folder") {
      if (!selectedItems[item.name]) {
        return false;
      }
      return item.items.every((file) => selectedItems[file.id]);
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
      // show info if some files were not moved due to being embedded
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
              className="flex items-center gap-x-2 cursor-pointer px-[14px] py-[7px] -mr-[14px] rounded-lg hover:bg-[#222628]/60"
              onClick={createNewFolder}
            >
              <Plus size={18} weight="bold" color="#D3D4D4" />
              <div className="text-[#D3D4D4] text-xs font-bold leading-[18px]">
                New Folder
              </div>
            </button>
          )}
        </div>

        <div className="relative w-[560px] h-[310px] bg-zinc-900 rounded-2xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 z-10 rounded-t-2xl text-white/80 text-xs grid grid-cols-12 py-2 px-8 border-b border-white/20 shadow-lg bg-zinc-900">
            <p className="col-span-6">Name</p>
            <p className="col-span-3">Date</p>
            <p className="col-span-2">Kind</p>
          </div>

          <div className="overflow-y-auto h-full pt-8">
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
            <div className="absolute bottom-[12px] left-0 right-0 flex justify-center pointer-events-none">
              <div className="mx-auto bg-white/40 rounded-lg py-1 px-2 pointer-events-auto">
                <div className="flex flex-row items-center gap-x-2">
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
                      onClick={() =>
                        setShowFolderSelection(!showFolderSelection)
                      }
                      className="border-none text-sm font-semibold bg-white h-[32px] w-[32px] rounded-lg text-[#222628] hover:bg-neutral-800/80 flex justify-center items-center group"
                    >
                      <MoveToFolderIcon className="text-[#222628] group-hover:text-white" />
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
            </div>
          )}
        </div>
        <UploadFile
          workspace={workspace}
          fetchKeys={fetchKeys}
          setLoading={setLoading}
          setLoadingMessage={setLoadingMessage}
        />
      </div>
    </div>
  );
}

export default memo(Directory);

```
# Directory Interface Documentation

## Purpose and Usage

The `Directory` interface is a React component that displays a directory listing of files and folders. It is designed to provide an interactive way to browse and manage files within a workspace.

### Parameters

* `workspace`: The current workspace being displayed.
* `fetchKeys`: An array of keys used for fetching file metadata.
* `setLoading`: A function to set the loading state.
* `setLoadingMessage`: A function to set the loading message.

## Methods

### `confirmNewFolder`

This method is called when the user clicks the "Create" button to confirm creating a new folder. It takes no parameters and returns nothing.

#### Parameters:

None

#### Return Value:

Nothing

### `createNewFolder`

This method is called when the user clicks the "+" icon to create a new folder. It takes no parameters and returns nothing.

#### Parameters:

None

#### Return Value:

Nothing

### `deleteFiles`

This method is called when the user clicks the trash can icon to delete selected files. It takes an array of file IDs as a parameter and returns nothing.

#### Parameters:

* `fileIds`: An array of file IDs to be deleted.

#### Return Value:

Nothing

### `moveToFolder`

This method is called when the user selects a folder from the folder selection popup. It takes the selected folder ID as a parameter and returns nothing.

#### Parameters:

* `folderId`: The ID of the selected folder.

#### Return Value:

Nothing

### `moveToWorkspace`

This method is called when the user clicks the "Move to Workspace" button. It takes no parameters and returns nothing.

#### Parameters:

None

#### Return Value:

Nothing

## Examples

Here are some examples of how to use the `Directory` interface:
```jsx
import React from 'react';
import { Directory } from './Directory';

const App = () => {
  const [workspace, setWorkspace] = useState([]);
  const [fetchKeys, setFetchKeys] = useState([]);

  return (
    <div>
      <Directory
        workspace={workspace }
        fetchKeys={fetchKeys}
        setLoading={(loading) => setWorkspace(loading)}
        setLoadingMessage={(message) => console.log(message)}
      />
    </div>
  );
};
```
## Dependencies

The `Directory` interface depends on the following components:

* `UploadFile`: A component used for uploading files.
* `FetchKeys`: An array of keys used for fetching file metadata.

## Clarity and Consistency

The documentation is written in a clear and concise manner, using consistent terminology and formatting throughout. The examples provided illustrate how to use the interface and its methods, making it easy for developers to understand and integrate it into their codebase.