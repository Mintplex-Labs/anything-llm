import React, { useEffect, useState } from "react";
import { X } from "@phosphor-icons/react";
import Admin from "@/models/admin";

const DIALOG_ID = `new-invite-modal`;

function hideModal() {
  document.getElementById(DIALOG_ID)?.close();
}

export const NewInviteModalId = DIALOG_ID;
export default function NewInviteModal() {
  const [invite, setInvite] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async (e) => {
    setError(null);
    e.preventDefault();
    const { invite: newInvite, error } = await Admin.newInvite();
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
  useEffect(() => {
    function resetStatus() {
      if (!copied) return false;
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
    resetStatus();
  }, [copied]);

  return (
    <dialog id={DIALOG_ID} className="bg-transparent outline-none">
      <div className="relative w-[500px] max-w-2xl max-h-full">
        <div className="relative bg-main-gradient rounded-lg shadow">
          <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-500/50">
            <h3 className="text-xl font-semibold text-white">
              Create new invite
            </h3>
            <button
              onClick={hideModal}
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
                {error && (
                  <p className="text-red-400 text-sm">Error: {error}</p>
                )}
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
                  to a new user where they can create an account as a default
                  user.
                </p>
              </div>
            </div>
            <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
              {!invite ? (
                <>
                  <button
                    onClick={hideModal}
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
    </dialog>
  );
}
