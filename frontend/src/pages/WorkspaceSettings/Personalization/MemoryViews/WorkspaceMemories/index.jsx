import { useState } from "react";
import MemoryForm from "@/components/Memories/MemoryForm";
import MemoryItem from "../MemoryItem";
import { Plus, Brain } from "@phosphor-icons/react";

/**
 * @param {Object} props
 * @param {Object[]} props.workspaceMemories
 * @param {Object[]} props.globalMemories
 * @param {function} props.onAdd - Called with (content) on submit
 * @param {function} props.onDelete
 * @param {function} props.onPromote
 * @param {function} props.onUpdate
 */
export default function WorkspaceMemories({
  workspaceMemories,
  globalMemories,
  onAdd,
  onDelete,
  onPromote,
  onUpdate,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [addScope, setAddScope] = useState("workspace");
  const totalCount = workspaceMemories.length + globalMemories.length;

  function handleAdd(content) {
    onAdd(content, addScope);
    setShowAddForm(false);
    setAddScope("workspace");
  }

  return (
    <div>
      <div className="flex flex-col gap-y-1 mb-4">
        <div className="flex items-center justify-between">
          <label className="block input-label">
            Workspace Memories ({workspaceMemories.length}/20)
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
          Memories specific to this workspace. These are automatically extracted
          from conversations and used to personalize responses.
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
            <p className="text-sm text-theme-text-secondary">No memories yet</p>
            <p className="text-xs text-theme-text-secondary max-w-[300px] text-center">
              Memories will be extracted automatically from your conversations,
              or you can add them manually.
            </p>
          </div>
        </div>
      ) : (
        workspaceMemories.length > 0 && (
          <div className="flex flex-col gap-y-1">
            {workspaceMemories.map((memory) => (
              <MemoryItem
                key={memory.id}
                memory={memory}
                onDelete={onDelete}
                onPromote={onPromote}
                onUpdate={onUpdate}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}
