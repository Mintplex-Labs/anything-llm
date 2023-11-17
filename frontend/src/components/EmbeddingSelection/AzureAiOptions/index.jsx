export default function AzureAiOptions({ settings }) {
  return (
    <>
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
    </>
  );
}
