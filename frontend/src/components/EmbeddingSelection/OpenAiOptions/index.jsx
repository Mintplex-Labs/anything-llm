export default function OpenAiOptions({ settings }) {
  return (
    <>
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          API Key
        </label>
        <input
          type="password"
          name="OpenAiKey"
          className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
          placeholder="OpenAI API Key"
          defaultValue={settings?.OpenAiKey ? "*".repeat(20) : ""}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          Model Preference
        </label>
        <select
          disabled={true}
          className="cursor-not-allowed bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            text-embedding-ada-002
          </option>
        </select>
      </div>
    </>
  );
}
