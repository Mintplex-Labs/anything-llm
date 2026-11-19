import { useTranslation } from "react-i18next";
import { ModalLabel, ModalHint } from "@/components/lib/Modal";
import WorkspaceMultiSelect from "./WorkspaceMultiSelect";
import { FULL_ACCESS, getScopes } from "../scopes";

/**
 * Scope checkboxes and the workspace limit for an API key.
 * @param {Object} props
 * @param {string[]} props.scopes - Selected scopes, `["full"]` for a full access key
 * @param {(scopes: string[]) => void} props.onScopesChange
 * @param {boolean} props.limited - If the key is limited to specific workspaces
 * @param {(limited: boolean) => void} props.onLimitedChange
 * @param {{id: number, name: string}[]} props.workspaces
 * @param {number[]} props.workspaceIds - Selected workspace ids
 * @param {(ids: number[]) => void} props.onWorkspaceIdsChange
 */
export default function ScopeFields({
  scopes,
  onScopesChange,
  limited,
  onLimitedChange,
  workspaces,
  workspaceIds,
  onWorkspaceIdsChange,
}) {
  const { t } = useTranslation();
  const fullAccess = scopes.includes(FULL_ACCESS);

  const toggle = (scope) => {
    if (scope === FULL_ACCESS) return onScopesChange(fullAccess ? [] : [scope]);
    const selected = scopes.filter((s) => s !== FULL_ACCESS);
    if (selected.includes(scope))
      return onScopesChange(selected.filter((s) => s !== scope));
    onScopesChange([...selected, scope]);
  };

  return (
    <div className="flex flex-col gap-y-3 w-full">
      <ModalLabel>{t("api.modal.scope.label")}</ModalLabel>
      <div className="flex flex-col gap-y-2">
        {Object.entries(getScopes(t)).map(([scope, { label, hint }]) => (
          <ScopeCheckbox
            key={scope}
            label={label}
            hint={hint}
            checked={scopes.includes(scope)}
            onChange={() => toggle(scope)}
          />
        ))}
      </div>
      {scopes.includes("users") && (
        <p className="text-xs text-yellow-300 light:text-orange-700">
          {t("api.modal.scope.usersWarning")}
        </p>
      )}
      {!fullAccess && (
        <div className="flex flex-col gap-y-1.5">
          <label className="flex items-center gap-x-2 text-sm text-zinc-50 light:text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={limited}
              onChange={(e) => onLimitedChange(e.target.checked)}
            />
            {t("api.modal.workspaces.label")}
          </label>
          <WorkspaceMultiSelect
            visible={limited}
            workspaces={workspaces}
            selected={workspaceIds}
            onChange={onWorkspaceIdsChange}
          />
          <ModalHint>{t("api.modal.workspaces.helper")}</ModalHint>
        </div>
      )}
    </div>
  );
}

function ScopeCheckbox({ label, hint, checked, onChange }) {
  return (
    <label className="flex items-start gap-x-2 cursor-pointer">
      <input
        type="checkbox"
        className="mt-0.5"
        checked={checked}
        onChange={onChange}
      />
      <span className="flex flex-col">
        <span className="text-sm text-zinc-50 light:text-slate-900">
          {label}
        </span>
        <ModalHint>{hint}</ModalHint>
      </span>
    </label>
  );
}
