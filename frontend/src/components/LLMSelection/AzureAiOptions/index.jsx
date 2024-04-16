import InputField from "@/components/lib/InputField";

export default function AzureAiOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-4">
        <InputField
          type="url"
          name="AzureOpenAiEndpoint"
          placeholder="https://my-azure.openai.azure.com"
          defaultValue={settings?.AzureOpenAiEndpoint}
          required={true}
          autoComplete="off"
          spellCheck={false}
          label="Azure Service Endpoint"
          inputClassName="w-full"
          className="w-60"
        />
        <InputField
          type="password"
          name="AzureOpenAiKey"
          placeholder="Azure OpenAI API Key"
          defaultValue={settings?.AzureOpenAiKey ? "*".repeat(20) : ""}
          required={true}
          autoComplete="off"
          spellCheck={false}
          label="API Key"
          inputClassName="w-full"
          className="w-60"
        />
        <InputField
          type="text"
          name="AzureOpenAiModelPref"
          placeholder="Azure OpenAI chat model deployment name"
          defaultValue={settings?.AzureOpenAiModelPref}
          required={true}
          autoComplete="off"
          spellCheck={false}
          label="Chat Deployment Name"
          inputClassName="w-full"
          className="w-60"
        />
      </div>
      <div className="w-full flex items-center gap-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Chat Model Token Limit
          </label>
          <select
            name="AzureOpenAiTokenLimit"
            defaultValue={settings?.AzureOpenAiTokenLimit || 4096}
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            required={true}
          >
            <option value={4096}>4,096 (gpt-3.5-turbo)</option>
            <option value={16384}>16,384 (gpt-3.5-16k)</option>
            <option value={8192}>8,192 (gpt-4)</option>
            <option value={32768}>32,768 (gpt-4-32k)</option>
            <option value={128000}>128,000 (gpt-4-turbo)</option>
          </select>
        </div>
        <InputField
          type="text"
          name="AzureOpenAiEmbeddingModelPref"
          placeholder="Azure OpenAI embedding model deployment name"
          defaultValue={settings?.AzureOpenAiEmbeddingModelPref}
          required={true}
          autoComplete="off"
          spellCheck={false}
          label="Embedding Deployment Name"
          inputClassName="w-full"
          className="w-60"
        />
        <div className="flex-flex-col w-60"></div>
      </div>
    </div>
  );
}
