import { Info } from "@phosphor-icons/react";
import paths from "../../../utils/paths";

export default function LocalAiOptions({ settings, showAlert = false }) {
  return (
    <div className="w-full flex flex-col">
      {showAlert && (
        <div className="flex flex-col md:flex-row md:items-center gap-x-2 text-white mb-6 bg-blue-800/30 w-fit rounded-lg px-4 py-2">
          <div className="gap-x-2 flex items-center">
            <Info size={12} className="hidden md:visible" />
            <p className="text-sm md:text-base">
              LocalAI as your LLM requires you to set an embedding service to
              use.
            </p>
          </div>
          <a
            href={paths.general.embeddingPreference()}
            className="text-sm md:text-base my-2 underline"
          >
            Manage embedding &rarr;
          </a>
        </div>
      )}
      <div className="w-full flex items-center gap-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            LocalAI Base Path
          </label>
          <input
            type="url"
            name="LocalAiBasePath"
            className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="http://your-server/v1"
            defaultValue={settings?.LocalAiBasePath}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
