import { ArrowsDownUp } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import Workspace from "../../../../models/workspace";
import System from "../../../../models/system";
import showToast from "../../../../utils/toast";
import Directory from "./Directory";
import WorkspaceDirectory from "./WorkspaceDirectory";
import useUser from "../../../../hooks/useUser";
import Admin from "../../../../models/admin";

// OpenAI Cost per token
// ref: https://openai.com/pricing#:~:text=%C2%A0/%201K%20tokens-,Embedding%20models,-Build%20advanced%20search

const MODEL_COSTS = {
  "text-embedding-ada-002": 0.0000001, // $0.0001 / 1K tokens
  "text-embedding-3-small": 0.00000002, // $0.00002 / 1K tokens
  "text-embedding-3-large": 0.00000013, // $0.00013 / 1K tokens
};

export default function DocumentSettings({ workspace, systemSettings }) {
  const [highlightWorkspace, setHighlightWorkspace] = useState(false);
  const [availableDocs, setAvailableDocs] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [workspaceDocs, setWorkspaceDocs] = useState({ items: [] });
  const [selectedItems, setSelectedItems] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [movedItems, setMovedItems] = useState([]);
  const [embeddingsCost, setEmbeddingsCost] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");
  const { user } = useUser();
  const [permissions, setPermissions] = useState({
    default_managing_workspaces: false,
  });

  useEffect(() => {
    async function fetchPermissions() {
      const { settings } = await Admin.userPermissions();
      setPermissions({
        default_managing_workspaces:
          settings?.default_managing_workspaces === true,
      });
    }
    fetchPermissions();
  }, []);

  const canManageWorkspace =
    !user ||
    user?.role !== "default" ||
    permissions.default_managing_workspaces;

  async function fetchKeys(refetchWorkspace = false) {
    setLoading(true);
    try {
      const localFiles = await System.localFiles();
      if (!localFiles) {
        // If localFiles is null (unauthorized), set empty states and return
        setAvailableDocs({ items: [] });
        setWorkspaceDocs({ items: [] });
        setLoading(false);
        return;
      }

      const currentWorkspace = refetchWorkspace
        ? await Workspace.bySlug(workspace.slug)
        : workspace;

      const documentsInWorkspace =
        currentWorkspace.documents.map((doc) => doc.docpath) || [];

      // Documents that are not in the workspace
      const availableDocs = {
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
      const workspaceDocs = {
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

      setAvailableDocs(availableDocs);
      setWorkspaceDocs(workspaceDocs);
    } catch (error) {
      console.error("Error fetching documents:", error);
      // Don't show error toast for unauthorized access
      if (error.message?.includes("401")) {
        setAvailableDocs({ items: [] });
        setWorkspaceDocs({ items: [] });
      } else {
        showToast("Error loading documents", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (canManageWorkspace) {
      fetchKeys(true);
    } else {
      setLoading(false);
      // Set empty arrays for users without permission
      setAvailableDocs({ items: [] });
      setWorkspaceDocs({ items: [] });
    }
  }, [canManageWorkspace]);

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

    let totalTokenCount = 0;
    newMovedItems.forEach((item) => {
      const { cached, token_count_estimate } = item;
      if (!cached) {
        totalTokenCount += token_count_estimate;
      }
    });

    // Do not do cost estimation unless the embedding engine is OpenAi.
    if (systemSettings?.EmbeddingEngine === "openai") {
      const COST_PER_TOKEN =
        MODEL_COSTS[
          systemSettings?.EmbeddingModelPref || "text-embedding-ada-002"
        ];

      const dollarAmount = (totalTokenCount / 1000) * COST_PER_TOKEN;
      setEmbeddingsCost(dollarAmount);
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
        embeddingCosts={embeddingsCost}
        movedItems={movedItems}
      />
    </div>
  );
}
