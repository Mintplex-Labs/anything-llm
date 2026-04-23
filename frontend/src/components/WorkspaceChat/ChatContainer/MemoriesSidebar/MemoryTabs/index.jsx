import { Plus } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { useMemoriesContext } from "../MemoriesContext";

const LIMITS = {
  workspace: 20,
  global: 5,
};

export default function MemoryTabs() {
  const { workspace, activeTab, setActiveTab, memories, openCreateModal } =
    useMemoriesContext();
  const { t } = useTranslation();
  const workspaceName =
    workspace?.name || t("chat_window.memories.tab_workspace");
  const workspaceCount = memories.workspace.length;
  const globalCount = memories.global.length;

  return (
    <div className="flex items-center justify-between shrink-0">
      <div className="flex items-center gap-1">
        <TabPill
          label={workspaceName}
          count={`${workspaceCount}/${LIMITS.workspace}`}
          active={activeTab === "workspace"}
          onClick={() => setActiveTab("workspace")}
        />
        <TabPill
          label={t("chat_window.memories.tab_global")}
          count={`${globalCount}/${LIMITS.global}`}
          active={activeTab === "global"}
          onClick={() => setActiveTab("global")}
        />
      </div>
      <button
        type="button"
        onClick={openCreateModal}
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
