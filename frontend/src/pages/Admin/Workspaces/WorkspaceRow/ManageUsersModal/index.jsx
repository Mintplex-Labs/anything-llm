import React, { useState, useEffect } from "react";
import { X, Users, Check } from "@phosphor-icons/react";
import Admin from "@/models/admin";

export default function ManageUsersModal({ workspace, users, closeModal }) {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentWorkspaceUsers, setCurrentWorkspaceUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchWorkspaceUsers() {
      try {
        const workspaceUsers = await Admin.workspaceUsers(workspace.id);
        const workspaceUserIds = workspaceUsers.map(user => user.userId);
        setCurrentWorkspaceUsers(workspaceUsers);
        setSelectedUsers(workspaceUserIds);
        setLoading(false);
      } catch (err) {
        setError("Failed to load workspace users");
        setLoading(false);
      }
    }
    fetchWorkspaceUsers();
  }, [workspace.id]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    
    try {
      const { success, error } = await Admin.updateUsersInWorkspace(
        workspace.id,
        selectedUsers
      );
      
      if (success) {
        setSuccess(true);
        setTimeout(() => {
          window.location.reload(); // Refresh to show updated data
        }, 1000);
      } else {
        setError(error || "Failed to update workspace users");
      }
    } catch (err) {
      setError("An error occurred while updating users");
    }
    
    setSaving(false);
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const getCurrentlySelectedCount = () => {
    return selectedUsers.filter(userId => 
      currentWorkspaceUsers.some(wu => wu.userId === userId)
    ).length;
  };

  const getNewlySelectedCount = () => {
    return selectedUsers.filter(userId => 
      !currentWorkspaceUsers.some(wu => wu.userId === userId)
    ).length;
  };

  const getRemovedCount = () => {
    return currentWorkspaceUsers.filter(wu => 
      !selectedUsers.includes(wu.userId)
    ).length;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <Users className="text-white w-6 h-6" />
            <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
              Manage Users - {workspace.name}
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
          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              <div className="flex items-center">
                <Check className="mr-2 w-5 h-5" />
                Users updated successfully! Refreshing...
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              Error: {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-white">
                Select Users for This Workspace
              </label>
              <div className="max-h-60 overflow-y-auto bg-theme-settings-input-bg rounded-lg border border-theme-modal-border">
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
                    {users.map((user) => {
                      const isCurrentlyInWorkspace = currentWorkspaceUsers.some(wu => wu.userId === user.id);
                      const isSelected = selectedUsers.includes(user.id);
                      
                      return (
                        <div
                          key={user.id}
                          className={`flex items-center p-2 hover:bg-theme-bg-primary rounded cursor-pointer ${
                            isCurrentlyInWorkspace && isSelected ? 'bg-blue-900 bg-opacity-20' : 
                            !isCurrentlyInWorkspace && isSelected ? 'bg-green-900 bg-opacity-20' :
                            isCurrentlyInWorkspace && !isSelected ? 'bg-red-900 bg-opacity-20' : ''
                          }`}
                          onClick={() => toggleUserSelection(user.id)}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleUserSelection(user.id)}
                            className="mr-3 w-4 h-4 text-primary-button bg-theme-bg-secondary border-gray-300 rounded focus:ring-primary-button focus:ring-2"
                          />
                          <div className="flex flex-col flex-grow">
                            <div className="flex items-center justify-between">
                              <span className="text-white text-sm font-medium">
                                {user.username}
                              </span>
                              {isCurrentlyInWorkspace && (
                                <span className="text-blue-300 text-xs bg-blue-900 bg-opacity-30 px-2 py-1 rounded">
                                  Currently in workspace
                                </span>
                              )}
                            </div>
                            <span className="text-white text-opacity-60 text-xs">
                              {user.role}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="text-white text-opacity-60 text-sm space-y-1">
              <p>• Currently in workspace: {getCurrentlySelectedCount()} users</p>
              {getNewlySelectedCount() > 0 && (
                <p className="text-green-300">• ➕ Will be added: {getNewlySelectedCount()} users</p>
              )}
              {getRemovedCount() > 0 && (
                <p className="text-red-300">• ➖ Will be removed from this workspace: {getRemovedCount()} users</p>
              )}
              <p>• Total after changes: {selectedUsers.length} users</p>
              {getRemovedCount() > 0 && (
                <p className="text-yellow-300 text-xs mt-2">
                  ⚠️ Note: Users will only be removed from this workspace, not deleted from the system
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mt-6 pt-6 border-t border-theme-modal-border">
            <button
              onClick={closeModal}
              type="button"
              disabled={saving}
              className="transition-all duration-300 text-white hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              type="button"
              disabled={saving || success}
              className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm disabled:opacity-50 flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Saving...
                </>
              ) : success ? (
                <>
                  <Check className="mr-2 w-4 h-4" />
                  Saved!
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}