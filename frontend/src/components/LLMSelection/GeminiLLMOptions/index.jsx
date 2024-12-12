export default function GeminiLLMOptions({ settings }) {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Google AI API Key
          </label>
          <input
            type="password"
            name="GeminiLLMApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Google Gemini API Key"
            defaultValue={settings?.GeminiLLMApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        {!settings?.credentialsOnly && (
          <>
            <div className="flex flex-col w-60">
              <label className="text-white text-sm font-semibold block mb-3">
                Chat Model Selection
              </label>
              <select
                name="GeminiLLMModelPref"
                defaultValue={settings?.GeminiLLMModelPref || "gemini-pro"}
                required={true}
                className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
              >
                <optgroup label="Stable Models">
                  {[
                    "gemini-pro",
                    "gemini-1.0-pro",
                    "gemini-1.5-pro-latest",
                    "gemini-1.5-flash-latest",
                  ].map((model) => {
                    return (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    );
                  })}
                </optgroup>
                <optgroup label="Experimental Models">
                  {[
                    "gemini-1.5-pro-exp-0801",
                    "gemini-1.5-pro-exp-0827",
                    "gemini-1.5-flash-exp-0827",
                    "gemini-1.5-flash-8b-exp-0827",
                    "gemini-exp-1114",
                    "gemini-exp-1121",
                    "gemini-exp-1206",
                    "learnlm-1.5-pro-experimental",
                    "gemini-2.0-flash-exp",
                  ].map((model) => {
                    return (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    );
                  })}
                </optgroup>
              </select>
            </div>
            <div className="flex flex-col w-60">
              <label className="text-white text-sm font-semibold block mb-3">
                Safety Setting
              </label>
              <select
                name="GeminiSafetySetting"
                defaultValue={
                  settings?.GeminiSafetySetting || "BLOCK_MEDIUM_AND_ABOVE"
                }
                required={true}
                className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
              >
                <option value="BLOCK_NONE">None</option>
                <option value="BLOCK_ONLY_HIGH">Block few</option>
                <option value="BLOCK_MEDIUM_AND_ABOVE">
                  Block some (default)
                </option>
                <option value="BLOCK_LOW_AND_ABOVE">Block most</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
