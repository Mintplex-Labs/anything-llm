import { useTranslation } from "react-i18next";

export const BYTES_PER_MEGABYTE = 1024 * 1024;

export function bytesToMegabytes(value) {
  if (value == null) return "";
  if (!Number.isSafeInteger(value) || value <= 0) return "";
  return String(value / BYTES_PER_MEGABYTE);
}

export function megabytesToBytes(value) {
  if (value === "") return null;
  const megabytes = Number(value);
  if (!Number.isFinite(megabytes) || megabytes <= 0) return undefined;
  const bytes = Math.round(megabytes * BYTES_PER_MEGABYTE);
  if (!Number.isSafeInteger(bytes) || bytes <= 0) return undefined;
  return bytes;
}

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
          min={0.5 / BYTES_PER_MEGABYTE}
          step="any"
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
