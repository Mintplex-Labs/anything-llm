import React, { useEffect, useState } from "react";
import BrowserExtensionApiKey from "@/models/browserExtensionApiKey";
import { fullApiUrl, POPUP_BROWSER_EXTENSION_EVENT } from "@/utils/constants";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalPrimaryButton,
  ModalSecondaryButton,
} from "@/components/lib/Modal";

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
    <form onSubmit={handleCreate} className="flex flex-col gap-y-5">
      <ModalHeader title="New Browser Extension API Key" onClose={closeModal} />
      <ModalBody>
        {error && <p className="text-red-400 text-sm">Error: {error}</p>}
        {apiKey && (
          <input
            type="text"
            defaultValue={apiKey}
            disabled={true}
            className="border-none bg-zinc-800 w-full text-zinc-100 placeholder:text-zinc-400 light:bg-white light:text-slate-900 light:placeholder:text-slate-400 text-sm rounded-lg block p-2.5"
          />
        )}
        {isMultiUser && (
          <p className="text-yellow-300 light:text-orange-500 text-xs md:text-sm font-semibold">
            Warning: You are in multi-user mode, this API key will allow access
            to all workspaces associated with your account. Please share it
            cautiously.
          </p>
        )}
        <p className="text-xs text-zinc-400 light:text-slate-600">
          After clicking "Create API Key", AnythingLLM will attempt to connect
          to your browser extension automatically.
        </p>
        <p className="text-xs text-zinc-400 light:text-slate-600">
          If you see "Connected to AnythingLLM" in the extension, the connection
          was successful. If not, please copy the connection string and paste it
          into the extension manually.
        </p>
      </ModalBody>
      <ModalFooter>
        {!apiKey ? (
          <>
            <ModalSecondaryButton onClick={closeModal} type="button">
              Cancel
            </ModalSecondaryButton>
            <ModalPrimaryButton type="submit">
              Create API Key
            </ModalPrimaryButton>
          </>
        ) : (
          <ModalPrimaryButton
            onClick={copyApiKey}
            type="button"
            disabled={copied}
            className="w-full"
          >
            {copied ? "API Key Copied!" : "Copy API Key"}
          </ModalPrimaryButton>
        )}
      </ModalFooter>
    </form>
  );
}
