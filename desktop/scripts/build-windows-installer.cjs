#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { validateArtifact } = require("./desktop-artifact-smoke-check.cjs");

const repoRoot = path.resolve(__dirname, "../..");
const artifactsRoot = path.join(repoRoot, "desktop", "artifacts");
const appName = "swarmsy-desktop-win32-x64";
const packageRoot = path.join(artifactsRoot, appName);
const archivePath = path.join(artifactsRoot, `${appName}.zip`);
const installerOutput = path.join(artifactsRoot, "SWARMSY-Desktop-Setup.exe");
const installerManifest = path.join(
  artifactsRoot,
  "SWARMSY-Desktop-Setup.manifest.json"
);
const installerScript = path.join(
  repoRoot,
  "desktop",
  "installer",
  "swarmsy-desktop.nsi"
);

function ensureExists(targetPath, label = targetPath) {
  if (!fs.existsSync(targetPath)) {
    throw new Error(`${label} does not exist: ${targetPath}`);
  }
}

function nsisDefineValue(value) {
  const defineValue = String(value);
  if (/[\r\n"]/.test(defineValue)) {
    throw new Error(
      "NSIS define values cannot contain quotes or newlines. Check installer paths."
    );
  }
  return defineValue.replace(/\$/g, "$$$$");
}

function resolveMakensis() {
  if (process.env.MAKENSIS_PATH) return process.env.MAKENSIS_PATH;
  return "makensis";
}

function writeInstallerManifest({ makensisPath }) {
  const manifest = {
    productName: "SWARMSY Desktop",
    installer: path.relative(repoRoot, installerOutput).replace(/\\/g, "/"),
    sourceArtifact: path.relative(repoRoot, packageRoot).replace(/\\/g, "/"),
    sourceArchive: path.relative(repoRoot, archivePath).replace(/\\/g, "/"),
    installScope: "per-user",
    defaultInstallDir: "%LOCALAPPDATA%\\Programs\\SWARMSY Desktop",
    desktopExecutable: "SWARMSY Desktop.exe",
    packages: [
      "desktop executable",
      "desktop/electron",
      "desktop/foundation",
      "desktop/runtime",
      "frontend/dist",
      "server runtime",
      "server/node_modules runtime dependencies",
      "server/prisma migrations",
      "server/public frontend bundle",
    ],
    deliberatelyExcluded: [
      "code signing",
      "auto-update",
      "Ollama runtime",
      "AI models",
      "user data",
      ".env files",
      "secrets",
      "credentials",
    ],
    makensisPath,
  };
  fs.writeFileSync(installerManifest, `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}

function buildInstaller({ makensisPath = resolveMakensis() } = {}) {
  ensureExists(installerScript, "NSIS installer script");
  validateArtifact({ packageRoot, archivePath });
  fs.rmSync(installerOutput, { force: true });
  fs.rmSync(installerManifest, { force: true });

  const args = [
    "/V3",
    `/DAPP_SOURCE_DIR=${nsisDefineValue(packageRoot)}`,
    `/DINSTALLER_OUTPUT=${nsisDefineValue(installerOutput)}`,
    installerScript,
  ];
  const result = spawnSync(makensisPath, args, { stdio: "inherit" });
  if (result.error || result.status !== 0) {
    throw result.error || new Error(`makensis exited with ${result.status}`);
  }

  ensureExists(installerOutput, "SWARMSY Desktop installer");
  writeInstallerManifest({ makensisPath });

  console.log(`[desktop:installer] Created ${installerOutput}`);
  console.log(`[desktop:installer] Created ${installerManifest}`);
}

function main() {
  try {
    buildInstaller();
  } catch (error) {
    console.error(`[desktop:installer] ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) main();

module.exports = {
  appName,
  artifactsRoot,
  installerManifest,
  installerOutput,
  installerScript,
  nsisDefineValue,
  packageRoot,
  writeInstallerManifest,
  buildInstaller,
};
