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
  "resources/app/desktop/foundation/storageContractBridge.cjs",
  "resources/app/server/utils/swarmsy/localUserStorageContract.js",
  "resources/app/desktop/foundation/localBackupStore.cjs",
  "resources/app/desktop/foundation/localSettingsStore.cjs",
  "resources/app/frontend/dist/_index.html",
];

const forbiddenPathSegments = new Set([
  ".anythingllm-desktop",
  "storage",
  "documents",
  "vector-cache",
  "hotdir",
  "models",
  "ollama",
  "local-user-data",
  "session-store",
]);

const forbiddenBasenamePatterns = [
  /^\.env(?:\..*)?$/i,
  /\.local$/i,
  /(?:^|[-_.])(secret|credential|api[-_]?key|access[-_]?token|refresh[-_]?token)(?:[-_.]|$)/i,
];

const textExtensions = new Set([
  ".cjs",
  ".js",
  ".json",
  ".html",
  ".css",
  ".txt",
  ".md",
]);

const hardcodedSecretValuePatterns = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\bprivate_key\b\s*[:=]\s*["']?-----BEGIN [A-Z ]*PRIVATE KEY-----/i,
  /\bAuthorization\b\s*[:=]\s*["']?Bearer\s+[A-Za-z0-9._~+/-]{32,}={0,2}["']?/i,
  /\bAWS_ACCESS_KEY_ID\b\s*[:=]\s*["']?AKIA[0-9A-Z]{16}["']?/,
  /\bAWS_SECRET_ACCESS_KEY\b\s*[:=]\s*["']?[A-Za-z0-9/+=]{40}["']?/,
  /\b(?:OPENAI|ANTHROPIC|GEMINI|GROQ|AZURE|PINECONE|QDRANT|MILVUS|WEAVIATE|POSTHOG)[A-Z0-9_]*(?:API[_-]?KEY|TOKEN|SECRET|CREDENTIAL)[A-Z0-9_]*\b\s*[:=]\s*["']?(?:sk-(?!my|123|example|xxxx|cp-\.\.\.)(?:proj-)?[A-Za-z0-9_-]{12,}|[A-Za-z0-9._~+/-]{32,}={0,2})["']?/i,
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

function assertNoForbiddenPaths(files, packageRoot) {
  for (const file of files) {
    const relativeSegments = path.relative(packageRoot, file).split(path.sep);
    for (const segment of relativeSegments) {
      if (forbiddenPathSegments.has(segment.toLowerCase())) {
        fail(
          `Forbidden local/runtime path included in artifact: ${displayPath(
            packageRoot,
            file
          )}`
        );
      }
    }

    const basename = path.basename(file);
    if (forbiddenBasenamePatterns.some((pattern) => pattern.test(basename))) {
      fail(
        `Forbidden secret/local-data-like file included: ${displayPath(
          packageRoot,
          file
        )}`
      );
    }
  }
}

function assertNoSecretValues(files, packageRoot) {
  for (const file of files) {
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
  forbiddenPathSegments,
  requiredPaths,
  validateArtifact,
};
