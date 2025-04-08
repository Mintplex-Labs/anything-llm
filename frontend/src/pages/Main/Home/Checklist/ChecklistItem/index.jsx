import { useState } from "react";
import { CHECKLIST_STORAGE_KEY } from "../constants";
import { Check } from "@phosphor-icons/react";

export function ChecklistItem({
  id,
  title,
  action,
  completed: defaultCompleted,
  onAction,
  icon: Icon,
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
      className={`flex items-center gap-x-4 transition-colors cursor-pointer rounded-lg p-3 group ${
        isCompleted ? "bg-[#36463D]" : "bg-[#203C48]"
      }`}
      onClick={handleClick}
    >
      {Icon && (
        <div className="flex-shrink-0">
          <Icon
            size={18}
            className={isCompleted ? "text-[#A6F4C5]" : "text-[#B9E6FE]"}
          />
        </div>
      )}
      <div className="flex-1">
        <h3
          className={`text-sm font-medium transition-colors duration-200 ${
            isCompleted
              ? "text-[#A6F4C5] line-through"
              : "text-[#B9E6FE] group-hover:text-white/90"
          }`}
        >
          {title}
        </h3>
      </div>
      {isCompleted ? (
        <div className="w-5 h-5 rounded-full bg-[#A6F4C5] flex items-center justify-center">
          <Check size={14} weight="bold" className="text-[#36463D]" />
        </div>
      ) : (
        <button className="w-[64px] h-[24px] rounded-md bg-white/10 text-white font-semibold text-xs transition-all duration-200 flex items-center justify-center hover:bg-white/10">
          {action}
        </button>
      )}
    </div>
  );
}
