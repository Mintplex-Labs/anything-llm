import { useState } from "react";
import Admin from "@/models/admin";
import System from "@/models/system";
import { userFromStorage } from "@/utils/request";
import { useTranslation } from "react-i18next";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalPrimaryButton,
  ModalSecondaryButton,
} from "@/components/lib/Modal";
import ScopeFields from "../ScopeFields";
import { parseKeyScopes, scopePayload, validScopeSelection } from "../scopes";

/**
 * @param {Object} props
 * @param {Object} props.apiKey - Key whose scopes are being edited
 * @param {() => void} props.closeModal
 * @param {() => void} props.onSuccess
 * @param {{id: number, name: string}[]} props.workspaces
 */
export default function EditApiKeyModal({
  apiKey,
  closeModal,
  onSuccess,
  workspaces,
}) {
  const { t } = useTranslation();
  const current = parseKeyScopes(apiKey);
  const [scopes, setScopes] = useState(current.scopes);
  const [limited, setLimited] = useState(current.workspaceIds !== null);
  // Workspaces deleted since the key was saved are dropped from the selection.
  const [workspaceIds, setWorkspaceIds] = useState(
    (current.workspaceIds ?? []).filter((id) =>
      workspaces.some((workspace) => workspace.id === id)
    )
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const valid = validScopeSelection(scopes, limited, workspaceIds);

  const handleSave = async (e) => {
    e.preventDefault();
    if (saving || !valid) return;
    setError(null);
    setSaving(true);
    const Model = !!userFromStorage() ? Admin : System;
    const { apiKey: updated, error } = await Model.updateApiKey(
      apiKey.id,
      scopePayload(scopes, limited, workspaceIds)
    );
    setSaving(false);
    if (!updated) return setError(error);
    onSuccess();
    closeModal();
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-y-5">
      <ModalHeader
        title={t("api.modal.editTitle")}
        subtitle={apiKey.name}
        onClose={closeModal}
      />
      <ModalBody>
        {error && (
          <p className="text-red-400 text-sm">
            {t("api.messages.error", { error })}
          </p>
        )}
        <ScopeFields
          scopes={scopes}
          onScopesChange={setScopes}
          limited={limited}
          onLimitedChange={setLimited}
          workspaces={workspaces}
          workspaceIds={workspaceIds}
          onWorkspaceIdsChange={setWorkspaceIds}
        />
      </ModalBody>
      <ModalFooter>
        <ModalSecondaryButton onClick={closeModal} type="button">
          {t("api.modal.cancel")}
        </ModalSecondaryButton>
        <ModalPrimaryButton type="submit" disabled={saving || !valid}>
          {t("api.modal.save")}
        </ModalPrimaryButton>
      </ModalFooter>
    </form>
  );
}
