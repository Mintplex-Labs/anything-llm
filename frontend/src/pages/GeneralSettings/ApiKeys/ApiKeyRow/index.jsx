import moment from "moment";
import { useEffect, useState } from "react";
import Admin from "@/models/admin";
import { Trash } from "@phosphor-icons/react";
import { safeJsonParse, userFromStorage } from "@/utils/request";
import System from "@/models/system";
import { useTranslation } from "react-i18next";

export default function ApiKeyRow({ apiKey, removeApiKey, workspaces }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const handleDelete = async () => {
    if (!window.confirm(t("api.row.deleteConfirm"))) return false;

    const user = userFromStorage();
    const Model = !!user ? Admin : System;
    await Model.deleteApiKey(apiKey.id);
    removeApiKey(apiKey.id);
  };

  const copyApiKey = () => {
    if (!apiKey) return false;
    window.navigator.clipboard.writeText(apiKey.secret);
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
      <tr className="bg-transparent text-white text-opacity-80 text-xs font-medium border-b border-white/10">
        <td scope="row" className="px-6 py-3 whitespace-nowrap align-middle">
          {apiKey.name || t("api.row.unnamed")}
        </td>
        <td scope="row" className="px-6 py-3 align-middle">
          <code className="font-mono text-[11px] break-all text-theme-text-primary">
            {apiKey.secret}
          </code>
        </td>
        <td className="px-6 py-3 align-middle">
          <ScopeLabel apiKey={apiKey} workspaces={workspaces} />
        </td>
        <td className="px-6 py-3 text-left align-middle">
          {apiKey.createdBy?.username || "--"}
        </td>
        <td className="px-6 py-3 whitespace-nowrap align-middle">
          {moment(apiKey.createdAt).format("lll")}
        </td>
        <td className="px-6 py-3 align-middle">
          <div className="flex items-center gap-x-6">
            <button
              onClick={copyApiKey}
              disabled={copied}
              className="text-xs font-medium text-blue-300 rounded-lg hover:text-white hover:light:text-blue-500 hover:text-opacity-60 hover:underline"
            >
              {copied ? t("api.row.copied") : t("api.row.copy")}
            </button>
            <button
              onClick={handleDelete}
              className="text-xs font-medium text-white/80 light:text-black/80 hover:light:text-red-500 hover:text-red-300 rounded-lg px-2 py-1 hover:bg-white hover:light:bg-red-50 hover:bg-opacity-10"
            >
              <Trash className="h-5 w-5" />
            </button>
          </div>
        </td>
      </tr>
    </>
  );
}

function ScopeLabel({ apiKey, workspaces }) {
  const { t } = useTranslation();
  switch (apiKey.scope) {
    case "user":
      return t("api.scopes.user");
    case "workspace":
      return (
        scopedWorkspaceNames(apiKey, workspaces) || t("api.row.noWorkspaces")
      );
    default:
      return t("api.scopes.full");
  }
}

/**
 * Comma-separated names of the workspaces a workspace-scoped key can access.
 * @returns {string} empty when none of the key's workspaces still exist
 */
function scopedWorkspaceNames(apiKey, workspaces = []) {
  const { workspaceIds = [] } = safeJsonParse(apiKey.scopeConfig, {}) ?? {};
  return workspaces
    .filter((workspace) => workspaceIds.includes(workspace.id))
    .map((workspace) => workspace.name)
    .join(", ");
}
