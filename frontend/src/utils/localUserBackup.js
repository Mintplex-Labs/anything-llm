/**
 * SWARMSY Local User backup/export/import foundation.
 *
 * Defines the allowed backup key set, the versioned backup schema,
 * and pure functions for export, validation, and import.
 *
 * Security rules enforced here:
 * - Auth credentials (user record, tokens, timestamps) are never included.
 * - Ephemeral session/runtime keys are never included.
 * - Import restores only explicitly allowed field names; any field not on
 *   the allowlist is silently skipped even if present in the backup file.
 * - Hosted/Admin Mode does not expose these helpers in its UI surface —
 *   the boundary is enforced by the calling component checking isLocalUserMode.
 */

export const BACKUP_SCHEMA_NAME = "swarmsy_local_user_backup";
export const BACKUP_SCHEMA_VERSION = 2;
export const DESKTOP_LOCAL_SETTINGS_SCHEMA =
  "swarmsy_desktop_local_user_settings";
export const DESKTOP_LOCAL_USER_BACKUP_SCHEMA =
  "swarmsy_desktop_local_user_backup";
export const DESKTOP_LOCAL_SETTINGS_VERSION = 1;
export const DESKTOP_LOCAL_USER_BACKUP_VERSION = 1;
export const DESKTOP_LOCAL_USER_BACKUP_APP = "SWARMSY";
export const DESKTOP_LOCAL_USER_BACKUP_MODE = "local_user_desktop";
export const DESKTOP_LOCAL_SETTINGS_ALLOWED_STATE_KEYS = new Set([
  "ollamaModel",
  "provider",
]);
const DESKTOP_LOCAL_SETTINGS_IGNORED_STATE_KEYS = new Set([
  "desktopFirstRunCompleted",
]);
const BACKUP_ALLOWED_TOP_LEVEL_KEYS = new Set([
  "schema",
  "version",
  "exportedAt",
  "state",
  "desktop",
]);
const BACKUP_V1_ALLOWED_TOP_LEVEL_KEYS = new Set([
  "schema",
  "version",
  "exportedAt",
  "state",
]);
const DESKTOP_BACKUP_ALLOWED_KEYS = new Set(["localSettings"]);
const DESKTOP_LOCAL_SETTINGS_ALLOWED_KEYS = new Set([
  "schema",
  "version",
  "updatedAt",
  "state",
]);

/**
 * Map of logical field name → localStorage key.
 *
 * Only fields listed here may be written into a backup object or
 * restored from one. Adding a new field here is the only change
 * required to extend backup coverage.
 */
export const BACKUP_STATE_FIELDS = {
  ollamaModel: "anythingllm_swarmsy_local_user_ollama_model",
  appearanceSettings: "anythingllm_appearance_settings",
  promptDrafts: "anythingllm_user_prompt_input_map",
  lastVisitedWorkspace: "anythingllm_last_visited_workspace",
  completedQuestionnaire: "anythingllm_completed_questionnaire",
  seenDocPinAlert: "anythingllm_pinned_document_alert",
  seenWatchAlert: "anythingllm_watched_document_alert",
  sidebarToggle: "anythingllm_sidebar_toggle",
  showChatMetrics: "anythingllm_show_chat_metrics",
};

/**
 * Storage keys that must never appear in a backup file.
 * Import defensively skips any field whose storage key is in this set,
 * regardless of what a backup file claims.
 */
export const NEVER_BACKUP_STORAGE_KEYS = new Set([
  "anythingllm_user",
  "anythingllm_authToken",
  "anythingllm_authTimestamp",
  "anythingllm_apiKey",
  "anythingllm_apiKeys",
  "anythingllm_pending_home_message",
  "anythingllm_swarmsy_local_user_active_runtime",
  "anythingllm_server_db_path",
]);

