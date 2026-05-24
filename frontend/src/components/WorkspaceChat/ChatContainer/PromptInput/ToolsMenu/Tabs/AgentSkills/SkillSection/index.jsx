import { useRef, useEffect } from "react";
import { CaretDown } from "@phosphor-icons/react";

export default function SkillSection({
  name,
  expanded,
  onToggle,
  enabledCount,
  totalCount,
  isMcp = false,
  indented = false,
  highlighted = false,
  children,
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (highlighted) ref.current?.scrollIntoView({ block: "nearest" });
  }, [highlighted]);

  let headerClasses =
    "border-none bg-transparent w-full flex items-center justify-between px-2 py-1 rounded cursor-pointer";
  if (highlighted) headerClasses += " bg-zinc-700/50 light:bg-slate-100";
  else headerClasses += " hover:bg-zinc-700/30 light:hover:bg-slate-50";

  return (
    <div className={indented ? "ml-3" : ""}>
      <button
        ref={ref}
        type="button"
        className={headerClasses}
        onClick={onToggle}
      >
        <div className="flex items-center gap-1.5">
          <CaretDown
            size={10}
            weight="bold"
            className={`text-zinc-400 light:text-slate-500 transition-transform duration-150 ${
              expanded ? "" : "-rotate-90"
            }`}
          />
          <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400 light:text-slate-500">
            {name}
          </span>
          {isMcp && (
            <span className="text-[8px] px-1 py-px rounded bg-zinc-600/50 light:bg-slate-200 text-zinc-300 light:text-slate-500 font-medium leading-tight">
              MCP
            </span>
          )}
        </div>
        <span className="text-[10px] text-zinc-500 light:text-slate-400 tabular-nums">
          {enabledCount}/{totalCount}
        </span>
      </button>
      {expanded && <div className="pl-3">{children}</div>}
    </div>
  );
}
