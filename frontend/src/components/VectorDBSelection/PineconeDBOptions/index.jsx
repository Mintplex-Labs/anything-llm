export default function PineconeDBOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Pinecone DB API Key
          </label>
          <input
            type="password"
            name="PineConeKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Pinecone API Key"
            defaultValue={settings?.PineConeKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Pinecone Index Name
          </label>
          <input
            type="text"
            name="PineConeIndex"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="my-index"
            defaultValue={settings?.PineConeIndex}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
