export default function QDrantDBOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            QDrant API Endpoint
          </label>
          <input
            type="url"
            name="QdrantEndpoint"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="http://localhost:6633"
            defaultValue={settings?.QdrantEndpoint}
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
            name="QdrantApiKey"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="wOeqxsYP4....1244sba"
            defaultValue={settings?.QdrantApiKey}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
