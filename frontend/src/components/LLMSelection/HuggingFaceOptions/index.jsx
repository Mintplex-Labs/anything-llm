import InputField from "@/components/lib/InputField";

export default function HuggingFaceOptions({ settings }) {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center gap-4">
        <InputField
          type="url"
          name="HuggingFaceLLMEndpoint"
          placeholder="https://example.endpoints.huggingface.cloud"
          defaultValue={settings?.HuggingFaceLLMEndpoint}
          required={true}
          autoComplete="off"
          spellCheck={false}
          label="HuggingFace Inference Endpoint"
          inputClassName="w-full"
          className="w-60"
        />
        <InputField
          type="password"
          name="HuggingFaceLLMAccessToken"
          placeholder="HuggingFace Access Token"
          defaultValue={
            settings?.HuggingFaceLLMAccessToken ? "*".repeat(20) : ""
          }
          required={true}
          autoComplete="off"
          spellCheck={false}
          label="HuggingFace Access Token"
          inputClassName="w-full"
          className="w-60"
        />
        <InputField
          type="number"
          name="HuggingFaceLLMTokenLimit"
          placeholder="4096"
          min={1}
          onScroll={(e) => e.target.blur()}
          defaultValue={settings?.HuggingFaceLLMTokenLimit}
          required={true}
          autoComplete="off"
          label="Model Token Limit"
          inputClassName="w-full"
          className="w-60"
        />
      </div>
    </div>
  );
}
