const fs = require("fs/promises");
const path = require("path");
const { getDesktopStorageContract } = require("./storageContractBridge.cjs");
const {
  validateLocalUserStoragePath,
} = require("../../server/utils/swarmsy/localUserStorageContract");

const DESKTOP_LOCAL_USER_SETTINGS_SCHEMA = "swarmsy_desktop_local_user_settings";
const DESKTOP_LOCAL_USER_SETTINGS_VERSION = 1;
const LOCAL_SETTINGS_FILENAME = "local-user-settings.json";

const ALLOWED_TOP_LEVEL_KEYS = new Set([
  "schema",
  "version",
  "updatedAt",
  "state",
]);
const ALLOWED_STATE_KEYS = new Set([
  "ollamaModel",
  "provider",
  "desktopFirstRunCompleted",
]);
const FORBIDDEN_STATE_KEYS = new Set([
  "authToken",
  "anythingllm_user",
  "apiKey",
  "apiKeys",
  "sessionToken",
  "pendingHomeMessage",
  "runtimeSessionKey",
  "serverDbPath",
]);

function isPlainObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isIsoDateString(value) {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function sanitizeSettingsStateInput(input = {}) {
  const errors = [];
  const normalizedState = {};
  const clearKeys = new Set();

  if (!isPlainObject(input)) {
    return {
      valid: false,
      errors: ["settings state must be a plain object."],
      state: {},
      clearKeys,
    };
  }

  for (const key of Object.keys(input)) {
    if (FORBIDDEN_STATE_KEYS.has(key)) {
      errors.push(`Forbidden state field "${key}" is not allowed.`);
      continue;
    }
    if (!ALLOWED_STATE_KEYS.has(key)) {
      errors.push(`Unknown state field "${key}" is not allowed.`);
      continue;
    }

    const value = input[key];
    if (value === null || value === undefined) {
      clearKeys.add(key);
      continue;
    }

    if (key === "desktopFirstRunCompleted") {
      if (typeof value === "boolean") {
        normalizedState[key] = value;
        continue;
      }
      if (typeof value === "string") {
        const normalizedBoolean = value.trim().toLowerCase();
        if (normalizedBoolean === "true" || normalizedBoolean === "false") {
          normalizedState[key] = normalizedBoolean === "true";
          continue;
        }
      }
      errors.push(`State field "${key}" must be a boolean when provided.`);
      continue;
    }

    if (typeof value !== "string") {
      errors.push(`State field "${key}" must be a string when provided.`);
      continue;
    }

    const normalizedValue = value.trim();
    if (!normalizedValue) {
      clearKeys.add(key);
      continue;
    }

    normalizedState[key] = normalizedValue;
  }

  return {
    valid: errors.length === 0,
    errors,
    state: normalizedState,
    clearKeys,
  };
}

function validateSettingsDocument(document) {
  const errors = [];
  if (!isPlainObject(document)) {
    return { valid: false, errors: ["settings document must be a plain object."] };
  }

  for (const key of Object.keys(document)) {
    if (!ALLOWED_TOP_LEVEL_KEYS.has(key)) {
      errors.push(`Unknown top-level field "${key}" is not allowed.`);
    }
  }

  if (document.schema !== DESKTOP_LOCAL_USER_SETTINGS_SCHEMA) {
    errors.push(
      `Invalid schema "${document.schema}". Expected "${DESKTOP_LOCAL_USER_SETTINGS_SCHEMA}".`
    );
  }

  if (document.version !== DESKTOP_LOCAL_USER_SETTINGS_VERSION) {
    errors.push(
      `Unsupported settings version "${document.version}". Expected ${DESKTOP_LOCAL_USER_SETTINGS_VERSION}.`
    );
  }

  if (!isIsoDateString(document.updatedAt)) {
    errors.push("updatedAt must be a valid ISO date string.");
  }

  const stateValidation = sanitizeSettingsStateInput(document.state || {});
  errors.push(...stateValidation.errors);

  return {
    valid: errors.length === 0,
    errors,
    settings: {
      schema: DESKTOP_LOCAL_USER_SETTINGS_SCHEMA,
      version: DESKTOP_LOCAL_USER_SETTINGS_VERSION,
      updatedAt: String(document.updatedAt || ""),
      state: stateValidation.state,
    },
  };
}

function resolveSettingsPayload(payload = {}) {
  if (!isPlainObject(payload)) {
    return { valid: false, errors: ["settings payload must be a plain object."] };
  }
  if (isPlainObject(payload.state)) {
    const extraKeys = Object.keys(payload).filter((k) => k !== "state");
    if (extraKeys.length > 0) {
      return {
        valid: false,
        errors: extraKeys.map(
          (k) => `Unknown settings payload field "${k}" is not allowed.`
        ),
      };
    }
    return sanitizeSettingsStateInput(payload.state);
  }
  return sanitizeSettingsStateInput(payload);
}

function assertPathWithinLocalUserRoot(targetPath, layout, { allowRoot = false } = {}) {
  const validation = validateLocalUserStoragePath(targetPath, { layout, allowRoot });
  if (!validation.valid) {
    throw new Error(validation.reason || "Path is outside SWARMSY Local User root.");
  }
}

async function resolveSettingsFileContext({
  fsApi = fs,
  pathApi = path,
  contractOptions = {},
} = {}) {
  const contract = getDesktopStorageContract(contractOptions);
  const layout = contract.layout;
  const settingsDir = layout?.paths?.settings;
  const settingsFilePath = pathApi.resolve(settingsDir, LOCAL_SETTINGS_FILENAME);

  assertPathWithinLocalUserRoot(layout.root, layout, { allowRoot: true });
  assertPathWithinLocalUserRoot(settingsDir, layout);
  assertPathWithinLocalUserRoot(settingsFilePath, layout);

  await fsApi.mkdir(settingsDir, { recursive: true });

  const settingsDirStats = await fsApi.lstat(settingsDir);
  if (settingsDirStats.isSymbolicLink()) {
    throw new Error("Settings directory cannot be a symlink.");
  }

  const realSettingsDir = await fsApi.realpath(settingsDir);
  assertPathWithinLocalUserRoot(realSettingsDir, layout);

  const realRoot = await fsApi.realpath(layout.root).catch(() => layout.root);
  assertPathWithinLocalUserRoot(realRoot, layout, { allowRoot: true });

  const settingsFileStats = await fsApi.lstat(settingsFilePath).catch((error) => {
    if (error?.code === "ENOENT") return null;
    throw error;
  });
  if (settingsFileStats?.isSymbolicLink()) {
    throw new Error("Settings file cannot be a symlink.");
  }

  return {
    layout,
    settingsDir,
    settingsFilePath,
  };
}

function createSettingsDocument(state = {}) {
  return {
    schema: DESKTOP_LOCAL_USER_SETTINGS_SCHEMA,
    version: DESKTOP_LOCAL_USER_SETTINGS_VERSION,
    updatedAt: new Date().toISOString(),
    state,
  };
}

function createAtomicWriteTempPath(context, { pathApi = path } = {}) {
  const entropy = `${process.pid}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
  const tempFilePath = pathApi.resolve(
    context.settingsDir,
    `${LOCAL_SETTINGS_FILENAME}.${entropy}.tmp`
  );
  assertPathWithinLocalUserRoot(tempFilePath, context.layout);
  return tempFilePath;
}

async function getLocalUserSettings(options = {}) {
  let context;
  try {
    context = await resolveSettingsFileContext(options);
  } catch (error) {
    return {
      ok: false,
      reason: "settings_path_invalid",
      message: String(error?.message || error || "Invalid settings path."),
    };
  }

  try {
    const raw = await (options.fsApi || fs).readFile(
      context.settingsFilePath,
      "utf8"
    );
    const parsed = JSON.parse(raw);
    const validation = validateSettingsDocument(parsed);
    if (!validation.valid) {
      return {
        ok: false,
        reason: "settings_validation_error",
        errors: validation.errors,
      };
    }

    return {
      ok: true,
      settings: validation.settings,
      path: context.settingsFilePath,
    };
  } catch (error) {
    if (error?.code === "ENOENT") {
      return {
        ok: true,
        settings: createSettingsDocument({}),
        path: context.settingsFilePath,
      };
    }
    if (error instanceof SyntaxError) {
      return {
        ok: false,
        reason: "settings_parse_error",
        message: "Local settings file contains invalid JSON.",
      };
    }
    return {
      ok: false,
      reason: "settings_read_failed",
      message: String(error?.message || error || "Failed to read local settings."),
    };
  }
}

async function setLocalUserSettings(payload = {}, options = {}) {
  const payloadValidation = resolveSettingsPayload(payload);
  if (!payloadValidation.valid) {
    return {
      ok: false,
      reason: "settings_validation_error",
      errors: payloadValidation.errors,
    };
  }

  const current = await getLocalUserSettings(options);
  const currentState = current?.ok ? current?.settings?.state || {} : {};
  const nextState = { ...currentState, ...payloadValidation.state };
  for (const key of payloadValidation.clearKeys) {
    delete nextState[key];
  }

  const nextDocument = createSettingsDocument(nextState);
  const documentValidation = validateSettingsDocument(nextDocument);
  if (!documentValidation.valid) {
    return {
      ok: false,
      reason: "settings_validation_error",
      errors: documentValidation.errors,
    };
  }

  let context;
  try {
    context = await resolveSettingsFileContext(options);
  } catch (error) {
    return {
      ok: false,
      reason: "settings_path_invalid",
      message: String(error?.message || error || "Invalid settings path."),
    };
  }

  const fsApi = options.fsApi || fs;
  let tempFilePath = null;
  try {
    tempFilePath = createAtomicWriteTempPath(context, {
      pathApi: options.pathApi || path,
    });
    const existingTempStats = await fsApi.lstat(tempFilePath).catch((error) => {
      if (error?.code === "ENOENT") return null;
      throw error;
    });
    if (existingTempStats) {
      throw new Error("Temporary settings file already exists.");
    }

    await fsApi.writeFile(
      tempFilePath,
      `${JSON.stringify(documentValidation.settings, null, 2)}\n`,
      "utf8"
    );

    const tempFileStats = await fsApi.lstat(tempFilePath);
    if (tempFileStats.isSymbolicLink()) {
      throw new Error("Temporary settings file cannot be a symlink.");
    }

    await fsApi.rename(tempFilePath, context.settingsFilePath);
    tempFilePath = null;
    return {
      ok: true,
      settings: documentValidation.settings,
      path: context.settingsFilePath,
    };
  } catch (error) {
    if (tempFilePath) {
      await fsApi.unlink(tempFilePath).catch(() => {});
    }
    return {
      ok: false,
      reason: "settings_write_failed",
      message: String(error?.message || error || "Failed to write local settings."),
    };
  }
}

async function clearLocalUserSettings(options = {}) {
  let context;
  try {
    context = await resolveSettingsFileContext(options);
  } catch (error) {
    return {
      ok: false,
      reason: "settings_path_invalid",
      message: String(error?.message || error || "Invalid settings path."),
    };
  }

  try {
    await (options.fsApi || fs).unlink(context.settingsFilePath);
    return { ok: true, cleared: true, path: context.settingsFilePath };
  } catch (error) {
    if (error?.code === "ENOENT") {
      return { ok: true, cleared: false, path: context.settingsFilePath };
    }
    return {
      ok: false,
      reason: "settings_clear_failed",
      message: String(error?.message || error || "Failed to clear local settings."),
    };
  }
}

module.exports = {
  DESKTOP_LOCAL_USER_SETTINGS_SCHEMA,
  DESKTOP_LOCAL_USER_SETTINGS_VERSION,
  LOCAL_SETTINGS_FILENAME,
  ALLOWED_STATE_KEYS,
  FORBIDDEN_STATE_KEYS,
  sanitizeSettingsStateInput,
  validateSettingsDocument,
  createSettingsDocument,
  resolveSettingsFileContext,
  getLocalUserSettings,
  setLocalUserSettings,
  clearLocalUserSettings,
};
