import { useState } from "react";
import ImageModelSelection from "../ImageModelSelection";
import ImageDimensionSelection from "../ImageDimensionSelection";

export default function OpenAiImageOptions({ settings }) {
  const [inputValue, setInputValue] = useState(
    settings?.ImageGenerationOpenAiKey
  );
  const [apiKey, setApiKey] = useState(settings?.ImageGenerationOpenAiKey);

  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-start gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            API Key
          </label>
          <input
            type="password"
            name="ImageGenerationOpenAiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="OpenAI API Key"
            defaultValue={
              settings?.ImageGenerationOpenAiKey ? "*".repeat(20) : ""
            }
            required={true}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => setApiKey(inputValue)}
          />
        </div>
        <ImageModelSelection
          provider="openai-imggen"
          apiKey={apiKey}
          settings={settings}
        />
        <ImageDimensionSelection provider="openai-imggen" settings={settings} />
      </div>
    </div>
  );
}
