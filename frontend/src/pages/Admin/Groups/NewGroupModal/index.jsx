import React, { useState } from "react";
import { X } from "@phosphor-icons/react";
import Admin from "@/models/admin";
import showToast from "@/utils/toast";

export default function NewGroupModal({ closeModal, fetchData = () => {} }) {
  const [error, setError] = useState(null);
  const handleCreate = async (e) => {
    setError(null);
    e.preventDefault();
    const form = new FormData(e.target);
    const { error, group } = await Admin.addGroup({
      groupname: form.get("name"),
    });
    if (group?.id) {
      fetchData();
      closeModal();
      showToast("Group created successfully", "success", { clear: true });
    }
    setError(error);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border custom-theme-bg-tertiary">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap custom-text-secondary">
              Create new group
            </h3>
          </div>
          <button
            onClick={closeModal}
            type="button"
            className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:border-opacity-50 border-transparent border"
          >
            <X
              size={24}
              weight="bold"
              className="text-white custom-text-secondary"
            />
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleCreate}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-white custom-text-secondary"
                >
                  Group Name
                </label>
                <input
                  name="name"
                  type="text"
                  className="border-none bg-theme-settings-input-bg w-full text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 custom-theme-bg-tertiary custom-text-secondary custom-border-secondary"
                  placeholder="Group name"
                  minLength={4}
                  required={true}
                  autoComplete="off"
                />
              </div>
              {error && <p className="text-red-400 text-sm">Error: {error}</p>}
              <p className="text-white text-opacity-60 text-xs md:text-sm custom-text-secondary"></p>
            </div>
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-theme-modal-border">
              <button
                onClick={closeModal}
                type="button"
                className="transition-all duration-300 text-white px-4 py-2 rounded-lg text-sm custom-text-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm border custom-button-secondary"
              >
                Create group
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
