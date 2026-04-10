import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Plus, DotsThreeVertical } from "@phosphor-icons/react";
import ChatSidebar, { useMemoriesSidebar } from "../ChatSidebar";
import { SimpleToggleSwitch } from "@/components/lib/Toggle";
import useUser from "@/hooks/useUser";
import Admin from "@/models/admin";
import Memory from "@/models/memory";
import MemoryModal from "./MemoryModal";

export { useMemoriesSidebar } from "../ChatSidebar";

const TABS = {
  WORKSPACE: "workspace",
  GLOBAL: "global",
};

const LIMITS = {
  workspace: 20,
  global: 5,
};

export default function MemoriesSidebar({ workspace }) {
  const { sidebarOpen, closeSidebar } = useMemoriesSidebar();
  const { user } = useUser();
  const canToggle = !user || user?.role === "admin";
  const [memories, setMemories] = useState({ global: [], workspace: [] });
  const [activeTab, setActiveTab] = useState(TABS.WORKSPACE);
  const [modalState, setModalState] = useState({ open: false, mode: "create" });
  const [editingMemory, setEditingMemory] = useState(null);
  const [enabled, setEnabled] = useState(false);
  const [loadingEnabled, setLoadingEnabled] = useState(true);

  useEffect(() => {
    if (!sidebarOpen) return;
    Admin.systemPreferencesByFields(["memory_enabled"]).then(({ settings }) => {
      const isOn = settings?.memory_enabled === "on";
      setEnabled(isOn);
      setLoadingEnabled(false);
    });
  }, [sidebarOpen]);

  async function fetchMemories() {
    if (!workspace?.id) return;
    const data = await Memory.forWorkspace(workspace.id);
    setMemories(data);
  }

  useEffect(() => {
    if (sidebarOpen && enabled) fetchMemories();
  }, [sidebarOpen, workspace?.id, enabled]);

  async function handleCreate(content) {
    const { memory } = await Memory.create(workspace.id, {
      content,
      scope: activeTab,
    });
    if (memory) fetchMemories();
  }

  async function handleDelete(memoryId) {
    await Memory.delete(memoryId);
    fetchMemories();
  }

  async function handleUpdate(memoryId, content) {
    const { memory } = await Memory.update(memoryId, { content });
    if (memory) fetchMemories();
  }

  async function handlePromote(memoryId) {
    const { memory } = await Memory.promoteToGlobal(memoryId);
    if (memory) fetchMemories();
  }

  async function handleDemote(memoryId) {
    if (!workspace?.id) return;
    const { memory } = await Memory.demoteToWorkspace(memoryId, workspace.id);
    if (memory) fetchMemories();
  }

  function openCreateModal() {
    setEditingMemory(null);
    setModalState({ open: true, mode: "create" });
  }

  function openEditModal(memory) {
    setEditingMemory(memory);
    setModalState({ open: true, mode: "edit" });
  }

  function closeModal() {
    setModalState({ open: false, mode: "create" });
    setEditingMemory(null);
  }

  const activeMemories =
    activeTab === TABS.WORKSPACE ? memories.workspace : memories.global;

  return (
    <>
      <ChatSidebar isOpen={sidebarOpen}>
        <div
          className="w-[366px] flex-shrink-0 flex flex-col gap-5 mt-[72px] px-5 overflow-y-auto no-scroll"
          style={{ maxHeight: "calc(100% - 88px)" }}
        >
          <SidebarHeader onClose={closeSidebar} />
          {canToggle && (
            <PersonalizationToggle
              enabled={enabled}
              loading={loadingEnabled}
              onToggle={setEnabled}
            />
          )}
          {enabled && (
            <>
              <MemoryTabs
                workspace={workspace}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                workspaceCount={memories.workspace.length}
                globalCount={memories.global.length}
                onAdd={openCreateModal}
              />
              {activeMemories.length === 0 ? (
                <EmptyState onCreateClick={openCreateModal} />
              ) : (
                <MemoryList
                  memories={activeMemories}
                  activeTab={activeTab}
                  onDelete={handleDelete}
                  onEdit={openEditModal}
                  onPromote={handlePromote}
                  onDemote={handleDemote}
                />
              )}
            </>
          )}
        </div>
      </ChatSidebar>
      <MemoryModal
        isOpen={modalState.open}
        mode={modalState.mode}
        initialContent={editingMemory?.content || ""}
        onClose={closeModal}
        onSubmit={(content) => {
          if (modalState.mode === "edit" && editingMemory) {
            handleUpdate(editingMemory.id, content);
          } else {
            handleCreate(content);
          }
        }}
      />
    </>
  );
}

function SidebarHeader({ onClose }) {
  return (
    <div className="flex items-start justify-between shrink-0">
      <p className="font-medium text-base leading-6 text-zinc-50 light:text-slate-900">
        Memories
      </p>
      <button
        onClick={onClose}
        type="button"
        className="text-zinc-50 light:text-slate-900 hover:text-white light:hover:text-slate-400 transition-colors border-none bg-transparent cursor-pointer"
      >
        <X size={16} weight="bold" />
      </button>
    </div>
  );
}

