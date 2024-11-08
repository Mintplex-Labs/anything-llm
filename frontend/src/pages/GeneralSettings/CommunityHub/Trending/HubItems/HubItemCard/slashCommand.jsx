import ModalWrapper from "@/components/ModalWrapper";
import { useModal } from "@/hooks/useModal";
import Workspace from "@/models/workspace";
import { X } from "@phosphor-icons/react";
import truncate from "truncate";
import { useState, useEffect } from "react";
import showToast from "@/utils/toast";
import System from "@/models/system";

export default function SlashCommandHubCard({ item }) {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <div
        key={item.id}
        className="bg-zinc-800 rounded-lg p-3 hover:bg-zinc-700 transition-all duration-200"
      >
        <p className="text-white text-sm font-medium">{item.name}</p>
        <div className="flex flex-col gap-2">
          <p className="text-white/60 text-xs mt-1">{item.description}</p>
          <p className="text-white/60 text-xs bg-zinc-900 px-2 py-1 rounded-md font-mono">
            {item.command}
            <br />
            <br />
            {truncate(item.prompt, 90)}
          </p>
        </div>
        <div className="flex justify-end mt-2">
          <button
            className="text-primary-button hover:text-primary-button/80 text-xs"
            onClick={openModal}
          >
            Import →
          </button>
        </div>
      </div>
      {isOpen && (
        <ImportSlashCommandModal
          item={item}
          isOpen={isOpen}
          closeModal={closeModal}
        />
      )}
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
        <div className="relative bg-main-gradient rounded-lg shadow py-4">
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

          <div className="flex flex-col gap-y-2 p-4 mt-2">
            <div className="w-full text-white text-md gap-x-2 flex items-center">
              <p className="text-white/60 w-fit font-mono bg-zinc-900 px-2 py-1 rounded-md text-sm whitespace-pre-line">
                {item.command}
              </p>
            </div>

            <div className="w-full text-white text-md flex flex-col gap-y-2">
              <p className="text-white/60 font-mono bg-zinc-900 p-4 rounded-md text-sm whitespace-pre-line max-h-[calc(200px)] overflow-y-auto">
                {item.prompt}
              </p>
            </div>
          </div>

          <div className="flex w-full justify-center px-4">
            <button
              type="button"
              onClick={importSlashCommand}
              disabled={loading}
              className="w-full text-center border border-slate-200 px-4 py-2 rounded-lg text-white text-sm hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
            >
              {loading ? "Importing..." : "Import slash command"}
            </button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
