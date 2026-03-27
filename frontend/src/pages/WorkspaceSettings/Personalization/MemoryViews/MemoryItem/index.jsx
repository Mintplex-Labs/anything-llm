import { useState } from "react";
import MemoryForm from "@/components/Memories/MemoryForm";
import { PencilSimple, Trash, GlobeSimple } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";

export default function MemoryItem({ memory, onDelete, onPromote, onUpdate }) {
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
