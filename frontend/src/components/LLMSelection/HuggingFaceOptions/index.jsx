import { useTranslation } from "react-i18next";

export default function HuggingFaceOptions({ settings }) {
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("llmPreference.huggingface.endpointLabel")}
          </label>
          <input
            type="url"
            name="HuggingFaceLLMEndpoint"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="https://example.endpoints.huggingface.cloud"
            defaultValue={settings?.HuggingFaceLLMEndpoint}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("llmPreference.huggingface.accessTokenLabel")}
          </label>
          <input
            type="password"
            name="HuggingFaceLLMAccessToken"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t("llmPreference.huggingface.accessTokenPlaceholder")}
            defaultValue={
              settings?.HuggingFaceLLMAccessToken ? "*".repeat(20) : ""
            }
            required={true}
            autoComplete="new-password"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("llmPreference.huggingface.tokenLimitLabel")}
          </label>
          <input
            type="number"
            name="HuggingFaceLLMTokenLimit"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
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
