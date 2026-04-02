import { ArrowsDownUp } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import Workspace from "../../../../models/workspace";
import System from "../../../../models/system";
import showToast from "../../../../utils/toast";
import Directory from "./Directory";
import WorkspaceDirectory from "./WorkspaceDirectory";

export default function DocumentSettings({ workspace }) {
  const [highlightWorkspace, setHighlightWorkspace] = useState(false);
  const [availableDocs, setAvailableDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workspaceDocs, setWorkspaceDocs] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [movedItems, setMovedItems] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState("");
  const availableDocsRef = useRef([]);

  useEffect(() => {
    availableDocsRef.current = availableDocs;
  }, [availableDocs]);

  async function fetchKeys(refetchWorkspace = false, options = {}) {
    const { autoSelectNew = false } = options;
    const previousIds = new Set();
    if (autoSelectNew && availableDocsRef.current?.items) {
      for (const folder of availableDocsRef.current.items) {
        for (const file of folder.items ?? []) {
          if (file?.id) previousIds.add(file.id);
        }
      }
    }

    setLoading(true);
    const localFiles = await System.localFiles();
    const currentWorkspace = refetchWorkspace
      ? await Workspace.bySlug(workspace.slug)
      : workspace;

    const documentsInWorkspace =
      currentWorkspace.documents.map((doc) => doc.docpath) || [];

    // Documents that are not in the workspace
    const filteredAvailableDocs = {
      ...localFiles,
      items: localFiles.items.map((folder) => {
        if (folder.items && folder.type === "folder") {
          return {
            ...folder,
            items: folder.items.filter(
              (file) =>
                file.type === "file" &&
                !documentsInWorkspace.includes(`${folder.name}/${file.name}`)
            ),
          };
        } else {
          return folder;
        }
      }),
    };

    // Documents that are already in the workspace
    const filteredWorkspaceDocs = {
      ...localFiles,
      items: localFiles.items.map((folder) => {
        if (folder.items && folder.type === "folder") {
          return {
            ...folder,
            items: folder.items.filter(
              (file) =>
                file.type === "file" &&
                documentsInWorkspace.includes(`${folder.name}/${file.name}`)
            ),
          };
        } else {
          return folder;
        }
      }),
    };

    setAvailableDocs(filteredAvailableDocs);
    setWorkspaceDocs(filteredWorkspaceDocs);

    if (autoSelectNew) {
      const newSelected = {};
      for (const folder of filteredAvailableDocs.items ?? []) {
        for (const file of folder.items ?? []) {
          if (file?.id && !previousIds.has(file.id)) {
            newSelected[file.id] = true;
          }
        }
      }
      if (Object.keys(newSelected).length > 0) {
        setSelectedItems((prev) => ({ ...prev, ...newSelected }));
      }
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchKeys(true);
  }, []);

  const updateWorkspace = async (e) => {
    e.preventDefault();
    setLoading(true);
    showToast("Updating workspace...", "info", { autoClose: false });
    setLoadingMessage("This may take a while for large documents");

    const changesToSend = {
      adds: movedItems.map((item) => `${item.folderName}/${item.name}`),
    };

    setSelectedItems({});
    setHasChanges(false);
    setHighlightWorkspace(false);
    await Workspace.modifyEmbeddings(workspace.slug, changesToSend)
      .then((res) => {
        if (!!res.message) {
          showToast(`Error: ${res.message}`, "error", { clear: true });
          return;
        }
        showToast("Workspace updated successfully.", "success", {
          clear: true,
        });
      })
      .catch((error) => {
        showToast(`Workspace update failed: ${error}`, "error", {
          clear: true,
        });
      });

    setMovedItems([]);
    await fetchKeys(true);
    setLoading(false);
    setLoadingMessage("");
  };

  const moveSelectedItemsToWorkspace = () => {
    setHighlightWorkspace(false);
    setHasChanges(true);

    const newMovedItems = [];

    for (const itemId of Object.keys(selectedItems)) {
      for (const folder of availableDocs.items) {
        const foundItem = folder.items.find((file) => file.id === itemId);
        if (foundItem) {
          newMovedItems.push({ ...foundItem, folderName: folder.name });
          break;
        }
      }
    }

    setMovedItems([...movedItems, ...newMovedItems]);

    let newAvailableDocs = JSON.parse(JSON.stringify(availableDocs));
    let newWorkspaceDocs = JSON.parse(JSON.stringify(workspaceDocs));

    for (const itemId of Object.keys(selectedItems)) {
      let foundItem = null;
      let foundFolderIndex = null;

      newAvailableDocs.items = newAvailableDocs.items.map(
        (folder, folderIndex) => {
          const remainingItems = folder.items.filter((file) => {
            const match = file.id === itemId;
            if (match) {
              foundItem = { ...file };
              foundFolderIndex = folderIndex;
            }
            return !match;
          });

          return {
            ...folder,
            items: remainingItems,
          };
        }
      );

      if (foundItem) {
        newWorkspaceDocs.items[foundFolderIndex].items.push(foundItem);
      }
    }

    setAvailableDocs(newAvailableDocs);
    setWorkspaceDocs(newWorkspaceDocs);
    setSelectedItems({});
  };

  return (
    <div className="flex upload-modal -mt-6 z-10 relative">
      <Directory
        files={availableDocs}
        setFiles={setAvailableDocs}
        loading={loading}
        loadingMessage={loadingMessage}
        setLoading={setLoading}
        workspace={workspace}
        fetchKeys={fetchKeys}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        updateWorkspace={updateWorkspace}
        highlightWorkspace={highlightWorkspace}
        setHighlightWorkspace={setHighlightWorkspace}
        moveToWorkspace={moveSelectedItemsToWorkspace}
        setLoadingMessage={setLoadingMessage}
      />
      <div className="upload-modal-arrow">
        <ArrowsDownUp className="text-white text-base font-bold rotate-90 w-11 h-11" />
      </div>
      <WorkspaceDirectory
        workspace={workspace}
        files={workspaceDocs}
        highlightWorkspace={highlightWorkspace}
        loading={loading}
        loadingMessage={loadingMessage}
        setLoadingMessage={setLoadingMessage}
        setLoading={setLoading}
        fetchKeys={fetchKeys}
        hasChanges={hasChanges}
        saveChanges={updateWorkspace}
        movedItems={movedItems}
      />
    </div>
  );
}
