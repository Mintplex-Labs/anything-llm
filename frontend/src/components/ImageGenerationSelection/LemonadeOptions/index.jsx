import { useState } from "react";
import ImageModelSelection from "../ImageModelSelection";

export default function LemonadeImageOptions({ settings }) {
  const [basePath, setBasePath] = useState(
    settings?.ImageGenerationLemonadeBasePath
  );
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Lemonade Base URL
          </label>
          <input
            type="url"
            name="ImageGenerationLemonadeBasePath"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="http://127.0.0.1:8000"
            defaultValue={settings?.ImageGenerationLemonadeBasePath || ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setBasePath(e.target.value)}
          />
        </div>
        <ImageModelSelection
          provider="lemonade"
          basePath={basePath}
          settings={settings}
        />
      </div>
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          API Key <span className="text-white/40">(optional)</span>
        </label>
        <input
          type="password"
          name="ImageGenerationLemonadeApiKey"
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="Lemonade API Key"
          defaultValue={
            settings?.ImageGenerationLemonadeApiKey ? "*".repeat(20) : ""
          }
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
