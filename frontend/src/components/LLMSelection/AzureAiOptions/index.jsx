import { Info } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";
import System from "@/models/system";

export default function AzureAiOptions({ settings }) {
  const { t } = useTranslation();
  const [connectionMethod, setConnectionMethod] = useState(
    settings?.AzureOpenAiConnectionMethod || "api_key"
  );
  const usesManagedIdentity = connectionMethod === "managed_identity";

  // Listing deployments needs the endpoint and credentials, which may still be
  // mid-edit. These update on blur rather than on change so that typing an
  // endpoint does not fire a request per keystroke.
  const [endpoint, setEndpoint] = useState(settings?.AzureOpenAiEndpoint);
  const [apiKey, setApiKey] = useState(settings?.AzureOpenAiKey);
  const [clientId, setClientId] = useState(
    settings?.AzureOpenAiManagedIdentityClientId
  );

  return (
    <div className="w-full flex flex-col gap-y-7 mt-1.5">
      <div className="w-full flex items-center gap-[36px]">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("llm.providers.azure_openai.azure_service_endpoint")}
          </label>
          <input
            type="url"
            name="AzureOpenAiEndpoint"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="https://my-azure.openai.azure.com"
            defaultValue={settings?.AzureOpenAiEndpoint}
            onBlur={(e) => setEndpoint(e.target.value)}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col w-60">
          <div className="flex items-center gap-1 mb-3">
            <label className="text-white text-sm font-semibold block">
              {t("llm.providers.azure_openai.connection_method")}
            </label>
            <Tooltip
              id="azure-openai-connection-method"
              place="top"
              delayShow={300}
              className="tooltip !text-xs !opacity-100"
              style={{
                maxWidth: "250px",
                whiteSpace: "normal",
                wordWrap: "break-word",
              }}
            />
            <div
              type="button"
              className="text-theme-text-secondary cursor-pointer hover:bg-theme-bg-primary flex items-center justify-center rounded-full"
              data-tooltip-id="azure-openai-connection-method"
              data-tooltip-place="top"
              data-tooltip-content={t(
                "llm.providers.azure_openai.connection_method_tooltip"
              )}
            >
              <Info size={18} className="text-theme-text-secondary" />
            </div>
          </div>
          <select
            name="AzureOpenAiConnectionMethod"
            value={connectionMethod}
            onChange={(e) => setConnectionMethod(e.target.value)}
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            required={true}
          >
            <option value="api_key">
              {t("llm.providers.azure_openai.api_key")}
            </option>
            <option value="managed_identity">
              {t("llm.providers.azure_openai.managed_identity")}
            </option>
          </select>
        </div>

        {usesManagedIdentity ? (
          <div className="flex flex-col w-60">
            <div className="flex items-center gap-1 mb-3">
              <label className="text-white text-sm font-semibold block">
                {t("llm.providers.azure_openai.managed_identity_client_id")}
              </label>
              <Tooltip
                id="azure-openai-managed-identity-client-id"
                place="top"
                delayShow={300}
                className="tooltip !text-xs !opacity-100"
                style={{
                  maxWidth: "250px",
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                }}
              />
              <div
                type="button"
                className="text-theme-text-secondary cursor-pointer hover:bg-theme-bg-primary flex items-center justify-center rounded-full"
                data-tooltip-id="azure-openai-managed-identity-client-id"
                data-tooltip-place="top"
                data-tooltip-content={t(
                  "llm.providers.azure_openai.managed_identity_client_id_tooltip"
                )}
              >
                <Info size={18} className="text-theme-text-secondary" />
              </div>
            </div>
            <input
              type="text"
              name="AzureOpenAiManagedIdentityClientId"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder={t(
                "llm.providers.azure_openai.managed_identity_client_id_placeholder"
              )}
              defaultValue={settings?.AzureOpenAiManagedIdentityClientId}
              onBlur={(e) => setClientId(e.target.value)}
              required={false}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        ) : (
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-3">
              {t("llm.providers.azure_openai.api_key")}
            </label>
            <input
              type="password"
              name="AzureOpenAiKey"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="Azure OpenAI API Key"
              defaultValue={settings?.AzureOpenAiKey ? "*".repeat(20) : ""}
              onBlur={(e) => setApiKey(e.target.value)}
              required={true}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        )}
      </div>

      <div className="w-full flex items-center gap-[36px]">
        <AzureDeploymentSelection
          settings={settings}
          endpoint={endpoint}
          apiKey={apiKey}
          connectionMethod={connectionMethod}
          clientId={clientId}
        />

        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("llm.providers.azure_openai.chat_model_token_limit")}
          </label>
          <select
            name="AzureOpenAiTokenLimit"
            defaultValue={settings?.AzureOpenAiTokenLimit || 4096}
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            required={true}
          >
            <option value={4096}>4,096 (gpt-3.5-turbo)</option>
            <option value={16384}>16,384 (gpt-3.5-16k)</option>
            <option value={8192}>8,192 (gpt-4)</option>
            <option value={32768}>32,768 (gpt-4-32k)</option>
            <option value={128000}>
              128,000 (gpt-4-turbo,gpt-4o,gpt-4o-mini,o1-mini)
            </option>
            <option value={200000}>200,000 (o1,o1-pro,o3-mini)</option>
            <option value={1047576}>1,047,576 (gpt-4.1)</option>
          </select>
        </div>

        <div className="flex flex-col w-60">
          <div className="flex items-center gap-1 mb-3">
            <label className="text-white text-sm font-semibold block">
              {t("llm.providers.azure_openai.model_type")}
            </label>
            <Tooltip
              id="azure-openai-model-type"
              place="top"
              delayShow={300}
              className="tooltip !text-xs !opacity-100"
              style={{
                maxWidth: "250px",
                whiteSpace: "normal",
                wordWrap: "break-word",
              }}
            />
            <div
              type="button"
              className="text-theme-text-secondary cursor-pointer hover:bg-theme-bg-primary flex items-center justify-center rounded-full"
              data-tooltip-id="azure-openai-model-type"
              data-tooltip-place="top"
              data-tooltip-content={t(
                "llm.providers.azure_openai.model_type_tooltip"
              )}
            >
              <Info size={18} className="text-theme-text-secondary" />
            </div>
          </div>
          <select
            name="AzureOpenAiModelType"
            defaultValue={settings?.AzureOpenAiModelType || "default"}
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            required={true}
          >
            <option value="default">
              {t("llm.providers.azure_openai.default")}
            </option>
            <option value="reasoning">
              {t("llm.providers.azure_openai.reasoning")}
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}

