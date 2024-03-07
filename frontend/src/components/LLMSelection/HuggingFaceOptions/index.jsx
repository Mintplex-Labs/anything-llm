export default function HuggingFaceOptions({ settings }) {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center gap-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            HuggingFace Inference Endpoint
          </label>
          <input
            type="url"
            name="HuggingFaceLLMEndpoint"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="https://example.endpoints.huggingface.cloud"
            defaultValue={settings?.HuggingFaceLLMEndpoint}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            HuggingFace Access Token
          </label>
          <input
            type="password"
            name="HuggingFaceLLMAccessToken"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
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
          <label className="text-white text-sm font-semibold block mb-4">
            Model Token Limit
          </label>
          <input
            type="number"
            name="HuggingFaceLLMTokenLimit"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
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
