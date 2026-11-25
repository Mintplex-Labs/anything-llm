import { safeJsonParse } from "@/utils/request";

export const FULL_ACCESS = "full";

/**
 * Label and hint for every scope, in display order.
 * @param {Function} t - i18next translate function
 * @returns {Object<string, {label: string, hint: string}>}
 */
export const getScopes = (t) => ({
  [FULL_ACCESS]: {
    label: t("api.scopes.full"),
    hint: t("api.modal.scope.helper.full"),
  },
  chat: {
    label: t("api.scopes.chat"),
    hint: t("api.modal.scope.helper.chat"),
  },
  workspace: {
    label: t("api.scopes.workspace"),
    hint: t("api.modal.scope.helper.workspace"),
  },
  documents: {
    label: t("api.scopes.documents"),
    hint: t("api.modal.scope.helper.documents"),
  },
  openai: {
    label: t("api.scopes.openai"),
    hint: t("api.modal.scope.helper.openai"),
  },
  embeds: {
    label: t("api.scopes.embeds"),
    hint: t("api.modal.scope.helper.embeds"),
  },
  mcp: {
    label: t("api.scopes.mcp"),
    hint: t("api.modal.scope.helper.mcp"),
  },
  users: {
    label: t("api.scopes.users"),
    hint: t("api.modal.scope.helper.users"),
  },
  sso: {
    label: t("api.scopes.sso"),
    hint: t("api.modal.scope.helper.sso"),
  },
});

/**
 * @param {{scope: string|null, scopeConfig: string|null}} apiKey
 * @returns {{scopes: string[], workspaceIds: number[]|null}} `workspaceIds` is null when the key can access every workspace
 */
export function parseKeyScopes(apiKey) {
  if (apiKey.scope === null || apiKey.scope === undefined)
    return { scopes: [FULL_ACCESS], workspaceIds: null };

  const scopes = safeJsonParse(apiKey.scope, []);
  return {
    scopes: Array.isArray(scopes) ? scopes : [],
    workspaceIds: parseWorkspaceIds(apiKey.scopeConfig),
  };
}

function parseWorkspaceIds(scopeConfig) {
  if (scopeConfig === null || scopeConfig === undefined) return null;
  const ids = safeJsonParse(scopeConfig, {})?.workspaceIds;
  return Array.isArray(ids) ? ids : [];
}

/**
 * Request body for creating or updating a key from the scope form state.
 * @param {string[]} scopes
 * @param {boolean} limited - If the key is limited to `workspaceIds`
 * @param {number[]} workspaceIds
 * @returns {{scopes: string[]|null, workspaceIds: number[]|null}}
 */
export function scopePayload(scopes, limited, workspaceIds) {
  if (scopes.includes(FULL_ACCESS)) return { scopes: null, workspaceIds: null };
  return { scopes, workspaceIds: limited ? workspaceIds : null };
}

/**
 * @param {string[]} scopes
 * @param {boolean} limited
 * @param {number[]} workspaceIds
 * @returns {boolean} If the scope form state can be saved
 */
export function validScopeSelection(scopes, limited, workspaceIds) {
  if (scopes.includes(FULL_ACCESS)) return true;
  return scopes.length > 0 && (!limited || workspaceIds.length > 0);
}
