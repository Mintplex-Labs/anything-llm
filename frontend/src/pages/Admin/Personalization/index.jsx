import { useEffect, useState } from "react";
import SettingsSidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import Admin from "@/models/admin";
import Workspace from "@/models/workspace";
import Memory from "@/models/memory";
import MemoryForm from "@/components/Memories/MemoryForm";
import showToast from "@/utils/toast";
import Toggle from "@/components/lib/Toggle";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import paths from "@/utils/paths";
import {
  Brain,
  Trash,
  PencilSimple,
  ArrowSquareOut,
  Plus,
  GlobeSimple,
} from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";

export default function Personalization() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [extracting, setExtracting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [memories, setMemories] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  async function fetchData() {
    const { settings } = await Admin.systemPreferencesByFields([
      "memory_enabled",
    ]);
    const isEnabled = settings?.memory_enabled === "on";
    setEnabled(isEnabled);

    if (isEnabled) {
      const [allMemories, allWorkspaces] = await Promise.all([
        Memory.all(),
        Workspace.all(),
      ]);
      setMemories(allMemories);
      setWorkspaces(allWorkspaces);
    } else {
      setMemories([]);
      setWorkspaces([]);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleToggle(checked) {
    const value = checked ? "on" : "off";
    const { success, error } = await Admin.updateSystemPreferences({
      memory_enabled: value,
    });
    if (!success) {
      showToast(`Failed to update setting: ${error}`, "error");
      return;
    }
    setEnabled(checked);
    showToast(
      `Personalization ${checked ? "enabled" : "disabled"}.`,
      "success"
    );
    if (checked) fetchData();
  }

  async function handleRunExtraction() {
    setExtracting(true);
    const { success, error } = await Memory.runExtraction();
    setExtracting(false);
    if (!success) {
      showToast(`Extraction failed: ${error}`, "error");
      return;
    }
    showToast("Memory extraction completed.", "success");
    fetchData();
  }

  async function handleClearAll() {
    if (
      !window.confirm(
        "Are you sure? This will permanently delete all of your personalization memories."
      )
    )
      return;
    setClearing(true);
    const { success, error } = await Memory.clearAll();
    setClearing(false);
    if (!success) {
      showToast(`Failed to clear memories: ${error}`, "error");
      return;
    }
    showToast("All personalization memories cleared.", "success");
    setMemories([]);
  }

  async function handleDeleteMemory(memoryId) {
    if (!window.confirm("Delete this memory?")) return;
    const { success } = await Memory.delete(memoryId);
    if (!success) {
      showToast("Failed to delete memory.", "error");
      return;
    }
    showToast("Memory deleted.", "success");
    setMemories((prev) => prev.filter((m) => m.id !== memoryId));
  }

  async function handleUpdateMemory(memoryId, content) {
    const { memory, error } = await Memory.update(memoryId, { content });
    if (!memory) {
      showToast(error || "Failed to update memory.", "error");
      return;
    }
    showToast("Memory updated.", "success");
    setMemories((prev) =>
      prev.map((m) => (m.id === memoryId ? { ...m, content } : m))
    );
  }

  async function handleAddGlobal(content) {
    // scope=global ignores workspaceId, but the endpoint requires one
    const wsId = workspaces[0]?.id || 0;
    const { memory, error } = await Memory.create(wsId, {
      content,
      scope: "global",
    });
    if (!memory) {
      showToast(error || "Failed to add memory.", "error");
      return;
    }
    showToast("Global memory added.", "success");
    setShowAddForm(false);
    setMemories((prev) => [memory, ...prev]);
  }

  const globalMemories = memories.filter((m) => m.scope === "global");

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <SettingsSidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white/10 border-b-2">
            <div className="items-center flex gap-x-4">
              <p className="text-lg leading-6 font-bold text-theme-text-primary">
                Personalization
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-theme-text-secondary">
              AnythingLLM can learn about you over time to provide more relevant
              and personalized responses. Memories are extracted automatically
              from your conversations.
            </p>
          </div>

          {loading ? (
            <Skeleton.default
              height="60vh"
              width="100%"
              highlightColor="var(--theme-bg-primary)"
              baseColor="var(--theme-bg-secondary)"
              count={1}
              className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
              containerClassName="flex w-full"
            />
          ) : (
            <div className="mt-6 flex flex-col gap-y-6">
              <Toggle
                size="lg"
                enabled={enabled}
                onChange={handleToggle}
                label="Enable Personalization"
                description="When enabled, AnythingLLM will learn user preferences and context from conversations."
              />

              {enabled && (
                <>
                  <div className="flex gap-x-3">
                    <button
                      onClick={handleRunExtraction}
                      disabled={extracting}
                      className="enabled:hover:bg-secondary enabled:hover:text-white rounded-lg bg-primary-button w-fit py-2 px-4 font-semibold text-xs disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      {extracting ? "Extracting..." : "Run Extraction Now"}
                    </button>
                    <button
                      onClick={handleClearAll}
                      disabled={clearing || memories.length === 0}
                      className="rounded-lg border border-red-500/50 text-red-300 hover:bg-red-500/20 w-fit py-2 px-4 font-semibold text-xs disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      {clearing ? "Clearing..." : "Clear All My Memories"}
                    </button>
                  </div>

                  <GlobalMemoriesSection
                    memories={globalMemories}
                    onDelete={handleDeleteMemory}
                    onUpdate={handleUpdateMemory}
                    showAddForm={showAddForm}
                    setShowAddForm={setShowAddForm}
                    onAdd={handleAddGlobal}
                  />

                  <WorkspacesList workspaces={workspaces} memories={memories} />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GlobalMemoriesSection({
  memories,
  onDelete,
  onUpdate,
  showAddForm,
  setShowAddForm,
  onAdd,
}) {
  return (
    <div>
      <div className="flex flex-col gap-y-1 mb-4">
        <div className="flex items-center justify-between">
          <label className="block input-label">
            Global Memories ({memories.length}/5)
          </label>
          {memories.length < 5 && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-x-1 border-none text-theme-text-secondary font-medium text-sm px-[10px] py-[6px] rounded-md bg-theme-bg-secondary hover:bg-theme-bg-primary"
            >
              <Plus size={14} weight="bold" />
              Add Global Memory
            </button>
          )}
        </div>
        <p className="text-white text-opacity-60 text-xs font-medium">
          These memories are applied across all workspaces.
        </p>
      </div>

      {showAddForm && (
        <div className="mb-4">
          <MemoryForm
            placeholder="Enter a global memory (e.g. 'My name is Sean')"
            submitLabel="Add"
            onSubmit={onAdd}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {memories.length === 0 && !showAddForm ? (
        <div className="flex items-center justify-center rounded-lg bg-theme-settings-input-bg py-8">
          <div className="flex flex-col items-center gap-y-2">
            <Brain className="h-8 w-8 text-theme-text-secondary" />
            <p className="text-sm text-theme-text-secondary">
              No global memories yet
            </p>
            <p className="text-xs text-theme-text-secondary">
              Add them manually or promote workspace memories to global.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-y-1">
          {memories.map((memory) => (
            <MemoryItem
              key={memory.id}
              memory={memory}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function WorkspacesList({ workspaces, memories }) {
  return (
    <div>
      <div className="flex flex-col gap-y-1 mb-4">
        <label className="block input-label">Workspace Memories</label>
        <p className="text-white text-opacity-60 text-xs font-medium">
          Manage workspace-specific memories from each workspace's settings.
        </p>
      </div>
      {workspaces.length === 0 ? (
        <p className="text-xs text-theme-text-secondary">
          No workspaces found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left rounded-lg min-w-[400px] border-spacing-0">
            <thead className="text-theme-text-secondary text-xs leading-[18px] font-bold uppercase border-white/10 border-b">
              <tr>
                <th scope="col" className="px-6 py-3 rounded-tl-lg">
                  Workspace
                </th>
                <th scope="col" className="px-6 py-3">
                  Memories
                </th>
                <th scope="col" className="px-6 py-3 rounded-tr-lg">
                  {" "}
                </th>
              </tr>
            </thead>
            <tbody>
              {workspaces.map((ws) => {
                const count = memories.filter(
                  (m) => m.workspaceId === ws.id && m.scope === "workspace"
                ).length;
                return (
                  <tr
                    key={ws.id}
                    className="bg-transparent text-white text-opacity-80 text-xs font-medium border-b border-white/10 h-10"
                  >
                    <th scope="row" className="px-6 whitespace-nowrap">
                      {ws.name}
                    </th>
                    <td className="px-6">{count}</td>
                    <td className="px-6">
                      <a
                        href={paths.workspace.settings.personalization(ws.slug)}
                        className="text-white flex items-center gap-x-1 hover:underline hover:text-sky-400"
                      >
                        Manage <ArrowSquareOut size={14} />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function MemoryItem({ memory, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <MemoryForm
        initialContent={memory.content}
        submitLabel="Save"
        onSubmit={(content) => {
          onUpdate(memory.id, content);
          setEditing(false);
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="group flex items-center gap-x-2 rounded-lg bg-theme-settings-input-bg px-3 py-2">
      <GlobeSimple size={14} className="text-theme-text-secondary shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white leading-relaxed">{memory.content}</p>
        <p className="text-xs text-theme-text-secondary mt-0.5">
          {new Date(memory.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center gap-x-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => setEditing(true)}
          data-tooltip-id="memory-actions"
          data-tooltip-content="Edit"
          className="border-none p-1 text-theme-text-secondary hover:text-white"
        >
          <PencilSimple size={14} />
        </button>
        <button
          onClick={() => onDelete(memory.id)}
          data-tooltip-id="memory-actions"
          data-tooltip-content="Delete"
          className="border-none p-1 text-theme-text-secondary hover:text-red-400"
        >
          <Trash size={14} />
        </button>
      </div>
      <Tooltip
        id="memory-actions"
        place="top"
        delayShow={300}
        className="tooltip !text-xs"
      />
    </div>
  );
}
