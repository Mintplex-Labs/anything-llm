import { ArrowsDownUp } from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Workspace from "../../../../models/workspace";
import showToast from "../../../../utils/toast";
import Directory from "./Directory";
import WorkspaceDirectory from "./WorkspaceDirectory";
import useDocumentPicker from "./hooks/useDocumentPicker";
import { useWorkspaceEmbeddingProgress } from "@/EmbeddingProgressContext";

const UPLOAD_FOLDER = "custom-documents";

/**
 * @param {Object} props
 * @param {"default"|"mobile"} [props.variant="default"] - `mobile` stacks the
 * two panels behind tabs instead of side by side
 */
export default function DocumentSettings({ workspace, variant = "default" }) {
  const [highlightWorkspace, setHighlightWorkspace] = useState(false);
  const [mobileTab, setMobileTab] = useState("documents");
  const [movedItems, setMovedItems] = useState([]);
  // Busy state local to the workspace (right) panel - removing embeddings.
  const [wsBusy, setWsBusy] = useState(false);
  const [wsBusyMessage, setWsBusyMessage] = useState("");
  const picker = useDocumentPicker(workspace);
  const {
    refresh,
    resolveSelection,
    removeFiles,
    clearSelection,
    workspaceDocs: embeddedDocs,
  } = picker;
  const hasChanges = movedItems.length > 0;

  // `syncAfterUpload` pre-selects files it has not seen before, so the upload
  // folder must already be loaded or every existing file in it reads as new.
  // Desktop loads it on hover, which touch screens never fire.
  const uploadFolderStatus = picker.contents[UPLOAD_FOLDER]?.status;
  useEffect(() => {
    if (variant !== "mobile") return;
    if (picker.status === "ready" && !uploadFolderStatus)
      picker.prefetchFolder(UPLOAD_FOLDER);
  }, [variant, picker.status, uploadFolderStatus, picker.prefetchFolder]);

  const { embeddingProgress, startEmbedding } = useWorkspaceEmbeddingProgress(
    workspace.slug,
    { onProgressCleared: refresh }
  );

  /**
   * Files mid-embed are shown in the workspace panel, so hide them from the
   * picker to avoid rendering the same document on both sides.
   */
  const hiddenPaths = useMemo(
    () => new Set(Object.keys(embeddingProgress ?? {})),
    [embeddingProgress]
  );

  /**
   * Stage the current selection for embedding. Files are removed from the
   * picker optimistically - no refetch, so the move is instant.
   */
  const moveSelectedItemsToWorkspace = useCallback(async () => {
    setHighlightWorkspace(false);
    const resolved = await resolveSelection();
    if (resolved.length === 0) return clearSelection();

    setMovedItems((prev) => {
      const seen = new Set(prev.map((item) => item.id));
      return [...prev, ...resolved.filter((item) => !seen.has(item.id))];
    });
    removeFiles(resolved.map((item) => item.id));
    clearSelection();
  }, [resolveSelection, removeFiles, clearSelection]);

  const updateWorkspace = async (e) => {
    e?.preventDefault();
    const filenames = movedItems.map(
      (item) => `${item.folderName}/${item.name}`
    );

    setMovedItems([]);
    setHighlightWorkspace(false);
    clearSelection();

    // Fire the embed POST first so the server is already processing the job
    // by the time the SSE connection opens. This avoids the server sending
    // idle (no active job) before embedding has started.
    const embedPromise = Workspace.modifyEmbeddings(workspace.slug, {
      adds: filenames,
    });
    startEmbedding(workspace.slug, filenames);
    embedPromise.catch((error) => {
      showToast(`Workspace update failed: ${error}`, "error", { clear: true });
    });
  };

  /** Merge not-yet-embedded staged files into the workspace panel. */
  const workspaceDocs = useMemo(() => {
    if (movedItems.length === 0) return embeddedDocs;
    const items = embeddedDocs.items.map((f) => ({
      ...f,
      items: [...f.items],
    }));
    for (const moved of movedItems) {
      let folder = items.find((f) => f.name === moved.folderName);
      if (!folder) {
        folder = { name: moved.folderName, type: "folder", items: [] };
        items.push(folder);
      }
      if (!folder.items.some((item) => item.id === moved.id))
        folder.items.push(moved);
    }
    return { ...embeddedDocs, items };
  }, [embeddedDocs, movedItems]);

  const initializing = picker.status === "initializing";

  if (variant === "mobile") {
    const workspaceDocCount = workspaceDocs.items.reduce(
      (sum, folder) => sum + folder.items.length,
      0
    );
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <MobileTabs
          selected={mobileTab}
          onSelect={setMobileTab}
          workspaceDocCount={workspaceDocCount}
          hasChanges={hasChanges}
        />
        <MobileTabPanel active={mobileTab === "documents"}>
          <Directory
            variant="mobile"
            picker={picker}
            workspace={workspace}
            hiddenPaths={hiddenPaths}
            embeddedCounts={Object.fromEntries(
              embeddedDocs.items.map((folder) => [
                folder.name,
                folder.items.length,
              ])
            )}
            setHighlightWorkspace={setHighlightWorkspace}
            moveToWorkspace={async () => {
              await moveSelectedItemsToWorkspace();
              setMobileTab("workspace");
            }}
          />
        </MobileTabPanel>
        <MobileTabPanel active={mobileTab === "workspace"}>
          <WorkspaceDirectory
            variant="mobile"
            workspace={workspace}
            files={workspaceDocs}
            highlightWorkspace={highlightWorkspace}
            loading={initializing || wsBusy}
            loadingMessage={wsBusyMessage}
            setLoadingMessage={setWsBusyMessage}
            setLoading={setWsBusy}
            fetchKeys={refresh}
            hasChanges={hasChanges}
            saveChanges={updateWorkspace}
            movedItems={movedItems}
          />
        </MobileTabPanel>
      </div>
    );
  }

  return (
    <div className="flex upload-modal -mt-6 z-10 relative">
      <Directory
        picker={picker}
        workspace={workspace}
        hiddenPaths={hiddenPaths}
        setHighlightWorkspace={setHighlightWorkspace}
        moveToWorkspace={moveSelectedItemsToWorkspace}
      />
      <div className="upload-modal-arrow">
        <ArrowsDownUp className="text-white text-base font-bold rotate-90 w-11 h-11" />
      </div>
      <WorkspaceDirectory
        workspace={workspace}
        files={workspaceDocs}
        highlightWorkspace={highlightWorkspace}
        loading={initializing || wsBusy}
        loadingMessage={wsBusyMessage}
        setLoadingMessage={setWsBusyMessage}
        setLoading={setWsBusy}
        fetchKeys={refresh}
        hasChanges={hasChanges}
        saveChanges={updateWorkspace}
        movedItems={movedItems}
      />
    </div>
  );
}

