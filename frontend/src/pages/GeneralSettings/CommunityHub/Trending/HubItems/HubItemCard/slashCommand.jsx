import ModalWrapper from "@/components/ModalWrapper";
import { useModal } from "@/hooks/useModal";
import { X } from "@phosphor-icons/react";
import truncate from "truncate";
import { useState } from "react";
import showToast from "@/utils/toast";
import System from "@/models/system";

export default function SlashCommandHubCard({ item }) {
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
            Command
          </label>
          <p className="text-white/60 text-xs bg-zinc-900 px-2 py-1 rounded-md font-mono border border-slate-800">
            {item.command}
          </p>

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
          </Link>
        </div>
      </div>
    </>
  );
}

function ImportSlashCommandModal({ item, isOpen, closeModal }) {
  const [loading, setLoading] = useState(false);

  const importSlashCommand = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { preset, error } = await System.createSlashCommandPreset({
        command: item.command,
        prompt: item.prompt,
        description: item.description,
      });
      if (error) throw new Error(error);
      showToast(
        `Slash command ${preset.command} imported successfully!`,
        "success"
      );
      closeModal();
    } catch (e) {
      console.error(e);
      showToast("Failed to import slash command.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} closeModal={closeModal}>
      <div className="relative w-full max-w-2xl max-h-full">
        <div className="relative bg-main-gradient rounded-lg shadow">
          <div className="flex items-start justify-between p-4 rounded-t border-gray-500/50">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-x-2 w-full justify-between">
                <h3 className="text-xl font-semibold text-white">
                  Import "{item.name}" slash command
                </h3>
                <button
                  onClick={closeModal}
                  className="text-white/60 hover:text-white"
                >
                  <X className="text-lg" />
                </button>
              </div>
              <p className="text-white/60 text-sm">
                Importing a slash command will make it available during chatting
                by simply invoking it with{" "}
                <code className="font-mono bg-zinc-900 px-1 py-0.5 rounded-md text-sm">
                  {item.command}
                </code>{" "}
                like you would any other command.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-y-4 p-4 max-h-[calc(300px)] overflow-y-auto my-2">
            <div className="flex flex-col gap-y-2">
              <label className="text-white text-sm font-semibold block">
                Command
              </label>
              <p className="text-white/60 font-mono bg-zinc-900 px-4 py-3 rounded-lg text-sm whitespace-pre-line">
                {item.command}
              </p>
            </div>

            <div className="flex flex-col gap-y-2">
              <label className="text-white text-sm font-semibold block">
                Prompt
              </label>
              <p className="text-white/60 font-mono bg-zinc-900 px-4 py-3 rounded-lg text-sm whitespace-pre-line">
                {item.prompt}
              </p>
            </div>
          </div>

          <div className="flex w-fit justify-end p-4 ml-auto">
            <button
              type="button"
              onClick={importSlashCommand}
              disabled={loading}
              className="border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex justify-center gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800 transition-all duration-300"
            >
              {loading ? "Importing..." : "Import slash command"}
            </button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
