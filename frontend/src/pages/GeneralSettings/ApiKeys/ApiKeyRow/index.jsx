import { useEffect, useRef, useState } from "react";
import Admin from "@/models/admin";
import showToast from "@/utils/toast";
import { Trash } from "@phosphor-icons/react";
import { userFromStorage } from "@/utils/request";
import System from "@/models/system";
import { useTranslation } from "react-i18next";

export default function ApiKeyRow({ apiKey }) {
  const rowRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const handleDelete = async () => {
    if (!window.confirm(t("apiKeyActions.confirmDeactivate"))) return false;
    if (rowRef?.current) {
      rowRef.current.remove();
    }

    const user = userFromStorage();
    const Model = !!user ? Admin : System;
    await Model.deleteApiKey(apiKey.id);
    showToast(t("apiKeyActions.deleteSuccess"), "info");
  };

  const copyApiKey = () => {
    if (!apiKey) return false;
    window.navigator.clipboard.writeText(apiKey.secret);
    showToast(t("apiKeyActions.copySuccess"), "success");
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
            {copied ? t("apiKeyActions.copied") : t("apiKeyActions.copy")}
          </button>
          <button
            onClick={handleDelete}
            className="font-medium px-2 py-1 rounded-lg hover:bg-sidebar-gradient text-white hover:text-white/80 hover:bg-opacity-20"
          >
            <Trash className="h-5 w-5" />
          </button>
        </td>
      </tr>
    </>
  );
}
