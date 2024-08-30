import React, { useEffect, useState } from "react";
import { X } from "@phosphor-icons/react";
import BrowserExtensionApiKey from "@/models/browserExtensionApiKey";
import { fullApiUrl, POPUP_BROWSER_EXTENSION_EVENT } from "@/utils/constants";

export default function NewBrowserExtensionApiKeyModal({
  closeModal,
  onSuccess,
  isMultiUser,
}) {
  const [apiKey, setApiKey] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async (e) => {
    setError(null);
    e.preventDefault();

    const { apiKey: newApiKey, error } =
      await BrowserExtensionApiKey.generateKey();
    if (!!newApiKey) {
      const fullApiKey = `${fullApiUrl()}|${newApiKey}`;
      setApiKey(fullApiKey);
      onSuccess();

      window.postMessage(
        { type: POPUP_BROWSER_EXTENSION_EVENT, apiKey: fullApiKey },
        "*"
      );
    }
    setError(error);
  };

  const copyApiKey = () => {
    if (!apiKey) return false;
    window.navigator.clipboard.writeText(apiKey);
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
    <div className="relative w-[500px] max-w-2xl max-h-full">
      <div className="relative bg-main-gradient rounded-lg shadow">
        <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-500/50">
          <h3 className="text-xl font-semibold text-white">
            New Browser Extension API Key
          </h3>
          <button
            onClick={closeModal}
            type="button"
            className="transition-all duration-300 text-gray-400 bg-transparent hover:border-white/60 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border border-none cursor-pointer"
          >
            <X className="text-gray-300 text-lg" />
          </button>
        </div>
        <form onSubmit={handleCreate}>
          <div className="p-6 space-y-6 flex h-full w-full">
            <div className="w-full flex flex-col gap-y-4">
              {error && <p className="text-red-400 text-sm">Error: {error}</p>}
              {apiKey && (
                <input
                  type="text"
                  defaultValue={apiKey}
                  disabled={true}
                  className="rounded-lg px-4 py-2 text-white bg-zinc-900 border border-gray-500/50 border-none"
                />
              )}
              {isMultiUser && (
                <p className="text-yellow-300 text-xs md:text-sm font-semibold">
                  Warning: You are in multi-user mode, this API key will allow
                  access to all workspaces associated with your account. Please
                  share it cautiously.
                </p>
              )}
              <p className="text-white text-xs md:text-sm">
                After clicking "Create API Key", AnythingLLM will attempt to
                connect to your browser extension automatically.
              </p>
              <p className="text-white text-xs md:text-sm">
                If you see "Connected to AnythingLLM" in the extension, the
                connection was successful. If not, please copy the connection
                string and paste it into the extension manually.
              </p>
            </div>
          </div>
          <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
            {!apiKey ? (
              <>
                <button
                  onClick={closeModal}
                  type="button"
                  className="px-4 py-2 rounded-lg text-white hover:bg-stone-900 transition-all duration-300 border-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800 border-none"
                >
                  Create API Key
                </button>
              </>
            ) : (
              <button
                onClick={copyApiKey}
                type="button"
                disabled={copied}
                className="w-full transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800 text-center justify-center border-none cursor-pointer"
              >
                {copied ? "API Key Copied!" : "Copy API Key"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
