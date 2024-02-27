import { Info } from "@phosphor-icons/react";
import paths from "@/utils/paths";

export default function LMStudioOptions({ settings, showAlert = false }) {
  return (
    <div className="w-full flex flex-col">
      {showAlert && (
        <div className="flex flex-col md:flex-row md:items-center gap-x-2 text-white mb-6 bg-blue-800/30 w-fit rounded-lg px-4 py-2">
          <div className="gap-x-2 flex items-center">
            <Info size={12} className="hidden md:visible" />
            <p className="text-sm md:text-base">
              LMStudio as your LLM requires you to set an embedding service to
              use.
            </p>
          </div>
          <a
            href={paths.settings.embeddingPreference()}
            className="text-sm md:text-base my-2 underline"
          >
            Manage embedding &rarr;
          </a>
        </div>
      )}
      <div className="w-full flex items-center gap-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            LMStudio Base URL
          </label>
          <input
            type="url"
            name="LMStudioBasePath"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="http://localhost:1234/v1"
            defaultValue={settings?.LMStudioBasePath}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Token context window
          </label>
          <input
            type="number"
            name="LMStudioTokenLimit"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="4096"
            min={1}
            onScroll={(e) => e.target.blur()}
            defaultValue={settings?.LMStudioTokenLimit}
            required={true}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}
