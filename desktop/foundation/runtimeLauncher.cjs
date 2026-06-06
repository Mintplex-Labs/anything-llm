const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const {
  runDesktopRuntimeHealthcheck,
} = require("./runtimeHealthcheck.cjs");

const DESKTOP_RUNTIME_LAUNCH_MODE = "desktop_local_runtime_launcher";
const DEFAULT_RUNTIME_SCRIPT = "desktop:runtime:dev";
const PACKAGED_RUNTIME_ENTRY = "desktop/runtime/start-local-runtime.cjs";
const LEGACY_RUNTIME_SCRIPT = "dev:all";
const AUTO_START_RUNTIME_ENV_FLAG = "SWARMSY_DESKTOP_AUTO_START_RUNTIME";
const RUNTIME_SCRIPT_ENV_FLAG = "SWARMSY_DESKTOP_RUNTIME_SCRIPT";
const DEFAULT_HEALTHCHECK_WAIT_TIMEOUT_MS = 45000;
const DEFAULT_HEALTHCHECK_RETRY_INTERVAL_MS = 1000;
const DEFAULT_LAUNCH_SPAWN_TIMEOUT_MS = 5000;
const DEFAULT_STOP_TIMEOUT_MS = 5000;
const repoRoot = path.resolve(__dirname, "../..");

function isDesktopRuntimeAutoStartEnabled({ env = process.env } = {}) {
  return (
    String(env?.[AUTO_START_RUNTIME_ENV_FLAG] || "")
      .trim()
      .toLowerCase() === "true"
  );
}

function resolvePackagedRuntimeEntry({ rootDir = repoRoot } = {}) {
  const entry = path.resolve(rootDir, PACKAGED_RUNTIME_ENTRY);
  return fs.existsSync(entry) ? entry : "";
}

function shouldAutoStartDesktopRuntime({
  env = process.env,
  packagedRuntime = false,
} = {}) {
  return packagedRuntime || isDesktopRuntimeAutoStartEnabled({ env });
}

function resolveManagedRuntimeRoot({ env = process.env } = {}) {
  const configured = String(
    env?.SWARMSY_DESKTOP_MANAGED_RUNTIME_DIR || ""
  ).trim();
  if (configured) return path.resolve(configured);
  const userDataDir = String(
    env?.SWARMSY_DESKTOP_USER_DATA_DIR || ""
  ).trim();
  if (userDataDir) return path.join(userDataDir, "managed-local-runtime");
  const localAppData = String(
    env?.LOCALAPPDATA || env?.APPDATA || ""
  ).trim();
  if (localAppData) {
    return path.join(localAppData, "SWARMSY Desktop", "managed-local-runtime");
  }
  return path.join(repoRoot, ".swarmsy-desktop", "managed-local-runtime");
}

function assertSafeManagedRuntimePath(managedRoot, managedAppRoot) {
  const resolvedManagedRoot = path.resolve(String(managedRoot || "").trim());
  const resolvedManagedAppRoot = path.resolve(
    String(managedAppRoot || "").trim()
  );
  const managedRootFsRoot = path.parse(resolvedManagedRoot).root;

  if (
    !String(managedRoot || "").trim() ||
    resolvedManagedRoot === managedRootFsRoot ||
    resolvedManagedRoot.length < managedRootFsRoot.length + 8
  ) {
    throw new Error(`Refusing to clear managed runtime root: ${managedRoot}`);
  }

  if (resolvedManagedAppRoot !== path.join(resolvedManagedRoot, "app")) {
    throw new Error(
      `Refusing to clear unexpected managed app root: ${managedAppRoot}`
    );
  }

  if (resolvedManagedAppRoot === resolvedManagedRoot) {
    throw new Error(
      `Refusing to clear managed app root equal to managed root: ${managedAppRoot}`
    );
  }

  return {
    managedRoot: resolvedManagedRoot,
    managedAppRoot: resolvedManagedAppRoot,
  };
}

function readPackageVersion({ rootDir = repoRoot } = {}) {
  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(rootDir, "package.json"), "utf8")
    );
    return String(pkg.version || "0.0.0");
  } catch {
    return "0.0.0";
  }
}

