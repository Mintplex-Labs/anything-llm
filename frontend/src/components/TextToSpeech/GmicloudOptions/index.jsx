import React from "react";

export default function GmicloudTextToSpeechOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="flex gap-x-4">
        <div className="flex flex-col w-60">
          <div className="flex justify-between items-start mb-2">
            <label className="text-white text-sm font-semibold">API Key</label>
          </div>
          <input
            type="password"
            name="TTSGmicloudKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="API Key"
            defaultValue={
              settings?.TTSGmicloudKey ? "*".repeat(20) : ""
            }
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
            Your GMI Cloud API key from the console organization settings.
          </p>
        </div>
        <div className="flex flex-col w-60">
          <div className="flex justify-between items-start mb-2">
            <label className="text-white text-sm font-semibold">
              Base URL
            </label>
          </div>
          <input
            type="url"
            name="TTSGmicloudEndpoint"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="https://console.gmicloud.ai"
            defaultValue={settings?.TTSGmicloudEndpoint}
            required={false}
            autoComplete="off"
            spellCheck={false}
          />
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
            Leave empty to use GMI Cloud's default endpoint.
          </p>
        </div>
      </div>
      <div className="flex gap-x-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            TTS Model
          </label>
          <input
            type="text"
            name="TTSGmicloudModel"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="inworld-tts-2"
            defaultValue={settings?.TTSGmicloudModel}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
            GMI Cloud model id, for example{" "}
            <code>inworld-tts-2</code> for low-latency speech or{" "}
            <code>minimax-tts-speech-2.8-turbo</code>.
          </p>
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Voice Model
          </label>
          <input
            type="text"
            name="TTSGmicloudVoiceModel"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Default voice for the model family"
            defaultValue={settings?.TTSGmicloudVoiceModel}
            required={false}
            autoComplete="off"
            spellCheck={false}
          />
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
            Voice id for the model family. Leave empty to use the family
            default. Chatterbox models require a Resemble voice UUID here.
          </p>
        </div>
      </div>
    </div>
  );
}
