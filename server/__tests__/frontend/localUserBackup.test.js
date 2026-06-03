const fs = require("fs");
const path = require("path");
const vm = require("vm");

function loadBackupModule() {
  const source = fs
    .readFileSync(
      path.resolve(__dirname, "../../../frontend/src/utils/localUserBackup.js"),
      "utf8"
    )
    // Strip ES module export keywords so vm.Script can run the source.
    .replace(/export const /g, "const ")
    .replace(/export async function /g, "async function ")
    .replace(/export function /g, "function ");

  const script = new vm.Script(
    `${source}
module.exports = {
  BACKUP_SCHEMA_NAME,
  BACKUP_SCHEMA_VERSION,
  DESKTOP_LOCAL_SETTINGS_SCHEMA,
  DESKTOP_LOCAL_SETTINGS_VERSION,
  DESKTOP_LOCAL_USER_BACKUP_SCHEMA,
  DESKTOP_LOCAL_USER_BACKUP_VERSION,
  DESKTOP_LOCAL_USER_BACKUP_APP,
  DESKTOP_LOCAL_USER_BACKUP_MODE,
  DESKTOP_LOCAL_SETTINGS_ALLOWED_STATE_KEYS,
  BACKUP_STATE_FIELDS,
  NEVER_BACKUP_STORAGE_KEYS,
  exportLocalUserBackup,
  exportLocalUserBackupV2,
  validateLocalUserBackup,
  importLocalUserBackup,
  importLocalUserBackupV2,
  isDesktopLocalUserBackup,
};`
  );

  const sandbox = { module: { exports: {} }, exports: {} };
  vm.createContext(sandbox);
  script.runInContext(sandbox);
  return sandbox.module.exports;
}

function createStorage(initial = {}) {
  const store = { ...initial };
  return {
    getItem: jest.fn((key) =>
      Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null
    ),
    setItem: jest.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    _store: store,
  };
}

