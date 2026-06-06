#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { resolveSigningStatus } = require("../signing/signingWorkflowHelpers.cjs");

const repoRoot = path.resolve(__dirname, "../..");
const artifactsRoot = path.join(repoRoot, "desktop", "artifacts");
const artifactZip = path.join(artifactsRoot, "swarmsy-desktop-win32-x64.zip");
const installerExe = path.join(artifactsRoot, "SWARMSY-Desktop-Setup.exe");
const releaseManifest = path.join(artifactsRoot, "SWARMSY-Desktop-Release.json");
const runtimePrismaShimCandidates = [
  "resources/app/server/node_modules/.bin/prisma.cmd",
  "resources/app/server/node_modules/.bin/prisma.ps1",
  "resources/app/server/node_modules/.bin/prisma",
];

const runtimeRequiredFiles = [
  "resources/app/desktop/runtime/start-local-runtime.cjs",
  "resources/app/server/index.js",
  "resources/app/server/package.json",
  "resources/app/server/prisma/schema.prisma",
  "resources/app/server/prisma/migrations/migration_lock.toml",
  "resources/app/server/node_modules/@prisma/client/package.json",
  "resources/app/server/public/_index.html",
];

function ensureExists(targetPath, label = targetPath) {
  if (!fs.existsSync(targetPath)) throw new Error(`${label} is missing: ${targetPath}`);
}

function sha256File(targetPath) {
  const hash = crypto.createHash("sha256");
  const data = fs.readFileSync(targetPath);
  hash.update(data);
  return hash.digest("hex");
}

function readVersion() {
  const rootPackage = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
  return rootPackage.version || "0.0.0";
}

function resolveCommitSha() {
  const envSha = String(process.env.GITHUB_SHA || "").trim();
  if (envSha) return envSha;
  const result = spawnSync("git", ["rev-parse", "HEAD"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  if (result.status === 0) return result.stdout.trim();
  return "unknown";
}

function relativeManifestArtifact(outputPath, targetPath) {
  return path.relative(path.dirname(outputPath), targetPath).replace(/\\/g, "/");
}

function createReleaseManifest({
  artifactPath = artifactZip,
  installerPath = installerExe,
  outputPath = releaseManifest,
  env = process.env,
  buildDate = new Date().toISOString(),
  commitSha = resolveCommitSha(),
  version = readVersion(),
} = {}) {
  ensureExists(artifactPath, "Desktop artifact zip");
  ensureExists(installerPath, "Desktop installer exe");

  const artifactSha256 = sha256File(artifactPath);
  const installerSha256 = sha256File(installerPath);
  const signing = resolveSigningStatus({ env });

  const manifest = {
    schemaVersion: 1,
    productName: "SWARMSY Desktop",
    version,
    buildDate,
    commitSha,
    artifact: relativeManifestArtifact(outputPath, artifactPath),
    installer: relativeManifestArtifact(outputPath, installerPath),
    artifactSHA256: artifactSha256,
    installerSHA256: installerSha256,
    signingStatus: signing.status,
    signingReason: signing.reason,
    signing: {
      status: signing.status,
      reason: signing.reason,
      certificateAvailable: signing.certificateAvailable,
      certificatePathConfigured: signing.certificatePathConfigured,
      signToolConfigured: signing.signToolConfigured,
    },
    runtime: {
      packaging: "managed_local_node_runtime",
      requiredFiles: runtimeRequiredFiles,
      prismaShimCandidates: runtimePrismaShimCandidates,
      localDataPreservedOutsideInstallDir: true,
    },
    artifacts: {
      desktopZip: {
        path: relativeManifestArtifact(outputPath, artifactPath),
        sha256: artifactSha256,
      },
      installerExe: {
        path: relativeManifestArtifact(outputPath, installerPath),
        sha256: installerSha256,
      },
    },
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}

function main() {
  try {
    const manifest = createReleaseManifest();
    console.log(`[desktop:release] Created ${releaseManifest}`);
    console.log(`[desktop:release] signingStatus=${manifest.signingStatus}`);
  } catch (error) {
    console.error(`[desktop:release] ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) main();

module.exports = {
  artifactZip,
  runtimePrismaShimCandidates,
  runtimeRequiredFiles,
  createReleaseManifest,
  installerExe,
  releaseManifest,
  relativeManifestArtifact,
  sha256File,
};
