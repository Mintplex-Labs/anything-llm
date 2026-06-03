#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "../..");
const artifactsRoot = path.join(repoRoot, "desktop", "artifacts");
const appName = "swarmsy-desktop-win32-x64";
const packageRoot = path.join(artifactsRoot, appName);
const appResourcesRoot = path.join(packageRoot, "resources", "app");
const frontendBuildEntry = path.join(
  repoRoot,
  "frontend",
  "dist",
  "_index.html"
);
const electronDistPath = process.env.ELECTRON_DIST_PATH
  ? path.resolve(process.env.ELECTRON_DIST_PATH)
  : "";

const copyEntries = [
  { from: "desktop/electron", to: "desktop/electron" },
  { from: "desktop/foundation", to: "desktop/foundation" },
  { from: "frontend/dist", to: "frontend/dist" },
  {
    from: "server/utils/swarmsy/localUserStorageContract.js",
    to: "server/utils/swarmsy/localUserStorageContract.js",
  },
];

function ensureExists(targetPath, label = targetPath) {
  if (!fs.existsSync(targetPath)) {
    throw new Error(`${label} does not exist: ${targetPath}`);
  }
}

function removeIfExists(targetPath) {
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
  }
}

function copyDirectory(from, to) {
  ensureExists(from);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.cpSync(from, to, {
    recursive: true,
    filter: (source) => {
      const base = path.basename(source).toLowerCase();
      return (
        !base.startsWith(".env") &&
        !base.endsWith(".local") &&
        base !== "node_modules"
      );
    },
  });
}

function writeDesktopPackageJson() {
  const rootPackage = JSON.parse(
    fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")
  );
  const desktopPackage = {
    name: "swarmsy-desktop-artifact",
    productName: "SWARMSY Desktop",
    version: rootPackage.version || "0.0.0",
    private: true,
    main: "desktop/electron/main.cjs",
    description:
      "Unsigned SWARMSY Windows desktop artifact for GitHub Actions manual testing.",
  };
  fs.writeFileSync(
    path.join(appResourcesRoot, "package.json"),
    `${JSON.stringify(desktopPackage, null, 2)}\n`
  );
}

function copyDirectoryContents(from, to) {
  ensureExists(from);
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from)) {
    copyDirectory(path.join(from, entry), path.join(to, entry));
  }
}

function copyElectronRuntime() {
  if (!electronDistPath) {
    throw new Error(
      "ELECTRON_DIST_PATH must point to an extracted Windows Electron runtime."
    );
  }
  ensureExists(electronDistPath, "Electron runtime distribution");
  copyDirectoryContents(electronDistPath, packageRoot);
  const electronExe = path.join(packageRoot, "electron.exe");
  ensureExists(electronExe, "Electron executable");
  fs.renameSync(electronExe, path.join(packageRoot, "SWARMSY Desktop.exe"));
}

function packageAppResources() {
  for (const entry of copyEntries) {
    copyDirectory(
      path.join(repoRoot, entry.from),
      path.join(appResourcesRoot, entry.to)
    );
  }
  writeDesktopPackageJson();
}

function createZipArchive() {
  const archivePath = path.join(artifactsRoot, `${appName}.zip`);
  removeIfExists(archivePath);

  const powershell = process.platform === "win32" ? "powershell" : "pwsh";
  const { spawnSync } = require("child_process");
  const result = spawnSync(
    powershell,
    [
      "-NoProfile",
      "-Command",
      `Compress-Archive -Path '${packageRoot.replace(/'/g, "''")}\\*' -DestinationPath '${archivePath.replace(/'/g, "''")}' -Force`,
    ],
    { stdio: "inherit" }
  );
  if (result.error || result.status !== 0) {
    throw (
      result.error || new Error(`Compress-Archive exited with ${result.status}`)
    );
  }
  ensureExists(archivePath, "Desktop artifact archive");
}

function main() {
  ensureExists(frontendBuildEntry, "Frontend build entry");
  removeIfExists(artifactsRoot);
  fs.mkdirSync(artifactsRoot, { recursive: true });

  copyElectronRuntime();
  fs.mkdirSync(appResourcesRoot, { recursive: true });
  packageAppResources();
  createZipArchive();

  console.log(`[desktop:artifact] Created ${packageRoot}`);
  console.log(
    `[desktop:artifact] Created ${path.join(artifactsRoot, `${appName}.zip`)}`
  );
}

main();
