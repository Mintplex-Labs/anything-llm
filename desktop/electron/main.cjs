const path = require("path");
const { app, BrowserWindow, ipcMain, shell } = require("electron");
const {
  getDesktopStorageContract,
} = require("../foundation/storageContractBridge.cjs");
const {
  TRUSTED_DESKTOP_HOSTS,
  normalizeTrustedHost,
  isTrustedDesktopOrigin,
  runDesktopRuntimeHealthcheck,
} = require("../foundation/runtimeHealthcheck.cjs");

const STORAGE_CONTRACT_CHANNEL = "swarmsy:get-storage-contract";

function resolveStartUrl() {
  const configured = String(process.env.SWARMSY_DESKTOP_START_URL || "").trim();
  return configured || "http://127.0.0.1:3000";
}

function renderFailurePage(failure) {
  const escapeHtml = (value) =>
    String(value || "").replace(/[&<>"]/g, (char) => {
      if (char === "&") return "&amp;";
      if (char === "<") return "&lt;";
      if (char === ">") return "&gt;";
      return "&quot;";
    });
  const message = String(
    failure?.message || failure || "Unknown desktop launch error"
  );
  const expectedUrl =
    failure?.reason === "runtime_unreachable"
      ? String(
          failure?.startUrl ||
            process.env.SWARMSY_DESKTOP_START_URL ||
            "http://127.0.0.1:3000"
        )
      : "http://127.0.0.1:3000";
  const escaped = escapeHtml(message);
  const escapedExpectedUrl = escapeHtml(expectedUrl);

  return `data:text/html;charset=utf-8,${encodeURIComponent(`
    <html>
      <body style="font-family: Arial, sans-serif; padding: 20px; background: #111827; color: #f9fafb;">
        <h2>SWARMSY Desktop could not reach the local runtime</h2>
        <p>${escaped}</p>
        <p>Expected local runtime URL: <code>${escapedExpectedUrl}</code>.</p>
        <p>Start the local runtime first (for example: <code>yarn dev:all</code>) and relaunch with <code>yarn desktop:dev</code>.</p>
        <p>Hosted/Admin deployment is unchanged by this desktop local runtime foundation.</p>
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
  runtimeHealthcheck = runDesktopRuntimeHealthcheck,
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
    const health = await runtimeHealthcheck({ startUrl: resolvedStartUrl });
    if (!health?.ok) {
      await window.loadURL(renderFailurePage(health));
      return window;
    }
    configureWindowSecurity(window, health.startUrl, { shellApi });
    await window.loadURL(health.startUrl);
  } catch (error) {
    await window.loadURL(
      renderFailurePage({
        reason: "desktop_launch_failed",
        message: String(error?.message || error || "Unknown desktop launch error"),
      })
    );
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
