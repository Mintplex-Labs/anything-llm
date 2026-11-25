import React, { useEffect, useState } from "react";
import { Copy, Check } from "@phosphor-icons/react";
import Admin from "@/models/admin";
import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalPrimaryButton,
  ModalSecondaryButton,
  ModalLabel,
  ModalHint,
} from "@/components/lib/Modal";

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
    <form onSubmit={handleCreate} className="flex flex-col gap-y-5">
      <ModalHeader title="Create new invite" onClose={closeModal} />
      <ModalBody>
        {error && <p className="text-red-400 text-sm">Error: {error}</p>}
        {invite && (
          <div className="relative">
            <input
              type="url"
              defaultValue={`${window.location.origin}/accept-invite/${invite.code}`}
              disabled={true}
              className="w-full h-[34px] px-3.5 pr-10 text-sm rounded-lg outline-none bg-zinc-800 border border-zinc-800 text-zinc-100 placeholder:text-zinc-400 light:bg-white light:border-slate-300 light:text-slate-900 light:placeholder:text-slate-400 focus:border-sky-500 light:focus:border-sky-500"
            />
            <button
              type="button"
              onClick={copyInviteLink}
              disabled={copied}
              className="border-none absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-zinc-800 light:hover:bg-slate-100 transition-all duration-300"
            >
              {copied ? (
                <Check size={20} className="text-green-400" weight="bold" />
              ) : (
                <Copy
                  size={20}
                  className="text-slate-50 light:text-slate-900"
                  weight="bold"
                />
              )}
            </button>
          </div>
        )}
        <p className="text-zinc-400 light:text-slate-600 text-xs md:text-sm">
          After creation you will be able to copy the invite and send it to a
          new user where they can create an account as the <b>default</b> role
          and automatically be added to workspaces selected.
        </p>

        {workspaces.length > 0 && !invite && (
          <div className="w-full">
            <div className="flex flex-col gap-y-1 mb-2">
              <ModalLabel htmlFor="workspaces">
                Auto-add invitee to workspaces
              </ModalLabel>
              <ModalHint>
                You can optionally automatically assign the user to the
                workspaces below by selecting them. By default, the user will
                not have any workspaces visible. You can assign workspaces later
                post-invite acceptance.
              </ModalHint>
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
        )}
      </ModalBody>
      <ModalFooter className={invite ? "justify-end" : undefined}>
        {!invite ? (
          <>
            <ModalSecondaryButton onClick={closeModal} type="button">
              Cancel
            </ModalSecondaryButton>
            <ModalPrimaryButton type="submit">Create Invite</ModalPrimaryButton>
          </>
        ) : (
          <ModalSecondaryButton onClick={closeModal} type="button">
            Close
          </ModalSecondaryButton>
        )}
      </ModalFooter>
    </form>
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
