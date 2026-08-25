export default function LanceDBCloudOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-96">
          <label className="text-white text-sm font-semibold block mb-3">
            LanceDB URI
          </label>
          <input
            name="LanceDBCloudUri"
            autoComplete="off"
            type="text"
            defaultValue={settings?.LanceDBCloudUri}
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="s3://my-bucket/lancedb"
            required={true}
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold flex items-center gap-x-2 mb-3">
            API Key{" "}
            <p className="!text-xs !italic !font-thin">
              LanceDB Cloud (db://) only
            </p>
          </label>
          <input
            type="password"
            name="LanceDBCloudApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="sk-lancedb-xxxxxxxx"
            defaultValue={settings?.LanceDBCloudApiKey ? "*".repeat(20) : ""}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold flex items-center gap-x-2 mb-3">
            Region{" "}
            <p className="!text-xs !italic !font-thin">
              LanceDB Cloud (db://) only
            </p>
          </label>
          <input
            name="LanceDBCloudRegion"
            autoComplete="off"
            type="text"
            defaultValue={settings?.LanceDBCloudRegion}
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="us-east-1"
          />
        </div>
      </div>
    </div>
  );
}
