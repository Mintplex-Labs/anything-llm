import { useTranslation } from "react-i18next"; // i18n 추가

export default function ChromaDBOptions({ settings }) {
  const { t } = useTranslation(); // i18n hook 추가

  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("vector.chromaDBOptions.endpointLabel")}
          </label>
          <input
            type="url"
            name="ChromaEndpoint"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t("vector.chromaDBOptions.endpointPlaceholder")}
            defaultValue={settings?.ChromaEndpoint}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("vector.chromaDBOptions.apiHeaderLabel")}
          </label>
          <input
            name="ChromaApiHeader"
            autoComplete="off"
            type="text"
            defaultValue={settings?.ChromaApiHeader}
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t("vector.chromaDBOptions.apiHeaderPlaceholder")}
          />
        </div>

        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("vector.chromaDBOptions.apiKeyLabel")}
          </label>
          <input
            name="ChromaApiKey"
            autoComplete="new-password"
            type="password"
            defaultValue={settings?.ChromaApiKey ? "*".repeat(20) : ""}
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t("vector.chromaDBOptions.apiKeyPlaceholder")}
          />
        </div>
      </div>
    </div>
  );
}
