import React, { useEffect, useState } from "react";
import { X } from "react-feather";
import Admin from "../../../../models/admin";
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
      <div className="relative w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-stone-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Create new invite
            </h3>
            <button
              onClick={hideModal}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="staticModal"
            >
              <X className="text-gray-300 text-lg" />
            </button>
          </div>
          <form onSubmit={handleCreate}>
            <div className="p-6 space-y-6 flex h-full w-full">
              <div className="w-full flex flex-col gap-y-4">
                {error && (
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    Error: {error}
                  </p>
                )}
                {invite && (
                  <input
                    type="url"
                    defaultValue={`${window.location.origin}/accept-invite/${invite.code}`}
                    disabled={true}
                    className="rounded-lg px-4 py-2 text-gray-800 bg-gray-100 dark:text-slate-200 dark:bg-stone-800"
                  />
                )}
                <p className="text-gray-800 dark:text-slate-200 text-xs md:text-sm">
                  After creation you will be able to copy the invite and send it
                  to a new user where they can create an account as a default
                  user.
                </p>
              </div>
            </div>
            <div className="flex w-full justify-between items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
              {!invite ? (
                <>
                  <button
                    onClick={hideModal}
                    type="button"
                    className="text-gray-800 hover:bg-gray-100 px-4 py-1 rounded-lg dark:text-slate-200 dark:hover:bg-stone-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-black dark:text-slate-200 dark:border-transparent dark:hover:text-slate-200 dark:hover:bg-gray-900 dark:focus:ring-gray-800"
                  >
                    Create Invite
                  </button>
                </>
              ) : (
                <button
                  onClick={copyInviteLink}
                  type="button"
                  disabled={copied}
                  className="w-full disabled:bg-green-200 disabled:text-green-600 text-gray-800 bg-gray-100 px-4 py-2 rounded-lg dark:text-slate-200 dark:bg-stone-900"
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
