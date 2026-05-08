export default function OpenAiSpeechToTextOptions({ settings }) {
  const apiKey = settings?.OpenAiKey;

  return (
    <div className="flex gap-x-4">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          API Key
        </label>
        <input
          type="password"
          name="OpenAiKey"
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="OpenAI API Key"
          defaultValue={apiKey ? "*".repeat(20) : ""}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Transcription Model
        </label>
        <select
          name="STTOpenAIModel"
          defaultValue={settings?.STTOpenAIModel ?? "whisper-1"}
          className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          {["whisper-1", "gpt-4o-transcribe", "gpt-4o-mini-transcribe"].map(
            (model) => (
              <option key={model} value={model}>
                {model}
              </option>
            )
          )}
        </select>
      </div>
    </div>
  );
}
