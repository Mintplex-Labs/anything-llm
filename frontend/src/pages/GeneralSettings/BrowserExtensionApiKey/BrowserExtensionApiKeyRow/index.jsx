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
      className="bg-transparent text-white text-opacity-80 text-xs font-medium border-b border-white/10 h-10"
    >
      <td scope="row" className="px-6 py-2 whitespace-nowrap">
        <div className="flex items-center">
          <span className="mr-2 font-mono">{connectionString}</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              data-tooltip-id="copy-connection-text"
              data-tooltip-content="Copy connection string"
              className="border-none text-theme-text-primary hover:text-theme-text-secondary transition-colors duration-200 p-1 rounded"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>

            <button
              onClick={handleConnect}
              data-tooltip-id="auto-connection"
              data-tooltip-content="Automatically connect to extension"
              className="border-none text-theme-text-primary hover:text-theme-text-secondary transition-colors duration-200 p-1 rounded"
            >
              <Plug className="h-4 w-4" />
            </button>
          </div>
        </div>
      </td>
      {isMultiUser && (
        <td className="px-6 py-2">
          {apiKey.user ? apiKey.user.username : "N/A"}
        </td>
      )}
      <td className="px-6 py-2">
        {new Date(apiKey.createdAt).toLocaleString()}
      </td>
      <td className="px-6 py-2">
        <button
          onClick={handleRevoke}
          className="text-xs font-medium text-white/80 light:text-black/80 hover:light:text-red-500 hover:text-red-300 rounded-lg px-2 py-1 hover:bg-white hover:light:bg-red-50 hover:bg-opacity-10"
        >
          <Trash className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}
