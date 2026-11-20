import moment from "moment";
import { useEffect, useState } from "react";
import Admin from "@/models/admin";
import { PencilSimple, Trash } from "@phosphor-icons/react";
import { userFromStorage } from "@/utils/request";
import System from "@/models/system";
import { useTranslation } from "react-i18next";
import Modal from "@/components/lib/Modal";
import { useModal } from "@/hooks/useModal";
import EditApiKeyModal from "../EditApiKeyModal";
import { FULL_ACCESS, getScopes, parseKeyScopes } from "../scopes";

export default function ApiKeyRow({
  apiKey,
  removeApiKey,
  workspaces,
  onUpdate,
}) {
  const { t } = useTranslation();
  const { isOpen, openModal, closeModal } = useModal();
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
              onClick={openModal}
              aria-label={t("api.row.edit")}
              className="border-none text-xs font-medium text-white/80 light:text-black/80 hover:light:text-blue-500 hover:text-blue-300 rounded-lg px-2 py-1 hover:bg-white hover:light:bg-blue-50 hover:bg-opacity-10"
            >
              <PencilSimple className="h-5 w-5" />
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
      <Modal isOpen={isOpen} onClose={closeModal}>
        <EditApiKeyModal
          apiKey={apiKey}
          closeModal={closeModal}
          onSuccess={onUpdate}
          workspaces={workspaces}
        />
      </Modal>
    </>
  );
}

function ScopeLabel({ apiKey, workspaces }) {
  const { t } = useTranslation();
  const { scopes, workspaceIds } = parseKeyScopes(apiKey);
  const labels = getScopes(t);
  if (scopes.includes(FULL_ACCESS)) return labels[FULL_ACCESS].label;

  return (
    <div className="flex flex-col gap-y-0.5">
      <span>
        {scopes.map((scope) => labels[scope].label).join(", ") ||
          t("api.row.noScopes")}
      </span>
      {workspaceIds !== null && (
        <span className="text-theme-text-secondary">
          {workspaceNames(workspaceIds, workspaces) ||
            t("api.row.noWorkspaces")}
        </span>
      )}
    </div>
  );
}

/**
 * Comma-separated names of the workspaces a key is limited to.
 * @returns {string} empty when none of the key's workspaces still exist
 */
function workspaceNames(workspaceIds, workspaces = []) {
  return workspaces
    .filter((workspace) => workspaceIds.includes(workspace.id))
    .map((workspace) => workspace.name)
    .join(", ");
}
