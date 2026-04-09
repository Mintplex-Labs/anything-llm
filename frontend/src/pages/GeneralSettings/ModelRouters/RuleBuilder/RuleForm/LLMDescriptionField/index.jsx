import { useTranslation } from "react-i18next";

export default function LLMDescriptionField({ existingRule }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-y-1.5">
      <label className="text-sm font-medium text-zinc-200 light:text-slate-900">
        {t("model-router.rule-form.match-description-label")}
      </label>
      <textarea
        name="description"
        defaultValue={existingRule?.description || ""}
        placeholder={t("model-router.rule-form.match-description-placeholder")}
        rows={2}
        className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-900 placeholder:text-zinc-400 light:placeholder:text-slate-500 text-sm rounded-lg outline-none block w-full p-2.5 resize-none"
        required
      />
      <p className="text-[10px] text-zinc-400 light:text-slate-500">
        {t("model-router.rule-form.match-description-help")}
      </p>
    </div>
  );
}
