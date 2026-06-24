import { useState } from "react";
import ImageModelSelection from "../ImageModelSelection";

export default function OllamaImageOptions({ settings }) {
  const [basePath, setBasePath] = useState(settings?.OllamaLLMBasePath);
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Ollama Base URL
          </label>
          <input
            type="url"
            name="OllamaLLMBasePath"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="http://127.0.0.1:11434"
            defaultValue={settings?.OllamaLLMBasePath || ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setBasePath(e.target.value)}
          />
        </div>
        <ImageModelSelection
          provider="ollama"
          basePath={basePath}
          settings={settings}
        />
      </div>
      <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
        Ollama image generation is experimental and only available on macOS.
      </p>
    </div>
  );
}
