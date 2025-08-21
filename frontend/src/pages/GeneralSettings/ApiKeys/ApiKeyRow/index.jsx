import { useEffect, useState } from "react";
import Admin from "@/models/admin";
import showToast from "@/utils/toast";
import { Trash } from "@phosphor-icons/react";
import { userFromStorage } from "@/utils/request";
import System from "@/models/system";

export default function ApiKeyRow({ apiKey, removeApiKey }) {
  const [copied, setCopied] = useState(false);
  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to deactivate this api key?\nAfter you do this it will not longer be useable.\n\nThis action is irreversible.`
      )
    )
      return false;

    const user = userFromStorage();
    const Model = !!user ? Admin : System;
    await Model.deleteApiKey(apiKey.id);
    showToast("API Key permanently deleted", "info");
    removeApiKey(apiKey.id);
  };

  const copyApiKey = () => {
    if (!apiKey) return false;
    window.navigator.clipboard.writeText(apiKey.secret);
    showToast("API Key copied to clipboard", "success");
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
    <>
      <tr className="bg-transparent text-white text-opacity-80 text-xs font-medium border-b border-white/10 h-10">
        <td scope="row" className="px-6 whitespace-nowrap">
          {apiKey.secret}
        </td>
        <td className="px-6 text-left">{apiKey.createdBy?.username || "--"}</td>
        <td className="px-6">{apiKey.createdAt}</td>
        <td className="px-6 flex items-center gap-x-6 h-full mt-1">
          <button
            onClick={copyApiKey}
            disabled={copied}
            className="text-xs font-medium text-blue-300 rounded-lg hover:text-white hover:light:text-blue-500 hover:text-opacity-60 hover:underline"
          >
            {copied ? "Copied" : "Copy API Key"}
          </button>
          <button
            onClick={handleDelete}
            className="text-xs font-medium text-white/80 light:text-black/80 hover:light:text-red-500 hover:text-red-300 rounded-lg px-2 py-1 hover:bg-white hover:light:bg-red-50 hover:bg-opacity-10"
          >
            <Trash className="h-5 w-5" />
          </button>
        </td>
      </tr>
    </>
  );
}
