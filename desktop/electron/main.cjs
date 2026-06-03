const path = require("path");
const { app, BrowserWindow, ipcMain, shell } = require("electron");
const {
  getDesktopStorageContract,
} = require("../foundation/storageContractBridge.cjs");
const {
  getLocalUserSettings,
  setLocalUserSettings,
  clearLocalUserSettings,
} = require("../foundation/localSettingsStore.cjs");
const {
  exportLocalUserBackup,
  importLocalUserBackup,
} = require("../foundation/localBackupStore.cjs");
const {
  TRUSTED_DESKTOP_HOSTS,
  normalizeTrustedHost,
  isTrustedDesktopOrigin,
  runDesktopRuntimeHealthcheck,
} = require("../foundation/runtimeHealthcheck.cjs");
const {
  isDesktopRuntimeAutoStartEnabled,
  getManualRuntimeStartCommand,
  launchDesktopLocalRuntime,
  waitForRuntimeHealthcheck,
  stopDesktopLaunchedRuntime,
} = require("../foundation/runtimeLauncher.cjs");

const STORAGE_CONTRACT_CHANNEL = "swarmsy:get-storage-contract";
const GET_LOCAL_USER_SETTINGS_CHANNEL = "swarmsy:get-local-user-settings";
const SET_LOCAL_USER_SETTINGS_CHANNEL = "swarmsy:set-local-user-settings";
const CLEAR_LOCAL_USER_SETTINGS_CHANNEL = "swarmsy:clear-local-user-settings";
const EXPORT_LOCAL_USER_BACKUP_CHANNEL = "swarmsy:export-local-user-backup";
const IMPORT_LOCAL_USER_BACKUP_CHANNEL = "swarmsy:import-local-user-backup";
const repoRoot = path.resolve(__dirname, "../..");
let managedRuntimeChild = null;
let managedRuntimeStopPromise = null;
let isQuittingAfterManagedRuntimeStop = false;

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
  const manualStartCommand = String(
    failure?.manualStartCommand || "yarn desktop:runtime:dev"
  );
  const autoStartHint =
    failure?.reason === "runtime_auto_start_disabled"
      ? `<p>Auto-start is disabled by default. Set <code>SWARMSY_DESKTOP_AUTO_START_RUNTIME=true</code> to let desktop dev mode launch the local runtime.</p>`
      : "";
  const expectedUrl =
    failure?.reason === "runtime_unreachable"
      || failure?.reason === "runtime_auto_start_disabled"
      || failure?.reason === "runtime_healthcheck_timeout"
      || failure?.reason === "runtime_launch_failed"
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
        ${autoStartHint}
        <p>Start the local runtime first (for example: <code>${escapeHtml(
          manualStartCommand
        )}</code>) and relaunch with <code>yarn desktop:dev</code>.</p>
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
  ipcMainApi.removeHandler?.(GET_LOCAL_USER_SETTINGS_CHANNEL);
  ipcMainApi.removeHandler?.(SET_LOCAL_USER_SETTINGS_CHANNEL);
  ipcMainApi.removeHandler?.(CLEAR_LOCAL_USER_SETTINGS_CHANNEL);
  ipcMainApi.removeHandler?.(EXPORT_LOCAL_USER_BACKUP_CHANNEL);
  ipcMainApi.removeHandler?.(IMPORT_LOCAL_USER_BACKUP_CHANNEL);
  ipcMainApi.handle(STORAGE_CONTRACT_CHANNEL, (event) => {
    const senderUrl =
      event?.senderFrame?.url || event?.sender?.getURL?.() || "";

    if (!isTrustedDesktopOrigin(senderUrl)) {
      return null;
    }

    return getDesktopStorageContract();
  });

  ipcMainApi.handle(GET_LOCAL_USER_SETTINGS_CHANNEL, async (event) => {
    const senderUrl =
      event?.senderFrame?.url || event?.sender?.getURL?.() || "";
    if (!isTrustedDesktopOrigin(senderUrl)) {
      return { ok: false, reason: "untrusted_origin" };
    }
    return getLocalUserSettings();
  });

  ipcMainApi.handle(SET_LOCAL_USER_SETTINGS_CHANNEL, async (event, payload) => {
    const senderUrl =
      event?.senderFrame?.url || event?.sender?.getURL?.() || "";
    if (!isTrustedDesktopOrigin(senderUrl)) {
      return { ok: false, reason: "untrusted_origin" };
    }
    return setLocalUserSettings(payload || {});
  });

  ipcMainApi.handle(CLEAR_LOCAL_USER_SETTINGS_CHANNEL, async (event) => {
    const senderUrl =
      event?.senderFrame?.url || event?.sender?.getURL?.() || "";
    if (!isTrustedDesktopOrigin(senderUrl)) {
      return { ok: false, reason: "untrusted_origin" };
    }
    return clearLocalUserSettings();
  });

  ipcMainApi.handle(EXPORT_LOCAL_USER_BACKUP_CHANNEL, async (event) => {
    const senderUrl =
      event?.senderFrame?.url || event?.sender?.getURL?.() || "";
    if (!isTrustedDesktopOrigin(senderUrl)) {
      return { ok: false, reason: "untrusted_origin" };
    }
    return exportLocalUserBackup();
  });

  ipcMainApi.handle(IMPORT_LOCAL_USER_BACKUP_CHANNEL, async (event, payload) => {
    const senderUrl =
      event?.senderFrame?.url || event?.sender?.getURL?.() || "";
    if (!isTrustedDesktopOrigin(senderUrl)) {
      return { ok: false, reason: "untrusted_origin" };
    }
    return importLocalUserBackup(payload);
  });
}

