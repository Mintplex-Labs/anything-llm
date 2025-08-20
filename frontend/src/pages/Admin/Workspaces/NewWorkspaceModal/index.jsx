import React, { useState } from "react";
import { X } from "@phosphor-icons/react";
import Admin from "@/models/admin";
import { useTranslation } from "react-i18next";

export default function NewWorkspaceModal({ closeModal }) {
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const handleCreate = async (e) => {
    setError(null);
    e.preventDefault();
    const form = new FormData(e.target);
    const { workspace, error } = await Admin.newWorkspace(form.get("name"));
    if (!!workspace) window.location.reload();
    setError(error);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-foreground overflow-hidden overflow-ellipsis whitespace-nowrap">
              Create new workspace
            </h3>
          </div>
          <button
            onClick={closeModal}
            type="button"
            className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-sm text-sm p-1 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
          >
            <X size={24} weight="bold" className="text-foreground" />
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleCreate}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-foreground"
                >
                  {t("common.workspaces-name")}
                </label>
                <input
                  name="name"
                  type="text"
                  className="border-none bg-theme-settings-input-bg w-full text-foreground placeholder:text-theme-settings-input-placeholder text-sm rounded-sm focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  placeholder="My workspace"
                  minLength={4}
                  required={true}
                  autoComplete="off"
                />
              </div>
              {error && <p className="text-red-400 text-sm">Error: {error}</p>}
              <p className="text-foreground text-opacity-60 text-xs md:text-sm">
                After creating this workspace only admins will be able to see
                it. You can add users after it has been created.
              </p>
            </div>
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-theme-modal-border">
              <button
                onClick={closeModal}
                type="button"
                className="transition-all duration-300 text-foreground hover:bg-zinc-700 px-4 py-2 rounded-sm text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="transition-all duration-300 bg-card text-foreground hover:opacity-60 px-4 py-2 rounded-sm text-sm"
              >
                Create workspace
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
