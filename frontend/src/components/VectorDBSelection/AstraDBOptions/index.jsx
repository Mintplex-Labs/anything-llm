import { useTranslation } from "react-i18next";

export default function AstraDBOptions({ settings }) {
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("vector.astraDBOptions.endpointLabel")}
          </label>
          <input
            type="url"
            name="AstraDBEndpoint"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t("vector.astraDBOptions.endpointPlaceholder")}
            defaultValue={settings?.AstraDBEndpoint}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("vector.astraDBOptions.applicationTokenLabel")}
          </label>
          <input
            type="password"
            name="AstraDBApplicationToken"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t("vector.astraDBOptions.applicationTokenPlaceholder")}
            defaultValue={
              settings?.AstraDBApplicationToken ? "*".repeat(20) : ""
            }
            required={true}
            autoComplete="new-password"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
