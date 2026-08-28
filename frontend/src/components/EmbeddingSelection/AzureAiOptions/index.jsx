import { useState } from "react";

export default function AzureAiOptions({ settings }) {
  const [connectionMethod, setConnectionMethod] = useState(
    settings?.AzureOpenAiConnectionMethod || "api_key"
  );
  const usesManagedIdentity = connectionMethod === "managed_identity";

  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Azure Service Endpoint
          </label>
          <input
            type="url"
            name="AzureOpenAiEndpoint"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="https://my-azure.openai.azure.com"
            defaultValue={settings?.AzureOpenAiEndpoint}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Connection Method
          </label>
          <select
            name="AzureOpenAiConnectionMethod"
            value={connectionMethod}
            onChange={(e) => setConnectionMethod(e.target.value)}
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            required={true}
          >
            <option value="api_key">API Key</option>
            <option value="managed_identity">Managed Identity</option>
          </select>
        </div>

        {usesManagedIdentity ? (
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-3">
              Managed Identity Client ID
            </label>
            <input
              type="text"
              name="AzureOpenAiManagedIdentityClientId"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="Optional - only for a user-assigned identity"
              defaultValue={settings?.AzureOpenAiManagedIdentityClientId}
              required={false}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        ) : (
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-3">
              API Key
            </label>
            <input
              type="password"
              name="AzureOpenAiKey"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="Azure OpenAI API Key"
              defaultValue={settings?.AzureOpenAiKey ? "*".repeat(20) : ""}
              required={true}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        )}
      </div>

      <div className="w-full flex items-center gap-[36px]">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Embedding Deployment Name
          </label>
          <input
            type="text"
            name="AzureOpenAiEmbeddingModelPref"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Azure OpenAI embedding model deployment name"
            defaultValue={settings?.AzureOpenAiEmbeddingModelPref}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
