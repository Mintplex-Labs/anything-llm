import { useTranslation } from "react-i18next";

export default function MaxContextSnippets({ workspace, setHasChanges }) {
  const { t } = useTranslation();
  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="name" className="block input-label custom-text-secondary">
          {t("vector-workspace.snippets.title")}
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5 custom-text-secondary">
          {t("vector-workspace.snippets.description")}
          <br />
          <i>{t("vector-workspace.snippets.recommend")}</i>
        </p>
      </div>
      <input
        name="topN"
        type="number"
        min={1}
        max={200}
        step={1}
        onWheel={(e) => e.target.blur()}
        defaultValue={workspace?.topN ?? 4}
        className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 mt-2 custom-theme-bg-tertiary custom-text-secondary custom-border-secondary"
        placeholder="4"
        required={true}
        autoComplete="off"
        onChange={() => setHasChanges(true)}
      />
    </div>
  );
}
