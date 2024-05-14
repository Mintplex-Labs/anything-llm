import Workspace from "@/models/workspace";
import { castToType } from "@/utils/types";
import showToast from "@/utils/toast";
import { useEffect, useRef, useState } from "react";
import VectorCount from "./VectorCount";
import WorkspaceName from "./WorkspaceName";
import SuggestedChatMessages from "./SuggestedChatMessages";
import DeleteWorkspace from "./DeleteWorkspace";
import WorkspacePfp from "./WorkspacePfp";

export default function GeneralInfo({ slug }) {
  const [workspace, setWorkspace] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const formEl = useRef(null);

  useEffect(() => {
    async function fetchWorkspace() {
      const workspace = await Workspace.bySlug(slug);
      setWorkspace(workspace);
      setLoading(false);
    }
    fetchWorkspace();
  }, [slug]);

  const handleUpdate = async (e) => {
    setSaving(true);
    e.preventDefault();
    const data = {};
    const form = new FormData(formEl.current);
    for (var [key, value] of form.entries()) data[key] = castToType(key, value);
    const { workspace: updatedWorkspace, message } = await Workspace.update(
      workspace.slug,
      data
    );
    if (!!updatedWorkspace) {
      showToast("Workspace updated!", "success", { clear: true });
    } else {
      showToast(`Error: ${message}`, "error", { clear: true });
    }
    setSaving(false);
    setHasChanges(false);
  };

  if (!workspace || loading) return null;
  return (
    <>
      <form
        ref={formEl}
        onSubmit={handleUpdate}
        className="w-1/2 flex flex-col gap-y-6"
      >
        <VectorCount reload={true} workspace={workspace} />
        <WorkspaceName
          key={workspace.slug}
          workspace={workspace}
          setHasChanges={setHasChanges}
        />
        {hasChanges && (
          <button
            type="submit"
            className="transition-all w-fit duration-300 border border-slate-200 px-5 py-2.5 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
          >
            {saving ? "Updating..." : "Update workspace"}
          </button>
        )}
      </form>
      <SuggestedChatMessages slug={workspace.slug} />
      <WorkspacePfp workspace={workspace} slug={slug} />
      <DeleteWorkspace workspace={workspace} />
    </>
  );
}
