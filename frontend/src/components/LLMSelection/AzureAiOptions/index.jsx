export default function AzureAiOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Azure Service Endpoint
          </label>
          <input
            type="url"
            name="AzureOpenAiEndpoint"
            className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="https://my-azure.openai.azure.com"
            defaultValue={settings?.AzureOpenAiEndpoint}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            API Key
          </label>
          <input
            type="password"
            name="AzureOpenAiKey"
            className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="Azure OpenAI API Key"
            defaultValue={settings?.AzureOpenAiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Chat Deployment Name
          </label>
          <input
            type="text"
            name="AzureOpenAiModelPref"
            className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="Azure OpenAI chat model deployment name"
            defaultValue={settings?.AzureOpenAiModelPref}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>

      <div className="w-full flex items-center gap-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Chat Model Token Limit
          </label>
          <select
            name="AzureOpenAiTokenLimit"
            defaultValue={settings?.AzureOpenAiTokenLimit || 4096}
            className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
            required={true}
          >
            <option value={4096}>4,096 (gpt-3.5-turbo)</option>
            <option value={16384}>16,384 (gpt-3.5-16k)</option>
            <option value={8192}>8,192 (gpt-4)</option>
            <option value={32768}>32,768 (gpt-4-32k)</option>
            <option value={128000}>128,000 (gpt-4-turbo)</option>
          </select>
        </div>

        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Embedding Deployment Name
          </label>
          <input
            type="text"
            name="AzureOpenAiEmbeddingModelPref"
            className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="Azure OpenAI embedding model deployment name"
            defaultValue={settings?.AzureOpenAiEmbeddingModelPref}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex-flex-col w-60"></div>
      </div>
    </div>
  );
}
