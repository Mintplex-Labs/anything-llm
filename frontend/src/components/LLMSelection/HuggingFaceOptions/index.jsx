export default function HuggingFaceOptions({ settings }) {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            HuggingFace Inference Endpoint
          </label>
          <input
            type="url"
            name="HuggingFaceLLMEndpoint"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="https://example.endpoints.huggingface.cloud"
            defaultValue={settings?.HuggingFaceLLMEndpoint}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            HuggingFace Access Token
          </label>
          <input
            type="password"
            name="HuggingFaceLLMAccessToken"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="HuggingFace Access Token"
            defaultValue={
              settings?.HuggingFaceLLMAccessToken ? "*".repeat(20) : ""
            }
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Model Token Limit
          </label>
          <input
            type="number"
            name="HuggingFaceLLMTokenLimit"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="4096"
            min={1}
            onScroll={(e) => e.target.blur()}
            defaultValue={settings?.HuggingFaceLLMTokenLimit}
            required={true}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}
