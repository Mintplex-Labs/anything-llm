const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const {
  DESKTOP_LOCAL_USER_BACKUP_SCHEMA,
  DESKTOP_LOCAL_USER_BACKUP_VERSION,
  DESKTOP_LOCAL_USER_BACKUP_APP,
  DESKTOP_LOCAL_USER_BACKUP_MODE,
  createBackupFileName,
  resolveBackupFileContext,
  validateLocalUserBackup,
  exportLocalUserBackup,
  importLocalUserBackup,
} = require("../../../desktop/foundation/localBackupStore.cjs");
const {
  setLocalUserSettings,
  getLocalUserSettings,
  resolveSettingsFileContext,
} = require("../../../desktop/foundation/localSettingsStore.cjs");

function createContractOptions(homeDir) {
  return {
    platform: "linux",
    homeDir,
    env: { XDG_CONFIG_HOME: path.posix.join(homeDir, ".xdg") },
  };
}

function validBackup(overrides = {}) {
  return {
    schema: DESKTOP_LOCAL_USER_BACKUP_SCHEMA,
    version: DESKTOP_LOCAL_USER_BACKUP_VERSION,
    exportedAt: "2026-06-03T00:00:00.000Z",
    app: DESKTOP_LOCAL_USER_BACKUP_APP,
    mode: DESKTOP_LOCAL_USER_BACKUP_MODE,
    state: {
      settings: {
        ollamaModel: "llama3.1:8b",
        provider: "ollama",
      },
    },
    ...overrides,
  };
}

