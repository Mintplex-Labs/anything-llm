import { useTranslation } from "react-i18next";
export default function LanceDBOptions({ settings }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-y-4">
      <div className="w-full h-10 items-center flex">
        <p className="text-sm font-base text-white text-opacity-60">
          {t("vector.provider.description")}
        </p>
      </div>
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-1">
          Reranking Worker Idle Timeout
        </label>
        <p className="text-theme-text-secondary text-xs font-normal block mb-3">
          How long the reranking worker process stays alive after finishing
          work. Set to 0 to shut down immediately.
        </p>
        <input
          type="number"
          name="NativeRerankingWorkerTimeout"
          min={0}
          max={3600}
          step={1}
          defaultValue={settings?.NativeRerankingWorkerTimeout ?? ""}
          className="border-none bg-theme-settings-input-bg border-gray-500 text-theme-text-primary text-sm rounded-lg block w-full p-2.5"
          placeholder="900"
        />
        <p className="text-theme-text-secondary text-xs font-normal mt-1">
          Value in seconds. Leave empty to use the default (900s).
        </p>
      </div>
    </div>
  );
}
