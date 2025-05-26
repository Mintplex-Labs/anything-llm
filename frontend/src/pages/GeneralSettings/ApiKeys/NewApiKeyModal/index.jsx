import React, { useEffect, useState } from "react";
import { X, Copy, Check } from "@phosphor-icons/react";
import Admin from "@/models/admin";
import paths from "@/utils/paths";
import { userFromStorage } from "@/utils/request";
import System from "@/models/system";
import showToast from "@/utils/toast";

export default function NewApiKeyModal({ closeModal, onSuccess }) {
  const [apiKey, setApiKey] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async (e) => {
    setError(null);
    e.preventDefault();
    const user = userFromStorage();
    const Model = !!user ? Admin : System;

    const { apiKey: newApiKey, error } = await Model.generateApiKey();
    if (!!newApiKey) {
      setApiKey(newApiKey);
      onSuccess();
    }
    setError(error);
  };

  const copyApiKey = () => {
    if (!apiKey) return false;
    window.navigator.clipboard.writeText(apiKey.secret);
    setCopied(true);
    showToast("API key copied to clipboard", "success", {
      clear: true,
    });
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
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
              Create new API key
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
        <div className="px-7 py-6">
          <form onSubmit={handleCreate}>
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              {error && <p className="text-red-400 text-sm">Error: {error}</p>}
              {apiKey && (
                <div className="relative">
                  <input
                    type="text"
                    defaultValue={`${apiKey.secret}`}
                    disabled={true}
                    className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg outline-none block w-full p-2.5 pr-10"
                  />
                  <button
                    type="button"
                    onClick={copyApiKey}
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
                Once created the API key can be used to programmatically access
                and configure this AnythingLLM instance.
              </p>
              <a
                href={paths.apiDocs()}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline"
              >
                Read the API documentation &rarr;
              </a>
            </div>
            <div className="flex justify-end items-center mt-6 pt-6 border-t border-theme-modal-border">
              {!apiKey ? (
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
                    Create API Key
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
