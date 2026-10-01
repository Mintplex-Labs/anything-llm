import { SESSION_REASONING_EFFORT_MAP } from "@/utils/constants";
import { safeJsonParse } from "@/utils/request";

/**
 * Reasoning effort is chosen per chat session - a thread, or a workspace's
 * default chat - and kept in this browser only, so one user's choice never
 * changes another user's chats. Sessions without a choice send no reasoning
 * params, so the provider's default applies.
 */
function sessionKey(workspaceSlug, threadSlug = null) {
  return threadSlug ? `${workspaceSlug}:${threadSlug}` : workspaceSlug;
}

function readMap() {
  try {
    return safeJsonParse(
      localStorage.getItem(SESSION_REASONING_EFFORT_MAP) || "{}",
      {}
    );
  } catch {
    return {};
  }
}

/**
 * @param {string} workspaceSlug
 * @param {string|null} [threadSlug]
 * @returns {string|null} The session's reasoning effort, or null for the provider default
 */
export function getSessionReasoningEffort(workspaceSlug, threadSlug = null) {
  if (!workspaceSlug) return null;
  return readMap()[sessionKey(workspaceSlug, threadSlug)] ?? null;
}

/**
 * @param {string} workspaceSlug
 * @param {string|null} threadSlug
 * @param {string|null} effort - null clears the session's choice
 */
export function setSessionReasoningEffort(workspaceSlug, threadSlug, effort) {
  if (!workspaceSlug) return;
  try {
    const map = readMap();
    const key = sessionKey(workspaceSlug, threadSlug);
    if (effort) map[key] = effort;
    else delete map[key];
    localStorage.setItem(SESSION_REASONING_EFFORT_MAP, JSON.stringify(map));
  } catch {}
}
