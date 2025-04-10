import { useState } from "react";
import { CHECKLIST_STORAGE_KEY, CHECKLIST_UPDATED_EVENT } from "../constants";
import { Check } from "@phosphor-icons/react";
import { safeJsonParse } from "@/utils/request";

export function ChecklistItem({ id, title, action, onAction, icon: Icon }) {
  const [isCompleted, setIsCompleted] = useState(() => {
    const stored = window.localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (!stored) return false;
    const completedItems = safeJsonParse(stored, {});
    return completedItems[id] || false;
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
        window.dispatchEvent(new CustomEvent(CHECKLIST_UPDATED_EVENT));
      }
    } else {
      await onAction();
    }
  };

  return (
    <div
      className={`flex items-center gap-x-4 transition-colors cursor-pointer rounded-lg p-3 group hover:bg-theme-checklist-item-bg-hover ${
        isCompleted
          ? "bg-theme-checklist-item-completed-bg"
          : "bg-theme-checklist-item-bg"
      }`}
      onClick={handleClick}
    >
      {Icon && (
        <div className="flex-shrink-0">
          <Icon
            size={18}
            className={
              isCompleted
                ? "text-theme-checklist-item-completed-text"
                : "text-theme-checklist-item-text"
            }
          />
        </div>
      )}
      <div className="flex-1">
        <h3
          className={`text-sm font-medium transition-colors duration-200 ${
            isCompleted
              ? "text-theme-checklist-item-completed-text line-through"
              : "text-theme-checklist-item-text"
          }`}
        >
          {title}
        </h3>
      </div>
      {isCompleted ? (
        <div className="w-5 h-5 rounded-full bg-theme-checklist-checkbox-fill flex items-center justify-center">
          <Check
            size={14}
            weight="bold"
            className="text-theme-checklist-checkbox-text"
          />
        </div>
      ) : (
        <button className="w-[64px] h-[24px] rounded-md bg-white/10 light:bg-white/70 text-theme-checklist-item-text font-semibold text-xs transition-all duration-200 flex items-center justify-center hover:bg-white/20 light:hover:bg-white/60">
          {action}
        </button>
      )}
    </div>
  );
}
