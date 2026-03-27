import { useEffect, useState } from "react";
import Memory from "@/models/memory";
import showToast from "@/utils/toast";
import WorkspaceMemories from "./MemoryViews/WorkspaceMemories";
import GlobalMemories from "./MemoryViews/GlobalMemories";

export default function Personalization({ workspace }) {
  const [memories, setMemories] = useState({ global: [], workspace: [] });
  const [loading, setLoading] = useState(true);

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

  async function handleAdd(content, scope) {
    const { memory, error } = await Memory.create(workspace.id, {
      content,
      scope,
    });
    if (!memory) {
      showToast(error || "Failed to add memory.", "error");
      return;
    }
    showToast("Memory added.", "success");
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

  return (
    <div className="relative">
      <div className="flex flex-col gap-y-6">
        <WorkspaceMemories
          workspaceMemories={memories.workspace}
          globalMemories={memories.global}
          onAdd={handleAdd}
          onDelete={handleDelete}
          onPromote={handlePromote}
          onUpdate={handleUpdate}
        />
        <GlobalMemories
          memories={memories.global}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
}
