import { useState, useEffect } from "react";
import useUser from "@/hooks/useUser";
import System from "@/models/system";

export const CHECKLIST_STORAGE_KEY = "anythingllm_checklist_completed";

export const CHECKLIST_ITEMS = [
  {
    id: "create_workspace",
    title: "Create a workspace",
    description: "Create your first workspace to get started",
    action: "Create",
    handler: "createWorkspace",
    completed: false,
    roles: ["admin", "manager"],
  },
  {
    id: "send_chat",
    title: "Send a chat",
    description: "Start a conversation with your AI assistant",
    action: "Chat",
    handler: "sendChat",
    completed: false,
    roles: ["admin", "manager", "default"],
  },
  {
    id: "embed_document",
    title: "Embed a document",
    description: "Add your first document to your workspace",
    action: "Embed",
    handler: "embedDocument",
    completed: false,
    roles: ["admin", "manager"],
  },
  {
    id: "setup_system_prompt",
    title: "Set up a system prompt",
    description: "Configure your AI assistant's behavior",
    action: "Set Up",
    handler: "setSystemPrompt",
    completed: false,
    roles: ["admin", "manager"],
  },
  {
    id: "define_slash_command",
    title: "Define a slash command",
    description: "Create custom commands for your assistant",
    action: "Define",
    handler: "setSlashCommand",
    completed: false,
    roles: ["admin", "manager", "default"],
  },
  {
    id: "visit_community",
    title: "Visit Community Hub",
    description: "Explore community resources and templates",
    action: "Browse",
    handler: "visitCommunityHub",
    completed: false,
    roles: ["admin", "manager", "default"],
  },
];

export function ChecklistItem({
  id,
  title,
  action,
  completed: defaultCompleted,
  onAction,
}) {
  const [isCompleted, setIsCompleted] = useState(() => {
    const stored = window.localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (!stored) return defaultCompleted;
    const completedItems = JSON.parse(stored);
    return completedItems[id] || defaultCompleted;
  });

  const handleClick = async (e) => {
    e.preventDefault();
    if (!isCompleted) {
      const shouldComplete = await onAction();
      if (shouldComplete) {
        const stored = window.localStorage.getItem(CHECKLIST_STORAGE_KEY);
        const completedItems = stored ? JSON.parse(stored) : {};
        completedItems[id] = true;
        window.localStorage.setItem(
          CHECKLIST_STORAGE_KEY,
          JSON.stringify(completedItems)
        );
        setIsCompleted(true);
      }
    } else {
      await onAction();
    }
  };

  return (
    <div
      className="flex items-center gap-x-4 transition-colors cursor-pointer bg-[#3E3C3E] rounded-lg p-3 group"
      onClick={handleClick}
    >
      <div className="flex-1">
        <h3 className="text-white text-sm font-medium group-hover:text-[#36BFFA] transition-colors duration-200">
          {title}
        </h3>
      </div>
      {isCompleted ? (
        <div className="w-3.5 h-3.5 rounded-full border border-white flex items-center justify-center">
          <div className="w-2 h-2 bg-[#6CE9A6] rounded-full" />
        </div>
      ) : (
        <button className="w-[64px] h-[24px] rounded-md border border-[#36BFFA] text-[#36BFFA] font-semibold text-xs transition-all duration-200 flex items-center justify-center hover:bg-[#36BFFA]/20 hover:border-[#36BFFA]/80">
          {action}
        </button>
      )}
    </div>
  );
}

export function useChecklistItems() {
  const [items, setItems] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    async function checkMultiUserMode() {
      const isMultiUser = await System.isMultiUserMode();

      if (!isMultiUser) {
        setItems(CHECKLIST_ITEMS);
        return;
      }

      const filteredItems = CHECKLIST_ITEMS.filter(
        (item) => !item.roles || item.roles.includes(user?.role)
      );
      setItems(filteredItems);
    }
    checkMultiUserMode();
  }, [user?.role]);

  return items;
}
