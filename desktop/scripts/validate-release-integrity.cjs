#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { sha256File, releaseManifest } = require("./generate-release-manifest.cjs");
const { SIGNING_STATUSES } = require("../signing/signingConfigSchema.cjs");

const repoRoot = path.resolve(__dirname, "../..");

function fail(message) {
  throw new Error(message);
}

function resolveFromManifest(manifestPath, manifestArtifactPath) {
  if (!manifestArtifactPath || typeof manifestArtifactPath !== "string") {
    fail("Manifest artifact path is missing or invalid.");
  }
  if (path.isAbsolute(manifestArtifactPath)) {
    fail("Manifest artifact paths must be relative for portable validation.");
  }
  const manifestRelativePath = path.resolve(
    path.dirname(manifestPath),
    manifestArtifactPath
  );
  if (fs.existsSync(manifestRelativePath)) return manifestRelativePath;
  return path.resolve(repoRoot, manifestArtifactPath);
}

function assertSha256(value, label) {
  if (!/^[a-f0-9]{64}$/i.test(String(value || ""))) {
    fail(`${label} must be a SHA256 hex digest.`);
  }
}

function validateReleaseIntegrity({ manifestPath = releaseManifest } = {}) {
  if (!fs.existsSync(manifestPath)) fail(`Release manifest is missing: ${manifestPath}`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

  if (manifest.schemaVersion !== 1) fail("Release manifest schemaVersion must be 1.");
  if (!manifest.version) fail("Release manifest version is missing.");
  if (!manifest.buildDate) fail("Release manifest buildDate is missing.");
  if (!manifest.commitSha) fail("Release manifest commitSha is missing.");

  const allowedStatuses = Object.values(SIGNING_STATUSES);
  if (!allowedStatuses.includes(manifest.signingStatus)) {
    fail(`Release manifest signingStatus must be one of: ${allowedStatuses.join(", ")}.`);
  }

  assertSha256(manifest.artifactSHA256, "artifactSHA256");
  assertSha256(manifest.installerSHA256, "installerSHA256");

  const artifactPath = resolveFromManifest(manifestPath, manifest.artifact);
  const installerPath = resolveFromManifest(manifestPath, manifest.installer);
  if (!fs.existsSync(artifactPath)) fail(`Desktop artifact zip is missing: ${artifactPath}`);
  if (!fs.existsSync(installerPath)) fail(`Desktop installer exe is missing: ${installerPath}`);

  const actualArtifactSha256 = sha256File(artifactPath);
  const actualInstallerSha256 = sha256File(installerPath);
  if (actualArtifactSha256 !== manifest.artifactSHA256) {
    fail("Desktop artifact zip SHA256 does not match release manifest.");
  }
  if (actualInstallerSha256 !== manifest.installerSHA256) {
    fail("Desktop installer exe SHA256 does not match release manifest.");
  }

  return { ok: true, manifestPath, manifest };
}

function main() {
  try {
    validateReleaseIntegrity({ manifestPath: process.argv[2] || releaseManifest });
    console.log("[desktop:release:integrity] Release manifest hashes validated.");
  } catch (error) {
    console.error(`[desktop:release:integrity] ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) main();

module.exports = {
  validateReleaseIntegrity,
};
