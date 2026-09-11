import Workspace from "@/models/workspace";
import { castToType } from "@/utils/types";
import showToast from "@/utils/toast";
import { useEffect, useState } from "react";
import AutosaveForm from "@/components/AutosaveForm";
import WorkspaceName from "./WorkspaceName";
import SuggestedChatMessages from "./SuggestedChatMessages";
import DeleteWorkspace from "./DeleteWorkspace";

export default function GeneralInfo({ slug, deletionProtected = false }) {
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkspace() {
      const workspace = await Workspace.bySlug(slug);
      setWorkspace(workspace);
      setLoading(false);
    }
    fetchWorkspace();
  }, [slug]);

  const handleUpdate = async (formEl) => {
    const data = {};
    const form = new FormData(formEl);
    for (var [key, value] of form.entries()) data[key] = castToType(key, value);
    const { workspace: updatedWorkspace, message } = await Workspace.update(
      workspace.slug,
      data
    );
    if (!updatedWorkspace)
      showToast(`Error: ${message}`, "error", { clear: true });
    return !!updatedWorkspace;
  };

  if (!workspace || loading) return null;
  return (
    <div className="w-full relative flex flex-col gap-y-[32px]">
      <AutosaveForm onSave={handleUpdate} className="w-1/2 flex flex-col">
        <WorkspaceName key={workspace.slug} workspace={workspace} />
      </AutosaveForm>
      <SuggestedChatMessages slug={workspace.slug} />
      <DeleteWorkspace workspace={workspace} visible={!deletionProtected} />
    </div>
  );
}
