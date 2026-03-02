const SPEECH_MODELS = [
  { id: "mars-flash", name: "MARS Flash (Low-latency, 150ms)" },
  { id: "mars-pro", name: "MARS Pro (High-fidelity)" },
  { id: "mars-instruct", name: "MARS Instruct (Emotional control)" },
];

const LANGUAGES = [
  { id: "en-us", name: "English (US)" },
  { id: "en-gb", name: "English (UK)" },
  { id: "es", name: "Spanish" },
  { id: "fr", name: "French" },
  { id: "de", name: "German" },
  { id: "it", name: "Italian" },
  { id: "pt", name: "Portuguese" },
  { id: "nl", name: "Dutch" },
  { id: "pl", name: "Polish" },
  { id: "ru", name: "Russian" },
  { id: "ja", name: "Japanese" },
  { id: "ko", name: "Korean" },
  { id: "zh", name: "Chinese (Mandarin)" },
  { id: "ar", name: "Arabic" },
  { id: "hi", name: "Hindi" },
  { id: "tr", name: "Turkish" },
  { id: "vi", name: "Vietnamese" },
  { id: "th", name: "Thai" },
  { id: "sv", name: "Swedish" },
  { id: "da", name: "Danish" },
];

export default function CambAiTTSOptions({ settings }) {
  return (
    <div className="flex gap-x-4 flex-wrap">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          API Key
        </label>
        <input
          type="password"
          name="TTSCambAiKey"
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="CAMB AI API Key"
          defaultValue={settings?.TTSCambAiKey ? "*".repeat(20) : ""}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      {!settings?.credentialsOnly && (
        <>
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-3">
              Voice ID
            </label>
            <input
              type="text"
              name="TTSCambAiVoiceModel"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="CAMB AI Voice ID"
              defaultValue={settings?.TTSCambAiVoiceModel || ""}
              required={true}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-3">
              Speech Model
            </label>
            <select
              name="TTSCambAiSpeechModel"
              required={true}
              className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
            >
              {SPEECH_MODELS.map((model) => (
                <option
                  key={model.id}
                  value={model.id}
                  selected={
                    model.id ===
                    (settings?.TTSCambAiSpeechModel || "mars-flash")
                  }
                >
                  {model.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-3">
              Language
            </label>
            <select
              name="TTSCambAiLanguage"
              required={true}
              className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
            >
              {LANGUAGES.map((lang) => (
                <option
                  key={lang.id}
                  value={lang.id}
                  selected={
                    lang.id === (settings?.TTSCambAiLanguage || "en-us")
                  }
                >
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
}

