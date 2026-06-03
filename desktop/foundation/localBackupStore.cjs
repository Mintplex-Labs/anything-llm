const nodeFs = require("fs");
const fs = require("fs/promises");
const path = require("path");
const { getDesktopStorageContract } = require("./storageContractBridge.cjs");
const {
  getLocalUserSettings,
  setLocalUserSettings,
} = require("./localSettingsStore.cjs");
const {
  validateLocalUserStoragePath,
} = require("../../server/utils/swarmsy/localUserStorageContract");

const DESKTOP_LOCAL_USER_BACKUP_SCHEMA = "swarmsy_desktop_local_user_backup";
const DESKTOP_LOCAL_USER_BACKUP_VERSION = 1;
const DESKTOP_LOCAL_USER_BACKUP_APP = "SWARMSY";
const DESKTOP_LOCAL_USER_BACKUP_MODE = "local_user_desktop";

const ALLOWED_TOP_LEVEL_KEYS = new Set([
  "schema",
  "version",
  "exportedAt",
  "app",
  "mode",
  "state",
]);
const ALLOWED_STATE_KEYS = new Set(["settings"]);
const ALLOWED_SETTINGS_KEYS = new Set(["ollamaModel", "provider"]);
const FORBIDDEN_FIELD_KEYS = new Set([
  "auth",
  "authToken",
  "anythingllm_user",
  "apiKey",
  "apiKeys",
  "session",
  "sessionToken",
  "token",
  "pending",
  "pendingHomeMessage",
  "runtime",
  "runtimeSessionKey",
  "server",
  "serverDb",
  "serverDbPath",
  "db",
  "dbPath",
  "hosted",
  "admin",
]);

function isPlainObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isIsoDateString(value) {
  if (typeof value !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
    return false;
  }
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString() === value;
}

function hasForbiddenFieldKey(key) {
  const normalized = String(key || "").trim();
  const lower = normalized.toLowerCase();
  if (FORBIDDEN_FIELD_KEYS.has(normalized)) return true;
  return [
    "auth",
    "session",
    "token",
    "apikey",
    "api_key",
    "secret",
    "runtime",
    "pending",
    "serverdb",
    "server_db",
    "dbpath",
    "db_path",
    "hosted",
    "admin",
  ].some((fragment) => lower.includes(fragment));
}

function collectForbiddenFields(value, pathParts = [], found = []) {
  if (!isPlainObject(value)) return found;
  for (const [key, child] of Object.entries(value)) {
    const nextPath = [...pathParts, key];
    if (hasForbiddenFieldKey(key)) found.push(nextPath.join("."));
    if (isPlainObject(child)) collectForbiddenFields(child, nextPath, found);
  }
  return found;
}

function assertPathWithinLocalUserRoot(
  targetPath,
  layout,
  { allowRoot = false } = {}
) {
  const validation = validateLocalUserStoragePath(targetPath, {
    layout,
    allowRoot,
  });
  if (!validation.valid) {
    throw new Error(
      validation.reason || "Path is outside SWARMSY Local User root."
    );
  }
}

function createBackupFileName(exportedAt = new Date().toISOString()) {
  const safeTimestamp = String(exportedAt)
    .replace(/[^0-9A-Za-z.-]/g, "-")
    .replace(/-+/g, "-");
  return `swarmsy-desktop-local-user-backup-${safeTimestamp}.json`;
}

async function resolveBackupFileContext({
  fsApi = fs,
  pathApi = path,
  contractOptions = {},
  exportedAt = new Date().toISOString(),
} = {}) {
  const contract = getDesktopStorageContract(contractOptions);
  const layout = contract.layout;
  const backupsDir = layout?.paths?.backups;
  const backupFilePath = pathApi.resolve(
    backupsDir,
    createBackupFileName(exportedAt)
  );

  assertPathWithinLocalUserRoot(layout.root, layout, { allowRoot: true });
  assertPathWithinLocalUserRoot(backupsDir, layout);
  assertPathWithinLocalUserRoot(backupFilePath, layout);

  await fsApi.mkdir(backupsDir, { recursive: true });

  const backupsDirStats = await fsApi.lstat(backupsDir);
  if (backupsDirStats.isSymbolicLink()) {
    throw new Error("Backups directory cannot be a symlink.");
  }

  const realBackupsDir = await fsApi.realpath(backupsDir);
  assertPathWithinLocalUserRoot(realBackupsDir, layout);

  const realRoot = await fsApi.realpath(layout.root).catch(() => layout.root);
  assertPathWithinLocalUserRoot(realRoot, layout, { allowRoot: true });

  const backupFileStats = await fsApi.lstat(backupFilePath).catch((error) => {
    if (error?.code === "ENOENT") return null;
    throw error;
  });
  if (backupFileStats?.isSymbolicLink()) {
    throw new Error("Backup file cannot be a symlink.");
  }
  if (backupFileStats) {
    throw new Error("Backup file already exists.");
  }

  return {
    layout,
    backupsDir,
    backupFilePath,
    exportedAt,
  };
}

