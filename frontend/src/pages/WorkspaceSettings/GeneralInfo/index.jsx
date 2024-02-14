import PreLoader from "@/components/Preloader";
import System from "@/models/system";
import Workspace from "@/models/workspace";
import { castToType } from "@/utils/types";
import showToast from "@/utils/toast";
import { useEffect, useRef, useState } from "react";

export default function GeneralInfo({ slug }) {
  const [workspace, setWorkspace] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const formEl = useRef(null);

  useEffect(() => {
    async function fetchWorkspace() {
      const workspace = await Workspace.bySlug(slug);
      setWorkspace(workspace);
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
      setTimeout(() => window.location.reload(), 1_500);
    } else {
      showToast(`Error: ${message}`, "error", { clear: true });
    }
    setSaving(false);
    setHasChanges(false);
  };

  if (!workspace) return null;
  return (
    <form
      ref={formEl}
      onSubmit={handleUpdate}
      className="w-1/2 flex flex-col gap-y-6"
    >
      <VectorCount reload={true} workspace={workspace} />
      <WorkspaceName workspace={workspace} setHasChanges={setHasChanges} />
      {hasChanges && (
        <button
          type="submit"
          className="transition-all duration-300 border border-slate-200 px-5 py-2.5 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
        >
          {saving ? "Updating..." : "Update workspace"}
        </button>
      )}
    </form>
  );
}

function VectorCount({ reload, workspace }) {
  const [totalVectors, setTotalVectors] = useState(null);
  useEffect(() => {
    async function fetchVectorCount() {
      const totalVectors = await System.totalIndexes(workspace.slug);
      setTotalVectors(totalVectors);
    }
    fetchVectorCount();
  }, [workspace?.slug, reload]);

  if (totalVectors === null)
    return (
      <div>
        <h3 className="text-white text-sm font-semibold">Number of vectors</h3>
        <p className="text-white text-opacity-60 text-xs font-medium py-1">
          Total number of vectors in your vector database.
        </p>
        <p className="text-white text-opacity-60 text-sm font-medium">
          <PreLoader size="4" />
        </p>
      </div>
    );
  return (
    <div>
      <h3 className="text-white text-sm font-semibold">Number of vectors</h3>
      <p className="text-white text-opacity-60 text-xs font-medium py-1">
        Total number of vectors in your vector database.
      </p>
      <p className="text-white text-opacity-60 text-sm font-medium">
        {totalVectors}
      </p>
    </div>
  );
}

function WorkspaceName({ workspace, setHasChanges }) {
  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="name" className="block text-sm font-medium text-white">
          Workspace Name
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          This will only change the display name of your workspace.
        </p>
      </div>
      <input
        name="name"
        type="text"
        minLength={2}
        maxLength={80}
        defaultValue={workspace?.name}
        className="bg-zinc-900 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder="My Workspace"
        required={true}
        autoComplete="off"
        onChange={() => setHasChanges(true)}
      />
    </div>
  );
}
