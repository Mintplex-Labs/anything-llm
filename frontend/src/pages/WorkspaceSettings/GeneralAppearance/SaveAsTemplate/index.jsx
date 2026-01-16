import WorkspaceTemplate from "@/models/workspaceTemplate";
import showToast from "@/utils/toast";
import { useState } from "react";

export default function SaveAsTemplate({ workspace }) {
  const [showModal, setShowModal] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!templateName.trim()) {
      showToast("Template name is required", "error");
      return;
    }

    setSaving(true);
    const { template, message } = await WorkspaceTemplate.create({
      name: templateName,
      description: templateDescription,
      workspaceSlug: workspace.slug,
    });

    if (template) {
      showToast("Template saved successfully!", "success", { clear: true });
      setShowModal(false);
      setTemplateName("");
      setTemplateDescription("");
    } else {
      showToast(`Error: ${message}`, "error", { clear: true });
    }
    setSaving(false);
  };

  return (
    <>
      <div className="mt-6 mb-6">
        <div className="flex flex-col gap-y-1">
          <h2 className="text-base leading-6 font-bold text-white">
            Save as Template
          </h2>
          <p className="text-xs leading-[18px] font-base text-white/60">
            Save this workspace&apos;s settings as a reusable template for
            creating new workspaces.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="mt-4 transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
        >
          Save as Template
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border w-full max-w-md">
            <div className="p-6 border-b border-theme-modal-border">
              <h3 className="text-xl font-semibold text-white">
                Save as Template
              </h3>
            </div>
            <form onSubmit={handleSave} className="p-6">
              <div className="flex flex-col gap-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-white">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button outline-none block p-2.5"
                    placeholder="My Template"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-white">
                    Description (optional)
                  </label>
                  <textarea
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button outline-none block p-2.5"
                    placeholder="Describe what this template is for..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-white text-sm hover:bg-theme-modal-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
