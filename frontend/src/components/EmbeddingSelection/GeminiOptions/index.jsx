const DEFAULT_MODELS = [
  {
    id: "embedding-001",
    name: "Embedding 001",
  },
  {
    id: "text-embedding-004",
    name: "Text Embedding 004",
  },
  {
    id: "gemini-embedding-exp-03-07",
    name: "Gemini Embedding Exp 03 07",
  },
];

export default function GeminiOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            API Key
          </label>
          <input
            type="password"
            name="GeminiEmbeddingApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Gemini API Key"
            defaultValue={settings?.GeminiEmbeddingApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Model Preference
          </label>
          <select
            name="EmbeddingModelPref"
            required={true}
            className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
          >
            <optgroup label="Available embedding models">
              {DEFAULT_MODELS.map((model) => {
                return (
                  <option
                    key={model.id}
                    value={model.id}
                    selected={settings?.EmbeddingModelPref === model.id}
                  >
                    {model.name}
                  </option>
                );
              })}
            </optgroup>
          </select>
        </div>
      </div>
    </div>
  );
}
