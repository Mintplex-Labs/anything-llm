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
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
              New Browser Extension API Key
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
                <input
                  type="text"
                  defaultValue={apiKey}
                  disabled={true}
                  className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg block w-full p-2.5"
                />
              )}
              {isMultiUser && (
                <p className="text-yellow-300 light:text-orange-500 text-xs md:text-sm font-semibold">
                  Warning: You are in multi-user mode, this API key will allow
                  access to all workspaces associated with your account. Please
                  share it cautiously.
                </p>
              )}
              <p className="text-white text-opacity-60 text-xs md:text-sm">
                After clicking "Create API Key", AnythingLLM will attempt to
                connect to your browser extension automatically.
              </p>
              <p className="text-white text-opacity-60 text-xs md:text-sm">
                If you see "Connected to AnythingLLM" in the extension, the
                connection was successful. If not, please copy the connection
                string and paste it into the extension manually.
              </p>
            </div>
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-theme-modal-border">
              {!apiKey ? (
                <>
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
                    Create API Key
                  </button>
                </>
              ) : (
                <button
                  onClick={copyApiKey}
                  type="button"
                  disabled={copied}
                  className="w-full transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm cursor-pointer"
                >
                  {copied ? "API Key Copied!" : "Copy API Key"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
