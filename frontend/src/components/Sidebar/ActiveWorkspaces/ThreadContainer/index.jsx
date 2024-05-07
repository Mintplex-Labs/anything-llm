import Workspace from "@/models/workspace";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { Plus, CircleNotch, Trash } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import ThreadItem from "./ThreadItem";
import { useParams } from "react-router-dom";

export default function ThreadContainer({ workspace }) {
  const { threadSlug = null } = useParams();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ctrlPressed, setCtrlPressed] = useState(false);
  const isThreadSelected = threads.some((_t) => _t.selected);

  useEffect(() => {
    async function fetchThreads() {
      if (!workspace.slug) return;
      const { threads } = await Workspace.threads.all(workspace.slug);
      setLoading(false);
      setThreads(threads);
    }
    fetchThreads();
  }, [workspace.slug]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Control") {
        setCtrlPressed(true);
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === "Control") {
        setCtrlPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleThreadClick = (id) => {
    if (!ctrlPressed && !isThreadSelected) return;
    const updatedItems = threads.map((_t) =>
      _t.id === id ? { ..._t, selected: !_t.selected } : _t
    );
    setThreads(updatedItems);
  };

  const handleDeleteAll = () => {
    const remainingItems = threads.map((item) => ({
      ...item,
      deleted: item.selected ? true : item.deleted, // Set deleted to true if selected is true
    }));
    setThreads(remainingItems);
  };

  function removeThread(threadId) {
    setThreads((prev) =>
      prev.map((_t) => {
        if (_t.id !== threadId) return _t;
        return { ..._t, deleted: true };
      })
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col bg-pulse w-full h-10 items-center justify-center">
        <p className="text-xs text-slate-600 animate-pulse">
          loading threads....
        </p>
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
      />
      {threads.map((thread, i) => (
        <ThreadItem
          key={thread.slug}
          idx={i + 1}
          ctrlPressed={ctrlPressed}
          onSelect={() => handleThreadClick(thread.id)}
          activeIdx={activeThreadIdx}
          isActive={activeThreadIdx === i + 1}
          workspace={workspace}
          onRemove={removeThread}
          thread={thread}
          hasNext={i !== threads.length - 1}
        />
      ))}
      {isThreadSelected && <DeleteAllThreadButton onDelete={handleDeleteAll} />}
      <NewThreadButton workspace={workspace} />
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
      className="w-full relative flex h-[40px] items-center border-none hover:bg-slate-600/20 rounded-lg"
    >
      <div className="flex w-full gap-x-2 items-center pl-4">
        <div className="bg-zinc-600 p-2 rounded-lg h-[24px] w-[24px] flex items-center justify-center">
          {loading ? (
            <CircleNotch
              weight="bold"
              size={14}
              className="shrink-0 animate-spin text-slate-100"
            />
          ) : (
            <Plus weight="bold" size={14} className="shrink-0 text-slate-100" />
          )}
        </div>

        {loading ? (
          <p className="text-left text-slate-100 text-sm">Starting Thread...</p>
        ) : (
          <p className="text-left text-slate-100 text-sm">New Thread</p>
        )}
      </div>
    </button>
  );
}

function DeleteAllThreadButton({ onDelete }) {
  return (
    <button
      onClick={onDelete}
      className="w-full relative flex h-[40px] items-center border-none hover:bg-slate-600/20 rounded-lg"
    >
      <div className="flex w-full gap-x-2 items-center pl-4">
        <div className="bg-zinc-600 p-2 rounded-lg h-[24px] w-[24px] flex items-center justify-center">
          <Trash weight="bold" size={14} className="shrink-0 text-slate-100" />
        </div>
        <p className=" text-red-600 text-left text-sm">Delete Selected</p>
      </div>
    </button>
  );
}
