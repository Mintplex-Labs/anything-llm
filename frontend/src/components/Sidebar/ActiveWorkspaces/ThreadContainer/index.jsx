import Workspace from "@/models/workspace";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { Plus, CircleNotch, Trash, CaretRight } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import ThreadItem from "./ThreadItem";
import { useParams } from "react-router-dom";
export const THREAD_RENAME_EVENT = "renameThread";

export default function ThreadContainer({ workspace }) {
  const { threadSlug = null } = useParams();
  const [threads, setThreads] = useState([]);
  const [archivedThreads, setArchivedThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ctrlPressed, setCtrlPressed] = useState(false);
  const [showArchivedThreads, setShowArchivedThreads] = useState(false);

  useEffect(() => {
    const chatHandler = (event) => {
      const { threadSlug, newName } = event.detail;
      setThreads((prevThreads) =>
        prevThreads.map((thread) => {
          if (thread.slug === threadSlug) {
            return { ...thread, name: newName };
          }
          return thread;
        })
      );
    };

    window.addEventListener(THREAD_RENAME_EVENT, chatHandler);

    return () => {
      window.removeEventListener(THREAD_RENAME_EVENT, chatHandler);
    };
  }, []);

  useEffect(() => {
    async function fetchThreads() {
      if (!workspace.slug) return;
      const { threads } = await Workspace.threads.all(workspace.slug);
      const { threads: archivedThreads } = await Workspace.threads.allArchived(
        workspace.slug
      );
      setLoading(false);
      setThreads(threads);
      setArchivedThreads(archivedThreads);
    }
    fetchThreads();
  }, [workspace.slug]);

  // Enable toggling of bulk-deletion by holding meta-key (ctrl on win and cmd/fn on others)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (["Control", "Meta"].includes(event.key)) {
        setCtrlPressed(true);
      }
    };

    const handleKeyUp = (event) => {
      if (["Control", "Meta"].includes(event.key)) {
        setCtrlPressed(false);
        // when toggling, unset bulk progress so
        // previously marked threads that were never deleted
        // come back to life.
        setThreads((prev) =>
          prev.map((t) => {
            return { ...t, deleted: false };
          })
        );
        setArchivedThreads((prev) =>
          prev.map((t) => {
            return { ...t, deleted: false };
          })
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const toggleForDeletion = (id) => {
    // Handle regular threads
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        return { ...t, deleted: !t.deleted };
      })
    );

    // Also handle archived threads
    setArchivedThreads((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        return { ...t, deleted: !t.deleted };
      })
    );
  };

  const handleDeleteAll = async () => {
    // Get slugs from both regular and archived threads that are marked for deletion
    const regularSlugs = threads
      .filter((t) => t.deleted === true)
      .map((t) => t.slug);
    const archivedSlugs = archivedThreads
      .filter((t) => t.deleted === true)
      .map((t) => t.slug);
    const allSlugs = [...regularSlugs, ...archivedSlugs];
    const selectedCount = regularSlugs.length + archivedSlugs.length;

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedCount} selected thread${selectedCount > 1 ? "s" : ""}? This cannot be undone.`
      )
    ) {
      return;
    }

    await Workspace.threads.deleteBulk(workspace.slug, allSlugs);

    // Remove deleted threads from both arrays
    setThreads((prev) => prev.filter((t) => !t.deleted));
    setArchivedThreads((prev) => prev.filter((t) => !t.deleted));

    // Only redirect if current thread is being deleted
    if (allSlugs.includes(threadSlug)) {
      window.location.href = paths.workspace.chat(workspace.slug);
    }
  };

  const handleViewArchivedThreads = () => {
    setShowArchivedThreads(!showArchivedThreads);
  };

  function removeThread(threadId) {
    setThreads((prev) =>
      prev.map((_t) => {
        if (_t.id !== threadId) return _t;
        return { ..._t, deleted: true };
      })
    );

    setArchivedThreads((prev) =>
      prev.map((_t) => {
        if (_t.id !== threadId) return _t;
        return { ..._t, deleted: true };
      })
    );

    // Show thread was deleted, but then remove from threads entirely so it will
    // not appear in bulk-selection.
    setTimeout(() => {
      setThreads((prev) => prev.filter((t) => !t.deleted));
      setArchivedThreads((prev) => prev.filter((t) => !t.deleted));
    }, 500);
  }

  const archiveThread = async (thread) => {
    setThreads((prev) => prev.filter((t) => t.id !== thread.id));
    setArchivedThreads((prev) => [...prev, { ...thread, archived: true }]);
    showToast("Thread archived successfully!", "success", { clear: true });

    // Redirect if archiving the active thread
    if (threadSlug === thread.slug) {
      window.location.href = paths.workspace.chat(workspace.slug);
    }
  };

  const restoreThread = async (thread) => {
    setArchivedThreads((prev) => prev.filter((t) => t.id !== thread.id));
    setThreads((prev) => [...prev, { ...thread, archived: false }]);
    showToast("Thread restored successfully!", "success", { clear: true });

    // Redirect if restoring the active thread
    if (threadSlug === thread.slug) {
      window.location.href = paths.workspace.chat(workspace.slug);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col bg-pulse w-full h-10 items-center justify-center">
        <p className="text-xs text-white animate-pulse">loading threads....</p>
      </div>
    );
  }

  const activeThreadIdx = !!threads.find(
    (thread) => thread?.slug === threadSlug
  )
    ? threads.findIndex((thread) => thread?.slug === threadSlug) + 1
    : 0;

  return (
    <div className="flex flex-col" role="list" aria-label="Threads">
      <ThreadItem
        idx={0}
        activeIdx={activeThreadIdx}
        isActive={activeThreadIdx === 0}
        thread={{ slug: null, name: "default" }}
        hasNext={threads.length > 0}
        workspace={workspace}
      />
      {threads.map((thread, i) => (
        <ThreadItem
          key={thread.slug}
          idx={i + 1}
          ctrlPressed={ctrlPressed}
          toggleMarkForDeletion={toggleForDeletion}
          activeIdx={activeThreadIdx}
          isActive={activeThreadIdx === i + 1}
          workspace={workspace}
          onRemove={removeThread}
          onArchive={archiveThread}
          onRestore={restoreThread}
          thread={thread}
          hasNext={i !== threads.length - 1}
        />
      ))}
      <NewThreadButton workspace={workspace} />
      {archivedThreads.length > 0 && (
        <div className="hidden group-hover:block">
          <ViewArchivedThreadsButton
            handleViewArchivedThreads={handleViewArchivedThreads}
            showArchivedThreads={showArchivedThreads}
          />
          {showArchivedThreads && (
            <div className="overflow-visible">
              {archivedThreads.map((thread, i) => (
                <ThreadItem
                  key={thread.slug}
                  idx={threads.length + i + 1}
                  ctrlPressed={ctrlPressed}
                  toggleMarkForDeletion={toggleForDeletion}
                  activeIdx={activeThreadIdx}
                  isActive={activeThreadIdx === threads.length + i + 1}
                  workspace={workspace}
                  onRemove={removeThread}
                  onArchive={archiveThread}
                  onRestore={restoreThread}
                  thread={thread}
                  hasNext={i !== archivedThreads.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      )}
      <DeleteAllThreadButton
        ctrlPressed={ctrlPressed}
        threads={threads}
        archivedThreads={archivedThreads}
        onDelete={handleDeleteAll}
      />
    </div>
  );
}

function NewThreadButton({ workspace }) {
  const [loading, setLoading] = useState(false);
  const onClick = async () => {
    setLoading(true);
    const { thread, error } = await Workspace.threads.new(workspace.slug);
    if (!!error) {
      showToast(`Could not create thread - ${error}`, "error", { clear: true });
      setLoading(false);
      return;
    }
    window.location.replace(
      paths.workspace.thread(workspace.slug, thread.slug)
    );
  };

  return (
    <button
      onClick={onClick}
      className="w-full relative flex h-[40px] items-center border-none hover:bg-[var(--theme-sidebar-thread-selected)] hover:light:bg-theme-sidebar-subitem-hover rounded-lg"
    >
      <div className="flex w-full gap-x-2 items-center pl-4">
        <div className="bg-white/20 p-2 rounded-lg h-[24px] w-[24px] flex items-center justify-center">
          {loading ? (
            <CircleNotch
              weight="bold"
              size={14}
              className="shrink-0 animate-spin text-white light:text-theme-text-primary"
            />
          ) : (
            <Plus
              weight="bold"
              size={14}
              className="shrink-0 text-white light:text-theme-text-primary"
            />
          )}
        </div>

        {loading ? (
          <p className="text-left text-white light:text-theme-text-primary text-sm">
            Starting Thread...
          </p>
        ) : (
          <p className="text-left text-white light:text-theme-text-primary text-sm">
            New Thread
          </p>
        )}
      </div>
    </button>
  );
}

function DeleteAllThreadButton({
  ctrlPressed,
  threads,
  archivedThreads,
  onDelete,
}) {
  if (
    !ctrlPressed ||
    (threads.filter((t) => t.deleted).length === 0 &&
      archivedThreads.filter((t) => t.deleted).length === 0)
  )
    return null;

  return (
    <button
      type="button"
      onClick={onDelete}
      className="w-full relative flex h-[40px] items-center border-none hover:bg-red-400/20 rounded-lg group"
    >
      <div className="flex w-full gap-x-2 items-center pl-4">
        <div className="bg-transparent p-2 rounded-lg h-[24px] w-[24px] flex items-center justify-center">
          <Trash
            weight="bold"
            size={14}
            className="shrink-0 text-white light:text-red-500/50 group-hover:text-red-400"
          />
        </div>
        <p className="text-white light:text-theme-text-secondary text-left text-sm group-hover:text-red-400">
          Clear
        </p>
      </div>
    </button>
  );
}

function ViewArchivedThreadsButton({
  handleViewArchivedThreads,
  showArchivedThreads,
}) {
  return (
    <div
      className="w-full relative flex h-[40px] items-center border-none rounded-lg"
      role="listitem"
    >
      <div className="flex w-full items-center justify-between pr-2 group relative hover:bg-theme-sidebar-subitem-hover rounded-[4px]">
        <button
          onClick={handleViewArchivedThreads}
          className="w-full pl-2 py-1 overflow-hidden text-left flex items-center gap-x-2"
        >
          <CaretRight
            size={18}
            className={`text-theme-text-primary transition-transform duration-200 ${
              showArchivedThreads ? "rotate-90" : ""
            }`}
          />
          <p className="text-left text-xs text-theme-text-primary">
            Archived Threads
          </p>
        </button>
      </div>
    </div>
  );
}
