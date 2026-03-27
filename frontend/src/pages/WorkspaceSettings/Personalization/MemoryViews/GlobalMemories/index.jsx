import MemoryItem from "@/components/Memories/MemoryItem";

/**
 * @param {Object} props
 * @param {Object[]} props.memories
 * @param {function} props.onDelete
 * @param {function} props.onUpdate
 */
export default function GlobalMemories({ memories, onDelete, onUpdate }) {
  if (memories.length === 0) return null;

  return (
    <div>
      <div className="flex flex-col gap-y-1 mb-4">
        <label className="block input-label">
          Global Memories ({memories.length}/5)
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium">
          Applied across all workspaces.
        </p>
      </div>
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
    </div>
  );
}
