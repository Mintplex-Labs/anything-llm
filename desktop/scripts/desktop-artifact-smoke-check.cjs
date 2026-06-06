#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "../..");
const artifactsRoot = path.join(repoRoot, "desktop", "artifacts");
const appName = "swarmsy-desktop-win32-x64";
const defaultPackageRoot = path.join(artifactsRoot, appName);
const defaultArchivePath = path.join(artifactsRoot, `${appName}.zip`);

const requiredPaths = [
  "SWARMSY Desktop.exe",
  "resources/app/package.json",
  "resources/app/desktop/electron/main.cjs",
  "resources/app/desktop/electron/preload.cjs",
  "resources/app/desktop/foundation/runtimeHealthcheck.cjs",
  "resources/app/desktop/foundation/runtimeLauncher.cjs",
  "resources/app/desktop/runtime/start-local-runtime.cjs",
  "resources/app/desktop/foundation/storageContractBridge.cjs",
  "resources/app/server/index.js",
  "resources/app/server/package.json",
  "resources/app/server/prisma/schema.prisma",
  "resources/app/server/prisma/migrations/migration_lock.toml",
  "resources/app/server/node_modules/@prisma/client/package.json",
  "resources/app/server/utils/swarmsy/localUserStorageContract.js",
  "resources/app/desktop/foundation/localBackupStore.cjs",
  "resources/app/desktop/foundation/localSettingsStore.cjs",
  "resources/app/frontend/dist/_index.html",
  "resources/app/server/public/_index.html",
];

const requiredAnyPaths = [
  [
    "resources/app/server/node_modules/.bin/prisma.cmd",
    "resources/app/server/node_modules/.bin/prisma.ps1",
    "resources/app/server/node_modules/.bin/prisma",
  ],
];

const forbiddenPathFragments = [
  "server/storage",
  "server/documents",
  "server/vector-cache",
  "collector/hotdir",
  ".anythingllm-desktop",
  "local-user-data",
  "session-store",
  "ollama/models",
  "comfyui/models",
];

const forbiddenEnvBasenamePatterns = [/^\.env(?:\..*)?$/i, /\.local$/i];
const forbiddenSecretBasenamePatterns = [
  /(?:^|[-_.])(secret|credential|api[-_]?key|access[-_]?token|refresh[-_]?token)(?:[-_.]|$)/i,
];
const forbiddenBasenamePatterns = [
  ...forbiddenEnvBasenamePatterns,
  ...forbiddenSecretBasenamePatterns,
];

const textExtensions = new Set([
  ".cjs",
  ".js",
  ".json",
  ".html",
  ".css",
  ".txt",
  ".md",
  ".markdown",
  ".rst",
]);

