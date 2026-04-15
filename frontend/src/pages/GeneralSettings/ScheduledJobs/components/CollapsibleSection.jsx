import { useState } from "react";
import { CaretDown, CaretRight } from "@phosphor-icons/react";

// Generic expand/collapse panel used by the run-detail page to wrap each
// trace section (thinking, tool calls, response, files).
export default function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-zinc-700 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-12 flex items-center gap-2 px-[18px] hover:bg-white/5 transition-colors text-left"
      >
        {open ? (
          <CaretDown className="h-4 w-4 text-zinc-50" />
        ) : (
          <CaretRight className="h-4 w-4 text-zinc-50" />
        )}
        <Icon className="h-4 w-4 text-zinc-50" />
        <span className="text-sm font-medium text-zinc-50">{title}</span>
      </button>
      {open && (
        <div className="px-[18px] py-3 border-t border-zinc-700">
          {children}
        </div>
      )}
    </div>
  );
}
