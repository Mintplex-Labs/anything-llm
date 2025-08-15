import React, { useState, useEffect } from "react";
import { X, Users } from "@phosphor-icons/react";
import Admin from "@/models/admin";
import { useTranslation } from "react-i18next";

export default function NewWorkspaceModal({ closeModal }) {
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchUsers() {
      const allUsers = await Admin.users();
      setUsers(allUsers || []);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  const handleCreate = async (e) => {
    setError(null);
    e.preventDefault();
    const form = new FormData(e.target);
    const { workspace, error } = await Admin.newWorkspace(form.get("name"));
    
    if (!!workspace && selectedUsers.length > 0) {
      // Add selected users to the newly created workspace
      const { success, error: updateError } = await Admin.updateUsersInWorkspace(
        workspace.id,
        selectedUsers
      );
      if (!success) {
        setError(updateError || "Failed to add users to workspace");
        return;
      }
    }
    
    if (!!workspace) window.location.reload();
    setError(error);
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
              Create new workspace
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
          <form onSubmit={handleCreate}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  {t("common.workspaces-name")}
                </label>
                <input
                  name="name"
                  type="text"
                  className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  placeholder="My workspace"
                  minLength={4}
                  required={true}
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-white">
                  <Users className="inline mr-2 w-4 h-4" />
                  Add Existing Users (Optional)
                </label>
                <div className="max-h-40 overflow-y-auto bg-theme-settings-input-bg rounded-lg border border-theme-modal-border">
                  {loading ? (
                    <div className="p-4 text-white text-opacity-60 text-sm">
                      Loading users...
                    </div>
                  ) : users.length === 0 ? (
                    <div className="p-4 text-white text-opacity-60 text-sm">
                      No users available
                    </div>
                  ) : (
                    <div className="p-2">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center p-2 hover:bg-theme-bg-primary rounded cursor-pointer"
                          onClick={() => toggleUserSelection(user.id)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUserSelection(user.id)}
                            className="mr-3 w-4 h-4 text-primary-button bg-theme-bg-secondary border-gray-300 rounded focus:ring-primary-button focus:ring-2"
                          />
                          <div className="flex flex-col">
                            <span className="text-white text-sm font-medium">
                              {user.username}
                            </span>
                            <span className="text-white text-opacity-60 text-xs">
                              {user.role}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {selectedUsers.length > 0 && (
                  <p className="mt-2 text-white text-opacity-60 text-xs">
                    {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>

              {error && <p className="text-red-400 text-sm">Error: {error}</p>}
              <p className="text-white text-opacity-60 text-xs md:text-sm">
                After creating this workspace, selected users will have access to it immediately. 
                You can manage users later from the workspace settings.
              </p>
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
                Create workspace
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
