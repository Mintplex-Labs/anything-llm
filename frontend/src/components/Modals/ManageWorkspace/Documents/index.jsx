import { ArrowsDownUp } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import Workspace from "../../../../models/workspace";
import System from "../../../../models/system";
import showToast from "../../../../utils/toast";
import Directory from "./Directory";
import WorkspaceDirectory from "./WorkspaceDirectory";
import { API_BASE, AUTH_TOKEN } from "@/utils/constants";

// OpenAI Cost per token
// ref: https://openai.com/pricing#:~:text=%C2%A0/%201K%20tokens-,Embedding%20models,-Build%20advanced%20search

const MODEL_COSTS = {
  "text-embedding-ada-002": 0.0000001, // $0.0001 / 1K tokens
  "text-embedding-3-small": 0.00000002, // $0.00002 / 1K tokens
  "text-embedding-3-large": 0.00000013, // $0.00013 / 1K tokens
};

/**
 * Per-file embedding status:
 *   "pending"    — queued, not started yet
 *   "embedding"  — currently being embedded (may have chunk progress)
 *   "complete"   — embedded successfully
 *   "failed"     — embedding failed
 *
 * Shape: { [filename]: { status, chunksCompleted?, totalChunks?, error? } }
 */

export default function DocumentSettings({ workspace, systemSettings }) {
  const [highlightWorkspace, setHighlightWorkspace] = useState(false);
  const [availableDocs, setAvailableDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workspaceDocs, setWorkspaceDocs] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [movedItems, setMovedItems] = useState([]);
  const [embeddingsCost, setEmbeddingsCost] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [embeddingProgress, setEmbeddingProgress] = useState(null);

  async function fetchKeys(refetchWorkspace = false) {
    setLoading(true);
    const localFiles = await System.localFiles();
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
    setLoading(false);
  }

  useEffect(() => {
    fetchKeys(true);
  }, []);

  const updateWorkspace = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingMessage("This may take a while for large documents");

    const filenames = movedItems.map(
      (item) => `${item.folderName}/${item.name}`
    );
    const changesToSend = { adds: filenames };

    // Build initial per-file progress — every file starts as "pending"
    const initialProgress = {};
    for (const name of filenames) {
      initialProgress[name] = { status: "pending" };
    }
    setEmbeddingProgress({ ...initialProgress });

    setSelectedItems({});
    setHasChanges(false);
    setHighlightWorkspace(false);

    // The SSE stream emits per-document events from the backend:
    //   doc_starting   — a document has started embedding
    //   chunk_progress — chunk-level progress within the current document
    //   doc_complete   — a document finished embedding successfully
    //   doc_failed     — a document failed to embed
    //   all_complete   — all documents have been processed
    // We track the "current file" from doc_starting so chunk_progress
    // events can be attributed to the right row.
    let currentFile = null;

    let eventSource = null;
    try {
      const token = window.localStorage.getItem(AUTH_TOKEN);
      const progressUrl = new URL(
        `${API_BASE}/workspace/${workspace.slug}/embed-progress`
      );
      if (token) progressUrl.searchParams.set("token", token);
      eventSource = new EventSource(progressUrl.toString());
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case "doc_starting":
              currentFile = data.filename;
              setEmbeddingProgress((prev) => ({
                ...prev,
                [data.filename]: { status: "embedding" },
              }));
              break;

            case "chunk_progress":
              if (currentFile) {
                setEmbeddingProgress((prev) => ({
                  ...prev,
                  [currentFile]: {
                    status: "embedding",
                    chunksCompleted: data.chunksCompleted,
                    totalChunks: data.totalChunks,
                  },
                }));
              }
              break;

            case "doc_complete":
              setEmbeddingProgress((prev) => ({
                ...prev,
                [data.filename]: { status: "complete" },
              }));
              currentFile = null;
              break;

            case "doc_failed":
              setEmbeddingProgress((prev) => ({
                ...prev,
                [data.filename]: {
                  status: "failed",
                  error: data.error || "Embedding failed",
                },
              }));
              currentFile = null;
              break;

            case "all_complete":
              // SSE has delivered all events — we can close
              eventSource?.close();
              eventSource = null;
              break;
          }
        } catch {
          // ignore parse errors
        }
      };
      eventSource.onerror = () => {
        eventSource?.close();
        eventSource = null;
      };
    } catch {
      // SSE is optional — embedding still works without it
    }

    // The API call runs in parallel with SSE events.
    // SSE gives us real-time updates; the API response is the final truth.
    await Workspace.modifyEmbeddings(workspace.slug, changesToSend)
      .then((res) => {
        // Use API response as the authoritative source for final statuses
        const embeddedPaths = new Set(res.embedded || []);
        const failedNames = res.failedToEmbed || [];

        setEmbeddingProgress((prev) => {
          const next = { ...prev };
          for (const name of filenames) {
            if (embeddedPaths.has(name)) {
              next[name] = { status: "complete" };
            } else {
              const displayName = name
                .split("/")
                .pop()
                ?.replace(/\.json$/, "");
              const didFail =
                failedNames.length > 0 &&
                failedNames.some(
                  (f) => f === displayName || f === name || name.includes(f)
                );
              if (didFail) {
                next[name] = { status: "failed", error: res.message };
              } else if (
                next[name]?.status !== "complete" &&
                next[name]?.status !== "failed"
              ) {
                next[name] = { status: "complete" };
              }
            }
          }
          return next;
        });

        if (res.message) {
          showToast(`Error: ${res.message}`, "error", { clear: true });
        } else {
          showToast("Workspace updated successfully.", "success", {
            clear: true,
          });
        }
      })
      .catch((error) => {
        setEmbeddingProgress((prev) => {
          const next = { ...prev };
          for (const name of filenames) {
            next[name] = { status: "failed", error: String(error) };
          }
          return next;
        });
        showToast(`Workspace update failed: ${error}`, "error", {
          clear: true,
        });
      });

    eventSource?.close();

    // Keep the progress visible so the user can see final statuses
    await new Promise((r) => setTimeout(r, 2000));

    setEmbeddingProgress(null);
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
        embeddingProgress={embeddingProgress}
      />
    </div>
  );
}
