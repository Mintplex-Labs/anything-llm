import { useState } from "react";
import { X } from "@phosphor-icons/react";
import ModalWrapper from "@/components/ModalWrapper";
import { CMD_REGEX } from ".";

export default function EditPresetModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  preset,
}) {
  const [command, setCommand] = useState(preset?.command?.slice(1) || "");
  const [deleting, setDeleting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const sanitizedCommand = command.replace(CMD_REGEX, "");
    onSave({
      id: preset.id,
      command: `/${sanitizedCommand}`,
      prompt: form.get("prompt"),
      description: form.get("description"),
    });
  };

  const handleCommandChange = (e) => {
    const value = e.target.value.replace(CMD_REGEX, "");
    setCommand(value);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this preset?"
    );
    if (!confirmDelete) return;

    setDeleting(true);
    await onDelete(preset.id);
    setDeleting(false);
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen}>
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-2xl max-h-full"
      >
        <div className="relative bg-main-gradient rounded-lg shadow">
          <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-500/50">
            <h3 className="text-xl font-semibold text-white">Edit Preset</h3>
            <button
              onClick={onClose}
              type="button"
              className="transition-all duration-300 text-gray-400 bg-transparent hover:border-white/60 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
            >
              <X className="text-gray-300 text-lg" />
            </button>
          </div>
          <div className="p-6 space-y-6 flex h-full w-full">
            <div className="w-full flex flex-col gap-y-4">
              <div>
                <label
                  htmlFor="command"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Command
                </label>
                <div className="flex items-center">
                  <span className="text-white text-sm mr-2 font-bold">/</span>
                  <input
                    type="text"
                    name="command"
                    placeholder="your-command"
                    value={command}
                    onChange={handleCommandChange}
                    required={true}
                    className="border-none bg-zinc-900 placeholder:text-white/20 border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="prompt"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Prompt
                </label>
                <textarea
                  name="prompt"
                  placeholder="This is a test prompt. Please respond with a poem about LLMs."
                  defaultValue={preset.prompt}
                  required={true}
                  className="border-none bg-zinc-900 placeholder:text-white/20 border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  defaultValue={preset.description}
                  placeholder="Responds with a poem about LLMs."
                  required={true}
                  className="border-none bg-zinc-900 placeholder:text-white/20 border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
            </div>
          </div>
          <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
            <div className="flex flex-col space-y-2">
              <button
                disabled={deleting}
                onClick={handleDelete}
                type="button"
                className="px-4 py-2 rounded-lg text-red-500 hover:bg-red-500/25 transition-all duration-300 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Preset"}
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={onClose}
                type="button"
                className="px-4 py-2 rounded-lg text-white hover:bg-stone-900 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
}
