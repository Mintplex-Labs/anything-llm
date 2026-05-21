import { useTranslation } from "react-i18next";

export default function JobDescription({ form, errors, onChange }) {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <label className="flex items-baseline gap-1.5 mb-2 text-sm font-medium text-theme-text-primary">
          <span>
            {t("scheduledJobs.modal.nameLabel")}{" "}
            <span className="text-red-400">*</span>
          </span>
          {errors.name && (
            <span className="text-red-400 italic font-normal">
              {t("scheduledJobs.modal.required", "Required")}
            </span>
          )}
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder={t("scheduledJobs.modal.namePlaceholder")}
          className={`bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 border ${
            errors.name ? "border-red-300" : "border-transparent"
          }`}
        />
      </div>

      <div>
        <label className="flex items-baseline gap-1.5 mb-2 text-sm font-medium text-theme-text-primary">
          <span>
            {t("scheduledJobs.modal.promptLabel")}{" "}
            <span className="text-red-400">*</span>
          </span>
          {errors.prompt && (
            <span className="text-red-400 italic font-normal">
              {t("scheduledJobs.modal.required", "Required")}
            </span>
          )}
        </label>
        <textarea
          name="prompt"
          value={form.prompt}
          onChange={onChange}
          placeholder={t("scheduledJobs.modal.promptPlaceholder")}
          rows={4}
          className={`bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 resize-y border ${
            errors.prompt ? "border-red-300" : "border-transparent"
          }`}
        />
      </div>
    </>
  );
}
