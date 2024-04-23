export default function GenericOpenAiOptions({ settings }) {
  return (
    <div className="flex gap-4 flex-wrap">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          Base URL
        </label>
        <input
          type="url"
          name="GenericOpenAiBasePath"
          className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
          placeholder="eg: https://proxy.openai.com"
          defaultValue={settings?.GenericOpenAiBasePath}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          API Key
        </label>
        <input
          type="password"
          name="GenericOpenAiKey"
          className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
          placeholder="Generic service API Key"
          defaultValue={settings?.GenericOpenAiKey ? "*".repeat(20) : ""}
          required={false}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      {!settings?.credentialsOnly && (
        <>
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-4">
              Chat Model Name
            </label>
            <input
              type="text"
              name="GenericOpenAiModelPref"
              className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
              placeholder="Model id used for chat requests"
              defaultValue={settings?.GenericOpenAiModelPref}
              required={true}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-4">
              Token context window
            </label>
            <input
              type="number"
              name="GenericOpenAiTokenLimit"
              className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
              placeholder="Content window limit (eg: 4096)"
              min={1}
              onScroll={(e) => e.target.blur()}
              defaultValue={settings?.GenericOpenAiTokenLimit}
              required={true}
              autoComplete="off"
            />
          </div>
        </>
      )}
    </div>
  );
}