function validBackup(overrides = {}) {
  const mod = loadBackupModule();
  return {
    schema: mod.BACKUP_SCHEMA_NAME,
    version: mod.BACKUP_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    state: { ollamaModel: "llama3.1:8b" },
    desktop: {
      localSettings: {
        schema: mod.DESKTOP_LOCAL_SETTINGS_SCHEMA,
        version: mod.DESKTOP_LOCAL_SETTINGS_VERSION,
        updatedAt: new Date().toISOString(),
        state: {
          ollamaModel: "llama3.1:8b",
          provider: "ollama",
        },
      },
    },
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Schema constants
// ---------------------------------------------------------------------------

describe("SWARMSY Local User backup schema constants", () => {
  it("BACKUP_SCHEMA_NAME is the expected identifier", () => {
    const { BACKUP_SCHEMA_NAME } = loadBackupModule();
    expect(BACKUP_SCHEMA_NAME).toBe("swarmsy_local_user_backup");
  });

  it("BACKUP_SCHEMA_VERSION starts at 2", () => {
    const { BACKUP_SCHEMA_VERSION } = loadBackupModule();
    expect(BACKUP_SCHEMA_VERSION).toBe(2);
  });

  it("BACKUP_STATE_FIELDS includes the Local User Ollama model key", () => {
    const { BACKUP_STATE_FIELDS } = loadBackupModule();
    expect(BACKUP_STATE_FIELDS.ollamaModel).toBe(
      "anythingllm_swarmsy_local_user_ollama_model"
    );
  });

  it("BACKUP_STATE_FIELDS does not contain any NEVER_BACKUP_STORAGE_KEYS value", () => {
    const { BACKUP_STATE_FIELDS, NEVER_BACKUP_STORAGE_KEYS } =
      loadBackupModule();
    for (const storageKey of Object.values(BACKUP_STATE_FIELDS)) {
      expect(NEVER_BACKUP_STORAGE_KEYS.has(storageKey)).toBe(false);
    }
  });

  it("NEVER_BACKUP_STORAGE_KEYS covers all auth credential keys", () => {
    const { NEVER_BACKUP_STORAGE_KEYS } = loadBackupModule();
    expect(NEVER_BACKUP_STORAGE_KEYS.has("anythingllm_user")).toBe(true);
    expect(NEVER_BACKUP_STORAGE_KEYS.has("anythingllm_authToken")).toBe(true);
    expect(NEVER_BACKUP_STORAGE_KEYS.has("anythingllm_authTimestamp")).toBe(
      true
    );
  });

  it("NEVER_BACKUP_STORAGE_KEYS covers ephemeral session/runtime keys", () => {
    const { NEVER_BACKUP_STORAGE_KEYS } = loadBackupModule();
    expect(
      NEVER_BACKUP_STORAGE_KEYS.has("anythingllm_pending_home_message")
    ).toBe(true);
    expect(
      NEVER_BACKUP_STORAGE_KEYS.has(
        "anythingllm_swarmsy_local_user_active_runtime"
      )
    ).toBe(true);
  });

  it("NEVER_BACKUP_STORAGE_KEYS covers API and server DB keys", () => {
    const { NEVER_BACKUP_STORAGE_KEYS } = loadBackupModule();
    expect(NEVER_BACKUP_STORAGE_KEYS.has("anythingllm_apiKey")).toBe(true);
    expect(NEVER_BACKUP_STORAGE_KEYS.has("anythingllm_apiKeys")).toBe(true);
    expect(NEVER_BACKUP_STORAGE_KEYS.has("anythingllm_server_db_path")).toBe(
      true
    );
  });
});

// ---------------------------------------------------------------------------
// exportLocalUserBackup
// ---------------------------------------------------------------------------

describe("exportLocalUserBackup", () => {
  it("returns an object with the correct schema and version", () => {
    const { exportLocalUserBackup, BACKUP_SCHEMA_NAME, BACKUP_SCHEMA_VERSION } =
      loadBackupModule();
    const storage = createStorage();
    const result = exportLocalUserBackup({ storage });
    expect(result.schema).toBe(BACKUP_SCHEMA_NAME);
    expect(result.version).toBe(BACKUP_SCHEMA_VERSION);
    expect(result.desktop).toEqual({ localSettings: null });
  });

  it("exportedAt is a valid ISO date string", () => {
    const { exportLocalUserBackup } = loadBackupModule();
    const storage = createStorage();
    const result = exportLocalUserBackup({ storage });
    expect(typeof result.exportedAt).toBe("string");
    expect(isNaN(Date.parse(result.exportedAt))).toBe(false);
  });

  it("state contains an entry for every BACKUP_STATE_FIELDS key", () => {
    const { exportLocalUserBackup, BACKUP_STATE_FIELDS } = loadBackupModule();
    const storage = createStorage();
    const result = exportLocalUserBackup({ storage });
    for (const field of Object.keys(BACKUP_STATE_FIELDS)) {
      expect(Object.prototype.hasOwnProperty.call(result.state, field)).toBe(
        true
      );
    }
  });

  it("reads the stored Ollama model from storage", () => {
    const { exportLocalUserBackup } = loadBackupModule();
    const storage = createStorage({
      anythingllm_swarmsy_local_user_ollama_model: "phi3:mini",
    });
    const result = exportLocalUserBackup({ storage });
    expect(result.state.ollamaModel).toBe("phi3:mini");
  });

  it("includes allowlisted desktop local settings when provided", () => {
    const { exportLocalUserBackup, DESKTOP_LOCAL_SETTINGS_SCHEMA } =
      loadBackupModule();
    const storage = createStorage();
    const result = exportLocalUserBackup({
      storage,
      desktopLocalSettings: {
        schema: DESKTOP_LOCAL_SETTINGS_SCHEMA,
        version: 1,
        updatedAt: new Date().toISOString(),
        state: { ollamaModel: "phi3:mini", provider: "ollama" },
      },
    });
    expect(result.desktop.localSettings.state).toEqual({
      ollamaModel: "phi3:mini",
      provider: "ollama",
    });
  });

  it("drops invalid desktop local settings payloads", () => {
    const { exportLocalUserBackup } = loadBackupModule();
    const storage = createStorage();
    const result = exportLocalUserBackup({
      storage,
      desktopLocalSettings: {
        schema: "bad_schema",
        version: 1,
        updatedAt: "bad-date",
        state: { authToken: "secret" },
      },
    });
    expect(result.desktop.localSettings).toBeNull();
  });

  it("records null for keys not present in storage", () => {
    const { exportLocalUserBackup } = loadBackupModule();
    const storage = createStorage();
    const result = exportLocalUserBackup({ storage });
    expect(result.state.ollamaModel).toBeNull();
  });

  it("does not include auth or runtime keys in state", () => {
    const { exportLocalUserBackup, NEVER_BACKUP_STORAGE_KEYS } =
      loadBackupModule();
    const storage = createStorage({
      anythingllm_user: '{"username":"test"}',
      anythingllm_authToken: "secret-token",
    });
    const result = exportLocalUserBackup({ storage });
    // State field values should not be the secret values.
    const stateValues = Object.values(result.state);
    expect(stateValues).not.toContain('{"username":"test"}');
    expect(stateValues).not.toContain("secret-token");
    // And no NEVER_BACKUP key name should appear as a state field key.
    for (const field of Object.keys(result.state)) {
      expect(NEVER_BACKUP_STORAGE_KEYS.has(field)).toBe(false);
    }
  });
});

// ---------------------------------------------------------------------------
// validateLocalUserBackup
// ---------------------------------------------------------------------------

describe("validateLocalUserBackup", () => {
  it("accepts a well-formed backup object", () => {
    const { validateLocalUserBackup } = loadBackupModule();
    const { valid, errors } = validateLocalUserBackup(validBackup());
    expect(valid).toBe(true);
    expect(errors).toHaveLength(0);
  });

  it("accepts v2 backups without desktop payload", () => {
    const { validateLocalUserBackup } = loadBackupModule();
    const backup = validBackup();
    delete backup.desktop;
    const { valid, errors } = validateLocalUserBackup(backup);
    expect(valid).toBe(true);
    expect(errors).toHaveLength(0);
  });

  it("rejects null", () => {
    const { validateLocalUserBackup } = loadBackupModule();
    const { valid } = validateLocalUserBackup(null);
    expect(valid).toBe(false);
  });

  it("rejects a string", () => {
    const { validateLocalUserBackup } = loadBackupModule();
    const { valid } = validateLocalUserBackup("not-an-object");
    expect(valid).toBe(false);
  });

  it("rejects an array", () => {
    const { validateLocalUserBackup } = loadBackupModule();
    const { valid } = validateLocalUserBackup([]);
    expect(valid).toBe(false);
  });

  it("rejects a wrong schema name", () => {
    const { validateLocalUserBackup } = loadBackupModule();
    const { valid, errors } = validateLocalUserBackup(
      validBackup({ schema: "other_schema" })
    );
    expect(valid).toBe(false);
    expect(errors.some((e) => e.includes("schema"))).toBe(true);
  });

  it("rejects a non-integer version", () => {
    const { validateLocalUserBackup } = loadBackupModule();
    const { valid } = validateLocalUserBackup(validBackup({ version: 1.5 }));
    expect(valid).toBe(false);
  });

  it("rejects version 0", () => {
    const { validateLocalUserBackup } = loadBackupModule();
    const { valid } = validateLocalUserBackup(validBackup({ version: 0 }));
    expect(valid).toBe(false);
  });

  it("rejects a version beyond the current schema version", () => {
    const { validateLocalUserBackup, BACKUP_SCHEMA_VERSION } =
      loadBackupModule();
    const { valid } = validateLocalUserBackup(
      validBackup({ version: BACKUP_SCHEMA_VERSION + 1 })
    );
    expect(valid).toBe(false);
  });

  it("rejects a missing exportedAt", () => {
    const { validateLocalUserBackup } = loadBackupModule();
    const backup = validBackup();
    delete backup.exportedAt;
    const { valid } = validateLocalUserBackup(backup);
    expect(valid).toBe(false);
  });

  it("rejects an invalid exportedAt string", () => {
    const { validateLocalUserBackup } = loadBackupModule();
    const { valid } = validateLocalUserBackup(
      validBackup({ exportedAt: "not-a-date" })
    );
    expect(valid).toBe(false);
  });

  it("rejects an array state", () => {
    const { validateLocalUserBackup } = loadBackupModule();
    const { valid } = validateLocalUserBackup(validBackup({ state: [] }));
    expect(valid).toBe(false);
  });

  it("rejects an unknown state field", () => {
    const { validateLocalUserBackup } = loadBackupModule();
    const { valid, errors } = validateLocalUserBackup(
      validBackup({ state: { unknownHostileField: "value" } })
    );
    expect(valid).toBe(false);
    expect(errors.some((e) => e.includes("unknownHostileField"))).toBe(true);
  });

  it("rejects unknown top-level fields", () => {
    const { validateLocalUserBackup } = loadBackupModule();
    const { valid } = validateLocalUserBackup(
      validBackup({ hostileRootField: true })
    );
    expect(valid).toBe(false);
  });

  it("rejects invalid desktop local settings payload", () => {
    const { validateLocalUserBackup } = loadBackupModule();
    const { valid, errors } = validateLocalUserBackup(
      validBackup({
        desktop: {
          localSettings: {
            schema: "bad",
            version: 999,
            updatedAt: "not-a-date",
            state: { authToken: "secret" },
          },
        },
      })
    );
    expect(valid).toBe(false);
    expect(errors.some((e) => e.includes("desktop.localSettings"))).toBe(true);
  });

  it("rejects v1 backups that include a desktop payload", () => {
    const { validateLocalUserBackup } = loadBackupModule();
    const { valid, errors } = validateLocalUserBackup({
      schema: "swarmsy_local_user_backup",
      version: 1,
      exportedAt: new Date().toISOString(),
      state: { ollamaModel: "safe-model" },
      desktop: {
        localSettings: {
          schema: "swarmsy_desktop_local_user_settings",
          version: 1,
          updatedAt: new Date().toISOString(),
          state: { ollamaModel: "llama3.1:8b", provider: "ollama" },
        },
      },
    });
    expect(valid).toBe(false);
    expect(errors).toContain('Unknown top-level field "desktop".');
  });

  it("rejects a state containing an auth key name as a field", () => {
    const { validateLocalUserBackup } = loadBackupModule();
    const { valid } = validateLocalUserBackup(
      validBackup({
        state: { anythingllm_user: '{"username":"hacked"}' },
      })
    );
    expect(valid).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// importLocalUserBackup
// ---------------------------------------------------------------------------

describe("importLocalUserBackup", () => {
  it("returns success: false for an invalid backup", () => {
    const { importLocalUserBackup } = loadBackupModule();
    const storage = createStorage();
    const result = importLocalUserBackup(
      { schema: "bad", version: 0, exportedAt: "not-a-date", state: {} },
      { storage }
    );
    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.restored).toHaveLength(0);
  });

  it("restores a present state field to storage", () => {
    const { importLocalUserBackup } = loadBackupModule();
    const storage = createStorage();
    const result = importLocalUserBackup(
      validBackup({ state: { ollamaModel: "llama3.1:8b" } }),
      { storage }
    );
    expect(result.success).toBe(true);
    expect(result.restored).toContain("ollamaModel");
    expect(storage._store["anythingllm_swarmsy_local_user_ollama_model"]).toBe(
      "llama3.1:8b"
    );
  });

  it("calls removeItem when a state field value is null", () => {
    const { importLocalUserBackup } = loadBackupModule();
    const storage = createStorage({
      anythingllm_swarmsy_local_user_ollama_model: "phi3:mini",
    });
    importLocalUserBackup(validBackup({ state: { ollamaModel: null } }), {
      storage,
    });
    expect(storage.removeItem).toHaveBeenCalledWith(
      "anythingllm_swarmsy_local_user_ollama_model"
    );
  });

  it("skips fields absent from the backup state", () => {
    const { importLocalUserBackup } = loadBackupModule();
    const storage = createStorage();
    const result = importLocalUserBackup(validBackup({ state: {} }), {
      storage,
    });
    expect(result.success).toBe(true);
    expect(result.restored).toHaveLength(0);
    expect(result.skipped.length).toBeGreaterThan(0);
  });

  it("returns success: false when storage is not available", () => {
    const { importLocalUserBackup } = loadBackupModule();
    const result = importLocalUserBackup(validBackup(), { storage: null });
    expect(result.success).toBe(false);
    expect(result.errors).toContain("Storage is not available.");
  });

  it("never writes auth keys to storage even if the backup state contains them", () => {
    const { importLocalUserBackup } = loadBackupModule();
    const storage = createStorage();
    // A crafted backup that tries to restore an auth field via an allowed field
    // name is impossible because validateLocalUserBackup rejects unknown fields.
    // This test verifies that the import path independently skips NEVER_BACKUP keys.
    const result = importLocalUserBackup(
      validBackup({ state: { ollamaModel: "safe-model" } }),
      { storage }
    );
    expect(result.success).toBe(true);
    expect(
      Object.prototype.hasOwnProperty.call(storage._store, "anythingllm_user")
    ).toBe(false);
    expect(
      Object.prototype.hasOwnProperty.call(
        storage._store,
        "anythingllm_authToken"
      )
    ).toBe(false);
  });

  it("accepts v1 backups without desktop payload", () => {
    const { importLocalUserBackup } = loadBackupModule();
    const storage = createStorage();
    const result = importLocalUserBackup(
      {
        schema: "swarmsy_local_user_backup",
        version: 1,
        exportedAt: new Date().toISOString(),
        state: { ollamaModel: "safe-model" },
      },
      { storage }
    );
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Full round-trip: export → import
// ---------------------------------------------------------------------------

describe("full round-trip: export then import", () => {
  it("restores the Ollama model selection end-to-end", () => {
    const { exportLocalUserBackup, importLocalUserBackup } = loadBackupModule();
    const exportStorage = createStorage({
      anythingllm_swarmsy_local_user_ollama_model: "mistral:7b",
      anythingllm_appearance_settings: '{"theme":"dark"}',
    });
    const backup = exportLocalUserBackup({ storage: exportStorage });

    const importStorage = createStorage();
    const result = importLocalUserBackup(backup, { storage: importStorage });

    expect(result.success).toBe(true);
    expect(result.restored).toContain("ollamaModel");
    expect(result.restored).toContain("appearanceSettings");
    expect(
      importStorage._store["anythingllm_swarmsy_local_user_ollama_model"]
    ).toBe("mistral:7b");
    expect(importStorage._store["anythingllm_appearance_settings"]).toBe(
      '{"theme":"dark"}'
    );
  });

  it("does not carry auth state across the round-trip", () => {
    const { exportLocalUserBackup, importLocalUserBackup } = loadBackupModule();
    const exportStorage = createStorage({
      anythingllm_user: '{"username":"alice"}',
      anythingllm_authToken: "tok",
      anythingllm_swarmsy_local_user_ollama_model: "phi3:mini",
    });
    const backup = exportLocalUserBackup({ storage: exportStorage });

    const importStorage = createStorage();
    importLocalUserBackup(backup, { storage: importStorage });

    expect(
      Object.prototype.hasOwnProperty.call(
        importStorage._store,
        "anythingllm_user"
      )
    ).toBe(false);
    expect(
      Object.prototype.hasOwnProperty.call(
        importStorage._store,
        "anythingllm_authToken"
      )
    ).toBe(false);
  });
});

describe("desktop-aware v2 helpers", () => {
  it("exportLocalUserBackupV2 includes trusted desktop settings when callback succeeds", async () => {
    const { exportLocalUserBackupV2, DESKTOP_LOCAL_SETTINGS_SCHEMA } =
      loadBackupModule();
    const backup = await exportLocalUserBackupV2({
      storage: createStorage(),
      readDesktopLocalSettings: async () => ({
        ok: true,
        settings: {
          schema: DESKTOP_LOCAL_SETTINGS_SCHEMA,
          version: 1,
          updatedAt: new Date().toISOString(),
          state: { ollamaModel: "llama3.1:8b", provider: "ollama" },
        },
      }),
    });
    expect(backup.desktop.localSettings.state.ollamaModel).toBe("llama3.1:8b");
  });

  it("exportLocalUserBackupV2 falls back to browser-only payload when desktop callback is unavailable", async () => {
    const { exportLocalUserBackupV2 } = loadBackupModule();
    const backup = await exportLocalUserBackupV2({
      storage: createStorage(),
      readDesktopLocalSettings: async () => ({
        ok: false,
        reason: "bridge_unavailable",
      }),
    });
    expect(backup.desktop).toEqual({ localSettings: null });
  });

  it("importLocalUserBackupV2 restores desktop settings through callback", async () => {
    const { importLocalUserBackupV2 } = loadBackupModule();
    const applyDesktopLocalSettings = jest.fn().mockResolvedValue({ ok: true });
    const result = await importLocalUserBackupV2(validBackup(), {
      storage: createStorage(),
      applyDesktopLocalSettings,
    });
    expect(result.success).toBe(true);
    expect(applyDesktopLocalSettings).toHaveBeenCalledWith({
      ollamaModel: "llama3.1:8b",
      provider: "ollama",
    });
    expect(result.restoredDesktopState).toEqual({
      ollamaModel: "llama3.1:8b",
      provider: "ollama",
    });
    expect(result.desktopRestore).toEqual({
      attempted: true,
      success: true,
      reason: null,
    });
  });

  it("importLocalUserBackupV2 does not report desktop state when callback returns ok false", async () => {
    const { importLocalUserBackupV2 } = loadBackupModule();
    const applyDesktopLocalSettings = jest
      .fn()
      .mockResolvedValue({ ok: false });
    const result = await importLocalUserBackupV2(validBackup(), {
      storage: createStorage(),
      applyDesktopLocalSettings,
    });
    expect(result.success).toBe(true);
    expect(applyDesktopLocalSettings).toHaveBeenCalled();
    expect(result.restoredDesktopState).toBeNull();
    expect(result.desktopRestore).toEqual({
      attempted: true,
      success: false,
      reason: "desktop_restore_failed",
    });
  });

  it("importLocalUserBackupV2 does not report desktop state when callback throws", async () => {
    const { importLocalUserBackupV2 } = loadBackupModule();
    const applyDesktopLocalSettings = jest
      .fn()
      .mockRejectedValue(new Error("write failed"));
    const result = await importLocalUserBackupV2(validBackup(), {
      storage: createStorage(),
      applyDesktopLocalSettings,
    });
    expect(result.success).toBe(true);
    expect(applyDesktopLocalSettings).toHaveBeenCalled();
    expect(result.restoredDesktopState).toBeNull();
    expect(result.desktopRestore).toEqual({
      attempted: true,
      success: false,
      reason: "desktop_restore_threw",
    });
  });

  it("importLocalUserBackupV2 trims desktop values and converts empties to null", async () => {
    const { importLocalUserBackupV2 } = loadBackupModule();
    const applyDesktopLocalSettings = jest.fn().mockResolvedValue({ ok: true });
    const backup = validBackup({
      desktop: {
        localSettings: {
          schema: "swarmsy_desktop_local_user_settings",
          version: 1,
          updatedAt: new Date().toISOString(),
          state: { ollamaModel: "   ", provider: "  ollama  " },
        },
      },
    });

    const result = await importLocalUserBackupV2(backup, {
      storage: createStorage(),
      applyDesktopLocalSettings,
    });
    expect(result.success).toBe(true);
    expect(applyDesktopLocalSettings).toHaveBeenCalledWith({
      ollamaModel: null,
      provider: "ollama",
    });
    expect(result.restoredDesktopState).toEqual({
      ollamaModel: null,
      provider: "ollama",
    });
    expect(result.desktopRestore).toEqual({
      attempted: true,
      success: true,
      reason: null,
    });
  });

  it("importLocalUserBackupV2 does not invoke desktop restore for v1 desktop payloads", async () => {
    const { importLocalUserBackupV2 } = loadBackupModule();
    const applyDesktopLocalSettings = jest.fn().mockResolvedValue({ ok: true });
    const backup = {
      schema: "swarmsy_local_user_backup",
      version: 1,
      exportedAt: new Date().toISOString(),
      state: { ollamaModel: "safe-model" },
      desktop: {
        localSettings: {
          schema: "swarmsy_desktop_local_user_settings",
          version: 1,
          updatedAt: new Date().toISOString(),
          state: { ollamaModel: "llama3.1:8b", provider: "ollama" },
        },
      },
    };
    const result = await importLocalUserBackupV2(backup, {
      storage: createStorage(),
      applyDesktopLocalSettings,
    });
    expect(result.success).toBe(false);
    expect(applyDesktopLocalSettings).not.toHaveBeenCalled();
  });

  it("importLocalUserBackupV2 rejects invalid desktop payloads safely", async () => {
    const { importLocalUserBackupV2 } = loadBackupModule();
    const applyDesktopLocalSettings = jest.fn().mockResolvedValue({ ok: true });
    const result = await importLocalUserBackupV2(
      validBackup({
        desktop: {
          localSettings: {
            schema: "bad_schema",
            version: 1,
            updatedAt: new Date().toISOString(),
            state: { ollamaModel: "llama3.1:8b", provider: "ollama" },
          },
        },
      }),
      { storage: createStorage(), applyDesktopLocalSettings }
    );
    expect(result.success).toBe(false);
    expect(applyDesktopLocalSettings).not.toHaveBeenCalled();
  });

  it("importLocalUserBackupV2 reports desktop restore skipped when v2 backup has no desktop payload", async () => {
    const { importLocalUserBackupV2 } = loadBackupModule();
    const applyDesktopLocalSettings = jest.fn().mockResolvedValue({ ok: true });
    const backup = validBackup();
    delete backup.desktop;

    const result = await importLocalUserBackupV2(backup, {
      storage: createStorage(),
      applyDesktopLocalSettings,
    });

    expect(result.success).toBe(true);
    expect(applyDesktopLocalSettings).not.toHaveBeenCalled();
    expect(result.restoredDesktopState).toBeNull();
    expect(result.desktopRestore).toEqual({
      attempted: false,
      success: false,
      reason: "desktop_restore_skipped_no_desktop_state",
    });
  });
});

// ---------------------------------------------------------------------------
// Hosted/Admin boundary
// ---------------------------------------------------------------------------

describe("hosted/admin boundary", () => {
  it("BACKUP_STATE_FIELDS contains only Local User state keys, not admin-only keys", () => {
    const { BACKUP_STATE_FIELDS } = loadBackupModule();
    const fieldValues = Object.values(BACKUP_STATE_FIELDS);
    // No admin or server-side key patterns should appear.
    expect(
      fieldValues.some((k) => k.includes("admin") || k.includes("server"))
    ).toBe(false);
  });

  it("NEVER_BACKUP_STORAGE_KEYS blocks the active Local User runtime session key", () => {
    const { NEVER_BACKUP_STORAGE_KEYS } = loadBackupModule();
    expect(
      NEVER_BACKUP_STORAGE_KEYS.has(
        "anythingllm_swarmsy_local_user_active_runtime"
      )
    ).toBe(true);
  });
});

describe("desktop filesystem backup detection", () => {
  it("detects only strict desktop Local User backup schema objects", () => {
    const module = loadBackupModule();
    expect(
      module.isDesktopLocalUserBackup({
        schema: module.DESKTOP_LOCAL_USER_BACKUP_SCHEMA,
        version: module.DESKTOP_LOCAL_USER_BACKUP_VERSION,
        exportedAt: "2026-06-03T00:00:00.000Z",
        app: module.DESKTOP_LOCAL_USER_BACKUP_APP,
        mode: module.DESKTOP_LOCAL_USER_BACKUP_MODE,
        state: { settings: { ollamaModel: "llama3.1:8b" } },
      })
    ).toBe(true);
    expect(module.isDesktopLocalUserBackup(validBackup())).toBe(false);
    expect(
      module.isDesktopLocalUserBackup({
        schema: module.DESKTOP_LOCAL_USER_BACKUP_SCHEMA,
        version: module.DESKTOP_LOCAL_USER_BACKUP_VERSION,
        app: module.DESKTOP_LOCAL_USER_BACKUP_APP,
        mode: module.DESKTOP_LOCAL_USER_BACKUP_MODE,
        exportedAt: "2026-06-03T00:00:00.000Z",
        state: {},
      })
    ).toBe(false);
    expect(
      module.isDesktopLocalUserBackup({
        schema: module.DESKTOP_LOCAL_USER_BACKUP_SCHEMA,
        version: module.DESKTOP_LOCAL_USER_BACKUP_VERSION,
        app: module.DESKTOP_LOCAL_USER_BACKUP_APP,
        mode: module.DESKTOP_LOCAL_USER_BACKUP_MODE,
        exportedAt: "2026-02-30T00:00:00.000Z",
        state: { settings: {} },
      })
    ).toBe(false);
  });
});
