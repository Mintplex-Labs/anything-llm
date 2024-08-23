import { useRef, useState } from "react";
import BrowserExtensionApiKey from "@/models/browserExtensionApiKey";
import showToast from "@/utils/toast";
import { Trash, Copy, Check } from "@phosphor-icons/react";
import { POPUP_BROWSER_EXTENSION_EVENT } from "@/utils/constants";

export default function BrowserExtensionApiKeyRow({
  apiKey,
  removeApiKey,
  connectionString,
}) {
  const rowRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleRevoke = async () => {
    if (
      !window.confirm(
        `Are you sure you want to revoke this browser extension API key?\nAfter you do this it will no longer be useable.\n\nThis action is irreversible.`
      )
    )
      return false;

    const result = await BrowserExtensionApiKey.revoke(apiKey.id);
    if (result.success) {
      removeApiKey(apiKey.id);
      showToast("Browser Extension API Key permanently revoked", "info", {
        clear: true,
      });
    } else {
      showToast("Failed to revoke API Key", "error", {
        clear: true,
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(connectionString);
    showToast("Connection string copied to clipboard", "success", {
      clear: true,
    });
    // Sending a message to Chrome extension to pop up the extension window
    // This will open the extension window and attempt to connect with the API key being copied
    window.postMessage(
      { type: POPUP_BROWSER_EXTENSION_EVENT, apiKey: connectionString },
      "*"
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <tr
      ref={rowRef}
      className="bg-transparent text-white text-opacity-80 text-sm font-medium"
    >
      <td scope="row" className="px-6 py-4 whitespace-nowrap flex items-center">
        <span className="mr-2">{connectionString}</span>
        <button
          onClick={handleCopy}
          className={`text-white hover:text-white/80 ${copied ? "text-green-400" : ""}`}
          title="Copy connection string"
        >
          {copied ? (
            <Check className="h-5 w-5 text-green-500" />
          ) : (
            <Copy className="h-5 w-5" />
          )}
        </button>
      </td>
      <td className="px-6 py-4">{apiKey.createdAt}</td>
      <td className="px-6 py-4 flex items-center gap-x-6">
        <button
          onClick={handleRevoke}
          className="font-medium px-2 py-1 rounded-lg hover:bg-sidebar-gradient text-white hover:text-white/80 hover:bg-opacity-20"
        >
          <Trash className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
}
