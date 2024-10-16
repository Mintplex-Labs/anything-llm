import React from "react";

export default function OpenAiGenericTextToSpeechOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="flex gap-x-4">
        <div className="flex flex-col w-60">
          <div className="flex justify-between items-center mb-2">
            <label className="text-white text-sm font-semibold">Base URL</label>
          </div>
          <input
            type="url"
            name="TTSOpenAICompatibleEndpoint"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="http://localhost:7851/v1"
            defaultValue={settings?.TTSOpenAICompatibleEndpoint}
            required={false}
            autoComplete="off"
            spellCheck={false}
          />
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
            This should be the base URL of the OpenAI compatible TTS service you
            will generate TTS responses from.
          </p>
        </div>

        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            API Key
          </label>
          <input
            type="password"
            name="TTSOpenAICompatibleKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="API Key"
            defaultValue={
              settings?.TTSOpenAICompatibleKey ? "*".repeat(20) : ""
            }
            autoComplete="off"
            spellCheck={false}
          />
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
            Some TTS services require an API key to generate TTS responses -
            this is optional if your service does not require one.
          </p>
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Voice Model
          </label>
          <input
            type="text"
            name="TTSOpenAICompatibleVoiceModel"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Your voice model identifier"
            defaultValue={settings?.TTSOpenAICompatibleVoiceModel}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
            Most TTS services will have several voice models available, this is
            the identifier for the voice model you want to use.
          </p>
        </div>
      </div>
    </div>
  );
}
