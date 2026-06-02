const { contextBridge, ipcRenderer } = require("electron");

const STORAGE_CONTRACT_CHANNEL = "swarmsy:get-storage-contract";
const TRUSTED_DESKTOP_HOSTS = new Set(["127.0.0.1", "localhost", "::1"]);

function normalizeTrustedHost(hostname = "") {
  return String(hostname || "")
    .trim()
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .toLowerCase();
}

function isTrustedDesktopOrigin(targetUrl) {
  try {
    const parsed = new URL(String(targetUrl || "").trim());
    return (
      (parsed.protocol === "http:" || parsed.protocol === "https:") &&
      TRUSTED_DESKTOP_HOSTS.has(normalizeTrustedHost(parsed.hostname))
    );
  } catch {
    return false;
  }
}

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