/**
 * @param {Object} props
 * @param {"documents"|"workspace"} props.selected
 */
function MobileTabs({ selected, onSelect, workspaceDocCount, hasChanges }) {
  const { t } = useTranslation();
  return (
    <div className="shrink-0 px-4 pb-4">
      <div className="relative grid grid-cols-2 p-1 rounded-xl bg-zinc-800 light:bg-slate-100">
        <div
          className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-lg bg-zinc-700 light:bg-white light:shadow-sm transition-transform duration-200 ease-in-out ${
            selected === "workspace" ? "translate-x-full" : "translate-x-0"
          }`}
        />
        <MobileTab
          active={selected === "documents"}
          onClick={() => onSelect("documents")}
        >
          {t("connectors.directory.my-documents")}
        </MobileTab>
        <MobileTab
          active={selected === "workspace"}
          onClick={() => onSelect("workspace")}
        >
          {t("connectors.directory.in-workspace")}
          <span
            className={
              hasChanges
                ? "text-sky-400 light:text-sky-600"
                : "text-zinc-400 light:text-slate-500"
            }
          >
            {workspaceDocCount}
          </span>
        </MobileTab>
      </div>
    </div>
  );
}

function MobileTab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-none bg-transparent relative h-9 flex items-center justify-center gap-x-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
        active
          ? "text-slate-50 light:text-slate-900"
          : "text-zinc-400 light:text-slate-500"
      }`}
    >
      {children}
    </button>
  );
}

/** Keeps inactive tabs mounted so in-flight uploads and selections survive a switch. */
function MobileTabPanel({ active, children }) {
  return (
    <div className={`flex-col flex-1 min-h-0 ${active ? "flex" : "hidden"}`}>
      {children}
    </div>
  );
}