function normalizeSettingsStateForBackup(settings = {}) {
  const state = settings?.state || {};
  const normalized = {};
  for (const key of ALLOWED_SETTINGS_KEYS) {
    const value = state[key];
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (trimmed) normalized[key] = trimmed;
  }
  return normalized;
}

function createBackupDocument({
  settings = {},
  exportedAt = new Date().toISOString(),
} = {}) {
  return {
    schema: DESKTOP_LOCAL_USER_BACKUP_SCHEMA,
    version: DESKTOP_LOCAL_USER_BACKUP_VERSION,
    exportedAt,
    app: DESKTOP_LOCAL_USER_BACKUP_APP,
    mode: DESKTOP_LOCAL_USER_BACKUP_MODE,
    state: {
      settings: normalizeSettingsStateForBackup(settings),
    },
  };
}

function getExclusiveNoFollowWriteFlags() {
  const flags =
    nodeFs.constants.O_WRONLY |
    nodeFs.constants.O_CREAT |
    nodeFs.constants.O_EXCL;
  return nodeFs.constants.O_NOFOLLOW
    ? flags | nodeFs.constants.O_NOFOLLOW
    : flags;
}

async function writeBackupFileExclusiveNoFollow(
  backupFilePath,
  contents,
  { fsApi = fs } = {}
) {
  let handle = null;
  try {
    handle = await fsApi.open(
      backupFilePath,
      getExclusiveNoFollowWriteFlags(),
      0o600
    );
    await handle.writeFile(contents, "utf8");
  } finally {
    if (handle) await handle.close();
  }
}

async function exportLocalUserBackup(options = {}) {
  const exportedAt = (options.now || new Date()).toISOString();
  let context;
  try {
    context = await resolveBackupFileContext({ ...options, exportedAt });
  } catch (error) {
    return {
      ok: false,
      reason: "backup_path_invalid",
      message: String(error?.message || error || "Invalid backup path."),
    };
  }

  const settingsResult = await getLocalUserSettings(options);
  if (!settingsResult?.ok) {
    return {
      ok: false,
      reason: "backup_settings_invalid",
      settingsReason: settingsResult?.reason || "settings_read_failed",
      message:
        settingsResult?.message ||
        "Desktop Local User settings could not be safely included in backup.",
    };
  }

  const backup = createBackupDocument({
    settings: settingsResult.settings,
    exportedAt,
  });

  const fsApi = options.fsApi || fs;
  try {
    await writeBackupFileExclusiveNoFollow(
      context.backupFilePath,
      `${JSON.stringify(backup, null, 2)}\n`,
      { fsApi }
    );
    const writtenStats = await fsApi.lstat(context.backupFilePath);
    if (writtenStats.isSymbolicLink()) {
      await fsApi.unlink(context.backupFilePath).catch(() => {});
      return { ok: false, reason: "backup_file_symlink" };
    }
    return {
      ok: true,
      backup,
      path: context.backupFilePath,
      backupsDir: context.backupsDir,
    };
  } catch (error) {
    return {
      ok: false,
      reason:
        error?.code === "EEXIST" || error?.code === "ELOOP"
          ? "backup_file_unsafe"
          : "backup_write_failed",
      message: String(error?.message || error || "Failed to write backup."),
    };
  }
}

function parseBackupPayload(payload) {
  if (typeof payload !== "string") return { ok: true, data: payload };
  try {
    return { ok: true, data: JSON.parse(payload) };
  } catch {
    return {
      ok: false,
      reason: "backup_parse_failed",
      errors: ["Backup JSON could not be parsed."],
    };
  }
}

