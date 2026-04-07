import { useState, useEffect } from "react";
import { X } from "@phosphor-icons/react";
import ScheduledJobs from "@/models/scheduledJobs";
import showToast from "@/utils/toast";
import { safeJsonParse } from "@/utils/request";
import { CRON_PRESETS } from "./utils/cron";

export default function NewJobModal({ job = null, onClose, onSaved }) {
  const isEditing = !!job;
  const [form, setForm] = useState({
    name: job?.name || "",
    prompt: job?.prompt || "",
    schedule: job?.schedule || "0 9 * * *",
    cronPreset: "custom",
    selectedTools: job?.tools ? safeJsonParse(job.tools, []) : [],
  });
  const [availableTools, setAvailableTools] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    ScheduledJobs.availableTools().then(({ tools }) => {
      setAvailableTools(tools || []);
    });

    // Set preset if schedule matches
    if (job?.schedule) {
      const match = CRON_PRESETS.find((p) => p.value === job.schedule);
      setForm((prev) => ({
        ...prev,
        cronPreset: match ? match.value : "custom",
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePresetChange = (value) => {
    setForm((prev) => ({
      ...prev,
      cronPreset: value,
      ...(value !== "custom" ? { schedule: value } : {}),
    }));
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
      showToast("Please fill in all required fields", "error");
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

    showToast(isEditing ? "Job updated" : "Job created", "success");
    onSaved();
  };

  return (
    <div className="relative w-full max-w-2xl max-h-full">
      <div className="relative bg-theme-bg-secondary rounded-lg shadow border border-theme-modal-border">
        <div className="flex items-start justify-between p-4 border-b rounded-t border-theme-modal-border">
          <h3 className="text-xl font-semibold text-theme-text-primary">
            {isEditing ? "Edit Scheduled Job" : "New Scheduled Job"}
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
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Daily News Digest"
              className="border-none bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-theme-text-primary">
              Prompt <span className="text-red-400">*</span>
            </label>
            <textarea
              name="prompt"
              value={form.prompt}
              onChange={handleChange}
              placeholder="The instruction to run on each execution..."
              rows={4}
              className="border-none bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 resize-y"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-theme-text-primary">
              Schedule <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              <select
                value={form.cronPreset}
                onChange={(e) => handlePresetChange(e.target.value)}
                className="border-none bg-theme-settings-input-bg text-theme-text-primary text-sm rounded-lg focus:outline-primary-button outline-none p-2.5"
              >
                {CRON_PRESETS.map((preset) => (
                  <option key={preset.value} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
              </select>
              {form.cronPreset === "custom" && (
                <input
                  type="text"
                  name="schedule"
                  value={form.schedule}
                  onChange={handleChange}
                  placeholder="Cron expression (e.g. 0 9 * * *)"
                  className="border-none bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button outline-none block flex-1 p-2.5"
                />
              )}
            </div>
            <p className="text-xs text-theme-text-secondary mt-1">
              Current schedule:{" "}
              <code className="text-theme-text-primary">{form.schedule}</code>
            </p>
          </div>

          {availableTools.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-theme-text-primary">
                  Tools (optional)
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
                    ? "Deselect all"
                    : "Select all"}
                </button>
              </div>
              <p className="text-xs text-theme-text-secondary mb-2">
                Select which agent tools this job can use.
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
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-button hover:bg-secondary-btn rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : isEditing ? "Update Job" : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
