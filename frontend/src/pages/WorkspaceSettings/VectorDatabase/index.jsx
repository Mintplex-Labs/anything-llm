import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";
import { castToType } from "@/utils/types";
import { useRef, useState } from "react";

export default function VectorDatabase({ workspace }) {
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const formEl = useRef(null);

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

  if (!workspace) return null;
  return (
    <form
      ref={formEl}
      onSubmit={handleUpdate}
      className="w-1/2 flex flex-col gap-y-6"
    >
      <VectorDBIdentifier workspace={workspace} />
      <MaxContextSnippets workspace={workspace} setHasChanges={setHasChanges} />
      <DocumentSimilarityThreshold
        workspace={workspace}
        setHasChanges={setHasChanges}
      />
      {hasChanges && (
        <button
          type="submit"
          className="w-fit transition-all duration-300 border border-slate-200 px-5 py-2.5 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
        >
          {saving ? "Updating..." : "Update workspace"}
        </button>
      )}
    </form>
  );
}

function VectorDBIdentifier({ workspace }) {
  return (
    <div>
      <h3 className="text-white text-sm font-semibold">
        Vector database identifier
      </h3>
      <p className="text-white text-opacity-60 text-xs font-medium py-1"> </p>
      <p className="text-white text-opacity-60 text-sm font-medium">
        {workspace?.slug}
      </p>
    </div>
  );
}

function MaxContextSnippets({ workspace, setHasChanges }) {
  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="name" className="block text-sm font-medium text-white">
          Max Context Snippets
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          This setting controls the maximum amount of context snippets the will
          be sent to the LLM for per chat or query.
          <br />
          <i>Recommended: 4</i>
        </p>
      </div>
      <input
        name="topN"
        type="number"
        min={1}
        max={12}
        step={1}
        onWheel={(e) => e.target.blur()}
        defaultValue={workspace?.topN ?? 4}
        className="bg-zinc-900 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-2"
        placeholder="4"
        required={true}
        autoComplete="off"
        onChange={() => setHasChanges(true)}
      />
    </div>
  );
}

function DocumentSimilarityThreshold({ workspace, setHasChanges }) {
  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="name" className="block text-sm font-medium text-white">
          Document similarity threshold
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          The minimum similarity score required for a source to be considered
          related to the chat. The higher the number, the more similar the
          source must be to the chat.
        </p>
      </div>
      <select
        name="similarityThreshold"
        defaultValue={workspace?.similarityThreshold ?? 0.25}
        className="bg-zinc-900 text-white text-sm mt-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        onChange={() => setHasChanges(true)}
        required={true}
      >
        <option value={0.0}>No restriction</option>
        <option value={0.25}>Low (similarity score &ge; .25)</option>
        <option value={0.5}>Medium (similarity score &ge; .50)</option>
        <option value={0.75}>High (similarity score &ge; .75)</option>
      </select>
    </div>
  );
}
