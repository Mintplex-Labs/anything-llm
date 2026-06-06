#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { validateArtifact } = require("./desktop-artifact-smoke-check.cjs");
const {
  artifactsRoot,
  installerManifest,
  installerOutput,
  packageRoot,
} = require("./build-windows-installer.cjs");

const archivePath = path.join(artifactsRoot, "swarmsy-desktop-win32-x64.zip");
const requiredInstallerContents = [
  "desktop executable",
  "desktop/electron",
  "desktop/foundation",
  "desktop/runtime",
  "frontend/dist",
  "server runtime",
  "server/node_modules runtime dependencies",
  "server/prisma migrations",
  "server/public frontend bundle",
];
const prohibitedInstallerContents = [
  "code signing",
  "auto-update",
  "Ollama runtime",
  "AI models",
  "user data",
  ".env files",
  "secrets",
  "credentials",
];

function fail(message) {
  throw new Error(message);
}

function assertExists(targetPath, label) {
  if (!fs.existsSync(targetPath)) fail(`${label} is missing: ${targetPath}`);
}

function assertInstallerManifest() {
  assertExists(installerManifest, "Installer manifest");
  const manifest = JSON.parse(fs.readFileSync(installerManifest, "utf8"));
  if (manifest.installScope !== "per-user") {
    fail("Installer manifest must declare per-user install scope.");
  }
  if (manifest.desktopExecutable !== "SWARMSY Desktop.exe") {
    fail("Installer manifest must install SWARMSY Desktop.exe.");
  }
  for (const item of requiredInstallerContents) {
    if (!manifest.packages?.includes(item)) {
      fail(`Installer manifest is missing required packaged content: ${item}`);
    }
  }
  for (const item of prohibitedInstallerContents) {
    if (!manifest.deliberatelyExcluded?.includes(item)) {
      fail(`Installer manifest is missing deliberate exclusion: ${item}`);
    }
  }
}

function validateInstaller() {
  validateArtifact({ packageRoot, archivePath });
  assertExists(installerOutput, "Installer executable");
  const installerStats = fs.statSync(installerOutput);
  if (installerStats.size <= 0) fail("Installer executable is empty.");
  assertInstallerManifest();
}

function main() {
  try {
    validateInstaller();
    console.log(
      "[desktop:installer:smoke] Windows installer package and safety checks passed."
    );
  } catch (error) {
    console.error(`[desktop:installer:smoke] ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) main();

module.exports = {
  prohibitedInstallerContents,
  requiredInstallerContents,
  validateInstaller,
};
