export default function ZillizCloudOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Cluster Endpoint
          </label>
          <input
            type="text"
            name="ZillizEndpoint"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="https://sample.api.gcp-us-west1.zillizcloud.com"
            defaultValue={settings?.ZillizEndpoint}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            API Token
          </label>
          <input
            type="password"
            name="ZillizApiToken"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="Zilliz cluster API Token"
            defaultValue={settings?.ZillizApiToken ? "*".repeat(20) : ""}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
