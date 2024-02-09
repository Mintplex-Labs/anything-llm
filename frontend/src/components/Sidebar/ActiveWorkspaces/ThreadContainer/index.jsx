import Workspace from "@/models/workspace";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { Plus, CircleNotch } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import ThreadItem from "./ThreadItem";

export default function ThreadContainer({ workspace }) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchThreads() {
      if (!workspace.slug) return;
      const { threads } = await Workspace.threads.all(workspace.slug);
      setLoading(false);
      setThreads(threads);
    }
    fetchThreads();
  }, [workspace.slug]);

  function removeThread(threadId) {
    setThreads((prev) => prev.filter((thread) => thread.id !== threadId));
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

  return (
    <div className="flex flex-col">
      <ThreadItem
        thread={{ slug: null, name: "default" }}
        hasNext={threads.length > 0}
      />
      {threads.map((thread, i) => (
        <ThreadItem
          key={thread.slug}
          workspace={workspace}
          onRemove={removeThread}
          thread={thread}
          hasNext={i !== threads.length - 1}
        />
      ))}
      <NewThreadButton workspace={workspace} />
    </div>
  );
}

function NewThreadButton({ workspace }) {
  const [loading, setLoading] = useState();
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
        {loading ? (
          <CircleNotch className="animate-spin text-slate-300" />
        ) : (
          <Plus className="text-slate-300" />
        )}
        {loading ? (
          <p className="text-left text-slate-300 text-sm">starting thread...</p>
        ) : (
          <p className="text-left text-slate-300 text-sm">new thread</p>
        )}
      </div>
    </button>
  );
}
