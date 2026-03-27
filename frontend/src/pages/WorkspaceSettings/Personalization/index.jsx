import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Memory from "@/models/memory";
import showToast from "@/utils/toast";
import WorkspaceMemories from "./MemoryViews/WorkspaceMemories";
import GlobalMemories from "./MemoryViews/GlobalMemories";

export default function Personalization({ workspace }) {
  const { t } = useTranslation();
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
    if (!window.confirm(t("personalization.toast.delete-confirm"))) return;
    const { success } = await Memory.delete(memoryId);
    if (!success) {
      showToast(t("personalization.toast.delete-failed"), "error");
      return;
    }
    showToast(t("personalization.toast.delete-success"), "success");
    fetchMemories();
  }

  async function handlePromote(memoryId) {
    const { memory, error } = await Memory.promoteToGlobal(memoryId);
    if (!memory) {
      showToast(error || t("personalization.toast.promote-failed"), "error");
      return;
    }
    showToast(t("personalization.toast.promote-success"), "success");
    fetchMemories();
  }

  async function handleAdd(content, scope) {
    const { memory, error } = await Memory.create(workspace.id, {
      content,
      scope,
    });
    if (!memory) {
      showToast(error || t("personalization.toast.add-failed"), "error");
      return;
    }
    showToast(t("personalization.toast.add-success"), "success");
    fetchMemories();
  }

  async function handleUpdate(memoryId, content) {
    const { memory, error } = await Memory.update(memoryId, { content });
    if (!memory) {
      showToast(error || t("personalization.toast.update-failed"), "error");
      return;
    }
    showToast(t("personalization.toast.update-success"), "success");
    fetchMemories();
  }

  if (loading) {
    return (
      <div className="text-theme-text-secondary text-sm py-8">
        {t("personalization.loading")}
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
