import React, { useEffect, useState } from "react";
import { X, Copy, Check } from "@phosphor-icons/react";
import Admin from "@/models/admin";
import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";

export default function NewInviteModal({ closeModal, onSuccess }) {
  const [invite, setInvite] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspaceIds, setSelectedWorkspaceIds] = useState([]);

  const handleCreate = async (e) => {
    setError(null);
    e.preventDefault();

    const { invite: newInvite, error } = await Admin.newInvite({
      role: null,
      workspaceIds: selectedWorkspaceIds,
    });
    if (!!newInvite) {
      setInvite(newInvite);
      onSuccess();
    }
    setError(error);
  };

  const copyInviteLink = () => {
    if (!invite) return false;
    window.navigator.clipboard.writeText(
      `${window.location.origin}/accept-invite/${invite.code}`
    );
    setCopied(true);
    showToast("Invite link copied to clipboard", "success", {
      clear: true,
    });
  };

  const handleWorkspaceSelection = (workspaceId) => {
    if (selectedWorkspaceIds.includes(workspaceId)) {
      const updated = selectedWorkspaceIds.filter((id) => id !== workspaceId);
      setSelectedWorkspaceIds(updated);
      return;
    }
    setSelectedWorkspaceIds([...selectedWorkspaceIds, workspaceId]);
  };

  useEffect(() => {
    function resetStatus() {
      if (!copied) return false;
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
    resetStatus();
  }, [copied]);

  useEffect(() => {
    async function fetchWorkspaces() {
      Workspace.all()
        .then((workspaces) => setWorkspaces(workspaces))
        .catch(() => setWorkspaces([]));
    }
    fetchWorkspaces();
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
              Create new invite
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
              {error && <p className="text-red-400 text-sm">Error: {error}</p>}
              {invite && (
                <div className="relative">
                  <input
                    type="url"
                    defaultValue={`${window.location.origin}/accept-invite/${invite.code}`}
                    disabled={true}
                    className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg outline-none block w-full p-2.5 pr-10"
                  />
                  <button
                    type="button"
                    onClick={copyInviteLink}
                    disabled={copied}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-theme-modal-border transition-all duration-300"
                  >
                    {copied ? (
                      <Check
                        size={20}
                        className="text-green-400"
                        weight="bold"
                      />
                    ) : (
                      <Copy size={20} className="text-white" weight="bold" />
                    )}
                  </button>
                </div>
              )}
              <p className="text-white text-opacity-60 text-xs md:text-sm">
                After creation you will be able to copy the invite and send it
                to a new user where they can create an account as the{" "}
                <b>default</b> role and automatically be added to workspaces
                selected.
              </p>
            </div>

            {workspaces.length > 0 && !invite && (
              <div className="mt-6">
                <div className="w-full">
                  <div className="flex flex-col gap-y-1 mb-2">
                    <label
                      htmlFor="workspaces"
                      className="block text-sm font-medium text-white"
                    >
                      Auto-add invitee to workspaces
                    </label>
                    <p className="text-white text-opacity-60 text-xs">
                      You can optionally automatically assign the user to the
                      workspaces below by selecting them. By default, the user
                      will not have any workspaces visible. You can assign
                      workspaces later post-invite acceptance.
                    </p>
                  </div>

                  <div className="flex flex-col gap-y-2 mt-2">
                    {workspaces.map((workspace) => (
                      <WorkspaceOption
                        key={workspace.id}
                        workspace={workspace}
                        selected={selectedWorkspaceIds.includes(workspace.id)}
                        toggleSelection={handleWorkspaceSelection}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end items-center mt-6 pt-6 border-t border-theme-modal-border">
              {!invite ? (
                <>
                  <button
                    onClick={closeModal}
                    type="button"
                    className="transition-all duration-300 text-white hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm"
                  >
                    Create Invite
                  </button>
                </>
              ) : (
                <button
                  onClick={closeModal}
                  type="button"
                  className="transition-all duration-300 text-white hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm"
                >
                  Close
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function WorkspaceOption({ workspace, selected, toggleSelection }) {
  return (
    <button
      type="button"
      onClick={() => toggleSelection(workspace.id)}
      className={`transition-all duration-300 w-full h-11 p-2.5 rounded-lg flex justify-start items-center gap-2.5 cursor-pointer border ${
        selected
          ? "border-theme-sidebar-item-workspace-active bg-theme-bg-secondary"
          : "border-theme-sidebar-border"
      } hover:border-theme-sidebar-border hover:bg-theme-bg-secondary`}
    >
      <input
        type="radio"
        name="workspace"
        value={workspace.id}
        checked={selected}
        className="hidden"
      />
      <div
        className={`w-4 h-4 rounded-full border-2 border-theme-sidebar-border mr-2 ${
          selected ? "bg-[var(--theme-sidebar-item-workspace-active)]" : ""
        }`}
      ></div>
      <div className="text-theme-text-primary text-sm font-medium font-['Plus Jakarta Sans'] leading-tight">
        {workspace.name}
      </div>
    </button>
  );
}
