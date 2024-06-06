import React, { useEffect, useState } from "react";
import { X } from "@phosphor-icons/react";
import Admin from "@/models/admin";
import Workspace from "@/models/workspace";

export default function NewInviteModal({ closeModal }) {
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
    if (!!newInvite) setInvite(newInvite);
    setError(error);
  };
  const copyInviteLink = () => {
    if (!invite) return false;
    window.navigator.clipboard.writeText(
      `${window.location.origin}/accept-invite/${invite.code}`
    );
    setCopied(true);
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
    <div className="relative w-[500px] max-w-2xl max-h-full overflow-auto">
      <div className="relative bg-main-gradient rounded-lg shadow">
        <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-500/50">
          <h3 className="text-xl font-semibold text-white">
            Create new invite
          </h3>
          <button
            onClick={closeModal}
            type="button"
            className="transition-all duration-300 text-gray-400 bg-transparent hover:border-white/60 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
            data-modal-hide="staticModal"
          >
            <X className="text-gray-300 text-lg" />
          </button>
        </div>
        <form onSubmit={handleCreate}>
          <div className="p-6 space-y-6 flex h-full w-full">
            <div className="w-full flex flex-col gap-y-4">
              {error && <p className="text-red-400 text-sm">Error: {error}</p>}
              {invite && (
                <input
                  type="url"
                  defaultValue={`${window.location.origin}/accept-invite/${invite.code}`}
                  disabled={true}
                  className="rounded-lg px-4 py-2 text-white bg-zinc-900 border border-gray-500/50"
                />
              )}
              <p className="text-white text-xs md:text-sm">
                After creation you will be able to copy the invite and send it
                to a new user where they can create an account as the{" "}
                <b>default</b> role and automatically be added to workspaces
                selected.
              </p>
            </div>
          </div>

          {workspaces.length > 0 && !invite && (
            <div className="p-6 flex w-full justify-between">
              <div className="w-full">
                <div className="flex flex-col gap-y-1  mb-2">
                  <label
                    htmlFor="workspaces"
                    className="text-sm font-medium text-white"
                  >
                    Auto-add invitee to workspaces
                  </label>
                  <p className="text-white/60 text-xs">
                    You can optionally automatically assign the user to the
                    workspaces below by selecting them. By default, the user
                    will not have any workspaces visible. You can assign
                    workspaces later post-invite acceptance.
                  </p>
                </div>

                <div className="flex flex-col gap-y-2">
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

          <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
            {!invite ? (
              <>
                <button
                  onClick={closeModal}
                  type="button"
                  className="px-4 py-2 rounded-lg text-white hover:bg-stone-900 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
                >
                  Create Invite
                </button>
              </>
            ) : (
              <button
                onClick={copyInviteLink}
                type="button"
                disabled={copied}
                className="w-full transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800 text-center justify-center"
              >
                {copied ? "Copied Link" : "Copy Invite Link"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function WorkspaceOption({ workspace, selected, toggleSelection }) {
  return (
    <button
      type="button"
      onClick={() => toggleSelection(workspace.id)}
      className={`transition-all duration-300 w-full h-11 p-2.5 bg-white/10 rounded-lg flex justify-start items-center gap-2.5 cursor-pointer border border-transparent ${
        selected ? "border-white border-opacity-40" : "border-none "
      } hover:border-white/60`}
    >
      <input
        type="radio"
        name="workspace"
        value={workspace.id}
        checked={selected}
        className="hidden"
      />
      <div
        className={`w-4 h-4 rounded-full border-2 border-white mr-2 ${
          selected ? "bg-white" : ""
        }`}
      ></div>
      <div className="text-white text-sm font-medium font-['Plus Jakarta Sans'] leading-tight">
        {workspace.name}
      </div>
    </button>
  );
}
