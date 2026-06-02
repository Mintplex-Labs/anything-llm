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
export const BACKUP_SCHEMA_VERSION = 1;

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
  "anythingllm_pending_home_message",
  "anythingllm_swarmsy_local_user_active_runtime",
]);

function resolveStorage(storage) {
  if (storage) return storage;
  if (typeof window === "undefined") return null;
  return window.localStorage || null;
}

/**
 * Read all allowed backup fields from storage and return a versioned
 * Local User backup object ready to serialize.
 *
 * @param {{ storage?: Storage }} [options]
 * @returns {{ schema: string, version: number, exportedAt: string, state: Record<string,string|null> }}
 */
export function exportLocalUserBackup({ storage } = {}) {
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
      `Unsupported backup version. Expected 1\u2013${BACKUP_SCHEMA_VERSION}, got ${data.version}.`
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
