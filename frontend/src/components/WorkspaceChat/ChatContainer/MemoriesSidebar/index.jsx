import { X } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import ChatSidebar from "../ChatSidebar";
import { MemoriesProvider, useMemoriesContext } from "./MemoriesContext";
import PersonalizationToggle from "./PersonalizationToggle";
import MemoryTabs from "./MemoryTabs";
import MemoryCard from "./MemoryCard";
import MemoryModal from "./MemoryModal";

export { useMemoriesSidebar } from "../ChatSidebar";

export default function MemoriesSidebar({ workspace }) {
  return (
    <MemoriesProvider workspace={workspace}>
      <MemoriesSidebarContent />
    </MemoriesProvider>
  );
}

function MemoriesSidebarContent() {
  const { sidebarOpen, canToggle, enabled } = useMemoriesContext();

  if (!canToggle && !enabled) return null;
  return (
    <>
      <ChatSidebar isOpen={sidebarOpen}>
        <SidebarPanel>
          <SidebarHeader />
          <PersonalizationToggle />
          <MemoryList />
        </SidebarPanel>
      </ChatSidebar>
      <MemoryModalWrapper />
    </>
  );
}

function SidebarPanel({ children }) {
  return (
    <div
      className="w-[366px] flex-shrink-0 flex flex-col gap-5 mt-[72px] px-5 overflow-y-auto no-scroll"
      style={{ maxHeight: "calc(100% - 88px)" }}
    >
      {children}
    </div>
  );
}

function MemoryList() {
  const { enabled, activeMemories } = useMemoriesContext();

  if (!enabled) return null;
  if (activeMemories.length === 0) {
    return (
      <>
        <MemoryTabs />
        <EmptyState />
      </>
    );
  }

  return (
    <>
      <MemoryTabs />
      <div className="flex flex-col gap-1.5 pb-4">
        {activeMemories.map((memory) => (
          <MemoryCard key={memory.id} memory={memory} />
        ))}
      </div>
    </>
  );
}

function MemoryModalWrapper() {
  const {
    enabled,
    modalState,
    editingMemory,
    closeModal,
    handleCreate,
    handleUpdate,
  } = useMemoriesContext();

  if (!enabled) return null;
  return (
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
  );
}

function SidebarHeader() {
  const { t } = useTranslation();
  const { closeSidebar } = useMemoriesContext();

  return (
    <div className="flex items-start justify-between shrink-0">
      <p className="font-medium text-base leading-6 text-zinc-50 light:text-slate-900">
        {t("chat_window.memories.title")}
      </p>
      <button
        onClick={closeSidebar}
        type="button"
        className="text-zinc-50 light:text-slate-900 hover:text-white light:hover:text-slate-400 transition-colors border-none bg-transparent cursor-pointer"
      >
        <X size={16} weight="bold" />
      </button>
    </div>
  );
}

function EmptyState() {
  const { t } = useTranslation();
  const { openCreateModal } = useMemoriesContext();
  return (
    <p className="text-sm leading-5 text-zinc-400 light:text-slate-600 text-center">
      {t("chat_window.memories.empty")}{" "}
      <button
        type="button"
        onClick={openCreateModal}
        className="text-zinc-50 light:text-slate-900 underline border-none bg-transparent cursor-pointer p-0 text-sm leading-5 font-normal"
      >
        {t("chat_window.memories.empty_cta")}
      </button>
    </p>
  );
}
