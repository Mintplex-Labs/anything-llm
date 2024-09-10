import { useTranslation } from "react-i18next";

export default function MilvusDBOptions({ settings }) {
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("vector.milvusDBOptions.addressLabel")}
          </label>
          <input
            type="text"
            name="MilvusAddress"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t("vector.milvusDBOptions.addressPlaceholder")}
            defaultValue={settings?.MilvusAddress}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("vector.milvusDBOptions.usernameLabel")}
          </label>
          <input
            type="text"
            name="MilvusUsername"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t("vector.milvusDBOptions.usernamePlaceholder")}
            defaultValue={settings?.MilvusUsername}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            {t("vector.milvusDBOptions.passwordLabel")}
          </label>
          <input
            type="password"
            name="MilvusPassword"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder={t("vector.milvusDBOptions.passwordPlaceholder")}
            defaultValue={settings?.MilvusPassword ? "*".repeat(20) : ""}
            autoComplete="new-password"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
