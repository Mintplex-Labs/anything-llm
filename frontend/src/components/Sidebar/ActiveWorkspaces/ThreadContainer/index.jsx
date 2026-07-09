import Workspace from "@/models/workspace";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { Plus, CircleNotch, Trash } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import ThreadItem from "./ThreadItem";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useHoverMetaKey from "./hooks";
export const THREAD_RENAME_EVENT = "renameThread";

// Pinned threads are stored per-workspace in the browser (no backend/DB change
// required). Each entry is a thread slug; pinned threads float to the top.
function pinnedStorageKey(workspaceSlug) {
  return `anythingllm-pinned-threads-${workspaceSlug}`;
}

function readPinnedSlugs(workspaceSlug) {
  try {
    const raw = window.localStorage.getItem(pinnedStorageKey(workspaceSlug));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writePinnedSlugs(workspaceSlug, slugs) {
  try {
    window.localStorage.setItem(
      pinnedStorageKey(workspaceSlug),
      JSON.stringify(slugs)
    );
  } catch {
    // ignore storage failures (private mode / quota)
  }
}

export default function ThreadContainer({
  workspace,
  isVirtualThread = false,
}) {
  const { t } = useTranslation();
  const { threadSlug = null } = useParams();
  const [threads, setThreads] = useState([]);
  const [defaultThreadHasChats, setDefaultThreadHasChats] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pinnedSlugs, setPinnedSlugs] = useState([]);
  const { containerRef, ctrlPressed } = useHoverMetaKey(setThreads, !loading);

  useEffect(() => {
    if (!workspace.slug) return;
    setPinnedSlugs(readPinnedSlugs(workspace.slug));
  }, [workspace.slug]);

  function togglePin(threadSlug) {
    if (!threadSlug) return;
    setPinnedSlugs((prev) => {
      const next = prev.includes(threadSlug)
        ? prev.filter((s) => s !== threadSlug)
        : [threadSlug, ...prev];
      writePinnedSlugs(workspace.slug, next);
      return next;
    });
  }

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
      const { threads, defaultThreadChatCount } = await Workspace.threads.all(
        workspace.slug
      );
      setLoading(false);
      setThreads(threads);
      setDefaultThreadHasChats(defaultThreadChatCount > 0);
    }
    fetchThreads();
  }, [workspace.slug, threadSlug]);

  const toggleForDeletion = (id) => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        return { ...t, deleted: !t.deleted };
      })
    );
  };

  const handleDeleteAll = async () => {
    const slugs = threads.filter((t) => t.deleted === true).map((t) => t.slug);
    await Workspace.threads.deleteBulk(workspace.slug, slugs);
    setThreads((prev) => prev.filter((t) => !t.deleted));

    // Only redirect if current thread is being deleted
    if (slugs.includes(threadSlug)) {
      window.location.href = paths.workspace.chat(workspace.slug);
    }
  };

  function removeThread(threadId) {
    setThreads((prev) =>
      prev.map((_t) => {
        if (_t.id !== threadId) return _t;
        return { ..._t, deleted: true };
      })
    );

    // Show thread was deleted, but then remove from threads entirely so it will
    // not appear in bulk-selection.
    setTimeout(() => {
      setThreads((prev) => prev.filter((t) => !t.deleted));
    }, 500);
  }

  if (loading) {
    return (
      <div className="flex flex-col bg-pulse w-full h-10 items-center justify-center">
        <p className="text-xs text-white animate-pulse">loading threads....</p>
      </div>
    );
  }

  // Show a virtual thread when on a bare workspace route (no threadSlug) and
  // the default thread has no chats — mimics the Home page virtual thread behavior.
  const showVirtualThread =
    isVirtualThread || (!threadSlug && !defaultThreadHasChats);

  // Newest threads first ("reverse direction"), each group newest-first.
  const pinnedSet = new Set(pinnedSlugs);
  const newestFirst = [...threads].reverse();
  const pinnedThreads = newestFirst.filter((thread) =>
    pinnedSet.has(thread.slug)
  );
  const unpinnedThreads = newestFirst.filter(
    (thread) => !pinnedSet.has(thread.slug)
  );

  // Build the visible item list top-to-bottom so the connector-line indices
  // (idx / activeIdx / hasNext) stay consistent with the ordering:
  // pinned threads at the very top, then the default workspace chat, then the
  // rest of the threads (newest first).
  const visualItems = [];
  if (showVirtualThread) visualItems.push({ kind: "virtual" });
  pinnedThreads.forEach((thread) =>
    visualItems.push({ kind: "thread", thread })
  );
  if (defaultThreadHasChats) visualItems.push({ kind: "default" });
  unpinnedThreads.forEach((thread) =>
    visualItems.push({ kind: "thread", thread })
  );

  const activeIdx = visualItems.findIndex((it) => {
    if (it.kind === "virtual") return true;
    if (it.kind === "default") return !threadSlug && !showVirtualThread;
    return it.thread.slug === threadSlug;
  });

  return (
    <div
      ref={containerRef}
      className="flex flex-col"
      role="list"
      aria-label="Threads"
    >
      <NewThreadButton workspace={workspace} />
      <DeleteAllThreadButton
        ctrlPressed={ctrlPressed}
        threads={threads}
        onDelete={handleDeleteAll}
      />
      {visualItems.map((it, i) => {
        const hasNext = i < visualItems.length - 1;
        const isActive = i === activeIdx;
        if (it.kind === "virtual") {
          return (
            <ThreadItem
              key="virtual-thread"
              idx={i}
              activeIdx={activeIdx}
              isActive={isActive}
              workspace={workspace}
              thread={{
                slug: null,
                name: `*${t("common.new-thread")}`,
                virtual: true,
              }}
              hasNext={hasNext}
            />
          );
        }
        if (it.kind === "default") {
          return (
            <ThreadItem
              key="default-thread"
              idx={i}
              activeIdx={activeIdx}
              isActive={isActive}
              workspace={workspace}
              thread={{ slug: null, name: "default" }}
              hasNext={hasNext}
            />
          );
        }
        const thread = it.thread;
        return (
          <ThreadItem
            key={thread.slug}
            idx={i}
            ctrlPressed={ctrlPressed}
            toggleMarkForDeletion={toggleForDeletion}
            activeIdx={activeIdx}
            isActive={isActive}
            workspace={workspace}
            onRemove={removeThread}
            thread={thread}
            hasNext={hasNext}
            isPinned={pinnedSet.has(thread.slug)}
            onTogglePin={togglePin}
          />
        );
      })}
    </div>
  );
}

function NewThreadButton({ workspace }) {
  const { t } = useTranslation();
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
      className="w-full relative flex h-[40px] items-center border-none hover:bg-[var(--theme-sidebar-thread-selected)] light:hover:bg-slate-300 hover:light:bg-theme-sidebar-subitem-hover rounded-lg"
    >
      <div className="flex w-full gap-x-2 items-center pl-4">
        <div className="bg-zinc-800 light:bg-slate-50 p-2 rounded-lg h-[24px] w-[24px] flex items-center justify-center">
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
            {t("common.starting-thread")}
          </p>
        ) : (
          <p className="text-left text-white light:text-theme-text-primary text-sm font-semibold">
            {t("common.new-thread")}
          </p>
        )}
      </div>
    </button>
  );
}

function DeleteAllThreadButton({ ctrlPressed, threads, onDelete }) {
  if (!ctrlPressed || threads.filter((t) => t.deleted).length === 0)
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
          Delete Selected
        </p>
      </div>
    </button>
  );
}
