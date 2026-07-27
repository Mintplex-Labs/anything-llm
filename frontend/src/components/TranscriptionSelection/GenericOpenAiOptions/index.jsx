export default function GenericOpenAiWhisperOptions({ settings }) {
  return (
    <div className="flex gap-x-7 gap-[36px] mt-1.5 flex-wrap">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Base URL
        </label>
        <input
          type="url"
          name="WhisperGenericOpenAiBaseUrl"
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="http://localhost:8000/v1"
          defaultValue={settings?.WhisperGenericOpenAiBaseUrl}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
        <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
          The base URL of the OpenAI-compatible service used to transcribe
          audio.
        </p>
      </div>
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          API Key
        </label>
        <input
          type="password"
          name="WhisperGenericOpenAiApiKey"
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="API Key"
          defaultValue={
            settings?.WhisperGenericOpenAiApiKey ? "*".repeat(20) : ""
          }
          autoComplete="off"
          spellCheck={false}
        />
        <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
          Optional - Only required if your service enforces authentication.
        </p>
      </div>
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Transcription Model
        </label>
        <input
          type="text"
          name="WhisperGenericOpenAiModel"
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="whisper-small"
          defaultValue={settings?.WhisperGenericOpenAiModel}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
        <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
          The model identifier to be used for transcription.
        </p>
      </div>
    </div>
  );
}