const hardcodedSecretValuePatterns = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\bprivate_key\b\s*[:=]\s*["']?-----BEGIN [A-Z ]*PRIVATE KEY-----/i,
  /\bAuthorization\b\s*[:=]\s*["']?Bearer\s+[A-Za-z0-9._~+/-]{32,}={0,2}["']?/i,
  /\bAWS_ACCESS_KEY_ID\b\s*[:=]\s*["']?AKIA[0-9A-Z]{16}["']?/,
  /\bAWS_SECRET_ACCESS_KEY\b\s*[:=]\s*["']?[A-Za-z0-9/+=]{40}["']?/,
  /\b(?:OPENAI|ANTHROPIC|GEMINI|GROQ|AZURE|PINECONE|QDRANT|MILVUS|WEAVIATE|POSTHOG)[A-Z0-9_]*(?:API[_-]?KEY|TOKEN|SECRET|CREDENTIAL)[A-Z0-9_]*\b\s*[:=]\s*(?:["']?sk-(?!my|123|example|xxxx|cp-\.\.\.)(?:proj-)?[A-Za-z0-9_-]{12,}["']?|["'][A-Za-z0-9._~+/-]{32,}={0,2}["'])/i,
  /\b(?:apiKey|api[_-]?key|authToken|auth[_-]?token|accessToken|access[_-]?token|refreshToken|refresh[_-]?token|sessionToken|session[_-]?token|token|secret|credential)\b\s*[:=]\s*["'](?:sk-(?!my|123|example|xxxx|cp-\.\.\.)(?:proj-)?[A-Za-z0-9_-]{12,}|gh[pousr]_[A-Za-z0-9_]{20,}|[A-Za-z0-9._~+/-]{40,}={0,2})["']/i,
];

function fail(message) {
  throw new Error(message);
}

function displayPath(packageRoot, file) {
  return path.relative(packageRoot, file) || file;
}

function assertExists(packageRoot, relativePath) {
  const target = path.join(packageRoot, relativePath);
  if (!fs.existsSync(target)) {
    fail(`Missing expected desktop artifact path: ${relativePath}`);
  }
}

function assertAnyExists(packageRoot, relativePaths) {
  if (
    !relativePaths.some((relativePath) =>
      fs.existsSync(path.join(packageRoot, relativePath))
    )
  ) {
    fail(
      `Missing one of expected desktop artifact paths: ${relativePaths.join(
        ", "
      )}`
    );
  }
}

function walk(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(absolute, files);
    } else {
      files.push(absolute);
    }
  }
  return files;
}

function isNodeModulesSourceFile(relativePortable) {
  if (!relativePortable.includes("/node_modules/")) return false;
  return /\.(?:c|m)?(?:d\.)?ts$|\.(?:c|m)?js$|\.map$/i.test(
    relativePortable
  );
}

function hasForbiddenBasename(file, packageRoot) {
  const basename = path.basename(file);
  const relativePortable = path
    .relative(packageRoot, file)
    .replace(/\\/g, "/")
    .toLowerCase();

  if (forbiddenEnvBasenamePatterns.some((pattern) => pattern.test(basename))) {
    return true;
  }

  if (isNodeModulesSourceFile(relativePortable)) return false;

  return forbiddenSecretBasenamePatterns.some((pattern) =>
    pattern.test(basename)
  );
}

function assertNoForbiddenPaths(files, packageRoot) {
  for (const file of files) {
    const relativePortable = path
      .relative(packageRoot, file)
      .replace(/\\/g, "/")
      .toLowerCase();
    for (const fragment of forbiddenPathFragments) {
      if (relativePortable.includes(fragment)) {
        fail(
          `Forbidden local/runtime path included in artifact: ${displayPath(
            packageRoot,
            file
          )}`
        );
      }
    }

    if (hasForbiddenBasename(file, packageRoot)) {
      fail(
        `Forbidden secret/local-data-like file included: ${displayPath(
          packageRoot,
          file
        )}`
      );
    }
  }
}

function isNodeModulesFile(relativePortable) {
  return relativePortable.includes("/node_modules/");
}

function assertNoSecretValues(files, packageRoot) {
  for (const file of files) {
    const relativePortable = path
      .relative(packageRoot, file)
      .replace(/\\/g, "/")
      .toLowerCase();
    if (isNodeModulesFile(relativePortable)) continue;
    if (!textExtensions.has(path.extname(file).toLowerCase())) continue;
    const stat = fs.statSync(file);
    if (stat.size > 2 * 1024 * 1024) continue;
    const contents = fs.readFileSync(file, "utf8");
    for (const pattern of hardcodedSecretValuePatterns) {
      if (pattern.test(contents)) {
        fail(
          `Hardcoded secret-like value found in ${displayPath(
            packageRoot,
            file
          )}`
        );
      }
    }
  }
}

function validateArtifact({
  packageRoot = defaultPackageRoot,
  archivePath = defaultArchivePath,
} = {}) {
  const appResourcesRoot = path.join(packageRoot, "resources", "app");

  if (!fs.existsSync(packageRoot)) {
    fail(`Artifact directory is missing: ${packageRoot}`);
  }
  if (!fs.existsSync(archivePath)) {
    fail(`Artifact archive is missing: ${archivePath}`);
  }
  for (const relativePath of requiredPaths) assertExists(packageRoot, relativePath);
  for (const relativePaths of requiredAnyPaths) {
    assertAnyExists(packageRoot, relativePaths);
  }

  const files = walk(packageRoot);
  if (
    !files.some((file) =>
      file.startsWith(path.join(appResourcesRoot, "frontend", "dist"))
    )
  ) {
    fail("Frontend build assets are missing from artifact resources.");
  }
  assertNoForbiddenPaths(files, packageRoot);
  assertNoSecretValues(files, packageRoot);
}

function main() {
  try {
    validateArtifact();
    console.log(
      "[desktop:artifact:smoke] Windows desktop artifact structure and safety checks passed."
    );
  } catch (error) {
    console.error(`[desktop:artifact:smoke] ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) main();

module.exports = {
  hardcodedSecretValuePatterns,
  forbiddenBasenamePatterns,
  forbiddenEnvBasenamePatterns,
  forbiddenPathFragments,
  forbiddenSecretBasenamePatterns,
  hasForbiddenBasename,
  isNodeModulesFile,
  isNodeModulesSourceFile,
  requiredAnyPaths,
  requiredPaths,
  validateArtifact,
};
