import { SESSION_REASONING_EFFORT_MAP } from "@/utils/constants";
import { safeJsonParse } from "@/utils/request";

/** Fired with `{ workspaceSlug, threadSlug }` when a session's reasoning effort changes. */
export const SESSION_REASONING_EFFORT_EVENT =
  "session_reasoning_effort_changed";

/**
 * Reasoning effort is chosen per chat session - a thread, or a workspace's
 * default chat - and kept in this browser only, so one user's choice never
 * changes another user's chats. Sessions without a choice use the workspace
 * default, then the system default.
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
 * @returns {string|null} The session's own reasoning effort, or null to use the defaults
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
  window.dispatchEvent(
    new CustomEvent(SESSION_REASONING_EFFORT_EVENT, {
      detail: { workspaceSlug, threadSlug },
    })
  );
}

/**
 * The effort a chat session will run with: its own choice, then the workspace
 * default, then the system default - skipping any the current model does not
 * support, the same way the server picks it.
 * @param {{sessionEffort?: string|null, workspaceEffort?: string|null, systemEffort?: string|null}} efforts
 * @param {string[]} reasoningOptions - Efforts the current model supports
 * @returns {string|null}
 */
export function effectiveReasoningEffort(
  { sessionEffort = null, workspaceEffort = null, systemEffort = null },
  reasoningOptions = []
) {
  return (
    [sessionEffort, workspaceEffort, systemEffort].find(
      (effort) => !!effort && reasoningOptions.includes(effort)
    ) ?? null
  );
}
