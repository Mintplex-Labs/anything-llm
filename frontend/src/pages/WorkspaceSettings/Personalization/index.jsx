import { useEffect, useState } from "react";
import Memory from "@/models/memory";
import MemoryForm from "@/components/Memories/MemoryForm";
import showToast from "@/utils/toast";
import {
  Plus,
  PencilSimple,
  Trash,
  GlobeSimple,
  Brain,
} from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";

export default function Personalization({ workspace }) {
  const [memories, setMemories] = useState({ global: [], workspace: [] });
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addScope, setAddScope] = useState("workspace");

  async function fetchMemories() {
    if (!workspace?.id) return;
    const data = await Memory.forWorkspace(workspace.id);
    setMemories(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchMemories();
  }, [workspace?.id]);

  async function handleDelete(memoryId) {
    if (!window.confirm("Delete this memory?")) return;
    const { success } = await Memory.delete(memoryId);
    if (!success) {
      showToast("Failed to delete memory.", "error");
      return;
    }
    showToast("Memory deleted.", "success");
    fetchMemories();
  }

  async function handlePromote(memoryId) {
    const { memory, error } = await Memory.promoteToGlobal(memoryId);
    if (!memory) {
      showToast(error || "Failed to promote memory.", "error");
      return;
    }
    showToast("Memory promoted to global.", "success");
    fetchMemories();
  }

  async function handleAdd(content) {
    const { memory, error } = await Memory.create(workspace.id, {
      content,
      scope: addScope,
    });
    if (!memory) {
      showToast(error || "Failed to add memory.", "error");
      return;
    }
    showToast("Memory added.", "success");
    setShowAddForm(false);
    setAddScope("workspace");
    fetchMemories();
  }

  async function handleUpdate(memoryId, content) {
    const { memory, error } = await Memory.update(memoryId, { content });
    if (!memory) {
      showToast(error || "Failed to update memory.", "error");
      return;
    }
    showToast("Memory updated.", "success");
    fetchMemories();
  }

  if (loading) {
    return (
      <div className="text-theme-text-secondary text-sm py-8">
        Loading personalization data...
      </div>
    );
  }

  const totalCount = memories.global.length + memories.workspace.length;

  return (
    <div className="relative">
      <div className="flex flex-col gap-y-6">
        <div>
          <div className="flex flex-col gap-y-1 mb-4">
            <div className="flex items-center justify-between">
              <label className="block input-label">
                Workspace Memories ({memories.workspace.length}/20)
              </label>
              <button
                onClick={() => {
                  setAddScope("workspace");
                  setShowAddForm(true);
                }}
                className="flex items-center gap-x-1 border-none text-theme-text-secondary font-medium text-sm px-[10px] py-[6px] rounded-md bg-theme-bg-secondary hover:bg-theme-bg-primary"
              >
                <Plus size={14} weight="bold" />
                Add Memory
              </button>
            </div>
            <p className="text-white text-opacity-60 text-xs font-medium">
              Memories specific to this workspace. These are automatically
              extracted from conversations and used to personalize responses.
            </p>
          </div>

          {showAddForm && (
            <div className="mb-4">
              <MemoryForm
                submitLabel="Add"
                onSubmit={handleAdd}
                onCancel={() => setShowAddForm(false)}
              />
              <div className="flex items-center gap-x-3 mt-2 ml-4">
                <label className="flex items-center gap-x-1.5 text-xs text-white cursor-pointer">
                  <input
                    type="radio"
                    name="scope"
                    checked={addScope === "workspace"}
                    onChange={() => setAddScope("workspace")}
                    className="accent-primary-button"
                  />
                  Workspace
                </label>
                <label className="flex items-center gap-x-1.5 text-xs text-white cursor-pointer">
                  <input
                    type="radio"
                    name="scope"
                    checked={addScope === "global"}
                    onChange={() => setAddScope("global")}
                    className="accent-primary-button"
                  />
                  Global
                </label>
              </div>
            </div>
          )}

          {totalCount === 0 && !showAddForm ? (
            <div className="flex items-center justify-center rounded-lg bg-theme-settings-input-bg py-12">
              <div className="flex flex-col items-center gap-y-2">
                <Brain className="h-8 w-8 text-theme-text-secondary" />
                <p className="text-sm text-theme-text-secondary">
                  No memories yet
                </p>
                <p className="text-xs text-theme-text-secondary max-w-[300px] text-center">
                  Memories will be extracted automatically from your
                  conversations, or you can add them manually.
                </p>
              </div>
            </div>
          ) : (
            memories.workspace.length > 0 && (
              <div className="flex flex-col gap-y-1">
                {memories.workspace.map((memory) => (
                  <MemoryItem
                    key={memory.id}
                    memory={memory}
                    onDelete={handleDelete}
                    onPromote={handlePromote}
                    onUpdate={handleUpdate}
                  />
                ))}
              </div>
            )
          )}
        </div>

        {memories.global.length > 0 && (
          <div>
            <div className="flex flex-col gap-y-1 mb-4">
              <label className="block input-label">
                Global Memories ({memories.global.length}/5)
              </label>
              <p className="text-white text-opacity-60 text-xs font-medium">
                Applied across all workspaces.
              </p>
            </div>
            <div className="flex flex-col gap-y-1">
              {memories.global.map((memory) => (
                <MemoryItem
                  key={memory.id}
                  memory={memory}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MemoryItem({ memory, onDelete, onPromote, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const isGlobal = memory.scope === "global";

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
      {isGlobal && (
        <GlobeSimple size={14} className="text-theme-text-secondary shrink-0" />
      )}
      <p className="flex-1 text-sm text-white leading-relaxed">
        {memory.content}
      </p>
      <div className="flex items-center gap-x-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => setEditing(true)}
          data-tooltip-id="memory-actions"
          data-tooltip-content="Edit"
          className="border-none p-1 text-theme-text-secondary hover:text-white"
        >
          <PencilSimple size={14} />
        </button>
        {onPromote && !isGlobal && (
          <button
            onClick={() => onPromote(memory.id)}
            data-tooltip-id="memory-actions"
            data-tooltip-content="Promote to global"
            className="border-none p-1 text-theme-text-secondary hover:text-sky-400"
          >
            <GlobeSimple size={14} />
          </button>
        )}
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
