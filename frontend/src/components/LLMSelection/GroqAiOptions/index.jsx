export default function GroqAiOptions({ settings }) {
  return (
    <div className="flex gap-[36px] mt-1.5">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Groq API Key
        </label>
        <input
          type="password"
          name="GroqApiKey"
          className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="Groq API Key"
          defaultValue={settings?.GroqApiKey ? "*".repeat(20) : ""}
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
            name="GroqModelPref"
            defaultValue={settings?.GroqModelPref || "llama3-8b-8192"}
            required={true}
            className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
          >
            {[
              "mixtral-8x7b-32768",
              "llama3-8b-8192",
              "llama3-70b-8192",
              "gemma-7b-it",
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
  );
}
