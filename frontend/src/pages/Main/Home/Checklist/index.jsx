import React, { useState, useEffect } from "react";
import { CHECKLIST_ITEMS, ChecklistItem } from "../../checklist";
import { X } from "@phosphor-icons/react";

const CHECKLIST_HIDDEN = "anythingllm_checklist_dismissed";

export default function Checklist() {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const hidden = window.localStorage.getItem(CHECKLIST_HIDDEN);
    setIsHidden(!!hidden);
  }, []);

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
            {CHECKLIST_ITEMS.filter((item) => !item.completed).length} tasks
            left
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
        {CHECKLIST_ITEMS.map((item, i) => (
          <ChecklistItem key={i} {...item} />
        ))}
      </div>
    </div>
  );
}
