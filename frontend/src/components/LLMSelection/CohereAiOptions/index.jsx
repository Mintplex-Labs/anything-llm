export default function CohereAiOptions({ settings }) {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center gap-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Cohere API Key
          </label>
          <input
            type="password"
            name="CohereApiKey"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="Cohere API Key"
            defaultValue={settings?.CohereApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Chat Model Selection
          </label>
          <select
            name="CohereModelPref"
            defaultValue={settings?.CohereModelPref || "command-r"}
            required={true}
            className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
          >
            {[
              "command-r",
              "command-r-plus",
              "command",
              "command-light",
              "command-nightly",
              "command-light-nightly",
            ].map((model) => {
              return (
                <option key={model} value={model}>
                  {model}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </div>
  );
}
