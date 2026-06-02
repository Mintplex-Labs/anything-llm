#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const repoRoot = path.resolve(__dirname, "../..");

function resolveElectronBinary(
  { platform = process.platform, rootDir = repoRoot } = {}
) {
  const pathModule = platform === "win32" ? path.win32 : path.posix;
  return pathModule.resolve(
    rootDir,
    "node_modules",
    ".bin",
    platform === "win32" ? "electron.cmd" : "electron"
  );
}

function getDesktopDevLaunchConfig({
  platform = process.platform,
  rootDir = repoRoot,
  env = process.env,
} = {}) {
  const pathModule = platform === "win32" ? path.win32 : path.posix;
  return {
    repoRoot: rootDir,
    electronMain: pathModule.resolve(rootDir, "desktop/electron/main.cjs"),
    electronBinary: resolveElectronBinary({ platform, rootDir }),
    configuredStartUrl: String(env.SWARMSY_DESKTOP_START_URL || "").trim(),
  };
}

function runDesktopDev({
  spawnImpl = spawn,
  platform = process.platform,
  rootDir = repoRoot,
  env = process.env,
} = {}) {
  const { electronMain, electronBinary, configuredStartUrl } =
    getDesktopDevLaunchConfig({ platform, rootDir, env });

  if (!fs.existsSync(electronMain)) {
    console.error(
      `[desktop:dev] Missing desktop entrypoint: ${electronMain}. Desktop foundation files are incomplete.`
    );
    process.exit(1);
  }

  if (!fs.existsSync(electronBinary)) {
    console.error(
      `[desktop:dev] Electron shim not found at ${electronBinary}.
Install Electron once in repo root:
  yarn add --dev electron`
    );
    process.exit(1);
  }

  if (!configuredStartUrl) {
    console.log(
      "[desktop:dev] SWARMSY_DESKTOP_START_URL is not set, defaulting to http://127.0.0.1:3000"
    );
  }

  const child = spawnImpl(electronBinary, [electronMain], {
    cwd: rootDir,
    stdio: "inherit",
    env,
    shell: platform === "win32",
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      console.error(`[desktop:dev] Electron exited via signal ${signal}.`);
      process.exit(1);
    }
    process.exit(code ?? 0);
  });

  return child;
}

if (require.main === module) {
  runDesktopDev();
}

module.exports = {
  resolveElectronBinary,
  getDesktopDevLaunchConfig,
  runDesktopDev,
};
