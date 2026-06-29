import { useState, useEffect } from "react";
import { WarningCircle } from "@phosphor-icons/react";
import ScheduledJobs from "@/models/scheduledJobs";
import showToast from "@/utils/toast";
import { safeJsonParse } from "@/utils/request";
import { useTranslation } from "react-i18next";
import { ModalHeader, ModalBody } from "@/components/lib/Modal";
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">
      <ModalHeader
        title={
          isEditing
            ? t("scheduledJobs.modal.titleEdit")
            : t("scheduledJobs.modal.titleNew")
        }
        onClose={onClose}
      >
        {hasErrors() && (
          <div className="flex gap-1 items-center mt-1">
            <WarningCircle size={16} className="text-red-400 shrink-0" />
            <p className="text-sm text-red-400">
              {t(
                "scheduledJobs.modal.requiredFieldsBanner",
                "Please fill out all required fields in order to create job."
              )}
            </p>
          </div>
        )}
      </ModalHeader>
      <ModalBody>
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

        <FormActions isEditing={isEditing} saving={saving} onClose={onClose} />
      </ModalBody>
    </form>
  );
}
