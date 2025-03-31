import React, { useState, useEffect } from "react";
import { CHECKLIST_ITEMS, ChecklistItem } from "../../checklist";
import { X } from "@phosphor-icons/react";

const CHECKLIST_HIDDEN = "anythingllm_checklist_dismissed";
export const CHECKLIST_STORAGE_KEY = "anythingllm_checklist_completed";

export default function Checklist() {
  const [isHidden, setIsHidden] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const hidden = window.localStorage.getItem(CHECKLIST_HIDDEN);
    setIsHidden(!!hidden);

    const stored = window.localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (stored) {
      const completedItems = JSON.parse(stored);
      setCompletedCount(Object.keys(completedItems).length);
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleStorageChange = () => {
    const stored = window.localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (stored) {
      const completedItems = JSON.parse(stored);
      setCompletedCount(Object.keys(completedItems).length);
    }
  };

  const handleClose = () => {
    window.localStorage.setItem(CHECKLIST_HIDDEN, "true");
    setIsHidden(true);
  };

  if (isHidden) return null;

  return (
    <div className="rounded-3xl border border-white/20 p-4 lg:p-6 -mb-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white font-semibold text-lg">Getting Started</h1>
        <div className="flex items-center gap-x-2">
          <p className="text-[#9F9FA0] text-xs">
            {CHECKLIST_ITEMS.length - completedCount} tasks left
          </p>
          <button
            onClick={handleClose}
            className="text-[#9F9FA0] hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={16} weight="bold" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CHECKLIST_ITEMS.map((item) => (
          <ChecklistItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
