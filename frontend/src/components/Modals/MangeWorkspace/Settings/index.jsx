import React, { useState, useRef, useEffect } from "react";
import Workspace from "../../../../models/workspace";
import paths from "../../../../utils/paths";
import { chatPrompt } from "../../../../utils/chat";

// Ensure that a type is correct before sending the body
// to the backend.
function castToType(key, value) {
  const definitions = {
    openAiTemp: {
      cast: (value) => Number(value),
    },
    openAiHistory: {
      cast: (value) => Number(value),
    },
  };

  if (!definitions.hasOwnProperty(key)) return value;
  return definitions[key].cast(value);
}

export default function WorkspaceSettings({ workspace }) {
  const formEl = useRef(null);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    function setTimer() {
      if (success !== null) {
        setTimeout(() => {
          setSuccess(null);
        }, 3_000);
      }

      if (error !== null) {
        setTimeout(() => {
          setError(null);
        }, 3_000);
      }
    }
    setTimer();
  }, [success, error]);

  const handleUpdate = async (e) => {
    setError(null);
    setSuccess(null);
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
      setSuccess("Workspace updated!");
    } else {
      setError(message);
    }
    setSaving(false);
  };

  const deleteWorkspace = async () => {
    if (
      !window.confirm(
        `You are about to delete your entire ${workspace.name} workspace. This will remove all vector embeddings on your vector database.\n\nThe original source files will remain untouched. This action is irreversible.`
      )
    )
      return false;
    await Workspace.delete(workspace.slug);
    workspace.slug === slug
      ? (window.location = paths.home())
      : window.location.reload();
  };

  return (
    <form ref={formEl} onSubmit={handleUpdate}>
      <div className="p-6 flex h-full w-full max-h-[80vh] overflow-y-scroll">
        <div className="flex flex-col gap-y-1 w-full">
          <div className="flex flex-col mb-2">
            <p className="text-gray-800 dark:text-stone-200 text-base ">
              Edit your workspace's settings
            </p>
          </div>

          <div className="w-full flex flex-col gap-y-4">
            <div>
              <input
                type="text"
                disabled={true}
                defaultValue={workspace?.slug}
                className="bg-gray-50 border disabled:bg-gray-400 disabled:text-gray-700 disabled:border-gray-400 disabled:dark:bg-stone-800 disabled:dark:border-stone-900 disabled:dark:text-stone-600 disabled:cursor-not-allowed border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-stone-600 dark:border-stone-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required={true}
                autoComplete="off"
              />
            </div>

            <div>
              <div className="flex flex-col gap-y-1 mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Workspace Name
                </label>
                <p className="text-xs text-gray-600 dark:text-stone-400">
                  This will only change the display name of your workspace.
                </p>
              </div>
              <input
                name="name"
                type="text"
                minLength={2}
                maxLength={80}
                defaultValue={workspace?.name}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-stone-600 dark:border-stone-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="My Workspace"
                required={true}
                autoComplete="off"
                onChange={() => setHasChanges(true)}
              />
            </div>

            <div>
              <div className="flex flex-col gap-y-1 mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  LLM Temperature
                </label>
                <p className="text-xs text-gray-600 dark:text-stone-400">
                  This setting controls how "random" or dynamic your chat
                  responses will be.
                  <br />
                  The higher the number (2.0 maximum) the more random and
                  incoherent.
                  <br />
                  Recommended: 0.7
                </p>
              </div>
              <input
                name="openAiTemp"
                type="number"
                min={0.0}
                max={2.0}
                step={0.1}
                onWheel={(e) => e.target.blur()}
                defaultValue={workspace?.openAiTemp ?? 0.7}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-stone-600 dark:border-stone-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="0.7"
                required={true}
                autoComplete="off"
                onChange={() => setHasChanges(true)}
              />
            </div>

            <div>
              <div className="flex flex-col gap-y-1 mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Prompt
                </label>
                <p className="text-xs text-gray-600 dark:text-stone-400">
                  The prompt that will be used on this workspace. Define the
                  context and instructions for the AI to generate a response.
                  You should to provide a carefully crafted prompt so the AI can
                  generate a relevant and accurate response.
                </p>
              </div>
              <textarea
                name="openAiPrompt"
                maxLength={500}
                rows={5}
                defaultValue={chatPrompt(workspace)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-stone-600 dark:border-stone-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed."
                required={true}
                wrap="soft"
                autoComplete="off"
                onChange={() => setHasChanges(true)}
              />
            </div>

            <div>
              <div className="flex flex-col gap-y-1 mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Chat History
                </label>
                <p className="text-xs text-gray-600 dark:text-stone-400">
                  The number of previous chats that will be included in the
                  response's short-term memory.
                  <br />
                  Recommend 20. Anything more than 45 is likely to lead to
                  continuous chat failures depending on message size.
                </p>
              </div>
              <input
                name="openAiHistory"
                type="number"
                min={1}
                max={45}
                step={1}
                onWheel={(e) => e.target.blur()}
                defaultValue={workspace?.openAiHistory ?? 20}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-stone-600 dark:border-stone-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="20"
                required={true}
                autoComplete="off"
                onChange={() => setHasChanges(true)}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm">
              Error: {error}
            </p>
          )}
          {success && (
            <p className="text-green-600 dark:text-green-400 text-sm">
              Success: {success}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between p-2 md:p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
        <button
          onClick={deleteWorkspace}
          type="button"
          className="border border-transparent text-gray-500 bg-white hover:bg-red-100 rounded-lg whitespace-nowrap text-sm font-medium px-5 py-2.5 hover:text-red-900 focus:z-10 dark:bg-transparent dark:text-gray-300 dark:hover:text-white dark:hover:bg-red-600"
        >
          Delete Workspace
        </button>
        {hasChanges && (
          <button
            type="submit"
            className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 whitespace-nowrap text-sm font-medium px-2 md:px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-black dark:text-slate-200 dark:border-transparent dark:hover:text-slate-200 dark:hover:bg-gray-900 dark:focus:ring-gray-800"
          >
            {saving ? "Updating..." : "Update workspace"}
          </button>
        )}
      </div>
    </form>
  );
}
