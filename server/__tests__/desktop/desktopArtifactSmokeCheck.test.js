const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  validateArtifact,
} = require("../../../desktop/scripts/desktop-artifact-smoke-check.cjs");

function writeFile(targetPath, contents = "") {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, contents);
}

function createArtifactFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "desktop-artifact-smoke-"));
  const packageRoot = path.join(root, "swarmsy-desktop-win32-x64");
  const archivePath = path.join(root, "swarmsy-desktop-win32-x64.zip");

  writeFile(path.join(packageRoot, "SWARMSY Desktop.exe"), "binary");
  writeFile(path.join(packageRoot, "resources/app/package.json"), "{}");
  writeFile(path.join(packageRoot, "resources/app/desktop/electron/main.cjs"));
  writeFile(path.join(packageRoot, "resources/app/desktop/electron/preload.cjs"));
  writeFile(
    path.join(packageRoot, "resources/app/desktop/foundation/runtimeHealthcheck.cjs")
  );
  writeFile(
    path.join(packageRoot, "resources/app/desktop/foundation/runtimeLauncher.cjs")
  );
  writeFile(
    path.join(
      packageRoot,
      "resources/app/desktop/foundation/storageContractBridge.cjs"
    )
  );
  writeFile(
    path.join(packageRoot, "resources/app/desktop/foundation/localBackupStore.cjs")
  );
  writeFile(
    path.join(packageRoot, "resources/app/desktop/foundation/localSettingsStore.cjs")
  );
  writeFile(
    path.join(
      packageRoot,
      "resources/app/server/utils/swarmsy/localUserStorageContract.js"
    )
  );
  writeFile(path.join(packageRoot, "resources/app/frontend/dist/_index.html"));
  writeFile(path.join(archivePath), "zip");

  return { root, packageRoot, archivePath };
}

function expectSmokeFailure(mutator, expectedMessage) {
  const fixture = createArtifactFixture();
  try {
    mutator(fixture.packageRoot);
    expect(() => validateArtifact(fixture)).toThrow(expectedMessage);
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true });
  }
}

describe("desktop artifact smoke validation", () => {
  it("passes for frontend bundle code strings without hardcoded values", () => {
    const fixture = createArtifactFixture();
    try {
      writeFile(
        path.join(
          fixture.packageRoot,
          "resources/app/frontend/dist/assets/index-test.js"
        ),
        `const labels = {
          apiKey: "API key",
          auth: "auth settings",
          session: "session status",
          token: "token label",
          serverDb: "serverDb",
          dbPath: "dbPath"
        };`
      );
      writeFile(
        path.join(fixture.packageRoot, "resources/app/frontend/dist/security.md"),
        "Generic documentation can mention auth tokens, API keys, and sessions without containing values."
      );

      expect(() => validateArtifact(fixture)).not.toThrow();
    } finally {
      fs.rmSync(fixture.root, { recursive: true, force: true });
    }
  });

  it("fails when an env file is included", () => {
    expectSmokeFailure((packageRoot) => {
      writeFile(
        path.join(packageRoot, "resources/app/frontend/dist/.env.production"),
        "OPENAI_API_KEY=sk-abc123"
      );
    }, /Forbidden secret\/local-data-like file included/);
  });

  it("fails when an OpenAI API key value is hardcoded", () => {
    expectSmokeFailure((packageRoot) => {
      writeFile(
        path.join(packageRoot, "resources/app/frontend/dist/assets/index.js"),
        'OPENAI_API_KEY="sk-liveRealSecretValue1234567890";'
      );
    }, /Hardcoded secret-like value found/);
  });

  it("fails when an Authorization bearer token is hardcoded", () => {
    expectSmokeFailure((packageRoot) => {
      writeFile(
        path.join(packageRoot, "resources/app/frontend/dist/assets/index.js"),
        'const headers = { Authorization: "Bearer abcdefghijklmnopqrstuvwxyz1234567890" };'
      );
    }, /Hardcoded secret-like value found/);
  });

  it("fails when a private key block is included", () => {
    expectSmokeFailure((packageRoot) => {
      writeFile(
        path.join(packageRoot, "resources/app/frontend/dist/assets/index.js"),
        "-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----"
      );
    }, /Hardcoded secret-like value found/);
  });
});
