#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "../..");
const requiredFiles = [
  "desktop/electron/main.cjs",
  "desktop/electron/preload.cjs",
  "desktop/foundation/runtimeHealthcheck.cjs",
  "desktop/foundation/storageContractBridge.cjs",
  "desktop/scripts/run-desktop-dev.cjs",
];

const missing = requiredFiles.filter(
  (relativePath) => !fs.existsSync(path.resolve(repoRoot, relativePath))
);
if (missing.length) {
  console.error("[desktop:smoke] Missing desktop foundation files:");
  for (const file of missing) console.error(` - ${file}`);
  process.exit(1);
}

console.log("[desktop:smoke] Desktop wrapper foundation files are present.");
console.log(
  "[desktop:smoke] Install Electron in repo root to run desktop:dev: yarn add --dev electron"
);
