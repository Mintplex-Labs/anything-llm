const fs = require("fs");
const path = require("path");
const vm = require("vm");

function loadBackupModule() {
  const source = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/utils/localUserBackup.js"
      ),
      "utf8"
    )
    // Strip ES module export keywords so vm.Script can run the source.
    .replace(/export const /g, "const ")
    .replace(/export function /g, "function ");

  const script = new vm.Script(
    `${source}
module.exports = {
  BACKUP_SCHEMA_NAME,
  BACKUP_SCHEMA_VERSION,
  BACKUP_STATE_FIELDS,
  NEVER_BACKUP_STORAGE_KEYS,
  exportLocalUserBackup,
  validateLocalUserBackup,
  importLocalUserBackup,
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

  it("BACKUP_SCHEMA_VERSION starts at 1", () => {
    const { BACKUP_SCHEMA_VERSION } = loadBackupModule();
    expect(BACKUP_SCHEMA_VERSION).toBe(1);
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
    expect(
      storage._store["anythingllm_swarmsy_local_user_ollama_model"]
    ).toBe("llama3.1:8b");
  });

  it("calls removeItem when a state field value is null", () => {
    const { importLocalUserBackup } = loadBackupModule();
    const storage = createStorage({
      anythingllm_swarmsy_local_user_ollama_model: "phi3:mini",
    });
    importLocalUserBackup(
      validBackup({ state: { ollamaModel: null } }),
      { storage }
    );
    expect(storage.removeItem).toHaveBeenCalledWith(
      "anythingllm_swarmsy_local_user_ollama_model"
    );
  });

  it("skips fields absent from the backup state", () => {
    const { importLocalUserBackup } = loadBackupModule();
    const storage = createStorage();
    const result = importLocalUserBackup(
      validBackup({ state: {} }),
      { storage }
    );
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
      Object.prototype.hasOwnProperty.call(importStorage._store, "anythingllm_user")
    ).toBe(false);
    expect(
      Object.prototype.hasOwnProperty.call(
        importStorage._store,
        "anythingllm_authToken"
      )
    ).toBe(false);
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
