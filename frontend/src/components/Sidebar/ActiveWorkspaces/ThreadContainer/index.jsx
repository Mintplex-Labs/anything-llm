import Workspace from "@/models/workspace";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { Plus, CircleNotch, Trash } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import ThreadItem from "./ThreadItem";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useChatThreadDrafts } from "@/contexts/ChatThreadDraftProvider";
import { debugChatTurn } from "@/utils/chat/debug";
export const THREAD_RENAME_EVENT = "renameThread";

export default function ThreadContainer({
  workspace,
  isVirtualThread = false,
}) {
  const { threadSlug = null } = useParams();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ctrlPressed, setCtrlPressed] = useState(false);
  const { t } = useTranslation();
  const { hasThreadActivity, clearThreadActivity } = useChatThreadDrafts();

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
      setLoading(false);
      setThreads(threads);
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

  function getActiveThreadIdx() {
    const rows = getSortedThreadRows(
      threads,
      workspace.slug,
      hasThreadActivity
    );
    if (isVirtualThread) return threads.length + 1;
    const idx = rows.findIndex((row) => row.thread?.slug === threadSlug);
    return idx >= 0 ? idx + 1 : 0;
  }

  useEffect(() => {
    const currentActivity = hasThreadActivity(workspace.slug, threadSlug);
    if (["completed", "failed"].includes(currentActivity?.status)) {
      clearThreadActivity(workspace.slug, threadSlug);
    }
  }, [workspace.slug, threadSlug, hasThreadActivity, clearThreadActivity]);

  const threadRows = getSortedThreadRows(
    threads,
    workspace.slug,
    hasThreadActivity
  );
  const activeThreadIdx = getActiveThreadIdx();
  const defaultActivity = displayActivity(
    hasThreadActivity(workspace.slug, null),
    activeThreadIdx === 0
  );

  useEffect(() => {
    debugChatTurn("ThreadContainer:renderState", {
      workspaceSlug: workspace.slug,
      activeThreadSlug: threadSlug,
      defaultActivityStatus: defaultActivity?.status || null,
      runningRows: threadRows
        .filter((row) => row.activity?.status === "running")
        .map((row) => ({
          threadSlug: row.thread.slug,
          turnId: row.activity.turnId,
        })),
    });
  }, [defaultActivity?.status, threadRows, threadSlug, workspace.slug]);

  if (loading) {
    return (
      <div className="flex flex-col bg-pulse w-full h-10 items-center justify-center">
        <p className="text-xs text-white animate-pulse">loading threads....</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col" role="list" aria-label="Threads">
      <ThreadItem
        idx={0}
        activeIdx={activeThreadIdx}
        isActive={activeThreadIdx === 0}
        workspace={workspace}
        thread={{ slug: null, name: t("common.default") }}
        activity={defaultActivity}
        hasNext={threads.length > 0 || isVirtualThread}
      />
      {threadRows.map(({ thread, activity }, i) => {
        const isActiveThread = activeThreadIdx === i + 1;
        return (
          <ThreadItem
            key={thread.slug}
            idx={i + 1}
            ctrlPressed={ctrlPressed}
            toggleMarkForDeletion={toggleForDeletion}
            activeIdx={activeThreadIdx}
            isActive={isActiveThread}
            workspace={workspace}
            onRemove={removeThread}
            thread={thread}
            activity={displayActivity(activity, isActiveThread)}
            hasNext={i !== threadRows.length - 1 || isVirtualThread}
          />
        );
      })}
      {isVirtualThread && (
        <ThreadItem
          idx={activeThreadIdx}
          activeIdx={activeThreadIdx}
          isActive={true}
          workspace={workspace}
          thread={{ slug: null, name: "*New Thread", virtual: true }}
          hasNext={false}
        />
      )}
      <DeleteAllThreadButton
        ctrlPressed={ctrlPressed}
        threads={threads}
        onDelete={handleDeleteAll}
      />
      <NewThreadButton workspace={workspace} />
    </div>
  );
}

function displayActivity(activity, isActive) {
  if (isActive) return activity?.status === "running" ? activity : null;
  return activity?.status === "running" ? activity : null;
}

function activitySortRank(activity) {
  if (activity?.status === "running") return 0;
  return 1;
}

function getSortedThreadRows(threads, workspaceSlug, hasThreadActivity) {
  return threads
    .map((thread, index) => ({
      thread,
      index,
      activity: hasThreadActivity(workspaceSlug, thread.slug),
    }))
    .sort((a, b) => {
      const rankDiff =
        activitySortRank(a.activity) - activitySortRank(b.activity);
      if (rankDiff !== 0) return rankDiff;
      if (activitySortRank(a.activity) === 0) {
        return (b.activity?.updatedAt || 0) - (a.activity?.updatedAt || 0);
      }
      return a.index - b.index;
    });
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
            Starting Thread...
          </p>
        ) : (
          <p className="text-left text-white light:text-theme-text-primary text-sm font-semibold">
            New Thread
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
