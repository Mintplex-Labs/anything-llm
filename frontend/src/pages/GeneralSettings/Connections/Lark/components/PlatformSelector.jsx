import { useTranslation } from "react-i18next";

export default function PlatformSelector({ value, onChange, disabled }) {
  const { t } = useTranslation();
  return (
    <label className="flex flex-col gap-y-1.5 text-sm font-medium w-full max-w-[400px]">
      {t("lark.setup.platform")}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="bg-zinc-800 light:bg-white light:border light:border-slate-300 rounded-lg h-9 px-3 text-white light:text-slate-900"
      >
        <option value="lark">Lark</option>
        <option value="feishu">Feishu</option>
      </select>
    </label>
  );
}