function PersonalizationToggle({ enabled, loading, onToggle }) {
  async function handleToggle(checked) {
    const value = checked ? "on" : "off";
    const { success } = await Admin.updateSystemPreferences({
      memory_enabled: value,
    });
    if (!success) return;
    onToggle(checked);
  }

  if (loading) return null;

  return (
    <div className="shrink-0 bg-zinc-900 light:bg-white light:border light:border-slate-300 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-50 light:text-slate-900">
            Enable Personalization
          </p>
          <p className="text-xs leading-4 text-zinc-400 light:text-slate-500">
            When enabled, AnythingLLM will learn user preferences and context
            from conversations
          </p>
        </div>
        <SimpleToggleSwitch
          size="md"
          enabled={enabled}
          onChange={handleToggle}
        />
      </div>
    </div>
  );
}

function MemoryTabs({
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
          active={activeTab === TABS.WORKSPACE}
          onClick={() => onTabChange(TABS.WORKSPACE)}
        />
        <TabPill
          label="Global"
          count={`${globalCount}/${LIMITS.global}`}
          active={activeTab === TABS.GLOBAL}
          onClick={() => onTabChange(TABS.GLOBAL)}
        />
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center justify-center size-6 rounded-lg border-none bg-transparent cursor-pointer text-zinc-50 light:text-slate-900 hover:bg-zinc-800 light:hover:bg-slate-200 transition-colors"
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

function MemoryList({
  memories,
  activeTab,
  onDelete,
  onEdit,
  onPromote,
  onDemote,
}) {
  return (
    <div className="flex flex-col gap-1.5 pb-4">
      {memories.map((memory) => (
        <MemoryCard
          key={memory.id}
          memory={memory}
          activeTab={activeTab}
          onDelete={onDelete}
          onEdit={onEdit}
          onPromote={onPromote}
          onDemote={onDemote}
        />
      ))}
    </div>
  );
}

function MemoryCard({
  memory,
  activeTab,
  onDelete,
  onEdit,
  onPromote,
  onDemote,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const isWorkspace = activeTab === TABS.WORKSPACE;

  return (
    <div className="relative shrink-0 bg-zinc-900 light:bg-white light:border light:border-slate-300 rounded-lg p-3 flex gap-0.5 items-start">
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-5 text-zinc-50 light:text-slate-900">
          {memory.content}
        </p>
        <p className="text-xs leading-4 text-zinc-400 light:text-slate-500 mt-1.5">
          {new Date(memory.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className="shrink-0 border-none bg-transparent cursor-pointer text-zinc-400 light:text-slate-400 hover:text-zinc-50 light:hover:text-slate-900 transition-colors p-0"
      >
        <DotsThreeVertical size={20} weight="bold" />
      </button>
      {menuOpen && (
        <CardMenu
          menuRef={menuRef}
          buttonRef={buttonRef}
          isWorkspace={isWorkspace}
          onEdit={() => {
            setMenuOpen(false);
            onEdit(memory);
          }}
          onMove={() => {
            setMenuOpen(false);
            if (isWorkspace) {
              onPromote(memory.id);
            } else {
              onDemote(memory.id);
            }
          }}
          onDelete={() => {
            setMenuOpen(false);
            onDelete(memory.id);
          }}
        />
      )}
    </div>
  );
}

function CardMenu({
  menuRef,
  buttonRef,
  isWorkspace,
  onEdit,
  onMove,
  onDelete,
}) {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 4, left: rect.right - 160 });
  }, []);

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-[9999] bg-zinc-800 light:bg-slate-50 border border-zinc-700 light:border-slate-300 rounded-lg p-3 flex flex-col gap-1.5 shadow-lg w-[160px]"
      style={{ top: pos.top, left: pos.left }}
    >
      <CardMenuItem label="Edit" onClick={onEdit} />
      <CardMenuItem
        label={isWorkspace ? "Move to Global" : "Move to Workspace"}
        onClick={onMove}
      />
      <CardMenuItem label="Delete" onClick={onDelete} />
    </div>,
    document.body
  );
}

function CardMenuItem({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left text-sm font-medium text-zinc-50 light:text-slate-700 border-none bg-transparent cursor-pointer hover:bg-zinc-700 light:hover:bg-slate-200 rounded px-2 py-1 transition-colors"
    >
      {label}
    </button>
  );
}

function EmptyState({ onCreateClick }) {
  return (
    <p className="text-sm leading-5 text-zinc-400 light:text-slate-600 text-center">
      No memories so far. After you interact with the chatbot more memories will
      fill in or{" "}
      <button
        type="button"
        onClick={onCreateClick}
        className="text-zinc-50 light:text-slate-900 underline border-none bg-transparent cursor-pointer p-0 text-sm leading-5 font-normal"
      >
        create a new memory
      </button>
    </p>
  );
}
