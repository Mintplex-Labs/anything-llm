const fs = require("fs");
const os = require("os");
const path = require("path");

const repoRoot = path.resolve(__dirname, "../../..");
const manifestScriptPath = path.join(
  repoRoot,
  "desktop/scripts/generate-release-manifest.cjs"
);
const validationScriptPath = path.join(
  repoRoot,
  "desktop/scripts/validate-release-integrity.cjs"
);
const packageJsonPath = path.join(repoRoot, "package.json");
const installerWorkflowPath = path.join(
  repoRoot,
  ".github/workflows/desktop-installer-build.yml"
);

const { createReleaseManifest, sha256File } = require(manifestScriptPath);
const { validateReleaseIntegrity } = require(validationScriptPath);

let tmpRoot;
let artifactPath;
let installerPath;
let manifestPath;

function writeFixtureFile(targetPath, contents) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, contents);
}

function createFixtureManifest(options = {}) {
  return createReleaseManifest({
    artifactPath,
    installerPath,
    outputPath: manifestPath,
    buildDate: "2026-06-04T00:00:00.000Z",
    commitSha: "abc123",
    version: "9.9.9",
    env: {},
    ...options,
  });
}

function readInstallerUploadPaths() {
  const workflow = fs.readFileSync(installerWorkflowPath, "utf8");
  const uploadBlock = workflow.slice(
    workflow.indexOf("- name: Upload Windows desktop installer")
  );
  return uploadBlock
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("desktop/artifacts/"));
}

