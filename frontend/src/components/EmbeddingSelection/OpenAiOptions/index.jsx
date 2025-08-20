export default function OpenAiOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-foreground text-sm font-semibold block mb-3">
            API Key
          </label>
          <input
            type="password"
            name="OpenAiKey"
            className="border-none bg-theme-settings-input-bg text-foreground placeholder:text-theme-settings-input-placeholder text-sm rounded-sm focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="OpenAI API Key"
            defaultValue={settings?.OpenAiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-foreground text-sm font-semibold block mb-3">
            Model Preference
          </label>
          <select
            name="EmbeddingModelPref"
            required={true}
            className="border-none bg-theme-settings-input-bg border-border text-foreground text-sm rounded-sm block w-full p-2.5"
          >
            <optgroup label="Available embedding models">
              {[
                "text-embedding-ada-002",
                "text-embedding-3-small",
                "text-embedding-3-large",
              ].map((model) => {
                return (
                  <option
                    key={model}
                    value={model}
                    selected={settings?.EmbeddingModelPref === model}
                  >
                    {model}
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
