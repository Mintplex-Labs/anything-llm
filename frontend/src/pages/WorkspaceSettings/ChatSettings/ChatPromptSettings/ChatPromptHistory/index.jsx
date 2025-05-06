import { useEffect, useState } from "react";
import PromptHistory from "@/models/promptHistory";

export default function ChatPromptHistory({ show, workspaceSlug, onRestore }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    if (!workspaceSlug) return;
    setLoading(true);
    const historyData = await PromptHistory.forWorkspace(workspaceSlug);
    setHistory(historyData);
    setLoading(false);
  };

  const handleClearAll = async () => {
    if (!workspaceSlug) return;
    const { success } = await PromptHistory.clearAll(workspaceSlug);
    if (success) {
      setHistory([]);
    }
  };

  useEffect(() => {
    if (show && workspaceSlug) {
      loadHistory();
    }
  }, [show, workspaceSlug]);

  return (
    <div
      className={`fixed right-3 top-3 bottom-3 w-[375px] bg-theme-action-menu-bg rounded-xl py-4 px-4 z-[9999] overflow-y-auto ${
        show ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300`}
    >
      <div className="flex items-center justify-between">
        <div className="text-white text-sm font-medium">
          System Prompt History
        </div>
        <div
          className="text-sm font-medium text-white cursor-pointer hover:text-gray-300"
          onClick={handleClearAll}
        >
          Clear All
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-y-[14px]">
        {loading ? (
          <div className="text-white text-sm">Loading...</div>
        ) : history.length === 0 ? (
          <div className="text-white text-sm">No history available</div>
        ) : (
          history.map((item) => (
            <PromptHistoryItem
              key={item.id}
              {...item}
              onRestore={() => onRestore(item.prompt)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function PromptHistoryItem({ prompt, modifiedAt, modifiedBy, user, onRestore }) {
  return (
    <div className="text-white">
      <div className="flex items-center justify-between">
        <div className="text-[#B6B7B7] text-xs">
          {new Date(modifiedAt).toLocaleString()}
          {user && ` by ${user.username}`}
        </div>
        <div
          className="text-xs cursor-pointer hover:text-gray-300"
          onClick={onRestore}
        >
          Restore
        </div>
      </div>
      <div className="flex items-center">
        <div className="text-white text-sm font-medium">{prompt}</div>
      </div>
    </div>
  );
}
