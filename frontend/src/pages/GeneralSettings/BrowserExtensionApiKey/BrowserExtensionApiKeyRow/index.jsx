import { useRef } from "react";
import BrowserExtensionApiKey from "@/models/browserExtensionApiKey";
import showToast from "@/utils/toast";
import { Trash, CheckCircle } from "@phosphor-icons/react";

export default function BrowserExtensionApiKeyRow({
  apiKey,
  updateApiKeyStatus,
  removeApiKey,
}) {
  const rowRef = useRef(null);

  const handleAccept = async () => {
    const result = await BrowserExtensionApiKey.accept(apiKey.key);
    if (result.success) {
      updateApiKeyStatus(apiKey.key, true);
      showToast("Browser Extension API Key accepted", "success");
    } else {
      showToast("Failed to accept API Key", "error");
    }
  };

  const handleRevoke = async () => {
    if (
      !window.confirm(
        `Are you sure you want to revoke this browser extension API key?\nAfter you do this it will no longer be useable.\n\nThis action is irreversible.`
      )
    )
      return false;

    const result = await BrowserExtensionApiKey.revoke(apiKey.key);
    if (result.success) {
      removeApiKey(apiKey.key);
      showToast("Browser Extension API Key permanently revoked", "info");
    } else {
      showToast("Failed to revoke API Key", "error");
    }
  };

  return (
    <tr
      ref={rowRef}
      className="bg-transparent text-white text-opacity-80 text-sm font-medium"
    >
      <td scope="row" className="px-6 py-4 whitespace-nowrap">
        {apiKey.key}
      </td>
      <td className="px-6 py-4 text-center">
        {apiKey.accepted ? (
          <span className="text-green-400">Accepted</span>
        ) : (
          <span className="text-yellow-400">Pending</span>
        )}
      </td>
      <td className="px-6 py-4">{apiKey.verificationCode}</td>
      <td className="px-6 py-4">{apiKey.createdAt}</td>
      <td className="px-6 py-4 flex items-center gap-x-6">
        {!apiKey.accepted && (
          <button
            onClick={handleAccept}
            className="font-medium px-2 py-1 rounded-lg hover:bg-sidebar-gradient text-green-400 hover:text-green-300 hover:bg-opacity-20"
          >
            <CheckCircle className="h-5 w-5" />
          </button>
        )}
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
