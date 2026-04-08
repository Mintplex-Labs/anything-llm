import { useState } from "react";
import { CaretDown, CaretRight } from "@phosphor-icons/react";

// Generic expand/collapse panel used by the run-detail page to wrap each
// trace section (thinking, tool calls, response, generated documents).
export default function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 bg-theme-bg-primary/50 hover:bg-theme-bg-primary/70 transition-colors text-left"
      >
        {open ? (
          <CaretDown className="h-4 w-4 text-theme-text-secondary" />
        ) : (
          <CaretRight className="h-4 w-4 text-theme-text-secondary" />
        )}
        <Icon className="h-4 w-4 text-theme-text-secondary" />
        <span className="text-sm font-medium text-theme-text-primary">
          {title}
        </span>
      </button>
      {open && <div className="p-4 border-t border-white/10">{children}</div>}
    </div>
  );
}
