const path = require("path");
const { app, BrowserWindow, ipcMain, shell } = require("electron");
const {
  getDesktopStorageContract,
} = require("../foundation/storageContractBridge.cjs");

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

function resolveStartUrl() {
  const configured = String(process.env.SWARMSY_DESKTOP_START_URL || "").trim();
  if (!configured) return "http://127.0.0.1:3000";

  try {
    const parsed = new URL(configured);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error(`Unsupported protocol "${parsed.protocol}"`);
    }
    return parsed.toString();
  } catch (error) {
    throw new Error(
      `SWARMSY_DESKTOP_START_URL must be a valid http(s) URL. Received "${configured}". ${error.message}`
    );
  }
}

function renderFailurePage(error) {
  const message = String(error?.message || error || "Unknown desktop launch error");
  const escaped = message.replace(/[&<>"]/g, (char) => {
    if (char === "&") return "&amp;";
    if (char === "<") return "&lt;";
    if (char === ">") return "&gt;";
    return "&quot;";
  });

  return `data:text/html;charset=utf-8,${encodeURIComponent(`
    <html>
      <body style="font-family: Arial, sans-serif; padding: 20px; background: #111827; color: #f9fafb;">
        <h2>SWARMSY Desktop Foundation Launch Failed</h2>
        <p>${escaped}</p>
        <p>Start URL defaults to <code>http://127.0.0.1:3000</code>.</p>
        <p>You can override with <code>SWARMSY_DESKTOP_START_URL</code> to target local dev or hosted environments.</p>
      </body>
    </html>
  `)}`;
}

function getOrigin(targetUrl) {
  try {
    return new URL(String(targetUrl || "").trim()).origin;
  } catch {
    return "";
  }
}

function shouldOpenExternally(targetUrl, allowedOrigin) {
  try {
    const parsed = new URL(String(targetUrl || "").trim());
    return !allowedOrigin || parsed.origin !== allowedOrigin;
  } catch {
    return false;
  }
}

function isExternalWebUrl(targetUrl) {
  try {
    const parsed = new URL(String(targetUrl || "").trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function configureWindowSecurity(window, startUrl, { shellApi = shell } = {}) {
  const allowedOrigin = getOrigin(startUrl);
  const openExternalSafely = (url) => {
    void shellApi.openExternal(url).catch((error) => {
      console.error("[desktop] Failed to open external URL:", error);
    });
  };

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (
      shouldOpenExternally(url, allowedOrigin) &&
      isExternalWebUrl(url)
    ) {
      openExternalSafely(url);
    }
    return { action: "deny" };
  });

  window.webContents.on("will-navigate", (event, url) => {
    if (shouldOpenExternally(url, allowedOrigin)) {
      event.preventDefault();
      if (isExternalWebUrl(url)) {
        openExternalSafely(url);
      }
    }
  });
}

function registerDesktopIpc({ ipcMainApi = ipcMain } = {}) {
  ipcMainApi.removeHandler?.(STORAGE_CONTRACT_CHANNEL);
  ipcMainApi.handle(STORAGE_CONTRACT_CHANNEL, (event) => {
    const senderUrl =
      event?.senderFrame?.url || event?.sender?.getURL?.() || "";

    if (!isTrustedDesktopOrigin(senderUrl)) {
      return null;
    }

    return getDesktopStorageContract();
  });
}

async function createWindow({
  BrowserWindowCtor = BrowserWindow,
  startUrl = null,
  shellApi = shell,
} = {}) {
  const window = new BrowserWindowCtor({
    width: 1366,
    height: 860,
    minWidth: 1024,
    minHeight: 700,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.resolve(__dirname, "preload.cjs"),
    },
  });

  try {
    const resolvedStartUrl =
      startUrl !== null && startUrl !== undefined ? startUrl : resolveStartUrl();
    configureWindowSecurity(window, resolvedStartUrl, { shellApi });
    await window.loadURL(resolvedStartUrl);
  } catch (error) {
    await window.loadURL(renderFailurePage(error));
  }

  return window;
}

function bootstrapDesktopApp({
  appInstance = app,
  BrowserWindowCtor = BrowserWindow,
  ipcMainApi = ipcMain,
  shellApi = shell,
} = {}) {
  registerDesktopIpc({ ipcMainApi });

  appInstance.whenReady().then(() => {
    createWindow({ BrowserWindowCtor, shellApi }).catch((error) => {
      console.error("[desktop] Failed to create window:", error);
    });
    appInstance.on("activate", () => {
      if (BrowserWindowCtor.getAllWindows().length === 0) {
        createWindow({ BrowserWindowCtor, shellApi }).catch((error) => {
          console.error("[desktop] Failed to re-create window:", error);
        });
      }
    });
  });

  appInstance.on("window-all-closed", () => {
    if (process.platform !== "darwin") appInstance.quit();
  });
}

if (require.main === module) {
  bootstrapDesktopApp();
}

module.exports = {
  STORAGE_CONTRACT_CHANNEL,
  TRUSTED_DESKTOP_HOSTS,
  normalizeTrustedHost,
  resolveStartUrl,
  renderFailurePage,
  isTrustedDesktopOrigin,
  shouldOpenExternally,
  isExternalWebUrl,
  configureWindowSecurity,
  registerDesktopIpc,
  createWindow,
  bootstrapDesktopApp,
};
