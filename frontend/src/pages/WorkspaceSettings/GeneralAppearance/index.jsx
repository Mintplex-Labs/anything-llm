import Workspace from "@/models/workspace";
import { castToType } from "@/utils/types";
import showToast from "@/utils/toast";
import { useEffect, useRef, useState } from "react";
import VectorCount from "./VectorCount";
import WorkspaceName from "./WorkspaceName";
import SuggestedChatMessages from "./SuggestedChatMessages";
import DeleteWorkspace from "./DeleteWorkspace";
import { Plus } from "@phosphor-icons/react";

export default function GeneralInfo({ slug }) {
  const [workspace, setWorkspace] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pfp, setPfp] = useState(null);
  const formEl = useRef(null);

  useEffect(() => {
    async function fetchWorkspace() {
      const workspace = await Workspace.bySlug(slug);
      const pfpUrl = await Workspace.fetchPfp(slug);
      setPfp(pfpUrl);
      setWorkspace(workspace);
      setLoading(false);
    }
    fetchWorkspace();
  }, [slug]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return false;

    const formData = new FormData();
    formData.append("file", file);
    const { success, error } = await Workspace.uploadPfp(
      formData,
      workspace.slug
    );
    if (!success) {
      showToast(`Failed to upload profile picture: ${error}`, "error");
      return;
    }

    const pfpUrl = await Workspace.fetchPfp(workspace.slug);
    setPfp(pfpUrl);
    showToast("Profile picture uploaded.", "success");
  };

  const handleRemovePfp = async () => {
    const { success, error } = await Workspace.removePfp(workspace.slug);
    if (!success) {
      showToast(`Failed to remove profile picture: ${error}`, "error");
      return;
    }

    setPfp(null);
  };

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
      setTimeout(() => window.location.reload(), 1_500);
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
      <div className="mt-6">
        <SuggestedChatMessages slug={workspace.slug} />
      </div>
      <DeleteWorkspace workspace={workspace} />

      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex flex-col items-center">
          <label className="w-36 h-36 flex flex-col items-center justify-center bg-zinc-900/50 transition-all duration-300 rounded-full mt-8 border-2 border-dashed border-white border-opacity-60 cursor-pointer hover:opacity-60">
            <input
              id="workspace-pfp-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            {pfp ? (
              <img
                src={pfp}
                alt="User profile picture"
                className="w-36 h-36 rounded-full object-cover bg-white"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-3">
                <Plus className="w-8 h-8 text-white/80 m-2" />
                <span className="text-white text-opacity-80 text-xs font-semibold">
                  Workspace Image
                </span>
                <span className="text-white text-opacity-60 text-xs">
                  800 x 800
                </span>
              </div>
            )}
          </label>
          {pfp && (
            <button
              type="button"
              onClick={handleRemovePfp}
              className="mt-3 text-white text-opacity-60 text-sm font-medium hover:underline"
            >
              Remove Profile Picture
            </button>
          )}
        </div>
      </div>
    </>
  );
}
