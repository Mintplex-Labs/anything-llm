import { Plus } from "@phosphor-icons/react";

const LIMITS = {
  workspace: 20,
  global: 5,
};

/**
 * @param {Object} props
 * @param {Object} props.workspace
 * @param {"workspace"|"global"} props.activeTab
 * @param {function} props.onTabChange
 * @param {number} props.workspaceCount
 * @param {number} props.globalCount
 * @param {function} props.onAdd
 */
export default function MemoryTabs({
  workspace,
  activeTab,
  onTabChange,
  workspaceCount,
  globalCount,
  onAdd,
}) {
  const workspaceName = workspace?.name || "Workspace";

  return (
    <div className="flex items-center justify-between shrink-0">
      <div className="flex items-center gap-1">
        <TabPill
          label={workspaceName}
          count={`${workspaceCount}/${LIMITS.workspace}`}
          active={activeTab === "workspace"}
          onClick={() => onTabChange("workspace")}
        />
        <TabPill
          label="Global"
          count={`${globalCount}/${LIMITS.global}`}
          active={activeTab === "global"}
          onClick={() => onTabChange("global")}
        />
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="-mr-1 flex items-center justify-center size-6 rounded-lg border-none bg-transparent cursor-pointer text-zinc-50 light:text-slate-900 hover:bg-zinc-800 light:hover:bg-slate-200 transition-colors"
      >
        <Plus size={16} weight="bold" />
      </button>
    </div>
  );
}

function TabPill({ label, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-0.5 h-6 px-3 rounded-full border-none cursor-pointer text-xs font-medium uppercase tracking-[1.2px] whitespace-nowrap transition-colors ${
        active
          ? "bg-zinc-800 light:bg-slate-300"
          : "bg-transparent hover:bg-zinc-800/50 light:hover:bg-slate-200"
      }`}
    >
      <span className="text-zinc-200 light:text-slate-800">{label}</span>
      <span className="text-zinc-400 light:text-slate-600 font-normal">
        ({count})
      </span>
    </button>
  );
}
