export default function AnthropicAiOptions({ settings }) {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Anthropic API Key
          </label>
          <input
            type="password"
            name="AnthropicApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Anthropic Claude-2 API Key"
            defaultValue={settings?.AnthropicApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        {!settings?.credentialsOnly && (
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-3">
              Chat Model Selection
            </label>
            <select
              name="AnthropicModelPref"
              defaultValue={settings?.AnthropicModelPref || "claude-2"}
              required={true}
              className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
            >
              {[
                "claude-instant-1.2",
                "claude-2.0",
                "claude-2.1",
                "claude-3-haiku-20240307",
                "claude-3-sonnet-20240229",
                "claude-3-opus-latest",
                "claude-3-5-haiku-latest",
                "claude-3-5-haiku-20241022",
                "claude-3-5-sonnet-latest",
                "claude-3-5-sonnet-20241022",
                "claude-3-5-sonnet-20240620",
              ].map((model) => {
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
