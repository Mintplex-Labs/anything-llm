import { useTranslation } from "react-i18next"; // Import i18n hook

export default function GenericOpenAiOptions({ settings }) {
  const { t } = useTranslation(); // Initialize translation hook

  return (
    <div className="flex flex-col gap-y-7">
      <div className="flex gap-[36px] mt-1.5 flex-wrap">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("genericOpenAiOptions.baseUrlLabel")}
          </label>
          <input
            type="url"
            name="GenericOpenAiBasePath"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t("genericOpenAiOptions.baseUrlPlaceholder")}
            defaultValue={settings?.GenericOpenAiBasePath}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("genericOpenAiOptions.apiKeyLabel")}
          </label>
          <input
            type="password"
            name="GenericOpenAiKey"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t("genericOpenAiOptions.apiKeyPlaceholder")}
            defaultValue={settings?.GenericOpenAiKey ? "*".repeat(20) : ""}
            required={false}
            autoComplete="new-password"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("genericOpenAiOptions.modelNameLabel")}
          </label>
          <input
            type="text"
            name="GenericOpenAiModelPref"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t("genericOpenAiOptions.modelNamePlaceholder")}
            defaultValue={settings?.GenericOpenAiModelPref}
            required={true}
            autoComplete="off"
          />
        </div>
      </div>
      <div className="flex gap-[36px] flex-wrap">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("genericOpenAiOptions.tokenContextWindowLabel")}
          </label>
          <input
            type="number"
            name="GenericOpenAiTokenLimit"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t(
              "genericOpenAiOptions.tokenContextWindowPlaceholder"
            )}
            min={1}
            onScroll={(e) => e.target.blur()}
            defaultValue={settings?.GenericOpenAiTokenLimit}
            required={true}
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("genericOpenAiOptions.maxTokensLabel")}
          </label>
          <input
            type="number"
            name="GenericOpenAiMaxTokens"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t("genericOpenAiOptions.maxTokensPlaceholder")}
            min={1}
            defaultValue={settings?.GenericOpenAiMaxTokens || 1024}
            required={true}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}
