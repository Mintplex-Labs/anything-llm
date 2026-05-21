import { useTranslation } from "react-i18next";

export default function FormActions({ isEditing, saving, onClose }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between pt-4">
      <button
        type="button"
        onClick={onClose}
        className="border-none h-[34px] px-3.5 text-sm font-medium text-zinc-50 light:text-slate-900 border border-zinc-700 light:border-slate-600 rounded-lg hover:bg-zinc-800 light:hover:bg-slate-100 transition-colors"
      >
        {t("scheduledJobs.modal.cancel")}
      </button>
      <button
        type="submit"
        disabled={saving}
        className="border-none h-[34px] px-3.5 text-sm font-medium text-zinc-950 light:text-white bg-zinc-50 light:bg-slate-900 hover:bg-zinc-200 light:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
      >
        {saving
          ? t("scheduledJobs.modal.saving")
          : isEditing
            ? t("scheduledJobs.modal.updateJob")
            : t("scheduledJobs.modal.createJob")}
      </button>
    </div>
  );
}
