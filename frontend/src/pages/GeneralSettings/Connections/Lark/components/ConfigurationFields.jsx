import { useTranslation } from "react-i18next";

export default function ConfigurationFields({
  workspaces,
  workspace,
  setWorkspace,
  limit,
  setLimit,
  disabled,
}) {
  const { t } = useTranslation();
  const inputClass =
    "bg-zinc-800 light:bg-white light:border light:border-slate-300 rounded-lg h-9 px-3 text-white light:text-slate-900";
  return (
    <>
      <label className="flex flex-col gap-y-1.5 text-sm font-medium w-full max-w-[400px]">
        {t("lark.setup.workspace")}
        <select
          value={workspace}
          onChange={(event) => setWorkspace(event.target.value)}
          disabled={disabled}
          className={inputClass}
          required
        >
          <option value="">{t("lark.setup.select-workspace")}</option>
          {workspaces.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      {!workspaces.length && (
        <p className="text-xs text-zinc-400 light:text-slate-600">
          {t("lark.setup.no-workspaces")}
        </p>
      )}
      <label className="flex flex-col gap-y-1.5 text-sm font-medium w-full max-w-[400px]">
        {t("lark.setup.attachment-limit")}
        <input
          type="number"
          min="1"
          step="1"
          value={limit}
          onChange={(event) => setLimit(event.target.value)}
          disabled={disabled}
          className={inputClass}
          aria-describedby="lark-attachment-help"
        />
      </label>
      <p
        id="lark-attachment-help"
        className="text-xs text-zinc-400 light:text-slate-600"
      >
        {t("lark.setup.attachment-limit-help")}
      </p>
    </>
  );
}
