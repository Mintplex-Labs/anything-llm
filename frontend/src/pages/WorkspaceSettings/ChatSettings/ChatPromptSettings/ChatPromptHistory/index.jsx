import { useEffect, useState, forwardRef } from "react";
import PromptHistory from "@/models/promptHistory";
import { DotsThreeVertical, X } from "@phosphor-icons/react";
import moment from "moment";

const ChatPromptHistory = forwardRef(function ChatPromptHistory(
  { show, workspaceSlug, onRestore, onClose },
  ref
) {
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
      ref={ref}
      className={`fixed right-3 top-3 bottom-3 w-[375px] bg-theme-action-menu-bg rounded-xl py-4 px-4 z-[9999] overflow-y-auto ${
        show
          ? "translate-x-0 opacity-100 visible"
          : "translate-x-full opacity-0 invisible"
      } transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div className="text-white text-sm font-medium">
          System Prompt History
        </div>
        <div className="flex items-center gap-2">
          <div
            className="text-sm font-medium text-white cursor-pointer hover:text-gray-300"
            onClick={handleClearAll}
          >
            Clear All
          </div>
          <X
            size={16}
            weight="bold"
            className="text-white cursor-pointer hover:text-gray-300"
            onClick={onClose}
          />
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
              id={item.id}
              {...item}
              onRestore={() => onRestore(item.prompt)}
              setHistory={setHistory}
              workspaceSlug={workspaceSlug}
            />
          ))
        )}
      </div>
    </div>
  );
});

function PromptHistoryItem({
  id,
  prompt,
  modifiedAt,
  user,
  onRestore,
  setHistory,
  workspaceSlug,
}) {
  const deleteHistory = async (id) => {
    if (!workspaceSlug) return;
    const { success } = await PromptHistory.delete(id);
    if (success) {
      setHistory(history.filter((item) => item.id !== id));
    }
  };
  return (
    <div className="text-white">
      <div className="flex items-center justify-between">
        <div className="text-xs">
          {user && (
            <>
              <span className="text-sky-400">{user.username}</span>{" "}
              <span className="mx-1 text-white">•</span>
            </>
          )}
          <span className="text-[#B6B7B7]">{moment(modifiedAt).fromNow()}</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="text-xs cursor-pointer hover:text-gray-300"
            onClick={onRestore}
          >
            Restore
          </div>
          <DotsThreeVertical
            size={16}
            weight="bold"
            className="text-white cursor-pointer hover:text-gray-300"
            onClick={() => deleteHistory(id)}
          />
        </div>
      </div>
      <div className="flex items-center mt-1">
        <div className="text-white text-sm font-medium">{prompt}</div>
      </div>
    </div>
  );
}

export default ChatPromptHistory;
