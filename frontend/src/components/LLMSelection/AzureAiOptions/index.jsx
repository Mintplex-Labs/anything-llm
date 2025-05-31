import { useTranslation } from "react-i18next";

export default function AzureAiOptions({ settings }) {
  const { t } = useTranslation();
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
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

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
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("llm.providers.azure_openai.chat_deployment_name")}
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
        </div>
      </div>

      <div className="w-full flex items-center gap-[36px]">
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
            <option value={4096}>{t("llm.providers.azure_openai.gpt_3_5_turbo")}</option>
            <option value={16384}>{t("llm.providers.azure_openai.gpt_3_5_16k")}</option>
            <option value={8192}>{t("llm.providers.azure_openai.gpt_4")}</option>
            <option value={32768}>{t("llm.providers.azure_openai.gpt_4_32k")}</option>
            <option value={128000}>{t("llm.providers.azure_openai.gpt_4_turbo_and_more")}</option>
            <option value={200000}>{t("llm.providers.azure_openai.o1_o1_pro_o3_mini")}</option>
            <option value={1047576}>{t("llm.providers.azure_openai.gpt_4_1")}</option>
          </select>
        </div>

        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("llm.providers.azure_openai.model_type")}
          </label>
          <select
            name="AzureOpenAiModelType"
            defaultValue={settings?.AzureOpenAiModelType || "default"}
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            required={true}
          >
            <option value="default">{t("llm.providers.azure_openai.default")}</option>
            <option value="reasoning">{t("llm.providers.azure_openai.reasoning")}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
