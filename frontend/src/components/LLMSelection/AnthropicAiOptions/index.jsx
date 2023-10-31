import { Info } from "@phosphor-icons/react";
import paths from "../../../utils/paths";

export default function AnthropicAiOptions({ settings, showAlert = false }) {
  return (
    <div className="w-full flex flex-col">
      {showAlert && (
        <div className="flex flex-col md:flex-row md:items-center gap-x-2 text-white mb-6 bg-blue-800/30 w-fit rounded-lg px-4 py-2">
          <div className="gap-x-2 flex items-center">
            <Info size={12} className="hidden md:visible" />
            <p className="text-sm md:text-base">
              Anthropic as your LLM requires you to set an embedding service to
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
            Anthropic Claude-2 API Key
          </label>
          <input
            type="password"
            name="AnthropicApiKey"
            className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="Anthropic Claude-2 API Key"
            defaultValue={settings?.AnthropicApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Chat Model Selection
          </label>
          <select
            name="AnthropicModelPref"
            defaultValue={settings?.AnthropicModelPref || "claude-2"}
            required={true}
            className="bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
          >
            {["claude-2"].map((model) => {
              return (
                <option key={model} value={model}>
                  {model}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </div>
  );
}
