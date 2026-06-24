import { useState } from "react";
import ImageModelSelection from "../ImageModelSelection";

export default function OpenAiImageOptions({ settings }) {
  const [apiKey, setApiKey] = useState(settings?.OpenAiKey);
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            API Key
          </label>
          <input
            type="password"
            name="OpenAiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="OpenAI API Key"
            defaultValue={settings?.OpenAiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
        <ImageModelSelection
          provider="openai-image"
          apiKey={apiKey}
          settings={settings}
        />
      </div>
    </div>
  );
}
