import InputField from "@/components/lib/InputField";

export default function AzureAiOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-4">
        <InputField
          type="url"
          label="Azure Service Endpoint"
          name="AzureOpenAiEndpoint"
          placeholder="https://my-azure.openai.azure.com"
          defaultValue={settings?.AzureOpenAiEndpoint}
          required={true}
          autoComplete="off"
          spellCheck={false}
          className="w-60"
        />
        <InputField
          type="password"
          label="API Key"
          name="AzureOpenAiKey"
          placeholder="Azure OpenAI API Key"
          defaultValue={settings?.AzureOpenAiKey ? "*".repeat(20) : ""}
          required={true}
          autoComplete="off"
          spellCheck={false}
          className="w-60"
        />
        <InputField
          label="Embedding Deployment Name"
          name="AzureOpenAiEmbeddingModelPref"
          placeholder="Azure OpenAI embedding model deployment name"
          defaultValue={settings?.AzureOpenAiEmbeddingModelPref}
          required={true}
          autoComplete="off"
          spellCheck={false}
          className="w-60"
        />
      </div>
    </div>
  );
}
