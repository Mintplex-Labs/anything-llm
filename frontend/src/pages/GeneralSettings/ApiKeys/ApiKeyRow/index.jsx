import { useEffect, useRef, useState } from "react";
import Admin from "../../../../models/admin";
import showToast from "../../../../utils/toast";
import { Trash } from "@phosphor-icons/react";
import { userFromStorage } from "../../../../utils/request";
import System from "../../../../models/system";

export default function ApiKeyRow({ apiKey }) {
  const rowRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to deactivate this api key?\nAfter you do this it will not longer be useable.\n\nThis action is irreversible.`
      )
    )
      return false;
    if (rowRef?.current) {
      rowRef.current.remove();
    }

    const user = userFromStorage();
    const Model = !!user ? Admin : System;
    await Model.deleteApiKey(apiKey.id);
    showToast("API Key permanently deleted", "info");
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
      <tr
        ref={rowRef}
        className="bg-transparent text-white text-opacity-80 text-sm font-medium"
      >
        <td scope="row" className="px-6 py-4 whitespace-nowrap">
          {apiKey.secret}
        </td>
        <td className="px-6 py-4 text-center">
          {apiKey.createdBy?.username || "--"}
        </td>
        <td className="px-6 py-4">{apiKey.createdAt}</td>
        <td className="px-6 py-4 flex items-center gap-x-6">
          <button
            onClick={copyApiKey}
            disabled={copied}
            className="font-medium text-blue-300 rounded-lg hover:text-white hover:text-opacity-60 hover:underline"
          >
            {copied ? "Copied" : "Copy API Key"}
          </button>
          <button
            onClick={handleDelete}
            className="font-medium text-red-300 px-2 py-1 rounded-lg hover:bg-red-800 hover:bg-opacity-20"
          >
            <Trash className="h-5 w-5" />
          </button>
        </td>
      </tr>
    </>
  );
}
