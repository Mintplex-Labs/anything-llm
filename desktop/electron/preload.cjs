const { contextBridge, ipcRenderer } = require("electron");

// Trusted-origin helpers are inlined here to avoid loading local CJS modules
// (http/https/path/fs/os) from a sandboxed preload where require is a limited
// Electron polyfill that cannot safely resolve arbitrary CommonJS helpers.
const TRUSTED_DESKTOP_HOSTS = new Set(["127.0.0.1", "localhost", "::1"]);

function normalizeTrustedHost(hostname) {
  return String(hostname || "")
    .trim()
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .toLowerCase();
}

function isTrustedDesktopOrigin(targetUrl) {
  const trimmed = String(targetUrl || "").trim();
  if (!trimmed) return false;
  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return false;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
  return TRUSTED_DESKTOP_HOSTS.has(normalizeTrustedHost(parsed.hostname));
}

const STORAGE_CONTRACT_CHANNEL = "swarmsy:get-storage-contract";
const GET_LOCAL_USER_SETTINGS_CHANNEL = "swarmsy:get-local-user-settings";
const SET_LOCAL_USER_SETTINGS_CHANNEL = "swarmsy:set-local-user-settings";
const CLEAR_LOCAL_USER_SETTINGS_CHANNEL = "swarmsy:clear-local-user-settings";
const EXPORT_LOCAL_USER_BACKUP_CHANNEL = "swarmsy:export-local-user-backup";
const IMPORT_LOCAL_USER_BACKUP_CHANNEL = "swarmsy:import-local-user-backup";
const GET_RUNTIME_STATUS_CHANNEL = "swarmsy:get-runtime-status";

function createDesktopBridge({ ipcRendererApi = ipcRenderer } = {}) {
  return {
    foundation: {
      getStorageContract: () => ipcRendererApi.invoke(STORAGE_CONTRACT_CHANNEL),
      getRuntimeStatus: () => ipcRendererApi.invoke(GET_RUNTIME_STATUS_CHANNEL),
      getLocalUserSettings: () =>
        ipcRendererApi.invoke(GET_LOCAL_USER_SETTINGS_CHANNEL),
      setLocalUserSettings: (payload = {}) =>
        ipcRendererApi.invoke(SET_LOCAL_USER_SETTINGS_CHANNEL, payload),
      clearLocalUserSettings: () =>
        ipcRendererApi.invoke(CLEAR_LOCAL_USER_SETTINGS_CHANNEL),
      exportLocalUserBackup: () =>
        ipcRendererApi.invoke(EXPORT_LOCAL_USER_BACKUP_CHANNEL),
      importLocalUserBackup: (payload) =>
        ipcRendererApi.invoke(IMPORT_LOCAL_USER_BACKUP_CHANNEL, payload),
      mode: "foundation_only",
    },
  };
}

function exposeDesktopBridge({
  contextBridgeApi = contextBridge,
  ipcRendererApi = ipcRenderer,
  locationHref = globalThis.location?.href || "",
} = {}) {
  if (!isTrustedDesktopOrigin(locationHref)) {
    return false;
  }

  contextBridgeApi.exposeInMainWorld(
    "swarmsyDesktop",
    createDesktopBridge({ ipcRendererApi })
  );
  return true;
}

exposeDesktopBridge();

module.exports = {
  STORAGE_CONTRACT_CHANNEL,
  GET_LOCAL_USER_SETTINGS_CHANNEL,
  SET_LOCAL_USER_SETTINGS_CHANNEL,
  CLEAR_LOCAL_USER_SETTINGS_CHANNEL,
  EXPORT_LOCAL_USER_BACKUP_CHANNEL,
  IMPORT_LOCAL_USER_BACKUP_CHANNEL,
  GET_RUNTIME_STATUS_CHANNEL,
  TRUSTED_DESKTOP_HOSTS,
  normalizeTrustedHost,
  isTrustedDesktopOrigin,
  createDesktopBridge,
  exposeDesktopBridge,
};
