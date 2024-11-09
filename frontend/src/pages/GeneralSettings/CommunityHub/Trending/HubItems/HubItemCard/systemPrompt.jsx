import truncate from "truncate";
import { useModal } from "@/hooks/useModal";
import { useState, useEffect } from "react";
import { X } from "@phosphor-icons/react";
import Workspace from "@/models/workspace";
import ModalWrapper from "@/components/ModalWrapper";
import showToast from "@/utils/toast";

export default function SystemPromptHubCard({ item }) {
  const { openModal, closeModal, isOpen } = useModal();
  return (
    <>
      <div
        key={item.id}
        onClick={openModal}
        className="bg-black/70 rounded-lg p-3 hover:bg-black/60 transition-all duration-200 cursor-pointer group border border-transparent hover:border-slate-400"
      >
        <p className="text-white text-sm font-medium">{item.name}</p>
        <div className="flex flex-col gap-2">
          <p className="text-white/60 text-xs mt-1">{item.description}</p>
          <label className="text-white/60 text-xs font-semibold mt-4">
            Prompt
          </label>
          <p className="text-white/60 text-xs bg-zinc-900 px-2 py-1 rounded-md font-mono border border-slate-800">
            {truncate(item.prompt, 90)}
          </p>
        </div>
        <div className="flex justify-end mt-2">
          <button
            className="text-primary-button hover:text-primary-button/80 text-sm font-medium px-3 py-1.5 rounded-md bg-black/30 group-hover:bg-black/50 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              openModal();
            }}
          >
            Import →
          </button>
        </div>
      </div>

      <ImportSystemPromptModal
        item={item}
        isOpen={isOpen}
        closeModal={closeModal}
      />
    </>
  );
}

function ImportSystemPromptModal({ item, isOpen, closeModal }) {
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    async function getWorkspaces() {
      const workspaces = await Workspace.all();
      setWorkspaces(workspaces);
    }
    getWorkspaces();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const destinationWorkspaceSlug = formData.get("destinationWorkspaceSlug");

    showToast("Importing system prompt...", "info");
    await Workspace.update(destinationWorkspaceSlug, {
      openAiPrompt: item.prompt,
    });
    showToast("System prompt applied to workspace.", "success", {
      clear: true,
    });
    closeModal();
  }

  return (
    <ModalWrapper isOpen={isOpen} closeModal={closeModal}>
      <div className="relative w-full max-w-2xl max-h-full">
        <div className="relative bg-main-gradient rounded-lg shadow">
          <div className="flex items-start justify-between p-4 rounded-t border-gray-500/50">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-x-2 w-full justify-between">
                <h3 className="text-xl font-semibold text-white">
                  Import "{item.name}" to a workspace
                </h3>
                <button
                  onClick={closeModal}
                  className="text-white/60 hover:text-white"
                >
                  <X className="text-lg" />
                </button>
              </div>
              <p className="text-white/60 text-sm">
                Importing a system prompt will overwrite your workspace's
                current prompt. Simply select the workspace you want to import
                the prompt to and click import.
              </p>
            </div>
          </div>

          <div className="w-full text-white text-md flex flex-col gap-y-2 p-4 max-h-[calc(300px)] overflow-y-auto my-2">
            <label className="text-white text-sm font-semibold block">
              Prompt
            </label>
            <p className="text-white/60 font-mono bg-zinc-900 px-4 py-3 rounded-lg text-sm whitespace-pre-line">
              {item.prompt}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex p-4 justify-between items-end"
          >
            <div className="flex flex-col w-60">
              <label className="text-white text-sm font-semibold block mb-3">
                Destination Workspace
              </label>
              <select
                name="destinationWorkspaceSlug"
                required={true}
                className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
              >
                <optgroup label="Available workspaces">
                  {workspaces.map((workspace) => (
                    <option key={workspace.id} value={workspace.slug}>
                      {workspace.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
            <button
              type="submit"
              className="h-fit border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800 transition-all duration-300"
            >
              Import into workspace
            </button>
          </form>
        </div>
      </div>
    </ModalWrapper>
  );
}
