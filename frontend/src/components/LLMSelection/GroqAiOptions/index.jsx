import InputField from "@/components/lib/InputField";

export default function GroqAiOptions({ settings }) {
  return (
    <div className="flex gap-x-4">
      <InputField
        type="password"
        name="GroqApiKey"
        placeholder="Groq API Key"
        defaultValue={settings?.GroqApiKey ? "*".repeat(20) : ""}
        required={true}
        autoComplete="off"
        spellCheck={false}
        label="Groq API Key"
        inputClassName="w-full"
        className="w-60"
      />
      {!settings?.credentialsOnly && (
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Chat Model Selection
          </label>
          <select
            name="GroqModelPref"
            defaultValue={settings?.GroqModelPref || "llama2-70b-4096"}
            required={true}
            className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
          >
            {["llama2-70b-4096", "mixtral-8x7b-32768"].map((model) => {
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
