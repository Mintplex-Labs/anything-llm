export default function TextGenWebUIOptions({ settings }) {
  return (
    <div className="flex gap-4 flex-wrap">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          Base URL
        </label>
        <input
          type="url"
          name="TextGenWebUIBasePath"
          className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
          placeholder="http://127.0.0.1:5000/v1"
          defaultValue={settings?.TextGenWebUIBasePath}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          Token context window
        </label>
        <input
          type="number"
          name="TextGenWebUITokenLimit"
          className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
          placeholder="Content window limit (eg: 4096)"
          min={1}
          onScroll={(e) => e.target.blur()}
          defaultValue={settings?.TextGenWebUITokenLimit}
          required={true}
          autoComplete="off"
        />
      </div>
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          API Key (Optional)
        </label>
        <input
          type="password"
          name="TextGenWebUIAPIKey"
          className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
          placeholder="TextGen Web UI API Key"
          defaultValue={settings?.TextGenWebUIAPIKey ? "*".repeat(20) : ""}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
