import InputField from "@/components/lib/InputField";

export default function OpenAiOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-4">
        <InputField
          type="password"
          label="API Key"
          name="OpenAiKey"
          placeholder="OpenAI API Key"
          defaultValue={settings?.OpenAiKey ? "*".repeat(20) : ""}
          required={true}
          autoComplete="off"
          spellCheck={false}
          className="w-60"
        />
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Model Preference
          </label>
          <select
            name="EmbeddingModelPref"
            required={true}
            className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
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
