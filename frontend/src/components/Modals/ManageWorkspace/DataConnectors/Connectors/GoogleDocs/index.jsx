import { useState, useEffect } from "react";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { Warning } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import Workspace from "@/models/workspace";

export default function GoogleDocsOptions({ workspace }) {
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);

  useEffect(() => {
    if (!workspace) {
      console.error('No workspace provided to GoogleDocsOptions');
      return;
    }
    checkAuthStatus();
  }, [workspace]);

  const checkAuthStatus = async () => {
    try {
      console.log("Checking auth status...");
      const response = await System.dataConnectors.googledocs.checkAuth();
      console.log("Auth status response:", response);
      
      if (response.error) {
        showToast(response.error, "error");
        return;
      }
      
      setAuthorized(response.authorized);
      if (response.authorized) {
        await fetchDocuments();
      }
    } catch (error) {
      console.error("Auth check error:", error);
      showToast("Failed to check authorization status", "error");
    }
  };

  const handleAuth = async () => {
    try {
      console.log("Getting auth URL...");
      const response = await System.dataConnectors.googledocs.getAuthUrl();
      console.log("Auth URL response:", response);
      
      if (response.error || !response.data?.url) {
        showToast(response.error || "Failed to get authorization URL", "error");
        return;
      }
      
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Auth URL error:", error);
      showToast("Failed to initiate authentication", "error");
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await System.dataConnectors.googledocs.listDocs();
      console.log("Documents response:", response); // Debug log
      
      if (response.error) {
        showToast(response.error, "error");
        return;
      }
      
      // Handle both possible response formats
      const docs = response.documents || response.data?.documents || [];
      setDocuments(docs);
    } catch (error) {
      console.error("Error fetching documents:", error);
      showToast("Failed to fetch documents", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedDocs.length === 0) {
      showToast("Please select at least one document", "error");
      return;
    }

    if (!workspace?.id) {
      showToast("No workspace ID found", "error");
      return;
    }

    try {
      setLoading(true);
      showToast("Collecting and embedding documents - this may take a while.", "info", {
        clear: true,
        autoClose: false,
      });

      console.log("Starting document collection for:", selectedDocs);
      console.log("Using workspace ID:", workspace.id);

      // First collect the documents
      const response = await System.dataConnectors.googledocs.collect({
        documentIds: selectedDocs,
        workspaceId: workspace.id
      });

      console.log("Collection response:", response);

      if (response.error) {
        showToast(response.error, "error", { clear: true });
        setLoading(false);
        return;
      }

      if (!response.data?.success || !response.data?.data?.documents || response.data.data.documents.length === 0) {
        showToast("No documents were successfully collected", "error", { clear: true });
        setLoading(false);
        return;
      }

      console.log("Documents collected successfully:", response.data.data.documents);

      // Then embed them into the workspace
      const docPaths = response.data.data.documents.map(doc => doc.path);
      console.log("Adding documents to workspace:", docPaths);

      const embedResult = await Workspace.modifyEmbeddings(workspace.slug, {
        adds: docPaths,
        deletes: []
      });

      if (embedResult.error) {
        showToast(`Failed to add documents to workspace: ${embedResult.error}`, "error", { clear: true });
        setLoading(false);
        return;
      }

      showToast(
        `Successfully imported ${selectedDocs.length} documents into the workspace.`,
        "success",
        { clear: true, duration: 5000 }
      );
      
      // Clear selection
      setSelectedDocs([]);
      setLoading(false);
      
      // Refresh the documents list
      window.location.reload();
    } catch (error) {
      console.error("Collection error:", error);
      showToast(error.message || "Failed to collect documents", "error", { clear: true });
      setLoading(false);
    }
  };

  const toggleDocumentSelection = (docId) => {
    console.log("Toggling document:", docId);
    setSelectedDocs((prev) => {
      const newSelection = prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId];
      console.log("Updated selection:", newSelection);
      return newSelection;
    });
  };

  if (!authorized) {
    return (
      <div className="flex w-full">
        <div className="flex flex-col w-full px-1 md:pb-6 pb-16">
          <div className="flex flex-col gap-y-2 w-full pr-10">
            <div className="flex flex-col gap-y-1 mb-4">
              <label className="text-white text-sm font-bold">
                Google Docs Authorization
              </label>
              <p className="text-xs font-normal text-theme-text-secondary">
                You need to authorize access to your Google Docs to import documents.
              </p>
            </div>
            <button
              onClick={handleAuth}
              className="mt-2 w-full justify-center border border-slate-200 px-4 py-2 rounded-lg text-dark-text text-sm font-bold items-center flex gap-x-2 bg-slate-200 hover:bg-slate-300 hover:text-slate-800"
            >
              Authorize Google Docs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full">
      <div className="flex flex-col w-full px-1 md:pb-6 pb-16">
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="w-full flex flex-col py-2">
            <div className="flex flex-col gap-y-1 mb-4">
              <label className="text-white text-sm font-bold flex gap-x-2 items-center">
                <p className="font-bold text-theme-text-primary">
                  Select Documents to Import
                </p>
                <Warning
                  size={14}
                  className="ml-1 text-orange-500 cursor-pointer"
                  data-tooltip-id="docs-selection-tooltip"
                />
                <Tooltip id="docs-selection-tooltip" className="max-w-xs">
                  Select the documents you want to import into your workspace.
                </Tooltip>
              </label>
            </div>

            <div className="max-h-60 overflow-y-auto mb-4 bg-theme-settings-input-bg rounded-lg">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center p-2 hover:bg-theme-settings-input-hover"
                >
                  <input
                    type="checkbox"
                    id={`doc-${doc.id}`}
                    checked={selectedDocs.includes(doc.id)}
                    onChange={() => toggleDocumentSelection(doc.id)}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`doc-${doc.id}`}
                    className="text-white text-sm cursor-pointer flex-grow"
                  >
                    {doc.name}
                  </label>
                </div>
              ))}
              {documents.length === 0 && (
                <p className="text-theme-text-secondary text-sm p-2">
                  No documents found in your Google Drive
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-y-2 w-full pr-10">
            <button
              type="submit"
              disabled={loading || selectedDocs.length === 0}
              className="mt-2 w-full justify-center border border-slate-200 px-4 py-2 rounded-lg text-dark-text text-sm font-bold items-center flex gap-x-2 bg-slate-200 hover:bg-slate-300 hover:text-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {loading ? "Importing documents..." : `Import Selected Documents (${selectedDocs.length})`}
            </button>
            {loading && (
              <p className="text-xs text-theme-text-secondary">
                Once complete, all documents will be available for embedding into workspaces.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 