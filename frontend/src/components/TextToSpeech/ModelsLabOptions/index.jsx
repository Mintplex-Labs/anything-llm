const MODELSLAB_VOICES = [
  { value: "en_us_001", label: "English (US) - Voice 1" },
  { value: "en_us_006", label: "English (US) - Voice 2" },
  { value: "en_us_007", label: "English (US) - Voice 3" },
  { value: "en_us_009", label: "English (US) - Voice 4" },
  { value: "en_us_010", label: "English (US) - Voice 5" },
  { value: "en_uk_001", label: "English (UK) - Voice 1" },
  { value: "en_uk_003", label: "English (UK) - Voice 2" },
  { value: "en_au_001", label: "English (AU) - Voice 1" },
  { value: "en_au_002", label: "English (AU) - Voice 2" },
];

const MODELSLAB_LANGUAGES = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "italian", label: "Italian" },
  { value: "portuguese", label: "Portuguese" },
  { value: "polish", label: "Polish" },
  { value: "hindi", label: "Hindi" },
];

const MODELSLAB_SPEEDS = [
  { value: "0.5", label: "0.5x (Slow)" },
  { value: "0.75", label: "0.75x" },
  { value: "1", label: "1x (Normal)" },
  { value: "1.25", label: "1.25x" },
  { value: "1.5", label: "1.5x (Fast)" },
  { value: "2", label: "2x (Very Fast)" },
];

export default function ModelsLabTextToSpeechOptions({ settings }) {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex gap-x-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            API Key
          </label>
          <input
            type="password"
            name="TTSModelsLabApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="ModelsLab API Key"
            defaultValue={settings?.TTSModelsLabApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
          <p className="text-xs text-white/60 mt-1">
            Get your API key at{" "}
            <a
              href="https://modelslab.com/dashboard/api-keys"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-white"
            >
              modelslab.com
            </a>
          </p>
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Voice
          </label>
          <select
            name="TTSModelsLabVoiceId"
            defaultValue={settings?.TTSModelsLabVoiceId ?? "en_us_001"}
            className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
          >
            {MODELSLAB_VOICES.map((voice) => (
              <option key={voice.value} value={voice.value}>
                {voice.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Language
          </label>
          <select
            name="TTSModelsLabLanguage"
            defaultValue={settings?.TTSModelsLabLanguage ?? "english"}
            className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
          >
            {MODELSLAB_LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col w-40">
          <label className="text-white text-sm font-semibold block mb-3">
            Speed
          </label>
          <select
            name="TTSModelsLabSpeed"
            defaultValue={settings?.TTSModelsLabSpeed ?? "1"}
            className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
          >
            {MODELSLAB_SPEEDS.map((speed) => (
              <option key={speed.value} value={speed.value}>
                {speed.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