function toPortableLower(filePath) {
  return String(filePath || "").replace(/\\/g, "/").toLowerCase();
}

function portablePathIncludes(portablePath, fragment) {
  return (
    portablePath.includes(`${fragment}/`) || portablePath.endsWith(fragment)
  );
}

function isUnderNodeModules(source) {
  return portablePathIncludes(toPortableLower(source), "/node_modules");
}

function shouldExcludeRuntimeCopy(source) {
  const base = path.basename(source).toLowerCase();
  const portable = toPortableLower(source);
  if (base.startsWith(".env") || base.endsWith(".local")) return true;
  if (
    portablePathIncludes(portable, "/.yarn") ||
    portablePathIncludes(portable, "/.yarnrc.yml") ||
    portablePathIncludes(portable, "/__tests__")
  ) {
    return true;
  }
  if (isUnderNodeModules(source)) return false;
  return [
    "/server/storage",
    "/server/documents",
    "/server/vector-cache",
    "/collector/hotdir",
    "/session-store",
  ].some((fragment) => portablePathIncludes(portable, fragment));
}

function copyRuntimeTree(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.cpSync(from, to, {
    recursive: true,
    filter: (source) => !shouldExcludeRuntimeCopy(source),
  });
}

function preparePackagedRuntimeRoot({
  rootDir = repoRoot,
  env = process.env,
} = {}) {
  const sourceEntry = resolvePackagedRuntimeEntry({ rootDir });
  if (!sourceEntry) return "";

  const version = readPackageVersion({ rootDir });
  const managedRoot = resolveManagedRuntimeRoot({ env });
  const managedAppRoot = path.join(managedRoot, "app");
  assertSafeManagedRuntimePath(managedRoot, managedAppRoot);
  const manifestPath = path.join(managedRoot, "runtime-manifest.json");
  let currentManifest = null;
  try {
    currentManifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch {}

  const entry = path.join(managedAppRoot, PACKAGED_RUNTIME_ENTRY);
  const serverIndex = path.join(managedAppRoot, "server", "index.js");
  if (
    currentManifest?.version !== version ||
    !fs.existsSync(entry) ||
    !fs.existsSync(serverIndex)
  ) {
    fs.rmSync(managedAppRoot, { recursive: true, force: true });
    fs.mkdirSync(managedAppRoot, { recursive: true });
    copyRuntimeTree(
      path.join(rootDir, "server"),
      path.join(managedAppRoot, "server")
    );
    copyRuntimeTree(
      path.join(rootDir, "desktop", "runtime"),
      path.join(managedAppRoot, "desktop", "runtime")
    );
    fs.mkdirSync(managedRoot, { recursive: true });
    fs.writeFileSync(
      manifestPath,
      `${JSON.stringify({ version, updatedAt: new Date().toISOString() }, null, 2)}\n`
    );
  }
  return entry;
}

function getAllowlistedRuntimeScripts() {
  return [DEFAULT_RUNTIME_SCRIPT, LEGACY_RUNTIME_SCRIPT];
}

function readRootPackageScripts({
  rootDir = repoRoot,
  readFileSyncImpl = fs.readFileSync,
} = {}) {
  try {
    const pkg = JSON.parse(
      readFileSyncImpl(path.resolve(rootDir, "package.json"), "utf8")
    );
    return pkg?.scripts && typeof pkg.scripts === "object" ? pkg.scripts : {};
  } catch {
    return {};
  }
}

function resolveRuntimeLaunchScript({
  env = process.env,
  packageScripts = readRootPackageScripts(),
} = {}) {
  const allowlistedScripts = new Set(getAllowlistedRuntimeScripts());
  const configuredScript = String(env?.[RUNTIME_SCRIPT_ENV_FLAG] || "").trim();

  if (configuredScript && !allowlistedScripts.has(configuredScript)) {
    return {
      ok: false,
      reason: "unsafe_runtime_script",
      message: `SWARMSY Desktop runtime launcher only allows ${Array.from(
        allowlistedScripts
      ).join(", ")}.`,
    };
  }

  let scriptName = configuredScript || DEFAULT_RUNTIME_SCRIPT;
  if (!packageScripts[scriptName] && !configuredScript) {
    scriptName = packageScripts[LEGACY_RUNTIME_SCRIPT]
      ? LEGACY_RUNTIME_SCRIPT
      : DEFAULT_RUNTIME_SCRIPT;
  }

  if (!allowlistedScripts.has(scriptName)) {
    return {
      ok: false,
      reason: "unsafe_runtime_script",
      message: `SWARMSY Desktop runtime launcher rejected "${scriptName}".`,
    };
  }

  const scriptCommand = String(packageScripts?.[scriptName] || "").trim();
  if (!scriptCommand) {
    return {
      ok: false,
      reason: "runtime_launch_not_configured",
      message: `Missing allowlisted runtime script "${scriptName}" in root package.json.`,
    };
  }

  return {
    ok: true,
    scriptName,
    scriptCommand,
  };
}

function resolveYarnBinary({ platform = process.platform } = {}) {
  return platform === "win32" ? "yarn.cmd" : "yarn";
}

function resolveNodeRuntimeBinary({ execPath = process.execPath } = {}) {
  return execPath;
}

function getManualRuntimeStartCommand({ env = process.env } = {}) {
  const result = resolveRuntimeLaunchScript({
    env,
  });
  if (result?.ok) {
    return `yarn ${result.scriptName}`;
  }
  return `yarn ${DEFAULT_RUNTIME_SCRIPT}`;
}

function attachRuntimeLogForwarding(child, { logger = console } = {}) {
  const toText = (value) => String(value || "").trimEnd();
  child?.stdout?.on?.("data", (chunk) => {
    const text = toText(chunk);
    if (text) logger.log(`[desktop:runtime] ${text}`);
  });
  child?.stderr?.on?.("data", (chunk) => {
    const text = toText(chunk);
    if (text) logger.error(`[desktop:runtime] ${text}`);
  });
}

async function launchDesktopLocalRuntime({
  rootDir = repoRoot,
  env = process.env,
  platform = process.platform,
  spawnImpl = spawn,
  logger = console,
  packageScripts = readRootPackageScripts({ rootDir }),
  packagedRuntime = false,
  execPath = process.execPath,
} = {}) {
  if (!shouldAutoStartDesktopRuntime({ env, packagedRuntime })) {
    return {
      ok: false,
      reason: "runtime_auto_start_disabled",
      message:
        "SWARMSY desktop local runtime auto-start is disabled. Set SWARMSY_DESKTOP_AUTO_START_RUNTIME=true to opt in.",
    };
  }

  const packagedRuntimeEntry = packagedRuntime
    ? preparePackagedRuntimeRoot({ rootDir, env })
    : "";

  if (packagedRuntime && !packagedRuntimeEntry) {
    return {
      ok: false,
      reason: "packaged_runtime_missing",
      message:
        "Packaged SWARMSY runtime entrypoint is missing from the desktop artifact.",
    };
  }

  const scriptResult = packagedRuntimeEntry
    ? { ok: true, scriptName: "desktop:runtime:packaged" }
    : resolveRuntimeLaunchScript({
        env,
        packageScripts,
      });
  if (!scriptResult.ok) {
    return scriptResult;
  }

  const command = packagedRuntimeEntry
    ? resolveNodeRuntimeBinary({ execPath })
    : resolveYarnBinary({ platform });
  const args = packagedRuntimeEntry
    ? [packagedRuntimeEntry]
    : ["run", scriptResult.scriptName];
  const isPackagedRuntimeLaunch = Boolean(packagedRuntimeEntry);
  const spawnEnv = isPackagedRuntimeLaunch
    ? {
        ...env,
        ELECTRON_RUN_AS_NODE: "1",
        SWARMSY_DESKTOP_MANAGED_RUNTIME_DIR:
          env.SWARMSY_DESKTOP_MANAGED_RUNTIME_DIR ||
          resolveManagedRuntimeRoot({ env }),
      }
    : env;
  let child;
  try {
    child = spawnImpl(command, args, {
      cwd: rootDir,
      env: spawnEnv,
      shell: isPackagedRuntimeLaunch ? false : platform === "win32",
      detached: platform !== "win32",
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });
  } catch {
    return {
      ok: false,
      reason: "runtime_launch_failed",
      message: "Failed to start SWARMSY local runtime.",
    };
  }

  attachRuntimeLogForwarding(child, { logger });

  return new Promise((resolve) => {
    let settled = false;
    let spawnTimeout = null;
    const settle = (value) => {
      if (!settled) {
        settled = true;
        if (spawnTimeout) {
          clearTimeout(spawnTimeout);
          spawnTimeout = null;
        }
        child.removeListener?.("error", onError);
        child.removeListener?.("spawn", onSpawn);
        resolve(value);
      }
    };

    const onError = () => {
      settle({
        ok: false,
        reason: "runtime_launch_failed",
        message: "Failed to start SWARMSY local runtime.",
      });
    };

    const onSpawn = () => {
      settle({
        ok: true,
        pid: child.pid,
        mode: DESKTOP_RUNTIME_LAUNCH_MODE,
        scriptName: scriptResult.scriptName,
        runtimeEntry: packagedRuntimeEntry || null,
        child,
      });
    };

    child.once?.("error", onError);
    child.once?.("spawn", onSpawn);

    spawnTimeout = setTimeout(() => {
      settle({
        ok: false,
        reason: "runtime_launch_failed",
        message:
          "Timed out waiting for SWARMSY local runtime process to spawn.",
      });
    }, DEFAULT_LAUNCH_SPAWN_TIMEOUT_MS);
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForRuntimeHealthcheck({
  startUrl,
  timeoutMs = DEFAULT_HEALTHCHECK_WAIT_TIMEOUT_MS,
  retryIntervalMs = DEFAULT_HEALTHCHECK_RETRY_INTERVAL_MS,
  runtimeHealthcheckImpl = runDesktopRuntimeHealthcheck,
  launchResult = null,
} = {}) {
  const startedAt = Date.now();
  let lastFailure = null;
  while (Date.now() - startedAt <= timeoutMs) {
    if (
      launchResult?.child &&
      (launchResult.child.exitCode !== null ||
        launchResult.child.signalCode !== null)
    ) {
      return {
        ok: false,
        reason: "runtime_launch_failed",
        message:
          "SWARMSY local runtime exited before passing desktop healthcheck.",
      };
    }

    const health = await runtimeHealthcheckImpl({ startUrl });
    if (health?.ok) {
      return {
        ...health,
        mode: DESKTOP_RUNTIME_LAUNCH_MODE,
      };
    }
    lastFailure = health;
    await sleep(retryIntervalMs);
  }

  return {
    ok: false,
    reason: "runtime_healthcheck_timeout",
    message: `SWARMSY local runtime did not become healthy before timeout at ${String(
      startUrl || ""
    )}.`,
    startUrl: String(startUrl || "").trim(),
    lastFailure,
  };
}

function waitForChildExit(child, timeoutMs = DEFAULT_STOP_TIMEOUT_MS) {
  return new Promise((resolve) => {
    if (!child || child.exitCode !== null || child.signalCode !== null) {
      resolve(true);
      return;
    }
    let settled = false;
    let timeout = null;
    const settle = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };
    const onExit = () => {
      if (timeout) clearTimeout(timeout);
      settle(true);
    };
    child.once?.("exit", onExit);
    timeout = setTimeout(() => {
      child.removeListener?.("exit", onExit);
      settle(false);
    }, timeoutMs);
  });
}

async function stopDesktopLaunchedRuntime({
  child = null,
  platform = process.platform,
  spawnImpl = spawn,
} = {}) {
  if (!child || typeof child.pid !== "number") {
    return { ok: true, mode: DESKTOP_RUNTIME_LAUNCH_MODE };
  }

  if (child.exitCode !== null || child.signalCode !== null) {
    return { ok: true, mode: DESKTOP_RUNTIME_LAUNCH_MODE };
  }

  if (platform === "win32") {
    let killer;
    try {
      killer = spawnImpl(
        "taskkill",
        ["/pid", String(child.pid), "/t", "/f"],
        {
          shell: false,
          windowsHide: true,
          stdio: "ignore",
        }
      );
    } catch (error) {
      child.kill?.();
      return {
        ok: false,
        reason: "runtime_stop_failed",
        message: error?.message || "Failed to invoke taskkill.",
      };
    }
    const taskkillResult = await new Promise((resolve) => {
      let settled = false;
      let timeout = null;
      const done = (result) => {
        if (settled) return;
        settled = true;
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        killer.removeListener?.("error", onError);
        killer.removeListener?.("exit", onExit);
        resolve(result);
      };
      const onError = () => done({ ok: false, reason: "runtime_stop_failed" });
      const onExit = (code) =>
        done(
          code === 0
            ? { ok: true }
            : { ok: false, reason: "runtime_stop_failed" }
        );
      killer.once?.("error", onError);
      killer.once?.("exit", onExit);
      timeout = setTimeout(
        () => done({ ok: false, reason: "runtime_stop_timeout" }),
        DEFAULT_STOP_TIMEOUT_MS
      );
    });
    if (taskkillResult.reason === "runtime_stop_timeout") {
      return {
        ok: false,
        reason: "runtime_stop_timeout",
        message:
          "Timed out waiting for Windows taskkill to stop SWARMSY local runtime.",
        mode: DESKTOP_RUNTIME_LAUNCH_MODE,
      };
    }
    if (taskkillResult.reason === "runtime_stop_failed") {
      try {
        child.kill?.();
      } catch {}
      return {
        ok: false,
        reason: "runtime_stop_failed",
        message: "Failed to stop SWARMSY local runtime with Windows taskkill.",
        mode: DESKTOP_RUNTIME_LAUNCH_MODE,
      };
    }
    return { ok: true, mode: DESKTOP_RUNTIME_LAUNCH_MODE };
  }

  try {
    process.kill(-child.pid, "SIGTERM");
  } catch {
    try {
      child.kill("SIGTERM");
    } catch {}
  }
  const exited = await waitForChildExit(child, DEFAULT_STOP_TIMEOUT_MS);
  if (!exited) {
    try {
      process.kill(-child.pid, "SIGKILL");
    } catch {
      try {
        child.kill("SIGKILL");
      } catch {}
    }
    const killed = await waitForChildExit(child, 1000);
    if (!killed) {
      return {
        ok: false,
        reason: "runtime_stop_timeout",
        message: "Timed out waiting for SWARMSY local runtime to exit.",
        mode: DESKTOP_RUNTIME_LAUNCH_MODE,
      };
    }
  }

  return { ok: true, mode: DESKTOP_RUNTIME_LAUNCH_MODE };
}

module.exports = {
  DESKTOP_RUNTIME_LAUNCH_MODE,
  DEFAULT_RUNTIME_SCRIPT,
  PACKAGED_RUNTIME_ENTRY,
  LEGACY_RUNTIME_SCRIPT,
  AUTO_START_RUNTIME_ENV_FLAG,
  RUNTIME_SCRIPT_ENV_FLAG,
  DEFAULT_HEALTHCHECK_WAIT_TIMEOUT_MS,
  DEFAULT_HEALTHCHECK_RETRY_INTERVAL_MS,
  DEFAULT_LAUNCH_SPAWN_TIMEOUT_MS,
  isDesktopRuntimeAutoStartEnabled,
  resolvePackagedRuntimeEntry,
  resolveManagedRuntimeRoot,
  assertSafeManagedRuntimePath,
  preparePackagedRuntimeRoot,
  shouldExcludeRuntimeCopy,
  toPortableLower,
  isUnderNodeModules,
  shouldAutoStartDesktopRuntime,
  resolveNodeRuntimeBinary,
  getAllowlistedRuntimeScripts,
  readRootPackageScripts,
  resolveRuntimeLaunchScript,
  resolveYarnBinary,
  getManualRuntimeStartCommand,
  attachRuntimeLogForwarding,
  launchDesktopLocalRuntime,
  waitForRuntimeHealthcheck,
  waitForChildExit,
  stopDesktopLaunchedRuntime,
};
