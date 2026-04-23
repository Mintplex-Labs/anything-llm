import { createContext, useContext, useState, useEffect } from "react";
import { useMemoriesSidebar } from "../ChatSidebar";
import useUser from "@/hooks/useUser";
import System from "@/models/system";
import Memory from "@/models/memory";

export const LIMITS = {
  workspace: 20,
  global: 5,
};

const MemoriesContext = createContext(null);

export function useMemoriesContext() {
  const ctx = useContext(MemoriesContext);
  if (!ctx) {
    throw new Error("useMemoriesContext must be used within MemoriesProvider");
  }
  return ctx;
}

export function MemoriesProvider({ workspace, children }) {
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

  const value = {
    workspace,
    sidebarOpen,
    closeSidebar,
    canToggle,
    memories,
    activeTab,
    setActiveTab,
    activeMemories,
    enabled,
    setEnabled,
    loadingEnabled,
    modalState,
    editingMemory,
    openCreateModal,
    openEditModal,
    closeModal,
    handleCreate,
    handleDelete,
    handleUpdate,
    handlePromote,
    handleDemote,
  };

  return (
    <MemoriesContext.Provider value={value}>
      {children}
    </MemoriesContext.Provider>
  );
}
