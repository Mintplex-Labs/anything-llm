export default function MilvusDBOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Milvus DB Address
          </label>
          <input
            type="text"
            name="MilvusAddress"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="http://localhost:19530"
            defaultValue={settings?.MilvusAddress}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Milvus Username
          </label>
          <input
            type="text"
            name="MilvusUsername"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="username"
            defaultValue={settings?.MilvusUsername}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Milvus Password
          </label>
          <input
            type="password"
            name="MilvusPassword"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="password"
            defaultValue={settings?.MilvusPassword ? "*".repeat(20) : ""}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