describe("desktop filesystem Local User backup store", () => {
  let tmpRoot;

  beforeEach(async () => {
    tmpRoot = await fs.mkdtemp(
      path.join(os.tmpdir(), "swarmsy-desktop-backup-")
    );
  });

  afterEach(async () => {
    await fs.rm(tmpRoot, { recursive: true, force: true });
  });

  it("exports the expected schema under layout.paths.backups", async () => {
    await setLocalUserSettings(
      { ollamaModel: " llama3.1:8b ", provider: "ollama" },
      { contractOptions: createContractOptions(tmpRoot) }
    );

    const result = await exportLocalUserBackup({
      contractOptions: createContractOptions(tmpRoot),
      now: new Date("2026-06-03T00:00:00.000Z"),
    });

    expect(result.ok).toBe(true);
    expect(result.backup).toEqual({
      schema: DESKTOP_LOCAL_USER_BACKUP_SCHEMA,
      version: DESKTOP_LOCAL_USER_BACKUP_VERSION,
      exportedAt: "2026-06-03T00:00:00.000Z",
      app: DESKTOP_LOCAL_USER_BACKUP_APP,
      mode: DESKTOP_LOCAL_USER_BACKUP_MODE,
      state: {
        settings: {
          ollamaModel: "llama3.1:8b",
          provider: "ollama",
        },
      },
    });
    expect(result.path.startsWith(result.backupsDir)).toBe(true);
    const written = JSON.parse(await fs.readFile(result.path, "utf8"));
    expect(written).toEqual(result.backup);
  });

  it("exports only allowlisted desktop settings and excludes secrets/runtime/server data", async () => {
    await setLocalUserSettings(
      { ollamaModel: "phi3:mini", provider: "ollama" },
      { contractOptions: createContractOptions(tmpRoot) }
    );
    const result = await exportLocalUserBackup({
      contractOptions: createContractOptions(tmpRoot),
      now: new Date("2026-06-03T00:00:00.000Z"),
    });

    const serialized = JSON.stringify(result.backup);
    expect(result.backup.state.settings).toEqual({
      ollamaModel: "phi3:mini",
      provider: "ollama",
    });
    for (const forbidden of [
      "authToken",
      "apiKey",
      "sessionToken",
      "runtimeSessionKey",
      "pendingHomeMessage",
      "serverDbPath",
      "hosted",
      "admin",
    ]) {
      expect(serialized).not.toContain(forbidden);
    }
  });

  it("exports safe empty settings state when the settings file is missing", async () => {
    const result = await exportLocalUserBackup({
      contractOptions: createContractOptions(tmpRoot),
      now: new Date("2026-06-03T00:00:00.000Z"),
    });
    expect(result.ok).toBe(true);
    expect(result.backup.state.settings).toEqual({});
  });

  it("rejects corrupt settings instead of exporting unsafe data", async () => {
    const context = await resolveSettingsFileContext({
      contractOptions: createContractOptions(tmpRoot),
    });
    await fs.writeFile(context.settingsFilePath, "{bad-json", "utf8");

    const result = await exportLocalUserBackup({
      contractOptions: createContractOptions(tmpRoot),
    });
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("backup_settings_invalid");
    expect(result.settingsReason).toBe("settings_parse_error");
  });

  it.each([
    ["malformed JSON", "{bad-json", "backup_parse_failed"],
    [
      "wrong schema",
      validBackup({ schema: "bad" }),
      "backup_validation_failed",
    ],
    ["wrong version", validBackup({ version: 2 }), "backup_validation_failed"],
    [
      "wrong app",
      validBackup({ app: "AnythingLLM" }),
      "backup_validation_failed",
    ],
    [
      "wrong mode",
      validBackup({ mode: "hosted_admin" }),
      "backup_validation_failed",
    ],
    [
      "invalid exportedAt",
      validBackup({ exportedAt: "2026-02-30T00:00:00.000Z" }),
      "backup_validation_failed",
    ],
    [
      "unknown top-level field",
      validBackup({ path: "/tmp/evil" }),
      "backup_validation_failed",
    ],
    [
      "unknown state field",
      validBackup({ state: { settings: {}, runtime: {} } }),
      "backup_validation_failed",
    ],
    [
      "unknown settings field",
      validBackup({ state: { settings: { extra: "x" } } }),
      "backup_validation_failed",
    ],
    [
      "forbidden auth field",
      validBackup({ state: { settings: { authToken: "secret" } } }),
      "backup_validation_failed",
    ],
    [
      "hosted/server path field",
      validBackup({ state: { settings: {}, serverDbPath: "/tmp/db" } }),
      "backup_validation_failed",
    ],
  ])("rejects %s", async (_label, payload, reason) => {
    await setLocalUserSettings(
      { ollamaModel: "original", provider: "ollama" },
      { contractOptions: createContractOptions(tmpRoot) }
    );
    const result = await importLocalUserBackup(payload, {
      contractOptions: createContractOptions(tmpRoot),
    });
    expect(result.ok).toBe(false);
    expect(result.reason).toBe(reason);
    const current = await getLocalUserSettings({
      contractOptions: createContractOptions(tmpRoot),
    });
    expect(current.settings.state.ollamaModel).toBe("original");
  });

  it("validates parsed backup objects without writing partial settings", () => {
    const validation = validateLocalUserBackup(
      validBackup({
        state: { settings: { ollamaModel: "ok", apiKey: "secret" } },
      })
    );
    expect(validation.valid).toBe(false);
    expect(validation.errors.join(" ")).toContain("Forbidden");
  });

  it("imports valid backups through localSettingsStore", async () => {
    const result = await importLocalUserBackup(JSON.stringify(validBackup()), {
      contractOptions: createContractOptions(tmpRoot),
    });
    expect(result.ok).toBe(true);

    const current = await getLocalUserSettings({
      contractOptions: createContractOptions(tmpRoot),
    });
    expect(current.settings.state).toEqual({
      ollamaModel: "llama3.1:8b",
      provider: "ollama",
    });
  });

  it("clears existing desktop settings when imported backup omits settings keys", async () => {
    await setLocalUserSettings(
      { ollamaModel: "stale:model", provider: "ollama" },
      { contractOptions: createContractOptions(tmpRoot) }
    );

    const result = await importLocalUserBackup(
      validBackup({ state: { settings: {} } }),
      { contractOptions: createContractOptions(tmpRoot) }
    );
    expect(result.ok).toBe(true);
    expect(result.restoredState).toEqual({
      ollamaModel: null,
      provider: null,
    });

    const current = await getLocalUserSettings({
      contractOptions: createContractOptions(tmpRoot),
    });
    expect(current.settings.state).toEqual({});
  });

  it("does not follow a symlink raced into place before backup file creation", async () => {
    const context = await resolveBackupFileContext({
      contractOptions: createContractOptions(tmpRoot),
      exportedAt: "2026-06-03T00:00:00.000Z",
    });
    const escapeTarget = path.join(tmpRoot, "race-escape-backup.json");
    await fs.writeFile(escapeTarget, "do-not-overwrite", "utf8");

    let didRaceSymlink = false;
    const fsApi = {
      ...fs,
      open: async (filePath, flags, mode) => {
        if (!didRaceSymlink) {
          didRaceSymlink = true;
          await fs.symlink(escapeTarget, filePath);
        }
        return fs.open(filePath, flags, mode);
      },
    };

    const result = await exportLocalUserBackup({
      contractOptions: createContractOptions(tmpRoot),
      fsApi,
      now: new Date("2026-06-03T00:00:00.000Z"),
    });

    expect(result.ok).toBe(false);
    expect(result.reason).toBe("backup_file_unsafe");
    expect(await fs.readFile(escapeTarget, "utf8")).toBe("do-not-overwrite");
  });

  it("rejects backup directory symlinks and backup file symlinks", async () => {
    const context = await resolveBackupFileContext({
      contractOptions: createContractOptions(tmpRoot),
      exportedAt: "2026-06-03T00:00:00.000Z",
    });
    const outsideDir = path.join(tmpRoot, "outside-backups");
    await fs.mkdir(outsideDir, { recursive: true });
    await fs.rm(context.backupsDir, { recursive: true, force: true });
    await fs.symlink(outsideDir, context.backupsDir);

    const dirResult = await exportLocalUserBackup({
      contractOptions: createContractOptions(tmpRoot),
      now: new Date("2026-06-03T00:00:00.000Z"),
    });
    expect(dirResult.ok).toBe(false);
    expect(dirResult.reason).toBe("backup_path_invalid");

    await fs.rm(context.backupsDir, { recursive: true, force: true });
    await fs.mkdir(context.backupsDir, { recursive: true });
    const escapeTarget = path.join(tmpRoot, "escape-backup.json");
    await fs.writeFile(escapeTarget, "{}", "utf8");
    const backupFilePath = path.join(
      context.backupsDir,
      createBackupFileName("2026-06-03T00:00:00.000Z")
    );
    await fs.symlink(escapeTarget, backupFilePath);

    const fileResult = await exportLocalUserBackup({
      contractOptions: createContractOptions(tmpRoot),
      now: new Date("2026-06-03T00:00:00.000Z"),
    });
    expect(fileResult.ok).toBe(false);
    expect(fileResult.reason).toBe("backup_path_invalid");
  });

  it("rejects path traversal and does not write outside the Local User root", async () => {
    const pathApi = {
      ...path,
      resolve: jest.fn(() => path.join(tmpRoot, "outside-backup.json")),
    };

    const contextResult = await resolveBackupFileContext({
      contractOptions: createContractOptions(tmpRoot),
      pathApi,
      exportedAt: "2026-06-03T00:00:00.000Z",
    }).catch((error) => error);
    expect(contextResult).toBeInstanceOf(Error);
    expect(contextResult.message).toContain("Local User data root");
  });
});
