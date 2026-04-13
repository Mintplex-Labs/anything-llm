import { useState, useEffect } from "react";
import { X } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import ChatSidebar, { useMemoriesSidebar } from "../ChatSidebar";
import useUser from "@/hooks/useUser";
import System from "@/models/system";
import Memory from "@/models/memory";
import PersonalizationToggle from "./PersonalizationToggle";
import MemoryTabs from "./MemoryTabs";
import MemoryCard from "./MemoryCard";
import MemoryModal from "./MemoryModal";

export { useMemoriesSidebar } from "../ChatSidebar";

export default function MemoriesSidebar({ workspace }) {
  const { sidebarOpen, closeSidebar } = useMemoriesSidebar();
  const { user } = useUser();
  const canToggle = !user || user?.role === "admin";
  const [memories, setMemories] = useState({ global: [], workspace: [] });
  const [activeTab, setActiveTab] = useState("workspace");
  const [modalState, setModalState] = useState({ open: false, mode: "create" });
  const [editingMemory, setEditingMemory] = useState(null);
  const [enabled, setEnabled] = useState(false);
  const [loadingEnabled, setLoadingEnabled] = useState(true);

  useEffect(() => {
    if (!sidebarOpen) return;
    System.keys().then((settings) => {
      setEnabled(!!settings?.MemoryEnabled);
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
    activeTab === "workspace" ? memories.workspace : memories.global;

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
                <div className="flex flex-col gap-1.5 pb-4">
                  {activeMemories.map((memory) => (
                    <MemoryCard
                      key={memory.id}
                      memory={memory}
                      activeTab={activeTab}
                      onDelete={handleDelete}
                      onEdit={openEditModal}
                      onPromote={handlePromote}
                      onDemote={handleDemote}
                    />
                  ))}
                </div>
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
  const { t } = useTranslation();
  return (
    <div className="flex items-start justify-between shrink-0">
      <p className="font-medium text-base leading-6 text-zinc-50 light:text-slate-900">
        {t("chat_window.memories.title")}
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

function EmptyState({ onCreateClick }) {
  const { t } = useTranslation();
  return (
    <p className="text-sm leading-5 text-zinc-400 light:text-slate-600 text-center">
      {t("chat_window.memories.empty")}{" "}
      <button
        type="button"
        onClick={onCreateClick}
        className="text-zinc-50 light:text-slate-900 underline border-none bg-transparent cursor-pointer p-0 text-sm leading-5 font-normal"
      >
        {t("chat_window.memories.empty_cta")}
      </button>
    </p>
  );
}
