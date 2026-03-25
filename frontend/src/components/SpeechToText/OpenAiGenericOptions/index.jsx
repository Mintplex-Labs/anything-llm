import React from "react";

export default function OpenAiGenericSTTOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="flex gap-x-4">
        <div className="flex flex-col w-60">
          <div className="flex justify-between items-start mb-2">
            <label className="text-white text-sm font-semibold">Base URL</label>
          </div>
          <input
            type="url"
            name="STTOpenAICompatibleEndpoint"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="http://localhost:8000/v1"
            defaultValue={settings?.STTOpenAICompatibleEndpoint}
            required={false}
            autoComplete="off"
            spellCheck={false}
          />
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
            This should be the base URL of the OpenAI compatible STT service you
            will use for speech-to-text transcription.
          </p>
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-2">
            API Key
          </label>
          <input
            type="password"
            name="STTOpenAICompatibleKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="API Key"
            defaultValue={
              settings?.STTOpenAICompatibleKey ? "*".repeat(20) : ""
            }
            autoComplete="off"
            spellCheck={false}
          />
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
            Some STT services require an API key to generate transcriptions -
            this is optional if your service does not require one.
          </p>
        </div>
      </div>
      <div className="flex gap-x-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            STT Model
          </label>
          <input
            type="text"
            name="STTOpenAICompatibleModel"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="whisper-1"
            defaultValue={settings?.STTOpenAICompatibleModel}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
            The model identifier for the STT model you want to use for
            transcription.
          </p>
        </div>
      </div>
    </div>
  );
}
