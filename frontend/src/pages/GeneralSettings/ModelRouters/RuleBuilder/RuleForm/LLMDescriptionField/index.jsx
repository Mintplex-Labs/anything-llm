import { useTranslation } from "react-i18next";

export default function LLMDescriptionField({ existingRule }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-y-1.5">
      <label className="text-sm font-medium leading-5 text-white light:text-slate-950">
        {t("model-router.rule-form.match-description-label")}
      </label>
      <textarea
        name="description"
        defaultValue={existingRule?.description || ""}
        placeholder={t("model-router.rule-form.match-description-placeholder")}
        rows={2}
        className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-700 placeholder:text-zinc-400 light:placeholder:text-slate-400 text-sm rounded-[8px] outline-none block w-full px-3.5 py-2.5 resize-none"
        required
      />
      <p className="text-xs leading-4 text-zinc-400 light:text-slate-600">
        {t("model-router.rule-form.match-description-help")}
      </p>
    </div>
  );
}