/**
 * Azure addresses models by deployment name, chosen by whoever created the
 * deployment, so the list has to come from the resource itself. A deployment can
 * always be typed in instead: listing needs read access to the resource, and a
 * deployment created in the last few minutes may not be listed yet.
 */
function AzureDeploymentSelection({
  settings,
  endpoint,
  apiKey,
  connectionMethod,
  clientId,
}) {
  const { t } = useTranslation();
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [manualEntry, setManualEntry] = useState(false);

  useEffect(() => {
    async function findDeployments() {
      if (!endpoint) {
        setDeployments([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { models, error } = await System.customModels(
        "azure",
        typeof apiKey === "boolean" ? null : apiKey,
        endpoint,
        null,
        { connectionMethod, managedIdentityClientId: clientId }
      );
      // Embedding deployments cannot serve chat, so they are left out of this
      // dropdown. "unknown" is kept: the capability catalog does not cover every
      // model a resource can serve, and those deployments still work.
      setDeployments(
        (models || []).filter((deployment) => deployment.type !== "embedding")
      );
      setError(error);
      setLoading(false);
    }
    findDeployments();
  }, [endpoint, apiKey, connectionMethod, clientId]);

  const label = t("llm.providers.azure_openai.chat_deployment_name");

  if (manualEntry || (!loading && !!endpoint && deployments.length === 0)) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          {label}
        </label>
        <input
          type="text"
          name="AzureOpenAiModelPref"
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="Azure OpenAI chat model deployment name"
          defaultValue={settings?.AzureOpenAiModelPref}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
        <p className="text-theme-text-secondary text-xs mt-2">
          {error ?? t("llm.providers.azure_openai.deployments_none_found")}
        </p>
      </div>
    );
  }

  if (loading || !endpoint) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          {label}
        </label>
        <select
          name="AzureOpenAiModelPref"
          disabled={true}
          defaultValue=""
          className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option value="" disabled={true}>
            {endpoint
              ? t("llm.providers.azure_openai.deployments_loading")
              : t("llm.providers.azure_openai.deployments_waiting")}
          </option>
        </select>
      </div>
    );
  }

  const chatDeployments = deployments.filter((d) => d.type === "chat");
  const otherDeployments = deployments.filter((d) => d.type !== "chat");

  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-3">
        {label}
      </label>
      <select
        name="AzureOpenAiModelPref"
        required={true}
        defaultValue={settings?.AzureOpenAiModelPref}
        className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg block w-full p-2.5"
      >
        {chatDeployments.length > 0 && (
          <optgroup label={t("llm.providers.azure_openai.deployments_chat")}>
            {chatDeployments.map((deployment) => (
              <option key={deployment.id} value={deployment.id}>
                {deployment.id}
              </option>
            ))}
          </optgroup>
        )}
        {otherDeployments.length > 0 && (
          <optgroup label={t("llm.providers.azure_openai.deployments_unknown")}>
            {otherDeployments.map((deployment) => (
              <option key={deployment.id} value={deployment.id}>
                {deployment.id}
              </option>
            ))}
          </optgroup>
        )}
      </select>
      <button
        type="button"
        onClick={() => setManualEntry(true)}
        className="text-theme-text-secondary hover:text-white text-xs mt-2 text-left underline w-fit"
      >
        {t("llm.providers.azure_openai.deployments_enter_manually")}
      </button>
    </div>
  );
}
