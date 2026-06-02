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

function createDesktopBridge({ ipcRendererApi = ipcRenderer } = {}) {
  return {
    foundation: {
      getStorageContract: () => ipcRendererApi.invoke(STORAGE_CONTRACT_CHANNEL),
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
  TRUSTED_DESKTOP_HOSTS,
  normalizeTrustedHost,
  isTrustedDesktopOrigin,
  createDesktopBridge,
  exposeDesktopBridge,
};
