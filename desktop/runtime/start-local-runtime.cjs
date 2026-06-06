#!/usr/bin/env node
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function ensureLocalSecret(file) {
  if (fs.existsSync(file)) return fs.readFileSync(file, "utf8").trim();
  const secret = crypto.randomBytes(32).toString("hex");
  fs.writeFileSync(file, `${secret}\n`, { mode: 0o600 });
  return secret;
}

function run(command, args, options = {}) {
  const {
    platform = process.platform,
    spawnSyncImpl = spawnSync,
    ...spawnOptions
  } = options;
  const isPowerShellScript =
    platform === "win32" &&
    String(command || "")
      .toLowerCase()
      .endsWith(".ps1");
  const actualCommand = isPowerShellScript ? "powershell.exe" : command;
  const actualArgs = isPowerShellScript
    ? ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", command, ...args]
    : args;

  const result = spawnSyncImpl(actualCommand, actualArgs, {
    stdio: "inherit",
    shell: platform === "win32" && !isPowerShellScript,
    windowsHide: true,
    ...spawnOptions,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(
      `${actualCommand} ${actualArgs.join(" ")} exited with ${result.status}`
    );
  }
}

function resolveRuntimeDataRoot(serverRoot, { env = process.env } = {}) {
  const userDataDir = String(env.SWARMSY_DESKTOP_USER_DATA_DIR || "").trim();
  if (userDataDir) {
    return path.join(userDataDir, "local-user-data", "runtime");
  }

  const managedRoot = String(
    env.SWARMSY_DESKTOP_MANAGED_RUNTIME_DIR || ""
  ).trim();
  if (managedRoot) {
    return path.join(managedRoot, "local-user-data", "runtime");
  }

  return path.join(serverRoot, "storage");
}

function resolvePrismaBin(serverRoot, { platform = process.platform } = {}) {
  const binDir = path.join(serverRoot, "node_modules", ".bin");
  const candidates =
    platform === "win32" ? ["prisma.cmd", "prisma.ps1", "prisma"] : ["prisma"];

  for (const candidate of candidates) {
    const fullPath = path.join(binDir, candidate);
    if (fs.existsSync(fullPath)) return fullPath;
  }

  return "";
}

function sqliteFileUrl(filePath) {
  return `file:${String(filePath || "").replace(/\\/g, "/")}`;
}

function initializeLocalRuntime(serverRoot, { env = process.env } = {}) {
  const storageRoot = resolveRuntimeDataRoot(serverRoot, { env });
  ensureDir(storageRoot);
  ensureDir(path.join(storageRoot, "documents"));
  ensureDir(path.join(storageRoot, "vector-cache"));
  ensureDir(path.join(storageRoot, "assets"));

  env.NODE_ENV = "production";
  env.SERVER_PORT = env.SERVER_PORT || "3000";
  env.STORAGE_DIR = storageRoot;
  env.DATABASE_URL = sqliteFileUrl(path.join(storageRoot, "anythingllm.db"));
  env.JWT_SECRET =
    env.JWT_SECRET ||
    ensureLocalSecret(path.join(storageRoot, "local-runtime.jwt"));
  env.SIG_KEY =
    env.SIG_KEY ||
    ensureLocalSecret(path.join(storageRoot, "local-runtime.sig"));
  env.DISABLE_TELEMETRY = env.DISABLE_TELEMETRY || "true";
  env.SWARMSY_DESKTOP_LOCAL_RUNTIME = "true";

  const prismaBin = resolvePrismaBin(serverRoot);
  if (!prismaBin) {
    throw new Error(
      `Bundled Prisma CLI is missing under ${path.join(
        serverRoot,
        "node_modules",
        ".bin"
      )}`
    );
  }

  run(prismaBin, ["migrate", "deploy"], {
    cwd: serverRoot,
    env,
  });
  run(prismaBin, ["db", "seed"], { cwd: serverRoot, env });
}

function main() {
  const serverRoot = path.resolve(__dirname, "..", "..", "server");
  if (!fs.existsSync(path.join(serverRoot, "index.js"))) {
    throw new Error(
      `Bundled SWARMSY server runtime is missing at ${serverRoot}`
    );
  }
  initializeLocalRuntime(serverRoot);
  require(path.join(serverRoot, "index.js"));
}

if (require.main === module) main();

module.exports = {
  ensureDir,
  ensureLocalSecret,
  initializeLocalRuntime,
  resolvePrismaBin,
  resolveRuntimeDataRoot,
  run,
  sqliteFileUrl,
};
