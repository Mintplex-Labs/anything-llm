import { ArrowsDownUp } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import Workspace from "../../../../models/workspace";
import System from "../../../../models/system";
import showToast from "../../../../utils/toast";
import Directory from "./Directory";
import WorkspaceDirectory from "./WorkspaceDirectory";

// OpenAI Cost per token
// ref: https://openai.com/pricing#:~:text=%C2%A0/%201K%20tokens-,Embedding%20models,-Build%20advanced%20search

const MODEL_COSTS = {
  "text-embedding-ada-002": 0.0000001, // $0.0001 / 1K tokens
  "text-embedding-3-small": 0.00000002, // $0.00002 / 1K tokens
  "text-embedding-3-large": 0.00000013, // $0.00013 / 1K tokens
};

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

  async function fetchKeys(refetchWorkspace = false) {
    setLoading(true);
    console.log('Fetching documents...');
    const localFiles = await System.localFiles();
    console.log('Local files response:', localFiles);
    
    const currentWorkspace = refetchWorkspace
      ? await Workspace.bySlug(workspace.slug)
      : workspace;
    console.log('Current workspace:', currentWorkspace);

    const documentsInWorkspace = 
      currentWorkspace.documents.map((doc) => doc.docpath) || [];
    console.log('Documents in workspace:', documentsInWorkspace);

    // Process all files regardless of type
    const processFiles = (folder) => {
      if (folder.type === "folder" && folder.items) {
        const processedItems = folder.items.map(file => {
          // Extract the base name without timestamp
          const baseName = file.name.split('_')[0] || file.name;
          
          // Create a unique ID combining multiple unique identifiers
          const uniqueId = [
            folder.name,
            baseName,
            file.id || '', // Original ID if exists
            file.lastModified || Date.now(), // Use lastModified or current timestamp
            Math.random().toString(36).substring(7) // Add random string for extra uniqueness
          ].filter(Boolean).join('_');

          return {
            ...file,
            id: uniqueId,
            originalId: file.id, // Keep original ID for reference
            title: file.title || baseName,
            url: file.url || `${folder.name}/${file.name}`,
            baseName: baseName // Store base name for reference
          };
        });
        return {
          ...folder,
          items: processedItems
        };
      }
      return folder;
    };

    // Documents that are not in the workspace
    const availableDocs = {
      ...localFiles,
      items: localFiles.items.map((folder) => {
        if (folder.type === "folder") {
          const filteredItems = folder.items.filter((file) => {
            const filePath = file.url ? file.url.replace('file://', '') : `${folder.name}/${file.name}`;
            return !documentsInWorkspace.includes(filePath);
          });
          return {
            ...processFiles({
              ...folder,
              items: filteredItems,
            }),
          };
        }
        return folder;
      }),
    };

    // Documents that are already in the workspace
    const workspaceDocs = {
      ...localFiles,
      items: localFiles.items.map((folder) => {
        if (folder.type === "folder") {
          const filteredItems = folder.items.filter((file) => {
            const filePath = file.url ? file.url.replace('file://', '') : `${folder.name}/${file.name}`;
            return documentsInWorkspace.includes(filePath);
          });
          return {
            ...processFiles({
              ...folder,
              items: filteredItems,
            }),
          };
        }
        return folder;
      }),
    };

    console.log('Final available docs:', availableDocs);
    console.log('Final workspace docs:', workspaceDocs);

    setAvailableDocs(availableDocs);
    setWorkspaceDocs(workspaceDocs);
    setLoading(false);
  }

  useEffect(() => {
    console.log('DocumentSettings mounted, fetching keys...');
    fetchKeys(true);
  }, []);

  const updateWorkspace = async (e) => {
    e.preventDefault();
    setLoading(true);
    showToast("Updating workspace...", "info", { autoClose: false });
    setLoadingMessage("This may take a while for large documents");

    try {
      // Create a Set to track unique paths and ensure proper formatting
      const uniquePaths = new Set();
      const changesToSend = {
        adds: movedItems
          .filter(item => {
            // Get clean path and ensure proper formatting
            const isGoogleDoc = 
              item.metadata?.source === 'google_docs' ||
              item.metadata?.type === 'google_document' ||
              item.type === 'google_document' ||
              (item.docId && item.docId.startsWith('googledoc-')) ||
              (item.chunkSource && item.chunkSource.startsWith('googledocs://'));

            const filePath = isGoogleDoc ? 
              `custom-documents/${item.name}` : 
              (item.url ? item.url.replace('file://', '') : `${item.folderName}/${item.name}`);
            
            console.log('Processing file path:', filePath, {
              isGoogleDoc,
              metadata: item.metadata,
              type: item.type
            });
            
            // Only include if path hasn't been seen
            if (!uniquePaths.has(filePath)) {
              uniquePaths.add(filePath);
              return true;
            }
            return false;
          })
          .map(item => {
            const isGoogleDoc = 
              item.metadata?.source === 'google_docs' ||
              item.metadata?.type === 'google_document' ||
              item.type === 'google_document' ||
              (item.docId && item.docId.startsWith('googledoc-')) ||
              (item.chunkSource && item.chunkSource.startsWith('googledocs://'));

            const path = isGoogleDoc ? 
              `custom-documents/${item.name}` : 
              (item.url ? item.url.replace('file://', '') : `${item.folderName}/${item.name}`);
            
            console.log('Adding file to workspace:', path, {
              isGoogleDoc,
              metadata: item.metadata,
              type: item.type
            });
            return path;
          }),
        deletes: [] // We're only handling additions in this case
      };

      setSelectedItems({});
      setHasChanges(false);
      setHighlightWorkspace(false);
      
      console.log('Sending changes to server:', changesToSend);
      const result = await Workspace.modifyEmbeddings(workspace.slug, changesToSend);
      
      if (result.message) {
        console.error('Error modifying embeddings:', result.message);
        showToast(`Error: ${result.message}`, "error", { clear: true });
        return;
      }
      
      // Show success message and wait a moment before refreshing
      showToast("Workspace updated successfully.", "success", {
        clear: true,
      });
      
      // Wait a moment to ensure the backend has processed everything
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Refresh the document lists
      setMovedItems([]);
      await fetchKeys(true);
    } catch (error) {
      console.error('Workspace update error:', error);
      showToast(`Workspace update failed: ${error}`, "error", {
        clear: true,
      });
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const moveSelectedItemsToWorkspace = () => {
    setHighlightWorkspace(false);
    setHasChanges(true);

    const newMovedItems = [];
    const processedIds = new Set(); // Track processed items to avoid duplicates

    for (const itemId of Object.keys(selectedItems)) {
      for (const folder of availableDocs.items) {
        // Find the item by its unique ID
        const foundItem = folder.items.find((file) => file.id === itemId);
        if (foundItem && !processedIds.has(foundItem.baseName)) {
          processedIds.add(foundItem.baseName);

          // Determine if this is a Google Doc
          const isGoogleDoc = 
            foundItem.metadata?.source === 'google_docs' ||
            foundItem.metadata?.type === 'google_document' ||
            foundItem.type === 'google_document' ||
            (foundItem.docId && foundItem.docId.startsWith('googledoc-')) ||
            (foundItem.chunkSource && foundItem.chunkSource.startsWith('googledocs://'));

          // Ensure proper file path construction
          const filePath = isGoogleDoc ? 
            `custom-documents/${foundItem.name}` : 
            (foundItem.url ? foundItem.url.replace('file://', '') : `${folder.name}/${foundItem.name}`);

          console.log('Moving item to workspace:', {
            id: foundItem.id,
            name: foundItem.name,
            path: filePath,
            folderName: folder.name,
            type: isGoogleDoc ? 'google_document' : foundItem.type,
            metadata: foundItem.metadata
          });

          newMovedItems.push({ 
            ...foundItem, 
            folderName: folder.name,
            path: filePath,
            type: isGoogleDoc ? 'google_document' : foundItem.type,
            id: foundItem.id, // Preserve the unique ID
            metadata: {
              ...foundItem.metadata,
              type: isGoogleDoc ? 'google_document' : foundItem.type
            }
          });
          break;
        }
      }
    }

    let totalTokenCount = 0;
    newMovedItems.forEach((item) => {
      const { cached, token_count_estimate } = item;
      if (!cached) {
        totalTokenCount += token_count_estimate || 0;
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

    console.log('Items to be moved:', newMovedItems);
    setMovedItems([...movedItems, ...newMovedItems]);

    // Create deep copies to avoid mutating state directly
    let newAvailableDocs = JSON.parse(JSON.stringify(availableDocs));
    let newWorkspaceDocs = JSON.parse(JSON.stringify(workspaceDocs));

    // Remove items from available docs using the unique IDs
    newAvailableDocs.items = newAvailableDocs.items.map((folder) => ({
      ...folder,
      items: folder.items.filter((file) => !selectedItems[file.id])
    }));

    // Add items to workspace docs
    newWorkspaceDocs.items = newWorkspaceDocs.items.map((folder) => {
      const itemsToAdd = newMovedItems.filter(item => item.folderName === folder.name);
      return {
        ...folder,
        items: [...folder.items, ...itemsToAdd]
      };
    });

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
