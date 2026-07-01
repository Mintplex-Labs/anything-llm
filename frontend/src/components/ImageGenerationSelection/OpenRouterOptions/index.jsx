import ImageModelSelection from "../ImageModelSelection";

export default function OpenRouterImageOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            API Key
          </label>
          <input
            type="password"
            name="ImageGenerationOpenRouterApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="OpenRouter API Key"
            defaultValue={
              settings?.ImageGenerationOpenRouterApiKey ? "*".repeat(20) : ""
            }
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <ImageModelSelection provider="openrouter-image" settings={settings} />
      </div>
    </div>
  );
}
