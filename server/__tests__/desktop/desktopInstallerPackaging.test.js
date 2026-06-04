const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "../../..");
const installerBuilderPath = path.join(
  repoRoot,
  "desktop/scripts/build-windows-installer.cjs"
);
const installerSmokePath = path.join(
  repoRoot,
  "desktop/scripts/desktop-installer-smoke-check.cjs"
);
const artifactSmokePath = path.join(
  repoRoot,
  "desktop/scripts/desktop-artifact-smoke-check.cjs"
);
const installerWorkflowPath = path.join(
  repoRoot,
  ".github/workflows/desktop-installer-build.yml"
);
const nsisInstallerPath = path.join(
  repoRoot,
  "desktop/installer/swarmsy-desktop.nsi"
);

describe("desktop Windows installer packaging foundation", () => {
  it("documents required installer contents and explicit exclusions", () => {
    const builder = require(installerBuilderPath);
    const smoke = require(installerSmokePath);

    expect(builder.installerOutput.endsWith("SWARMSY-Desktop-Setup.exe")).toBe(
      true
    );
    expect(smoke.requiredInstallerContents).toEqual(
      expect.arrayContaining([
        "desktop executable",
        "desktop/electron",
        "desktop/foundation",
        "frontend/dist",
        "server/utils/swarmsy/localUserStorageContract.js",
      ])
    );
    expect(smoke.prohibitedInstallerContents).toEqual(
      expect.arrayContaining([
        "code signing",
        "auto-update",
        "Ollama runtime",
        "AI models",
        "user data",
        ".env files",
        "secrets",
        "credentials",
      ])
    );
  });

  it("uses guarded root npm install while preserving package install/build steps", () => {
    const workflow = fs.readFileSync(installerWorkflowPath, "utf8");

    expect(workflow).toContain("node-version-file: \".nvmrc\"");
    expect(workflow).toContain("Install root dependencies when lockfile exists");
    expect(workflow).toContain("if (Test-Path package-lock.json)");
    expect(workflow).toContain("git diff --quiet -- package-lock.json");
    expect(workflow).toContain(
      "package-lock.json changed during npm ci. Please commit lockfile updates."
    );
    expect(workflow).toContain("elseif (Test-Path npm-shrinkwrap.json)");
    expect(workflow).toContain("git diff --quiet -- npm-shrinkwrap.json");
    expect(workflow).toContain(
      "npm-shrinkwrap.json changed during npm ci. Please commit lockfile updates."
    );
    expect(workflow).toContain("skipping root npm ci");
    expect(workflow).toContain(
      "git diff --quiet -- frontend/yarn.lock server/yarn.lock collector/yarn.lock"
    );
    expect(workflow).toContain("if ($LASTEXITCODE -ne 0)");
    expect(workflow).toContain(
      "yarn.lock files changed during install/build steps. Please commit lockfile updates."
    );
    expect(workflow).toContain("working-directory: frontend");
    expect(workflow).toContain("working-directory: server");
    expect(workflow).toContain("working-directory: collector");
    expect(workflow).toContain("run: yarn install --frozen-lockfile");
    expect(workflow).toContain("run: yarn build");
    expect(workflow).toContain("run: npm run desktop:artifact:package:win");
    expect(workflow).toContain("run: npm run desktop:installer:package:win");
    expect(workflow).toContain(
      "npx --yes jest@29.7.0 server/__tests__/desktop/desktopInstallerPackaging.test.js --runInBand"
    );
  });

  it("removes stale installer outputs before invoking makensis", () => {
    const builderScript = fs.readFileSync(installerBuilderPath, "utf8");
    const validationIndex = builderScript.indexOf(
      "validateArtifact({ packageRoot, archivePath });"
    );
    const installerRemovalIndex = builderScript.indexOf(
      "fs.rmSync(installerOutput, { force: true });"
    );
    const manifestRemovalIndex = builderScript.indexOf(
      "fs.rmSync(installerManifest, { force: true });"
    );
    const makensisIndex = builderScript.indexOf("spawnSync(makensisPath");

    expect(validationIndex).toBeGreaterThan(-1);
    expect(installerRemovalIndex).toBeGreaterThan(validationIndex);
    expect(manifestRemovalIndex).toBeGreaterThan(installerRemovalIndex);
    expect(makensisIndex).toBeGreaterThan(manifestRemovalIndex);
  });

  it("escapes NSIS define values without breaking Windows paths", () => {
    const builder = require(installerBuilderPath);

    expect(builder.nsisDefineValue("C:\\a\\repo\\desktop\\artifacts")).toBe(
      "C:\\a\\repo\\desktop\\artifacts"
    );
    expect(builder.nsisDefineValue("C:\\Users\\me\\SWARMSY$Desktop")).toBe(
      "C:\\Users\\me\\SWARMSY$$Desktop"
    );
    expect(() => builder.nsisDefineValue('C:\\bad"path')).toThrow(
      "NSIS define values cannot contain quotes or newlines"
    );
    expect(() => builder.nsisDefineValue("C:\\bad\npath")).toThrow(
      "NSIS define values cannot contain quotes or newlines"
    );
  });

  it("removes the full installed app tree without touching Local User paths", () => {
    const nsis = fs.readFileSync(nsisInstallerPath, "utf8");
    const uninstallSection = nsis.slice(nsis.indexOf('Section "Uninstall"'));

    expect(uninstallSection).toContain(
      'IfFileExists "$INSTDIR\\SWARMSY Desktop.exe" 0 uninstall_safety_abort'
    );
    expect(uninstallSection).toContain(
      'IfFileExists "$INSTDIR\\Uninstall SWARMSY Desktop.exe" 0 uninstall_safety_abort'
    );
    expect(uninstallSection).toContain(
      'IfFileExists "$INSTDIR\\resources\\app\\package.json" 0 uninstall_safety_abort'
    );
    expect(uninstallSection).toContain(
      "SWARMSY Desktop uninstall aborted because the selected install directory is missing expected SWARMSY application files."
    );
    expect(nsis).toContain(
      'WriteRegStr HKCU "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\SWARMSY Desktop" "DisplayName" "SWARMSY Desktop"'
    );
    expect(nsis).toContain(
      'WriteRegStr HKCU "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\SWARMSY Desktop" "UninstallString" "$\\"$INSTDIR\\Uninstall SWARMSY Desktop.exe$\\""'
    );
    expect(nsis).toContain(
      'WriteRegStr HKCU "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\SWARMSY Desktop" "InstallLocation" "$INSTDIR"'
    );
    expect(nsis).toContain(
      'WriteRegDWORD HKCU "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\SWARMSY Desktop" "NoModify" 1'
    );
    expect(nsis).toContain(
      'WriteRegDWORD HKCU "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\SWARMSY Desktop" "NoRepair" 1'
    );
    expect(uninstallSection).toContain(
      'DeleteRegKey HKCU "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\SWARMSY Desktop"'
    );
    expect(uninstallSection).toContain('RMDir /r "$INSTDIR"');
    expect(uninstallSection).not.toMatch(
      /\$APPDATA|\$LOCALAPPDATA|backups|settings/i
    );
    expect(uninstallSection).not.toMatch(/anythingllm-desktop|local-user-data/i);
  });

  it("generates an unsigned per-user installer from the existing artifact output", () => {
    const tmpRoot = fs.mkdtempSync(
      path.join(os.tmpdir(), "swarmsy-installer-")
    );
    const makensisPath = path.join(
      tmpRoot,
      process.platform === "win32" ? "makensis.cmd" : "makensis"
    );
    const artifactsRoot = path.join(repoRoot, "desktop", "artifacts");
    const packageRoot = path.join(artifactsRoot, "swarmsy-desktop-win32-x64");

    fs.rmSync(artifactsRoot, { recursive: true, force: true });
    fs.mkdirSync(path.join(packageRoot, "resources/app/desktop/electron"), {
      recursive: true,
    });
    fs.mkdirSync(path.join(packageRoot, "resources/app/desktop/foundation"), {
      recursive: true,
    });
    fs.mkdirSync(
      path.join(packageRoot, "resources/app/server/utils/swarmsy"),
      { recursive: true }
    );
    fs.mkdirSync(path.join(packageRoot, "resources/app/frontend/dist"), {
      recursive: true,
    });

    fs.writeFileSync(path.join(packageRoot, "SWARMSY Desktop.exe"), "exe");
    fs.writeFileSync(
      path.join(packageRoot, "resources/app/package.json"),
      JSON.stringify({ main: "desktop/electron/main.cjs" })
    );
    fs.writeFileSync(
      path.join(packageRoot, "resources/app/desktop/electron/main.cjs"),
      "module.exports = {};"
    );
    fs.writeFileSync(
      path.join(packageRoot, "resources/app/desktop/electron/preload.cjs"),
      "module.exports = {};"
    );
    for (const foundationFile of [
      "runtimeHealthcheck.cjs",
      "runtimeLauncher.cjs",
      "storageContractBridge.cjs",
      "localBackupStore.cjs",
      "localSettingsStore.cjs",
    ]) {
      fs.writeFileSync(
        path.join(
          packageRoot,
          "resources/app/desktop/foundation",
          foundationFile
        ),
        "module.exports = {};"
      );
    }
    fs.writeFileSync(
      path.join(
        packageRoot,
        "resources/app/server/utils/swarmsy/localUserStorageContract.js"
      ),
      "module.exports = {};"
    );
    fs.writeFileSync(
      path.join(packageRoot, "resources/app/frontend/dist/_index.html"),
      "<html></html>"
    );
    fs.writeFileSync(
      path.join(artifactsRoot, "swarmsy-desktop-win32-x64.zip"),
      "zip"
    );

    const mockMakensis = process.platform === "win32"
      ? "@echo off\r\nnode -e \"const fs=require('fs'); const arg=process.argv.find(a=>a.startsWith('/DINSTALLER_OUTPUT=')); fs.writeFileSync(arg.slice('/DINSTALLER_OUTPUT='.length).replace(/\\\\/g,'\\\\'), 'installer');\" %*\r\n"
      : "#!/bin/sh\nnode - \"$@\" <<'NODE'\nconst fs = require('fs');\nconst arg = process.argv.find((value) => value.startsWith('/DINSTALLER_OUTPUT='));\nfs.writeFileSync(arg.slice('/DINSTALLER_OUTPUT='.length).replace(/\\\\/g, '\\\\'), 'installer');\nNODE\n";
    fs.writeFileSync(makensisPath, mockMakensis, { mode: 0o755 });

    try {
      const buildResult = spawnSync(
        process.execPath,
        [installerBuilderPath],
        {
          cwd: repoRoot,
          env: { ...process.env, MAKENSIS_PATH: makensisPath },
          encoding: "utf8",
        }
      );
      expect(buildResult.stderr).toBe("");
      expect(buildResult.status).toBe(0);
      expect(
        fs.existsSync(path.join(artifactsRoot, "SWARMSY-Desktop-Setup.exe"))
      ).toBe(true);

      const smokeResult = spawnSync(process.execPath, [installerSmokePath], {
        cwd: repoRoot,
        encoding: "utf8",
      });
      expect(smokeResult.stderr).toBe("");
      expect(smokeResult.status).toBe(0);
    } finally {
      fs.rmSync(artifactsRoot, { recursive: true, force: true });
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    }
  });

  it("keeps installer smoke validation aligned with artifact safety checks", () => {
    const artifactSmoke = require(artifactSmokePath);

    expect(Array.from(artifactSmoke.forbiddenPathSegments)).toEqual(
      expect.arrayContaining(["models", "ollama", "local-user-data"])
    );
    expect(
      artifactSmoke.forbiddenBasenamePatterns.some((pattern) =>
        pattern.test(".env")
      )
    ).toBe(true);
    expect(
      artifactSmoke.hardcodedSecretValuePatterns.some((pattern) =>
        pattern.test("OPENAI_API_KEY=sk-realSecretValue123456789012345")
      )
    ).toBe(true);
  });
});
