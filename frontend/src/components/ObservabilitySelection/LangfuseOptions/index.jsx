export default function LangfuseOptions({ config = {} }) {
  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="flex gap-x-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-2">
            Public key
          </label>
          <input
            type="text"
            name="publicKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="pk-lf-..."
            defaultValue={config.publicKey || ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-2">
            Secret key
          </label>
          <input
            type="password"
            name="secretKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="sk-lf-..."
            defaultValue={config.secretKey || ""}
            required={true}
            autoComplete="new-password"
            spellCheck={false}
          />
        </div>
      </div>
      <div className="flex gap-x-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-2">
            Host URL
          </label>
          <input
            type="url"
            name="host"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="https://cloud.langfuse.com"
            defaultValue={config.host || ""}
            required={false}
            autoComplete="off"
            spellCheck={false}
          />
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
            Leave blank to use Langfuse Cloud, or set the URL of your
            self-hosted Langfuse instance.
          </p>
        </div>
      </div>
    </div>
  );
}