describe("desktop release integrity manifest", () => {
  beforeEach(() => {
    tmpRoot = fs.mkdtempSync(path.join(repoRoot, "desktop/artifacts-test-"));
    artifactPath = path.join(tmpRoot, "swarmsy-desktop-win32-x64.zip");
    installerPath = path.join(tmpRoot, "SWARMSY-Desktop-Setup.exe");
    manifestPath = path.join(tmpRoot, "SWARMSY-Desktop-Release.json");
    writeFixtureFile(artifactPath, "artifact zip bytes");
    writeFixtureFile(installerPath, "installer exe bytes");
  });

  afterEach(() => {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  it("generates release manifest metadata and SHA256 hashes", () => {
    const manifest = createFixtureManifest();

    expect(fs.existsSync(manifestPath)).toBe(true);
    expect(manifest).toEqual(
      expect.objectContaining({
        schemaVersion: 1,
        productName: "SWARMSY Desktop",
        version: "9.9.9",
        buildDate: "2026-06-04T00:00:00.000Z",
        commitSha: "abc123",
        artifactSHA256: sha256File(artifactPath),
        installerSHA256: sha256File(installerPath),
        artifact: "swarmsy-desktop-win32-x64.zip",
        installer: "SWARMSY-Desktop-Setup.exe",
        signingStatus: "signing_unavailable",
      })
    );
    expect(path.isAbsolute(manifest.artifact)).toBe(false);
    expect(path.isAbsolute(manifest.installer)).toBe(false);
    expect(manifest.runtime).toEqual(
      expect.objectContaining({
        packaging: "managed_local_node_runtime",
        localDataPreservedOutsideInstallDir: true,
        requiredFiles: expect.arrayContaining([
          "resources/app/desktop/runtime/start-local-runtime.cjs",
          "resources/app/server/index.js",
          "resources/app/server/public/_index.html",
        ]),
        prismaShimCandidates: expect.arrayContaining([
          "resources/app/server/node_modules/.bin/prisma.cmd",
          "resources/app/server/node_modules/.bin/prisma.ps1",
          "resources/app/server/node_modules/.bin/prisma",
        ]),
      })
    );
    expect(manifest.artifacts.desktopZip.sha256).toBe(manifest.artifactSHA256);
    expect(manifest.artifacts.installerExe.sha256).toBe(manifest.installerSHA256);
  });

  it("validates a manifest for untampered artifacts", () => {
    createFixtureManifest();

    expect(() => validateReleaseIntegrity({ manifestPath })).not.toThrow();
  });

  it("fails validation when the desktop artifact is tampered", () => {
    createFixtureManifest();
    fs.appendFileSync(artifactPath, "tampered");

    expect(() => validateReleaseIntegrity({ manifestPath })).toThrow(
      "Desktop artifact zip SHA256 does not match release manifest."
    );
  });

  it("fails validation when the installer is missing", () => {
    createFixtureManifest();
    fs.rmSync(installerPath, { force: true });

    expect(() => validateReleaseIntegrity({ manifestPath })).toThrow(
      "Desktop installer exe is missing"
    );
  });


  it("fails validation when the desktop zip is missing", () => {
    createFixtureManifest();
    fs.rmSync(artifactPath, { force: true });

    expect(() => validateReleaseIntegrity({ manifestPath })).toThrow(
      "Desktop artifact zip is missing"
    );
  });

  it("fails validation when the installer is tampered", () => {
    createFixtureManifest();
    fs.appendFileSync(installerPath, "tampered");

    expect(() => validateReleaseIntegrity({ manifestPath })).toThrow(
      "Desktop installer exe SHA256 does not match release manifest."
    );
  });

  it("validates from self-contained downloaded workflow files", () => {
    createFixtureManifest();
    const downloadRoot = fs.mkdtempSync(path.join(os.tmpdir(), "swarmsy-download-"));
    const downloadedManifest = path.join(downloadRoot, "SWARMSY-Desktop-Release.json");

    try {
      for (const sourcePath of [artifactPath, installerPath, manifestPath]) {
        fs.copyFileSync(sourcePath, path.join(downloadRoot, path.basename(sourcePath)));
      }

      expect(() =>
        validateReleaseIntegrity({ manifestPath: downloadedManifest })
      ).not.toThrow();
    } finally {
      fs.rmSync(downloadRoot, { recursive: true, force: true });
    }
  });

  it("ensures installer workflow uploads every release-manifest-referenced file", () => {
    const manifest = createFixtureManifest();
    const uploadedBasenames = new Set(
      readInstallerUploadPaths().map((uploadPath) => path.basename(uploadPath))
    );

    expect(Array.from(uploadedBasenames)).toEqual(
      expect.arrayContaining([
        "SWARMSY-Desktop-Setup.exe",
        "SWARMSY-Desktop-Setup.manifest.json",
        "SWARMSY-Desktop-Release.json",
        "swarmsy-desktop-win32-x64.zip",
      ])
    );
    expect(uploadedBasenames.has(path.basename(manifest.artifact))).toBe(true);
    expect(uploadedBasenames.has(path.basename(manifest.installer))).toBe(true);
  });

  it("keeps release integrity scripts isolated from Hosted/Admin, backup, and diagnostics behavior", () => {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    const installerWorkflow = fs.readFileSync(installerWorkflowPath, "utf8");

    expect(packageJson.scripts["desktop:release:manifest"]).toBe(
      "node desktop/scripts/generate-release-manifest.cjs"
    );
    expect(packageJson.scripts["desktop:release:validate"]).toBe(
      "node desktop/scripts/validate-release-integrity.cjs"
    );
    expect(installerWorkflow).toContain("Run desktop diagnostics tests");
    expect(installerWorkflow).toContain("Run desktop backup tests");
    expect(installerWorkflow).toContain("Package desktop app artifact");
    expect(installerWorkflow).toContain("Build Windows installer");
    expect(installerWorkflow.indexOf("Validate release integrity manifest")).toBeGreaterThan(
      installerWorkflow.indexOf("Generate release integrity manifest")
    );
    expect(installerWorkflow.indexOf("Upload Windows desktop installer")).toBeGreaterThan(
      installerWorkflow.indexOf("Validate release integrity manifest")
    );
    expect(installerWorkflow).not.toMatch(/hosted|admin|auto-update/i);
  });
});
