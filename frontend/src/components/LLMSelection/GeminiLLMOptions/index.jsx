export default function GeminiLLMOptions({ settings }) {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center gap-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Google AI API Key
          </label>
          <input
            type="password"
            name="GeminiLLMApiKey"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="Google Gemini API Key"
            defaultValue={settings?.GeminiLLMApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        {!settings?.credentialsOnly && (
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-4">
              Chat Model Selection
            </label>
            <select
              name="GeminiLLMModelPref"
              defaultValue={settings?.GeminiLLMModelPref || "gemini-pro"}
              required={true}
              className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
            >
              {["gemini-pro", "gemini-1.5-pro-latest"].map((model) => {
                return (
                  <option key={model} value={model}>
                    {model}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
