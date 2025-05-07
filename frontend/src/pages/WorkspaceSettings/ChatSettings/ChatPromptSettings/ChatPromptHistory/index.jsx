import { useEffect, useState, forwardRef } from "react";
import PromptHistory from "@/models/promptHistory";
import { X } from "@phosphor-icons/react";
import PromptHistoryItem from "./PromptHistoryItem";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default forwardRef(function ChatPromptHistory(
  { show, workspaceSlug, onRestore, onClose },
  ref
) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  function loadHistory() {
    if (!workspaceSlug) return;
    setLoading(true);
    PromptHistory.forWorkspace(workspaceSlug)
      .then((historyData) => {
        setHistory(historyData);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleClearAll() {
    if (!workspaceSlug) return;
    if (
      window.confirm(
        "Are you sure you want to clear all history? This action cannot be undone."
      )
    ) {
      PromptHistory.clearAll(workspaceSlug)
        .then(({ success }) => {
          if (success) setHistory([]);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  useEffect(() => {
    if (show && workspaceSlug) loadHistory();
  }, [show, workspaceSlug]);

  return (
    <div
      ref={ref}
      className={`fixed right-3 top-3 bottom-3 w-[375px] bg-theme-action-menu-bg light:bg-theme-home-update-card-bg rounded-xl py-4 px-4 z-[9999] overflow-y-auto ${
        show
          ? "translate-x-0 opacity-100 visible"
          : "translate-x-full opacity-0 invisible"
      } transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div className="text-theme-text-primary text-sm font-semibold">
          System Prompt History
        </div>
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              type="button"
              className="text-sm font-medium text-theme-text-secondary cursor-pointer hover:text-primary-button"
              onClick={handleClearAll}
            >
              Clear All
            </button>
          )}
          <button
            type="button"
            className="text-theme-text-secondary cursor-pointer hover:text-primary-button"
            onClick={onClose}
          >
            <X size={16} weight="bold" />
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-y-[14px] h-full">
        {loading ? (
          <LoaderSkeleton />
        ) : history.length === 0 ? (
          <div className="flex text-theme-text-secondary text-sm text-center w-full h-full flex items-center justify-center">
            No system prompt history available
          </div>
        ) : (
          history.map((item) => (
            <PromptHistoryItem
              key={item.id}
              id={item.id}
              {...item}
              onRestore={() => onRestore(item.prompt)}
              setHistory={setHistory}
            />
          ))
        )}
      </div>
    </div>
  );
});

function LoaderSkeleton() {
  const highlightColor = "var(--theme-bg-primary)";
  const baseColor = "var(--theme-bg-secondary)";
  return (
    <Skeleton.default
      height="85px"
      width="100%"
      highlightColor={highlightColor}
      baseColor={baseColor}
      count={8}
    />
  );
}
