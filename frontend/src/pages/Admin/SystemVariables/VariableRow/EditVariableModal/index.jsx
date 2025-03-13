import React, { useState } from "react";
import { X } from "@phosphor-icons/react";
import System from "@/models/system";
import showToast from "@/utils/toast";

export default function EditVariableModal({ variable, closeModal, onRefresh }) {
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    key: variable.key,
    value: variable.value,
    description: variable.description || "",
    type: variable.type || "user",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.key || !formData.value) {
      setError("Key and value are required");
      return;
    }

    try {
      await System.updateSystemVariable(variable.id, formData);
      showToast("Variable updated successfully", "success", { clear: true });
      if (onRefresh) onRefresh();
      closeModal();
    } catch (error) {
      console.error("Error updating variable:", error);
      setError("Failed to update variable");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
              Edit {variable.key}
            </h3>
          </div>
          <button
            onClick={closeModal}
            type="button"
            className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
          >
            <X size={24} weight="bold" className="text-white" />
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleUpdate}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="key"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Key
                </label>
                <input
                  name="key"
                  type="text"
                  className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  placeholder="e.g., company_name"
                  value={formData.key}
                  onChange={handleInputChange}
                  required={true}
                  autoComplete="off"
                />
                <p className="mt-2 text-xs text-white/60">
                  Key must be unique and will be used in prompts as {"{key}"}
                </p>
              </div>
              <div>
                <label
                  htmlFor="value"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Value
                </label>
                <input
                  name="value"
                  type="text"
                  className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  placeholder="e.g., Acme Corp"
                  value={formData.value}
                  onChange={handleInputChange}
                  required={true}
                  autoComplete="off"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Description
                </label>
                <input
                  name="description"
                  type="text"
                  className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  placeholder="Optional description"
                  value={formData.description}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
              </div>
              {error && <p className="text-red-400 text-sm">Error: {error}</p>}
            </div>
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-theme-modal-border">
              <button
                onClick={closeModal}
                type="button"
                className="transition-all duration-300 text-white hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm"
              >
                Update variable
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
