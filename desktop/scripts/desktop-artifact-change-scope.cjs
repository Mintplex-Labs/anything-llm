#!/usr/bin/env node
const fs = require("fs");
const { execFileSync } = require("child_process");

const FULL_BUILD_PREFIXES = ["desktop/", "frontend/", "server/"];
const FULL_BUILD_FILES = new Set([
  ".github/workflows/desktop-artifact-build.yml",
  "package-lock.json",
]);
const PACKAGE_FIELDS = [
  "version",
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies",
  "overrides",
  "resolutions",
];

function stableValue(value) {
  return JSON.stringify(value ?? null);
}

function relevantDesktopScripts(packageJson = {}) {
  return Object.fromEntries(
    Object.entries(packageJson.scripts || {}).filter(
      ([name]) => name.startsWith("desktop:") || name === "prod:frontend"
    )
  );
}

function packageChangeRequiresFullBuild(basePackage, headPackage) {
  if (!basePackage || !headPackage) return true;
  if (
    PACKAGE_FIELDS.some(
      (field) =>
        stableValue(basePackage[field]) !== stableValue(headPackage[field])
    )
  ) {
    return true;
  }

  return (
    stableValue(relevantDesktopScripts(basePackage)) !==
    stableValue(relevantDesktopScripts(headPackage))
  );
}

function requiresFullBuild({
  eventName = "pull_request",
  files = [],
  basePackage = null,
  headPackage = null,
} = {}) {
  if (eventName !== "pull_request") return true;

  const normalizedFiles = files.map((file) =>
    String(file || "").replace(/\\/g, "/")
  );
  if (
    normalizedFiles.some(
      (file) =>
        FULL_BUILD_FILES.has(file) ||
        FULL_BUILD_PREFIXES.some((prefix) => file.startsWith(prefix))
    )
  ) {
    return true;
  }

  if (normalizedFiles.includes("package.json")) {
    return packageChangeRequiresFullBuild(basePackage, headPackage);
  }

  return false;
}

function readChangedFiles(baseSha, headSha) {
  return execFileSync("git", ["diff", "--name-only", baseSha, headSha], {
    encoding: "utf8",
  })
    .split(/\r?\n/)
    .map((file) => file.trim())
    .filter(Boolean);
}

function readPackageAt(ref) {
  return JSON.parse(
    execFileSync("git", ["show", `${ref}:package.json`], {
      encoding: "utf8",
    })
  );
}

function writeOutput(fullBuild) {
  const line = `full_build=${fullBuild ? "true" : "false"}\n`;
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, line);
  } else {
    process.stdout.write(line);
  }
}

function main() {
  const eventName = process.env.GITHUB_EVENT_NAME || "";
  if (eventName !== "pull_request") {
    writeOutput(true);
    return;
  }

  const baseSha = String(process.env.DESKTOP_BUILD_BASE_SHA || "").trim();
  const headSha = String(process.env.DESKTOP_BUILD_HEAD_SHA || "").trim();
  if (!baseSha || !headSha) {
    console.warn(
      "[desktop:artifact:scope] Missing pull request refs; failing closed to a full artifact build."
    );
    writeOutput(true);
    return;
  }

  try {
    const files = readChangedFiles(baseSha, headSha);
    const includesPackage = files.includes("package.json");
    const basePackage = includesPackage ? readPackageAt(baseSha) : null;
    const headPackage = includesPackage ? readPackageAt(headSha) : null;
    const fullBuild = requiresFullBuild({
      eventName,
      files,
      basePackage,
      headPackage,
    });
    console.log(
      `[desktop:artifact:scope] full_build=${fullBuild} changed_files=${files.join(",")}`
    );
    writeOutput(fullBuild);
  } catch (error) {
    console.warn(
      `[desktop:artifact:scope] Scope detection failed; running the full build: ${error.message}`
    );
    writeOutput(true);
  }
}

if (require.main === module) main();

module.exports = {
  FULL_BUILD_FILES,
  FULL_BUILD_PREFIXES,
  PACKAGE_FIELDS,
  packageChangeRequiresFullBuild,
  relevantDesktopScripts,
  requiresFullBuild,
};