function resolveStorage(storage) {
  if (storage) return storage;
  if (typeof window === "undefined") return null;
  return window.localStorage || null;
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isIsoDateString(value) {
  if (typeof value !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
    return false;
  }
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString() === value;
}

function normalizeDesktopLocalSettingsForBackup(input) {
  if (!isPlainObject(input)) return null;
  if (input.schema !== DESKTOP_LOCAL_SETTINGS_SCHEMA) return null;
  if (input.version !== DESKTOP_LOCAL_SETTINGS_VERSION) return null;
  if (!isIsoDateString(input.updatedAt)) return null;
  if (!isPlainObject(input.state)) return null;

  const state = {};
  for (const key of Object.keys(input.state)) {
    if (!DESKTOP_LOCAL_SETTINGS_ALLOWED_STATE_KEYS.has(key)) {
      if (DESKTOP_LOCAL_SETTINGS_IGNORED_STATE_KEYS.has(key)) continue;
      return null;
    }

    const value = input.state[key];
    if (value === null || value === undefined) {
      state[key] = null;
      continue;
    }

    if (typeof value !== "string") return null;
    const normalizedValue = value.trim();
    state[key] = normalizedValue || null;
  }

  return {
    schema: DESKTOP_LOCAL_SETTINGS_SCHEMA,
    version: DESKTOP_LOCAL_SETTINGS_VERSION,
    updatedAt: input.updatedAt,
    state,
  };
}

function normalizeDesktopLocalSettingsStateForRestore(state) {
  const normalizedState = {};
  for (const key of DESKTOP_LOCAL_SETTINGS_ALLOWED_STATE_KEYS) {
    const value = state?.[key];
    if (typeof value !== "string") {
      normalizedState[key] = null;
      continue;
    }
    const trimmedValue = value.trim();
    normalizedState[key] = trimmedValue || null;
  }
  return normalizedState;
}

export function resolveLocalUserBackupImportModelState({
  browserModelWasRestored = false,
  browserRestoredModelId = "",
  desktopRestoredModelId = "",
} = {}) {
  const normalizedBrowserModelId = String(browserRestoredModelId || "").trim();
  const normalizedDesktopModelId = String(desktopRestoredModelId || "").trim();

  if (normalizedDesktopModelId) {
    return {
      restoredModelId: normalizedDesktopModelId,
      shouldMirrorBrowserModel: false,
      mirrorModelId: "",
      shouldPersistBrowserModel: true,
      browserModelIdToPersist: normalizedDesktopModelId,
    };
  }

  if (browserModelWasRestored) {
    return {
      restoredModelId: normalizedBrowserModelId,
      shouldMirrorBrowserModel: true,
      mirrorModelId: normalizedBrowserModelId,
      shouldPersistBrowserModel: true,
      browserModelIdToPersist: normalizedBrowserModelId,
    };
  }

  return {
    restoredModelId: "",
    shouldMirrorBrowserModel: false,
    mirrorModelId: "",
    shouldPersistBrowserModel: false,
    browserModelIdToPersist: "",
  };
}

/**
 * Read all allowed backup fields from storage and return a versioned
 * Local User backup object ready to serialize.
 *
 * @param {{ storage?: Storage, desktopLocalSettings?: unknown }} [options]
 * @returns {{
 *   schema: string,
 *   version: number,
 *   exportedAt: string,
 *   state: Record<string,string|null>,
 *   desktop: { localSettings: {
 *     schema: string,
 *     version: number,
 *     updatedAt: string,
 *     state: Record<string, string|null>
 *   } | null }
 * }}
 */
export function exportLocalUserBackup({ storage, desktopLocalSettings } = {}) {
  const store = resolveStorage(storage);
  const state = {};

  for (const [field, key] of Object.entries(BACKUP_STATE_FIELDS)) {
    try {
      const value = store ? store.getItem(key) : null;
      state[field] = value !== undefined ? value : null;
    } catch {
      state[field] = null;
    }
  }

  return {
    schema: BACKUP_SCHEMA_NAME,
    version: BACKUP_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    state,
    desktop: {
      localSettings:
        normalizeDesktopLocalSettingsForBackup(desktopLocalSettings) || null,
    },
  };
}

/**
 * Validate a parsed backup object.
 *
 * Returns `{ valid: true, errors: [] }` when the object is a well-formed
 * Local User backup, or `{ valid: false, errors: string[] }` otherwise.
 *
 * @param {unknown} data
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateLocalUserBackup(data) {
  const errors = [];

  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    errors.push("Backup must be a plain object.");
    return { valid: false, errors };
  }

  const allowedTopLevelKeys =
    data.version === 1
      ? BACKUP_V1_ALLOWED_TOP_LEVEL_KEYS
      : BACKUP_ALLOWED_TOP_LEVEL_KEYS;

  for (const topLevelKey of Object.keys(data)) {
    if (!allowedTopLevelKeys.has(topLevelKey)) {
      errors.push(`Unknown top-level field "${topLevelKey}".`);
    }
  }

  if (data.schema !== BACKUP_SCHEMA_NAME) {
    errors.push(
      `Invalid schema "${data.schema}". Expected "${BACKUP_SCHEMA_NAME}".`
    );
  }

  if (
    typeof data.version !== "number" ||
    !Number.isInteger(data.version) ||
    data.version < 1 ||
    data.version > BACKUP_SCHEMA_VERSION
  ) {
    errors.push(
      `Unsupported backup version. Expected 1-${BACKUP_SCHEMA_VERSION}, got ${data.version}.`
    );
  }

  if (
    typeof data.exportedAt !== "string" ||
    isNaN(Date.parse(data.exportedAt))
  ) {
    errors.push("exportedAt must be a valid ISO date string.");
  }

  if (
    data.state === null ||
    typeof data.state !== "object" ||
    Array.isArray(data.state)
  ) {
    errors.push("Backup state must be a plain object.");
    return { valid: errors.length === 0, errors };
  }

  const allowedFieldNames = new Set(Object.keys(BACKUP_STATE_FIELDS));
  for (const field of Object.keys(data.state)) {
    if (!allowedFieldNames.has(field)) {
      errors.push(`Unknown state field "${field}".`);
    }

    const stateValue = data.state[field];
    if (
      stateValue !== null &&
      stateValue !== undefined &&
      typeof stateValue !== "string"
    ) {
      errors.push(`State field "${field}" must be a string or null.`);
    }
  }

  if (
    data.version >= 2 &&
    data.desktop !== undefined &&
    data.desktop !== null
  ) {
    if (!isPlainObject(data.desktop)) {
      errors.push("desktop must be a plain object.");
    } else {
      for (const desktopKey of Object.keys(data.desktop)) {
        if (!DESKTOP_BACKUP_ALLOWED_KEYS.has(desktopKey)) {
          errors.push(`Unknown desktop field "${desktopKey}".`);
        }
      }

      if (
        data.desktop.localSettings !== null &&
        data.desktop.localSettings !== undefined
      ) {
        const localSettings = data.desktop.localSettings;
        if (!isPlainObject(localSettings)) {
          errors.push("desktop.localSettings must be a plain object or null.");
        } else {
          for (const key of Object.keys(localSettings)) {
            if (!DESKTOP_LOCAL_SETTINGS_ALLOWED_KEYS.has(key)) {
              errors.push(`Unknown desktop.localSettings field "${key}".`);
            }
          }

          if (localSettings.schema !== DESKTOP_LOCAL_SETTINGS_SCHEMA) {
            errors.push(
              `Invalid desktop.localSettings schema "${localSettings.schema}".`
            );
          }
          if (localSettings.version !== DESKTOP_LOCAL_SETTINGS_VERSION) {
            errors.push(
              `Unsupported desktop.localSettings version "${localSettings.version}".`
            );
          }
          if (!isIsoDateString(localSettings.updatedAt)) {
            errors.push(
              "desktop.localSettings.updatedAt must be a valid ISO date string."
            );
          }
          if (!isPlainObject(localSettings.state)) {
            errors.push("desktop.localSettings.state must be a plain object.");
          } else {
            for (const stateKey of Object.keys(localSettings.state)) {
              if (!DESKTOP_LOCAL_SETTINGS_ALLOWED_STATE_KEYS.has(stateKey)) {
                errors.push(
                  `Unknown desktop.localSettings.state field "${stateKey}".`
                );
                continue;
              }
              const value = localSettings.state[stateKey];
              if (
                value !== null &&
                value !== undefined &&
                typeof value !== "string"
              ) {
                errors.push(
                  `desktop.localSettings.state.${stateKey} must be a string or null.`
                );
              }
            }
          }
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate a backup object and, if valid, restore its allowed fields to
 * storage.
 *
 * Fields absent from the backup are skipped. Fields with a null value
 * cause the corresponding storage key to be removed (clear semantics).
 *
 * @param {unknown} data
 * @param {{ storage?: Storage }} [options]
 * @returns {{ success: boolean, restored: string[], skipped: string[], errors: string[] }}
 */
export function importLocalUserBackup(data, { storage } = {}) {
  const { valid, errors } = validateLocalUserBackup(data);
  if (!valid) {
    return { success: false, restored: [], skipped: [], errors };
  }

  const store = resolveStorage(storage);
  if (!store) {
    return {
      success: false,
      restored: [],
      skipped: [],
      errors: ["Storage is not available."],
    };
  }

  const restored = [];
  const skipped = [];

  for (const [field, key] of Object.entries(BACKUP_STATE_FIELDS)) {
    // Enforce the never-backup boundary even during import.
    if (NEVER_BACKUP_STORAGE_KEYS.has(key)) {
      skipped.push(field);
      continue;
    }

    if (!Object.prototype.hasOwnProperty.call(data.state, field)) {
      skipped.push(field);
      continue;
    }

    const value = data.state[field];
    try {
      if (value === null || value === undefined) {
        store.removeItem(key);
      } else {
        store.setItem(key, String(value));
      }
      restored.push(field);
    } catch {
      skipped.push(field);
    }
  }

  return { success: true, restored, skipped, errors: [] };
}

export async function exportLocalUserBackupV2({
  storage,
  readDesktopLocalSettings,
} = {}) {
  let desktopLocalSettings = null;

  if (typeof readDesktopLocalSettings === "function") {
    try {
      const desktopResult = await readDesktopLocalSettings();
      desktopLocalSettings = desktopResult?.ok ? desktopResult.settings : null;
    } catch {
      desktopLocalSettings = null;
    }
  }

  return exportLocalUserBackup({ storage, desktopLocalSettings });
}

export async function importLocalUserBackupV2(
  data,
  { storage, applyDesktopLocalSettings } = {}
) {
  const result = importLocalUserBackup(data, { storage });
  if (!result.success) return result;

  let restoredDesktopState = null;
  const desktopRestore = {
    attempted: false,
    success: false,
    reason: "desktop_restore_not_attempted",
  };

  if (data?.version < 2) {
    desktopRestore.reason = "desktop_restore_skipped_backup_version";
  } else if (typeof applyDesktopLocalSettings !== "function") {
    desktopRestore.reason = "desktop_restore_skipped_no_callback";
  } else if (
    !isPlainObject(data?.desktop) ||
    !isPlainObject(data?.desktop?.localSettings) ||
    !isPlainObject(data.desktop.localSettings.state)
  ) {
    desktopRestore.reason = "desktop_restore_skipped_no_desktop_state";
  } else {
    desktopRestore.attempted = true;
    try {
      const normalizedDesktopState =
        normalizeDesktopLocalSettingsStateForRestore(
          data.desktop.localSettings.state
        );
      const desktopResult = await applyDesktopLocalSettings(
        normalizedDesktopState
      );
      if (desktopResult?.ok) {
        restoredDesktopState = normalizedDesktopState;
        desktopRestore.success = true;
        desktopRestore.reason = null;
      } else {
        desktopRestore.reason =
          desktopResult?.reason || "desktop_restore_failed";
      }
    } catch {
      restoredDesktopState = null;
      desktopRestore.reason = "desktop_restore_threw";
      // Browser fallback import remains successful.
    }
  }

  return {
    ...result,
    restoredDesktopState,
    desktopRestore,
  };
}

export function isDesktopLocalUserBackup(data) {
  return (
    isPlainObject(data) &&
    data.schema === DESKTOP_LOCAL_USER_BACKUP_SCHEMA &&
    data.version === DESKTOP_LOCAL_USER_BACKUP_VERSION &&
    data.app === DESKTOP_LOCAL_USER_BACKUP_APP &&
    data.mode === DESKTOP_LOCAL_USER_BACKUP_MODE &&
    isIsoDateString(data.exportedAt) &&
    isPlainObject(data.state) &&
    isPlainObject(data.state.settings)
  );
}
