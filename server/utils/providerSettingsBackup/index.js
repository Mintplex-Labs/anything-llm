const fs = require("fs");
const path = require("path");

const BACKUP_VERSION = 1;
const BACKUP_FILENAME = "provider-settings.backup.json";
const SECRET_KEY_PATTERN =
  /(KEY|TOKEN|SECRET|PASSWORD|CONNECTION_STRING|AUTH|CREDENTIAL)/i;

function storageDir() {
  return process.env.STORAGE_DIR
    ? path.resolve(process.env.STORAGE_DIR)
    : path.resolve(__dirname, "../../storage");
}

function backupDir() {
  return path.join(storageDir(), "system");
}

function backupPath() {
  return path.join(backupDir(), BACKUP_FILENAME);
}

function isFilled(value) {
  return value !== undefined && value !== null && String(value).length > 0;
}

function isSecretKey(key = "") {
  return SECRET_KEY_PATTERN.test(key);
}

function maskValue(key, value) {
  if (!isFilled(value)) return value;
  if (!isSecretKey(key)) return value;
  const stringValue = String(value);
  if (stringValue.length <= 8) return "********";
  return `${stringValue.slice(0, 3)}****${stringValue.slice(-4)}`;
}

function maskValues(values = {}) {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, maskValue(key, value)])
  );
}

function sanitizeValuesForBackup(values = {}, allowedEnvKeys = []) {
  const whitelist = new Set(allowedEnvKeys);
  return Object.fromEntries(
    Object.entries(values).filter(
      ([key, value]) => whitelist.has(key) && value !== undefined
    )
  );
}

function valuesFromEnv(allowedEnvKeys = []) {
  return Object.fromEntries(
    allowedEnvKeys
      .filter((key) => process.env[key] !== undefined)
      .map((key) => [key, process.env[key]])
  );
}

function writeBackupValues(values = {}, allowedEnvKeys = []) {
  const safeValues = sanitizeValuesForBackup(values, allowedEnvKeys);
  fs.mkdirSync(backupDir(), { recursive: true, mode: 0o700 });

  const payload = {
    version: BACKUP_VERSION,
    updatedAt: new Date().toISOString(),
    values: safeValues,
  };

  const target = backupPath();
  const temp = `${target}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(payload, null, 2), {
    encoding: "utf8",
    flag: "w",
    mode: 0o600,
  });
  try {
    fs.chmodSync(temp, 0o600);
  } catch (error) {
    console.warn(
      `[ProviderSettingsBackup] Failed to chmod temp backup: ${error.message}`
    );
  }
  fs.renameSync(temp, target);
  try {
    fs.chmodSync(target, 0o600);
  } catch (error) {
    console.warn(
      `[ProviderSettingsBackup] Failed to chmod backup: ${error.message}`
    );
  }

  return {
    success: true,
    path: target,
    count: Object.keys(safeValues).length,
    updatedAt: payload.updatedAt,
  };
}

function persistCurrentEnvBackup(allowedEnvKeys = []) {
  return writeBackupValues(valuesFromEnv(allowedEnvKeys), allowedEnvKeys);
}

function readBackup() {
  const target = backupPath();
  if (!fs.existsSync(target)) return { exists: false, values: {} };

  try {
    const raw = fs.readFileSync(target, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !parsed.values) {
      return {
        exists: true,
        values: {},
        error: "invalid_backup_format",
      };
    }
    return {
      exists: true,
      version: parsed.version,
      updatedAt: parsed.updatedAt,
      values: parsed.values,
    };
  } catch (error) {
    return {
      exists: true,
      values: {},
      error: "invalid_backup_json",
      message: error.message,
    };
  }
}

function rejectUnknownKeys(values = {}, allowedEnvKeys = []) {
  const whitelist = new Set(allowedEnvKeys);
  return Object.keys(values).filter((key) => !whitelist.has(key));
}

function applyValuesToEnv(values = {}, { overwrite = false } = {}) {
  const applied = {};
  const skipped = {};

  for (const [key, value] of Object.entries(values)) {
    if (!overwrite && isFilled(process.env[key])) {
      skipped[key] = "already_set";
      continue;
    }
    process.env[key] = value === null ? "" : String(value);
    applied[key] = process.env[key];
  }

  return { applied, skipped };
}

function hydrateFromBackup(allowedEnvKeys = [], { overwrite = false } = {}) {
  const backup = readBackup();
  if (!backup.exists) {
    return { success: true, exists: false, applied: {}, skipped: {} };
  }
  if (backup.error) {
    return {
      success: false,
      exists: true,
      error: backup.error,
      applied: {},
      skipped: {},
    };
  }

  const unknownKeys = rejectUnknownKeys(backup.values, allowedEnvKeys);
  if (unknownKeys.length > 0) {
    return {
      success: false,
      exists: true,
      error: "backup_contains_non_whitelisted_keys",
      unknownKeys,
      applied: {},
      skipped: {},
    };
  }

  const { applied, skipped } = applyValuesToEnv(backup.values, { overwrite });
  return {
    success: true,
    exists: true,
    version: backup.version,
    updatedAt: backup.updatedAt,
    applied,
    skipped,
  };
}

function normalizeImportPayload(payload = {}) {
  if (payload?.values && typeof payload.values === "object")
    return payload.values;
  return payload;
}

function importBackupValues(payload = {}, allowedEnvKeys = [], options = {}) {
  const values = normalizeImportPayload(payload);
  if (!values || typeof values !== "object" || Array.isArray(values)) {
    return { success: false, error: "invalid_backup_format" };
  }

  const unknownKeys = rejectUnknownKeys(values, allowedEnvKeys);
  if (unknownKeys.length > 0) {
    return {
      success: false,
      error: "non_whitelisted_provider_keys",
      unknownKeys,
    };
  }

  const safeValues = sanitizeValuesForBackup(values, allowedEnvKeys);
  const { applied, skipped } = applyValuesToEnv(safeValues, options);
  writeBackupValues(valuesFromEnv(allowedEnvKeys), allowedEnvKeys);
  return { success: true, applied, skipped };
}

function exportBackupValues(
  allowedEnvKeys = [],
  { includeSecrets = false } = {}
) {
  const values = sanitizeValuesForBackup(
    valuesFromEnv(allowedEnvKeys),
    allowedEnvKeys
  );
  return {
    version: BACKUP_VERSION,
    updatedAt: new Date().toISOString(),
    values: includeSecrets ? values : maskValues(values),
    masked: !includeSecrets,
    path: backupPath(),
    count: Object.keys(values).length,
  };
}

function maskedKeyList(values = {}) {
  return Object.keys(values).map((key) => ({
    key,
    hasValue: isFilled(values[key]),
    secret: isSecretKey(key),
    value: maskValue(key, values[key]),
  }));
}

module.exports = {
  backupPath,
  exportBackupValues,
  hydrateFromBackup,
  importBackupValues,
  maskValue,
  maskValues,
  maskedKeyList,
  persistCurrentEnvBackup,
  readBackup,
  valuesFromEnv,
  writeBackupValues,
};