async function ensureDesktopRuntimeReady({
  startUrl,
  env = process.env,
  rootDir = repoRoot,
  runtimeHealthcheck = runDesktopRuntimeHealthcheck,
  runtimeLauncher = launchDesktopLocalRuntime,
  runtimeHealthWaiter = waitForRuntimeHealthcheck,
  runtimeStopper = stopDesktopLaunchedRuntime,
} = {}) {
  const health = await runtimeHealthcheck({ startUrl });
  if (health?.ok) {
    return {
      ok: true,
      health,
    };
  }

  if (health?.reason !== "runtime_unreachable") {
    return {
      ok: false,
      failure: health,
    };
  }

  if (!isDesktopRuntimeAutoStartEnabled({ env })) {
    return {
      ok: false,
      failure: {
        ...health,
        reason: "runtime_auto_start_disabled",
        message:
          "SWARMSY local runtime is not reachable and desktop runtime auto-start is disabled.",
        manualStartCommand: getManualRuntimeStartCommand({ env }),
      },
    };
  }

  const launchResult = await runtimeLauncher({
    rootDir,
    env,
  });

  if (!launchResult?.ok) {
    return {
      ok: false,
      failure: {
        ...launchResult,
        startUrl,
        manualStartCommand: getManualRuntimeStartCommand({ env }),
      },
    };
  }

  managedRuntimeChild = launchResult.child || managedRuntimeChild;

  const waitedHealth = await runtimeHealthWaiter({
    startUrl,
    launchResult,
    runtimeHealthcheckImpl: runtimeHealthcheck,
  });

  if (!waitedHealth?.ok) {
    await runtimeStopper({
      child: launchResult.child,
    });
    if (managedRuntimeChild === launchResult.child) {
      managedRuntimeChild = null;
    }
    return {
      ok: false,
      failure: {
        ...waitedHealth,
        startUrl,
        manualStartCommand: getManualRuntimeStartCommand({ env }),
      },
    };
  }

  return {
    ok: true,
    health: waitedHealth,
  };
}

async function stopManagedRuntime({ runtimeStopper = stopDesktopLaunchedRuntime } = {}) {
  if (managedRuntimeStopPromise) return managedRuntimeStopPromise;

  if (!managedRuntimeChild) {
    return { ok: true };
  }

  const child = managedRuntimeChild;

  managedRuntimeStopPromise = Promise.resolve()
    .then(() => runtimeStopper({ child }))
    .catch((error) => ({
      ok: false,
      reason: "runtime_stop_failed",
      message: error?.message || "Failed to stop SWARMSY local runtime.",
    }))
    .finally(() => {
      if (managedRuntimeChild === child) managedRuntimeChild = null;
      managedRuntimeStopPromise = null;
    });

  return managedRuntimeStopPromise;
}

async function createWindow({
  BrowserWindowCtor = BrowserWindow,
  startUrl = null,
  shellApi = shell,
  runtimeOrchestrator = ensureDesktopRuntimeReady,
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
    const runOrchestrator =
      runtimeHealthcheck === runDesktopRuntimeHealthcheck
        ? runtimeOrchestrator
        : (options) =>
            runtimeOrchestrator({
              ...options,
              runtimeHealthcheck,
            });
    const runtime = await runOrchestrator({
      startUrl: resolvedStartUrl,
    });
    if (!runtime?.ok) {
      await window.loadURL(renderFailurePage(runtime?.failure));
      return window;
    }
    configureWindowSecurity(window, runtime.health.startUrl, { shellApi });
    await window.loadURL(runtime.health.startUrl);
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
  runtimeStopper = stopDesktopLaunchedRuntime,
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

  appInstance.on("before-quit", (event) => {
    if (isQuittingAfterManagedRuntimeStop) return;
    event?.preventDefault?.();
    void stopManagedRuntime({ runtimeStopper }).finally(() => {
      isQuittingAfterManagedRuntimeStop = true;
      appInstance.quit();
    });
  });

  appInstance.on("window-all-closed", () => {
    void stopManagedRuntime({ runtimeStopper }).finally(() => {
      if (process.platform !== "darwin") appInstance.quit();
    });
  });
}

if (require.main === module) {
  bootstrapDesktopApp();
}

module.exports = {
  STORAGE_CONTRACT_CHANNEL,
  GET_LOCAL_USER_SETTINGS_CHANNEL,
  SET_LOCAL_USER_SETTINGS_CHANNEL,
  CLEAR_LOCAL_USER_SETTINGS_CHANNEL,
  EXPORT_LOCAL_USER_BACKUP_CHANNEL,
  IMPORT_LOCAL_USER_BACKUP_CHANNEL,
  TRUSTED_DESKTOP_HOSTS,
  normalizeTrustedHost,
  resolveStartUrl,
  renderFailurePage,
  isTrustedDesktopOrigin,
  shouldOpenExternally,
  isExternalWebUrl,
  configureWindowSecurity,
  registerDesktopIpc,
  ensureDesktopRuntimeReady,
  stopManagedRuntime,
  createWindow,
  bootstrapDesktopApp,
};
