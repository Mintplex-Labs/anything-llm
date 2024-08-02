import { useTranslation } from "react-i18next";

export default function DocumentSimilarityThreshold({
  workspace,
  setHasChanges,
}) {
  const { t } = useTranslation();
  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="name" className="block input-label">
          {t("vector-workspace.doc.title")}
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          {t("vector-workspace.doc.description")}
        </p>
      </div>
      <select
        name="similarityThreshold"
        defaultValue={workspace?.similarityThreshold ?? 0.25}
        className="bg-zinc-900 text-white text-sm mt-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        onChange={() => setHasChanges(true)}
        required={true}
      >
        <option value={0.0}>{t("vector-workspace.doc.zero")}</option>
        <option value={0.25}>{t("vector-workspace.doc.low")}</option>
        <option value={0.5}>{t("vector-workspace.doc.medium")}</option>
        <option value={0.75}>{t("vector-workspace.doc.high")}</option>
      </select>
    </div>
  );
}
