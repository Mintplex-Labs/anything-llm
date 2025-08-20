function toProperCase(string) {
  return string.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export default function OpenAiTextToSpeechOptions({ settings }) {
  const apiKey = settings?.TTSOpenAIKey;

  return (
    <div className="flex gap-x-4">
      <div className="flex flex-col w-60">
        <label className="text-foreground text-sm font-semibold block mb-3">
          API Key
        </label>
        <input
          type="password"
          name="TTSOpenAIKey"
          className="border-none bg-theme-settings-input-bg text-foreground placeholder:text-theme-settings-input-placeholder text-sm rounded-sm focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="OpenAI API Key"
          defaultValue={apiKey ? "*".repeat(20) : ""}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <div className="flex flex-col w-60">
        <label className="text-foreground text-sm font-semibold block mb-3">
          Voice Model
        </label>
        <select
          name="TTSOpenAIVoiceModel"
          defaultValue={settings?.TTSOpenAIVoiceModel ?? "alloy"}
          className="border-none bg-theme-settings-input-bg border-border text-foreground text-sm rounded-sm block w-full p-2.5"
        >
          {["alloy", "echo", "fable", "onyx", "nova", "shimmer"].map(
            (voice) => {
              return (
                <option key={voice} value={voice}>
                  {toProperCase(voice)}
                </option>
              );
            }
          )}
        </select>
      </div>
    </div>
  );
}
