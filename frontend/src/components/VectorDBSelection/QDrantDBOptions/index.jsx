import { useTranslation } from "react-i18next";

export default function QDrantDBOptions({ settings }) {
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("vector.qdrantDBOptions.endpointLabel")}
          </label>
          <input
            type="url"
            name="QdrantEndpoint"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t("vector.qdrantDBOptions.endpointPlaceholder")}
            defaultValue={settings?.QdrantEndpoint}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("vector.qdrantDBOptions.apiKeyLabel")}
          </label>
          <input
            type="password"
            name="QdrantApiKey"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t("vector.qdrantDBOptions.apiKeyPlaceholder")}
            defaultValue={settings?.QdrantApiKey}
            autoComplete="new-password"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
