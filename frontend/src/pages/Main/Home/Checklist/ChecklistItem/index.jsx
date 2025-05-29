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
      className={`flex items-center gap-x-4 transition-all duration-200 cursor-pointer rounded-lg p-3 group hover:bg-hemp-warm ${
        isCompleted ? "bg-hemp-primary/10" : "bg-hemp-neutral hover:shadow-sm"
      }`}
      onClick={handleClick}
    >
      {Icon && (
        <div className="flex-shrink-0">
          <Icon
            size={18}
            className={isCompleted ? "text-hemp-primary" : "text-hemp-text"}
          />
        </div>
      )}
      <div className="flex-1">
        <h3
          className={`text-sm font-medium transition-colors duration-200 ${
            isCompleted ? "text-hemp-primary line-through" : "text-hemp-text"
          }`}
        >
          {title}
        </h3>
      </div>
      {isCompleted ? (
        <div className="w-5 h-5 rounded-full bg-hemp-primary flex items-center justify-center">
          <Check size={14} weight="bold" className="text-white" />
        </div>
      ) : (
        <button className="w-[64px] h-[24px] rounded-md bg-hemp-accent text-hemp-text font-semibold text-xs transition-all duration-200 flex items-center justify-center hover:bg-hemp-secondary hover:text-white">
          {action}
        </button>
      )}
    </div>
  );
}
