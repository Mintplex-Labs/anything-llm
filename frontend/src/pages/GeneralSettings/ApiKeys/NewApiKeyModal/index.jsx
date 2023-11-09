import React, { useEffect, useState } from "react";
import { X } from "@phosphor-icons/react";
import Admin from "../../../../models/admin";
import paths from "../../../../utils/paths";
import { userFromStorage } from "../../../../utils/request";
import System from "../../../../models/system";

const DIALOG_ID = `new-api-key-modal`;

function hideModal() {
  document.getElementById(DIALOG_ID)?.close();
}

export const NewApiKeyModalId = DIALOG_ID;
export default function NewApiKeyModal() {
  const [apiKey, setApiKey] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async (e) => {
    setError(null);
    e.preventDefault();
    const user = userFromStorage();
    const Model = !!user ? Admin : System;

    const { apiKey: newApiKey, error } = await Model.generateApiKey();
    if (!!newApiKey) setApiKey(newApiKey);
    setError(error);
  };
  const copyApiKey = () => {
    if (!apiKey) return false;
    window.navigator.clipboard.writeText(apiKey.secret);
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
              Create new API key
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
                {apiKey && (
                  <input
                    type="text"
                    defaultValue={`${apiKey.secret}`}
                    disabled={true}
                    className="rounded-lg px-4 py-2 text-white bg-zinc-900 border border-gray-500/50"
                  />
                )}
                <p className="text-white text-xs md:text-sm">
                  Once created the API key can be used to programmatically
                  access and configure this AnythingLLM instance.
                </p>
                <a
                  href={paths.apiDocs()}
                  target="_blank"
                  className="text-blue-400 hover:underline"
                >
                  Read the API documentation &rarr;
                </a>
              </div>
            </div>
            <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
              {!apiKey ? (
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
                    Create API key
                  </button>
                </>
              ) : (
                <button
                  onClick={copyApiKey}
                  type="button"
                  disabled={copied}
                  className="w-full transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800 text-center justify-center"
                >
                  {copied ? "Copied API key" : "Copy API key"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}
