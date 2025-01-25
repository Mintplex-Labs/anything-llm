export default function PrismRerankerOptions({ settings }) {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Prism URL
          </label>
          <input
            type="url"
            name="RerankerUrl"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Prism Re-Ranker URL"
            defaultValue={settings?.RerankerUrl}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Prism API Key
          </label>
          <input
            type="password"
            name="RerankerApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Prism API Key"
            defaultValue={settings?.RerankerApiKey}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Re-rank Top N Results
          </label>
          <input
            type="number"
            name="RerankTopNResults"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="3"
            defaultValue={settings?.RerankTopNResults || 3}
            autoComplete="off"
            spellCheck={false}
            min={0}
          />
        </div>
      </div>
    </div>
  );
}
