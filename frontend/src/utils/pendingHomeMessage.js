import { PENDING_HOME_MESSAGE } from "./constants";
import { safeJsonParse } from "./request";

function normalizePendingScopeValue(value) {
  return value == null ? "" : String(value).trim();
}

export function buildPendingHomeMessage({
  message,
  attachments = [],
  runtime,
  workspaceSlug = "",
  threadSlug = null,
} = {}) {
  const payload = {
    message,
    attachments,
    workspaceSlug: normalizePendingScopeValue(workspaceSlug),
    threadSlug: normalizePendingScopeValue(threadSlug) || null,
  };

  if (runtime) {
    payload.runtime = runtime;
  }

  return payload;
}

export function getPendingHomeMessageForDestination({
  workspaceSlug = "",
  threadSlug = null,
} = {}) {
  const pending = safeJsonParse(sessionStorage.getItem(PENDING_HOME_MESSAGE));
  if (!pending?.message) {
    return {
      pending: null,
      shouldClearLegacy: false,
    };
  }

  if (
    !Object.prototype.hasOwnProperty.call(pending, "workspaceSlug") ||
    !Object.prototype.hasOwnProperty.call(pending, "threadSlug")
  ) {
    return {
      pending: null,
      shouldClearLegacy: true,
    };
  }

  const normalizedWorkspaceSlug = normalizePendingScopeValue(workspaceSlug);
  const normalizedThreadSlug = normalizePendingScopeValue(threadSlug);
  const pendingWorkspaceSlug = normalizePendingScopeValue(
    pending.workspaceSlug
  );
  const pendingThreadSlug = normalizePendingScopeValue(pending.threadSlug);

  if (
    !normalizedWorkspaceSlug ||
    !pendingWorkspaceSlug ||
    pendingWorkspaceSlug !== normalizedWorkspaceSlug ||
    pendingThreadSlug !== normalizedThreadSlug
  ) {
    return {
      pending: null,
      shouldClearLegacy: false,
    };
  }

  return {
    pending,
    shouldClearLegacy: false,
  };
}
