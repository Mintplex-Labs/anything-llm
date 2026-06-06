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
  writeFile(path.join(packageRoot, "resources/app/desktop/runtime/start-local-runtime.cjs"));
  writeFile(path.join(packageRoot, "resources/app/server/index.js"));
  writeFile(path.join(packageRoot, "resources/app/server/package.json"), "{}");
  writeFile(path.join(packageRoot, "resources/app/server/prisma/schema.prisma"));
  writeFile(path.join(packageRoot, "resources/app/server/prisma/migrations/migration_lock.toml"));
  writeFile(path.join(packageRoot, "resources/app/server/node_modules/.bin/prisma"));
  writeFile(path.join(packageRoot, "resources/app/server/node_modules/@prisma/client/package.json"));
  writeFile(
    path.join(
      packageRoot,
      "resources/app/server/utils/swarmsy/localUserStorageContract.js"
    )
  );
  writeFile(path.join(packageRoot, "resources/app/frontend/dist/_index.html"));
  writeFile(path.join(packageRoot, "resources/app/server/public/_index.html"));
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

  it("allows systemSettings-style source field names without secret values", () => {
    const fixture = createArtifactFixture();
    try {
      writeFile(
        path.join(fixture.packageRoot, "resources/app/server/models/systemSettings.js"),
        `module.exports = {
          currentSettings() {
            return {
              AzureOpenAiTokenLimit: process.env.AZURE_OPENAI_TOKEN_LIMIT,
              VoyageAiApiKey: !!process.env.VOYAGEAI_API_KEY,
              JWTSecret: !!process.env.JWT_SECRET,
              hub_api_key: (apiKey) => String(apiKey || ""),
            };
          },
        };`
      );

      expect(() => validateArtifact(fixture)).not.toThrow();
    } finally {
      fs.rmSync(fixture.root, { recursive: true, force: true });
    }
  });

  it("allows vendored node_modules documentation with example secrets", () => {
    const fixture = createArtifactFixture();
    try {
      writeFile(
        path.join(
          fixture.packageRoot,
          "resources/app/server/node_modules/dotenv/README-es.md"
        ),
        `# dotenv examples
OPENAI_API_KEY=sk-exampleDocumentationKey1234567890
AWS_SECRET_ACCESS_KEY=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN
`
      );

      expect(() => validateArtifact(fixture)).not.toThrow();
    } finally {
      fs.rmSync(fixture.root, { recursive: true, force: true });
    }
  });

  it("allows harmless dependency type filenames under node_modules", () => {
    const fixture = createArtifactFixture();
    try {
      writeFile(
        path.join(
          fixture.packageRoot,
          "resources/app/server/node_modules/jose/dist/types/key/generate_secret.d.ts"
        ),
        "export type GenerateSecretOptions = {};"
      );

      expect(() => validateArtifact(fixture)).not.toThrow();
    } finally {
      fs.rmSync(fixture.root, { recursive: true, force: true });
    }
  });

  it("allows vendored node_modules implementation files with secret-like internals", () => {
    const fixture = createArtifactFixture();
    try {
      writeFile(
        path.join(
          fixture.packageRoot,
          "resources/app/server/node_modules/jose/dist/webapi/key/import.js"
        ),
        `export async function importJWK(jwk) {
          const secret = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
          return { jwk, secret };
        }`
      );

      expect(() => validateArtifact(fixture)).not.toThrow();
    } finally {
      fs.rmSync(fixture.root, { recursive: true, force: true });
    }
  });

  it("still fails for secret-like filenames outside dependency internals", () => {
    expectSmokeFailure((packageRoot) => {
      writeFile(
        path.join(packageRoot, "resources/app/desktop/runtime/api-secret.json"),
        "{}"
      );
    }, /Forbidden secret\/local-data-like file included/);
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

  it("fails when app-owned server config hardcodes an API key", () => {
    expectSmokeFailure((packageRoot) => {
      writeFile(
        path.join(packageRoot, "resources/app/server/config/leaked.js"),
        'module.exports = { OPENAI_API_KEY: "sk-liveRealSecretValue1234567890" };'
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

  it.each([
    "resources/app/server/storage/anythingllm.db",
    "resources/app/server/documents/private.txt",
    "resources/app/server/vector-cache/cache.json",
    "resources/app/session-store/session.json",
    "resources/app/local-user-data/runtime/anythingllm.db",
  ])("fails when forbidden local data path is included: %s", (relativePath) => {
    expectSmokeFailure((packageRoot) => {
      writeFile(path.join(packageRoot, relativePath), "local-data");
    }, /Forbidden local\/runtime path included/);
  });
});
