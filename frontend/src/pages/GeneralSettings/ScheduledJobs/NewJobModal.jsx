import { useState, useEffect } from "react";
import { X } from "@phosphor-icons/react";
import ScheduledJobs from "@/models/scheduledJobs";
import showToast from "@/utils/toast";
import { safeJsonParse } from "@/utils/request";
import { humanizeCron } from "./utils/cron";
import CronBuilder from "./CronBuilder";
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

  useEffect(() => {
    ScheduledJobs.availableTools().then(({ tools }) => {
      setAvailableTools(tools || []);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleModeChange = (mode) => {
    setForm((prev) => ({ ...prev, scheduleMode: mode }));
  };

  const toggleTool = (toolName) => {
    setForm((prev) => ({
      ...prev,
      selectedTools: prev.selectedTools.includes(toolName)
        ? prev.selectedTools.filter((t) => t !== toolName)
        : [...prev.selectedTools, toolName],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.prompt.trim() || !form.schedule.trim()) {
      showToast(t("scheduledJobs.modal.requiredFields"), "error");
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
        <div className="flex items-start justify-between p-4 border-b rounded-t border-theme-modal-border">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-theme-text-primary">
              {t("scheduledJobs.modal.nameLabel")}{" "}
              <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder={t("scheduledJobs.modal.namePlaceholder")}
              className="border-none bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-theme-text-primary">
              {t("scheduledJobs.modal.promptLabel")}{" "}
              <span className="text-red-400">*</span>
            </label>
            <textarea
              name="prompt"
              value={form.prompt}
              onChange={handleChange}
              placeholder={t("scheduledJobs.modal.promptPlaceholder")}
              rows={4}
              className="border-none bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 resize-y"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-theme-text-primary">
              {t("scheduledJobs.modal.scheduleLabel")}{" "}
              <span className="text-red-400">*</span>
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
              <CronBuilder
                value={form.schedule}
                onChange={(cron) =>
                  setForm((prev) => ({ ...prev, schedule: cron }))
                }
              />
            )}

            {form.scheduleMode === "custom" && (
              <input
                type="text"
                name="schedule"
                value={form.schedule}
                onChange={handleChange}
                placeholder={t("scheduledJobs.modal.cronPlaceholder")}
                className="border-none bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button outline-none block w-full p-2.5"
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
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-theme-text-primary">
                  {t("scheduledJobs.modal.toolsLabel")}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const allSelected =
                      form.selectedTools.length === availableTools.length;
                    setForm((prev) => ({
                      ...prev,
                      selectedTools: allSelected
                        ? []
                        : availableTools.map((t) => t.id),
                    }));
                  }}
                  className="px-2 py-0.5 text-xs rounded-md border border-white/10 text-theme-text-secondary hover:text-theme-text-primary hover:border-white/30 transition-colors"
                >
                  {form.selectedTools.length === availableTools.length
                    ? t("scheduledJobs.modal.deselectAll")
                    : t("scheduledJobs.modal.selectAll")}
                </button>
              </div>
              <p className="text-xs text-theme-text-secondary mb-2">
                {t("scheduledJobs.modal.toolsDescription")}
              </p>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-theme-settings-input-bg rounded-lg">
                {availableTools.map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => toggleTool(tool.id)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      form.selectedTools.includes(tool.id)
                        ? "bg-primary-button text-white border-primary-button"
                        : "bg-transparent text-theme-text-secondary border-white/10 hover:border-white/30"
                    }`}
                  >
                    {tool.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-theme-text-secondary hover:text-theme-text-primary transition-colors"
            >
              {t("scheduledJobs.modal.cancel")}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-button hover:bg-secondary-btn rounded-lg transition-colors disabled:opacity-50"
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
