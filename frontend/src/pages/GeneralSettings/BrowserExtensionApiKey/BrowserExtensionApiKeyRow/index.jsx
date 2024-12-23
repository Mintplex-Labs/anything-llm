import { useRef, useState } from "react";
import BrowserExtensionApiKey from "@/models/browserExtensionApiKey";
import showToast from "@/utils/toast";
import { Trash, Copy, Check, Plug } from "@phosphor-icons/react";
import { POPUP_BROWSER_EXTENSION_EVENT } from "@/utils/constants";

export default function BrowserExtensionApiKeyRow({
  apiKey,
  removeApiKey,
  connectionString,
  isMultiUser,
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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = () => {
    // Sending a message to Chrome extension to pop up the extension window
    // This will open the extension window and attempt to connect with the API key
    window.postMessage(
      { type: POPUP_BROWSER_EXTENSION_EVENT, apiKey: connectionString },
      "*"
    );
    showToast("Attempting to connect to browser extension...", "info", {
      clear: true,
    });
  };

  return (
    <tr
      ref={rowRef}
      className="bg-transparent text-white text-opacity-80 text-sm font-medium"
    >
      <td scope="row" className="px-6 py-4 whitespace-nowrap flex items-center">
        <span className="mr-2 font-mono">{connectionString}</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            data-tooltip-id="copy-connection-text"
            data-tooltip-content="Copy connection string"
            className="border-none text-theme-text-primary hover:text-theme-text-secondary transition-colors duration-200 p-1 rounded"
          >
            {copied ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </button>

          <button
            onClick={handleConnect}
            data-tooltip-id="auto-connection"
            data-tooltip-content="Automatically connect to extension"
            className="border-none text-theme-text-primary hover:text-theme-text-secondary transition-colors duration-200 p-1 rounded"
          >
            <Plug className="h-5 w-5" />
          </button>
        </div>
      </td>
      {isMultiUser && (
        <td className="px-6 py-4">
          {apiKey.user ? apiKey.user.username : "N/A"}
        </td>
      )}
      <td className="px-6 py-4">
        {new Date(apiKey.createdAt).toLocaleString()}
      </td>
      <td className="px-6 py-4">
        <button
          onClick={handleRevoke}
          className="border-none font-medium px-2 py-1 rounded-lg text-theme-text-primary hover:text-red-500"
        >
          <Trash className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
}
