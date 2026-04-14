import { useState, useEffect } from "react";
import { X, WarningCircle } from "@phosphor-icons/react";
import ScheduledJobs from "@/models/scheduledJobs";
import showToast from "@/utils/toast";
import { safeJsonParse } from "@/utils/request";
import { humanizeCron } from "./utils/cron";
import CronBuilder from "./CronBuilder";
import ToolsSelector from "./ToolsSelector";
import { useTranslation } from "react-i18next";

export default function NewJobModal({ job = null, onClose, onSaved }) {
  const { t, i18n } = useTranslation();
  const isEditing = !!job;
  const [form, setForm] = useState({
    name: job?.name || "",
    prompt: job?.prompt || "",
    schedule: job?.schedule || "0 9 * * *",
    scheduleMode: "builder",
    selectedTools: job?.tools ? safeJsonParse(job.tools, []) : [],
  });
  const [availableTools, setAvailableTools] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    prompt: false,
    schedule: false,
  });
  const hasErrors = errors.name || errors.prompt || errors.schedule;

  const clearError = (field) => {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: false } : prev));
  };

  useEffect(() => {
    ScheduledJobs.availableTools().then(({ tools }) => {
      setAvailableTools(tools || []);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  };

  const handleScheduleChange = (cron) => {
    setForm((prev) => ({ ...prev, schedule: cron }));
    clearError("schedule");
  };

  const handleModeChange = (mode) => {
    setForm((prev) => ({ ...prev, scheduleMode: mode }));
  };

  const setSelectedTools = (selectedTools) => {
    setForm((prev) => ({ ...prev, selectedTools }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {
      name: !form.name.trim(),
      prompt: !form.prompt.trim(),
      schedule: !form.schedule.trim(),
    };
    if (nextErrors.name || nextErrors.prompt || nextErrors.schedule) {
      setErrors(nextErrors);
      return;
    }

    setSaving(true);
    const data = {
      name: form.name.trim(),
      prompt: form.prompt.trim(),
      schedule: form.schedule.trim(),
      tools: form.selectedTools,
    };

    const result = isEditing
      ? await ScheduledJobs.update(job.id, data)
      : await ScheduledJobs.create(data);

    setSaving(false);

    if (result.error) {
      showToast(result.error, "error");
      return;
    }

    showToast(
      isEditing
        ? t("scheduledJobs.modal.jobUpdated")
        : t("scheduledJobs.modal.jobCreated"),
      "success"
    );
    onSaved();
  };

  return (
    <div className="relative w-full max-w-2xl max-h-full">
      <div className="relative bg-theme-bg-secondary rounded-lg shadow border border-theme-modal-border">
        <div className="flex flex-col gap-1 p-4 border-b rounded-t border-theme-modal-border">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-semibold text-theme-text-primary">
              {isEditing
                ? t("scheduledJobs.modal.titleEdit")
                : t("scheduledJobs.modal.titleNew")}
            </h3>
            <button
              onClick={onClose}
              type="button"
              className="transition-all duration-300 text-gray-400 bg-transparent hover:border-white/60 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            >
              <X className="text-gray-300 text-lg" />
            </button>
          </div>
          {hasErrors && (
            <div className="flex gap-1 items-center">
              <WarningCircle size={16} className="text-red-400 shrink-0" />
              <p className="text-sm text-red-400">
                {t(
                  "scheduledJobs.modal.requiredFieldsBanner",
                  "Please fill out all required fields in order to create job."
                )}
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
              onChange={handleChange}
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
              onChange={handleChange}
              placeholder={t("scheduledJobs.modal.promptPlaceholder")}
              rows={4}
              className={`bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 resize-y border ${
                errors.prompt ? "border-red-300" : "border-transparent"
              }`}
            />
          </div>

          <div>
            <label className="flex items-baseline gap-1.5 mb-2 text-sm font-medium text-theme-text-primary">
              <span>
                {t("scheduledJobs.modal.scheduleLabel")}{" "}
                <span className="text-red-400">*</span>
              </span>
              {errors.schedule && (
                <span className="text-red-400 italic font-normal">
                  {t("scheduledJobs.modal.required", "Required")}
                </span>
              )}
            </label>
            <div className="flex gap-1 mb-2 p-1 bg-theme-settings-input-bg rounded-lg w-fit">
              {[
                {
                  value: "builder",
                  label: t("scheduledJobs.modal.modeBuilder"),
                },
                { value: "custom", label: t("scheduledJobs.modal.modeCustom") },
              ].map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => handleModeChange(tab.value)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    form.scheduleMode === tab.value
                      ? "bg-primary-button text-white"
                      : "text-theme-text-secondary hover:text-theme-text-primary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {form.scheduleMode === "builder" && (
              <div
                className={`rounded-lg border ${
                  errors.schedule ? "border-red-300" : "border-transparent"
                }`}
              >
                <CronBuilder
                  value={form.schedule}
                  onChange={handleScheduleChange}
                />
              </div>
            )}

            {form.scheduleMode === "custom" && (
              <input
                type="text"
                name="schedule"
                value={form.schedule}
                onChange={handleChange}
                placeholder={t("scheduledJobs.modal.cronPlaceholder")}
                className={`bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button outline-none block w-full p-2.5 border ${
                  errors.schedule ? "border-red-300" : "border-transparent"
                }`}
              />
            )}

            <p className="text-xs text-theme-text-secondary mt-2">
              {t("scheduledJobs.modal.currentSchedule")}{" "}
              <code className="text-theme-text-primary">{form.schedule}</code>
              {form.schedule && (
                <span className="ml-2">
                  — {humanizeCron(form.schedule, i18n.language)}
                </span>
              )}
            </p>
          </div>

          {availableTools.length > 0 && (
            <ToolsSelector
              availableTools={availableTools}
              selectedTools={form.selectedTools}
              onChange={setSelectedTools}
            />
          )}

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="h-[34px] px-3.5 text-sm font-medium text-zinc-50 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              {t("scheduledJobs.modal.cancel")}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-[34px] px-3.5 text-sm font-medium text-zinc-950 bg-zinc-50 hover:bg-zinc-200 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving
                ? t("scheduledJobs.modal.saving")
                : isEditing
                  ? t("scheduledJobs.modal.updateJob")
                  : t("scheduledJobs.modal.createJob")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
