import { useState, useEffect } from "react";
import useUser from "@/hooks/useUser";
import System from "@/models/system";
import { CHECKLIST_ITEMS, CHECKLIST_STORAGE_KEY } from "../constants";

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
      className="flex items-center gap-x-4 transition-colors cursor-pointer bg-theme-checklist-item-bg rounded-lg p-3 group"
      onClick={handleClick}
    >
      <div className="flex-1">
        <h3 className="text-theme-checklist-item-text text-sm font-medium group-hover:text-theme-checklist-item-hover transition-colors duration-200">
          {title}
        </h3>
      </div>
      {isCompleted ? (
        <div className="w-3.5 h-3.5 rounded-full border border-theme-checklist-checkbox-border flex items-center justify-center">
          <div className="w-2 h-2 bg-theme-checklist-checkbox-fill rounded-full" />
        </div>
      ) : (
        <button className="w-[64px] h-[24px] rounded-md border border-theme-checklist-button-border text-theme-checklist-button-text font-semibold text-xs transition-all duration-200 flex items-center justify-center hover:bg-theme-checklist-button-hover-bg hover:border-theme-checklist-button-hover-border">
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
