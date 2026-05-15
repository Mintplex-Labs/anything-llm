import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const FileAccessPolicy = {
  storageKey: "anythingllm-file-access-session-mode",
  modes: {
    sandbox: "sandbox",
    authorized: "authorized",
    open: "open",
  },
  labels: {
    sandbox: "Sandbox",
    authorized: "Authorized",
    open: "Open",
  },
  getSessionMode(workspaceSlug = null, threadSlug = null) {
    const key = this.sessionKey(workspaceSlug, threadSlug);
    return sessionStorage.getItem(key) || null;
  },
  setSessionMode(mode, workspaceSlug = null, threadSlug = null) {
    const normalized = this.normalizeMode(mode);
    sessionStorage.setItem(
      this.sessionKey(workspaceSlug, threadSlug),
      normalized
    );
    return normalized;
  },
  sessionKey(workspaceSlug = null, threadSlug = null) {
    return `${this.storageKey}:${workspaceSlug || "global"}:${threadSlug || "default"}`;
  },
  normalizeMode(mode) {
    return Object.values(this.modes).includes(mode) ? mode : this.modes.sandbox;
  },
  getPolicy: async function (sessionMode = null) {
    const url = new URL(
      `${API_BASE}/system/file-access-policy`,
      window.location.origin
    );
    if (sessionMode) url.searchParams.set("sessionMode", sessionMode);
    return fetch(url, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => ({ success: false, error: e.message, policy: null }));
  },
  updateGlobalPolicy: async function (updates = {}) {
    return fetch(`${API_BASE}/system/file-access-policy`, {
      method: "PATCH",
      headers: baseHeaders(),
      body: JSON.stringify(updates),
    })
      .then((res) => res.json())
      .catch((e) => ({ success: false, error: e.message }));
  },
  logSessionModeChange: async function ({
    mode,
    workspaceSlug = null,
    threadSlug = null,
  }) {
    return fetch(`${API_BASE}/system/file-access-policy/session-event`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ mode, workspaceSlug, threadSlug }),
    }).catch(() => null);
  },
};

export default FileAccessPolicy;
