import { useState, useEffect } from "react";
import { X, WarningCircle } from "@phosphor-icons/react";
import ScheduledJobs from "@/models/scheduledJobs";
import showToast from "@/utils/toast";
import { safeJsonParse } from "@/utils/request";
import { useTranslation } from "react-i18next";
import JobDescription from "./JobDescription";
import JobSchedule from "./JobSchedule";
import ToolsSelector from "./ToolsSelector";
import FormActions from "./FormActions";

function setDefaultFormState(job) {
  return {
    name: job?.name || "",
    prompt: job?.prompt || "",
    schedule: job?.schedule || "0 9 * * *",
    scheduleMode: "builder",
    selectedTools: job?.tools ? safeJsonParse(job.tools, []) : [],
  };
}

export default function JobFormModal({ job = null, onClose, onSaved }) {
  const { t } = useTranslation();
  const isEditing = !!job;
  const [form, setForm] = useState(setDefaultFormState(job));
  const [availableTools, setAvailableTools] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    prompt: false,
    schedule: false,
  });
  const hasErrors = () => Object.values(errors).some(Boolean);

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
              className="border-none transition-all duration-300 text-gray-400 bg-transparent hover:border-white/60 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            >
              <X className="text-gray-300 text-lg" />
            </button>
          </div>
          {hasErrors() && (
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
          <JobDescription form={form} errors={errors} onChange={handleChange} />

          <JobSchedule
            schedule={form.schedule}
            scheduleMode={form.scheduleMode}
            error={errors.schedule}
            onScheduleChange={handleScheduleChange}
            onModeChange={handleModeChange}
          />

          {availableTools.length > 0 && (
            <ToolsSelector
              availableTools={availableTools}
              selectedTools={form.selectedTools}
              onChange={setSelectedTools}
            />
          )}

          <FormActions
            isEditing={isEditing}
            saving={saving}
            onClose={onClose}
          />
        </form>
      </div>
    </div>
  );
}