function validateImportSettings(settings) {
  const errors = [];
  if (!isPlainObject(settings)) {
    return { valid: false, errors: ["state.settings must be a plain object."] };
  }
  for (const key of Object.keys(settings)) {
    if (hasForbiddenFieldKey(key)) {
      errors.push(`Forbidden settings field "${key}" is not allowed.`);
    } else if (!ALLOWED_SETTINGS_KEYS.has(key)) {
      errors.push(`Unknown settings field "${key}" is not allowed.`);
    }
  }

  const normalized = {};
  for (const key of ALLOWED_SETTINGS_KEYS) {
    if (!Object.prototype.hasOwnProperty.call(settings, key)) {
      normalized[key] = null;
      continue;
    }

    const value = settings[key];
    if (value === null || value === undefined) {
      normalized[key] = null;
      continue;
    }
    if (typeof value !== "string") {
      errors.push(`Settings field "${key}" must be a string or null.`);
      normalized[key] = null;
      continue;
    }
    const trimmed = value.trim();
    normalized[key] = trimmed || null;
  }
  return { valid: errors.length === 0, errors, settings: normalized };
}

function validateLocalUserBackup(payload) {
  const errors = [];
  if (!isPlainObject(payload)) {
    return {
      valid: false,
      reason: "backup_invalid",
      errors: ["Backup must be a plain object."],
    };
  }

  const forbiddenFields = collectForbiddenFields(payload);
  if (forbiddenFields.length > 0) {
    errors.push(`Forbidden backup field(s): ${forbiddenFields.join(", ")}.`);
  }

  for (const key of Object.keys(payload)) {
    if (!ALLOWED_TOP_LEVEL_KEYS.has(key)) {
      errors.push(`Unknown top-level field "${key}" is not allowed.`);
    }
  }
  if (payload.schema !== DESKTOP_LOCAL_USER_BACKUP_SCHEMA) {
    errors.push(`Invalid schema "${payload.schema}".`);
  }
  if (payload.version !== DESKTOP_LOCAL_USER_BACKUP_VERSION) {
    errors.push(`Unsupported backup version "${payload.version}".`);
  }
  if (payload.app !== DESKTOP_LOCAL_USER_BACKUP_APP) {
    errors.push(`Invalid app "${payload.app}".`);
  }
  if (payload.mode !== DESKTOP_LOCAL_USER_BACKUP_MODE) {
    errors.push(`Invalid mode "${payload.mode}".`);
  }
  if (!isIsoDateString(payload.exportedAt)) {
    errors.push("exportedAt must be a valid ISO date string.");
  }
  if (!isPlainObject(payload.state)) {
    errors.push("state must be a plain object.");
  } else {
    for (const key of Object.keys(payload.state)) {
      if (hasForbiddenFieldKey(key)) {
        errors.push(`Forbidden state field "${key}" is not allowed.`);
      } else if (!ALLOWED_STATE_KEYS.has(key)) {
        errors.push(`Unknown state field "${key}" is not allowed.`);
      }
    }
  }

  const settingsValidation = isPlainObject(payload.state)
    ? validateImportSettings(payload.state.settings || {})
    : { valid: false, errors: ["state.settings must be a plain object."] };
  errors.push(...settingsValidation.errors);

  return {
    valid: errors.length === 0,
    reason: errors.length > 0 ? "backup_validation_failed" : null,
    errors,
    settings: settingsValidation.settings || {},
  };
}

async function importLocalUserBackup(payload, options = {}) {
  const parsed = parseBackupPayload(payload);
  if (!parsed.ok)
    return { ok: false, reason: parsed.reason, errors: parsed.errors };

  const validation = validateLocalUserBackup(parsed.data);
  if (!validation.valid) {
    return {
      ok: false,
      reason: validation.reason,
      errors: validation.errors,
    };
  }

  const result = await setLocalUserSettings(
    { state: validation.settings },
    options
  );
  if (!result?.ok) {
    return {
      ok: false,
      reason: result?.reason || "settings_restore_failed",
      errors: result?.errors || [],
      message: result?.message,
    };
  }

  return {
    ok: true,
    settings: result.settings,
    restoredState: validation.settings,
    path: result.path,
  };
}

module.exports = {
  DESKTOP_LOCAL_USER_BACKUP_SCHEMA,
  DESKTOP_LOCAL_USER_BACKUP_VERSION,
  DESKTOP_LOCAL_USER_BACKUP_APP,
  DESKTOP_LOCAL_USER_BACKUP_MODE,
  ALLOWED_TOP_LEVEL_KEYS,
  ALLOWED_STATE_KEYS,
  ALLOWED_SETTINGS_KEYS,
  FORBIDDEN_FIELD_KEYS,
  createBackupFileName,
  getExclusiveNoFollowWriteFlags,
  writeBackupFileExclusiveNoFollow,
  resolveBackupFileContext,
  createBackupDocument,
  validateLocalUserBackup,
  exportLocalUserBackup,
  importLocalUserBackup,
};
