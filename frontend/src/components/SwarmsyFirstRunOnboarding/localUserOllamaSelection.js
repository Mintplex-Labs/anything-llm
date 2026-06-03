const LOCAL_USER_OLLAMA_MODEL_STORAGE_KEY =
  "anythingllm_swarmsy_local_user_ollama_model";
const DESKTOP_LOCAL_SETTINGS_SCHEMA = "swarmsy_desktop_local_user_settings";

function resolveStorage(storage) {
  if (storage) return storage;
  if (typeof window === "undefined") return null;
  return window.localStorage || null;
}

function resolveDesktopBridge(targetWindow) {
  const scopedWindow =
    targetWindow || (typeof window !== "undefined" ? window : null);
  return scopedWindow?.swarmsyDesktop?.foundation || null;
}

export function normalizeLocalUserOllamaModelId(modelId = "") {
  return String(modelId || "").trim();
}

export function readLocalUserOllamaModelSelection({ storage } = {}) {
  const localStorage = resolveStorage(storage);
  if (!localStorage) return "";
  try {
    return normalizeLocalUserOllamaModelId(
      localStorage.getItem(LOCAL_USER_OLLAMA_MODEL_STORAGE_KEY)
    );
  } catch {
    return "";
  }
}

export function persistLocalUserOllamaModelSelection(
  modelId,
  { storage } = {}
) {
  const localStorage = resolveStorage(storage);
  if (!localStorage) return false;

  const normalizedModelId = normalizeLocalUserOllamaModelId(modelId);
  try {
    if (!normalizedModelId) {
      localStorage.removeItem(LOCAL_USER_OLLAMA_MODEL_STORAGE_KEY);
      return true;
    }
    localStorage.setItem(
      LOCAL_USER_OLLAMA_MODEL_STORAGE_KEY,
      normalizedModelId
    );
    return true;
  } catch {
    return false;
  }
}

export function clearLocalUserOllamaModelSelection({ storage } = {}) {
  return persistLocalUserOllamaModelSelection("", { storage });
}

export function hasDesktopLocalSettingsBridge({ targetWindow } = {}) {
  const bridge = resolveDesktopBridge(targetWindow);
  return (
    !!bridge &&
    typeof bridge.getLocalUserSettings === "function" &&
    typeof bridge.setLocalUserSettings === "function"
  );
}

export async function readDesktopLocalUserOllamaModelSelection({
  targetWindow,
} = {}) {
  const bridge = resolveDesktopBridge(targetWindow);
  if (!bridge || typeof bridge.getLocalUserSettings !== "function") {
    return { ok: false, reason: "bridge_unavailable", modelId: "" };
  }

  try {
    const response = await bridge.getLocalUserSettings();
    const modelId = normalizeLocalUserOllamaModelId(
      response?.settings?.state?.ollamaModel
    );
    const isSchemaMatch =
      !response?.settings?.schema ||
      response?.settings?.schema === DESKTOP_LOCAL_SETTINGS_SCHEMA;
    if (!response?.ok || !isSchemaMatch) {
      return {
        ok: false,
        reason: response?.reason || "invalid_desktop_settings",
        modelId: "",
      };
    }
    return { ok: true, modelId };
  } catch (error) {
    return {
      ok: false,
      reason: "bridge_read_failed",
      message: String(
        error?.message || error || "Failed to read desktop settings."
      ),
      modelId: "",
    };
  }
}

export async function mirrorDesktopLocalUserOllamaModelSelection(
  modelId,
  { targetWindow } = {}
) {
  const bridge = resolveDesktopBridge(targetWindow);
  if (!bridge || typeof bridge.setLocalUserSettings !== "function") {
    return { ok: false, reason: "bridge_unavailable" };
  }

  const normalizedModelId = normalizeLocalUserOllamaModelId(modelId);
  try {
    const payload = normalizedModelId
      ? { ollamaModel: normalizedModelId, provider: "ollama" }
      : { ollamaModel: null, provider: "ollama" };
    const response = await bridge.setLocalUserSettings(payload);
    if (!response?.ok) {
      return {
        ok: false,
        reason: response?.reason || "desktop_settings_write_failed",
      };
    }
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      reason: "bridge_write_failed",
      message: String(
        error?.message || error || "Failed to write desktop settings."
      ),
    };
  }
}

export async function readDesktopLocalUserSettingsForBackup({
  targetWindow,
} = {}) {
  const bridge = resolveDesktopBridge(targetWindow);
  if (
    !bridge ||
    typeof bridge.getStorageContract !== "function" ||
    typeof bridge.getLocalUserSettings !== "function"
  ) {
    return { ok: false, reason: "bridge_unavailable" };
  }

  try {
    const contract = await bridge.getStorageContract();
    if (
      !contract ||
      contract?.layout?.mode !== "local_user" ||
      typeof contract?.layout?.root !== "string" ||
      !contract.layout.root.trim()
    ) {
      return { ok: false, reason: "invalid_storage_contract" };
    }

    const response = await bridge.getLocalUserSettings();
    const settings = response?.settings;
    const isSchemaMatch =
      settings?.schema === DESKTOP_LOCAL_SETTINGS_SCHEMA &&
      settings?.state &&
      typeof settings.state === "object" &&
      !Array.isArray(settings.state);
    if (!response?.ok || !isSchemaMatch) {
      return {
        ok: false,
        reason: response?.reason || "invalid_desktop_settings",
      };
    }
    return { ok: true, settings };
  } catch (error) {
    return {
      ok: false,
      reason: "bridge_read_failed",
      message: String(
        error?.message || error || "Failed to read desktop settings."
      ),
    };
  }
}

export async function restoreDesktopLocalUserSettingsFromBackup(
  state = {},
  { targetWindow } = {}
) {
  const bridge = resolveDesktopBridge(targetWindow);
  if (
    !bridge ||
    typeof bridge.getStorageContract !== "function" ||
    typeof bridge.setLocalUserSettings !== "function"
  ) {
    return { ok: false, reason: "bridge_unavailable" };
  }

  try {
    const contract = await bridge.getStorageContract();
    if (
      !contract ||
      contract?.layout?.mode !== "local_user" ||
      typeof contract?.layout?.root !== "string" ||
      !contract.layout.root.trim()
    ) {
      return { ok: false, reason: "invalid_storage_contract" };
    }

    const normalizedOllamaModel = normalizeLocalUserOllamaModelId(
      state?.ollamaModel
    );
    const normalizedProvider =
      typeof state?.provider === "string" ? state.provider.trim() : "";
    const payload = {
      ollamaModel: normalizedOllamaModel || null,
      provider: normalizedProvider || null,
    };
    const response = await bridge.setLocalUserSettings(payload);
    if (!response?.ok) {
      return { ok: false, reason: response?.reason || "bridge_write_failed" };
    }
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      reason: "bridge_write_failed",
      message: String(
        error?.message || error || "Failed to write desktop settings."
      ),
    };
  }
}

function normalizeModelIds(models = []) {
  return (Array.isArray(models) ? models : [])
    .map((model) => normalizeLocalUserOllamaModelId(model?.id))
    .filter(Boolean);
}

export function resolveLocalUserOllamaModelSelection({
  models = [],
  selectedModelId = "",
  storedModelId = "",
} = {}) {
  const modelIds = normalizeModelIds(models);
  const hasModelId = (modelId) => modelIds.includes(modelId);
  const activeModelId = normalizeLocalUserOllamaModelId(selectedModelId);
  const savedModelId = normalizeLocalUserOllamaModelId(storedModelId);

  if (activeModelId && hasModelId(activeModelId)) {
    return {
      modelId: activeModelId,
      source: "active",
      staleStoredModelId: null,
    };
  }

  if (savedModelId && hasModelId(savedModelId)) {
    return {
      modelId: savedModelId,
      source: "stored",
      staleStoredModelId: null,
    };
  }

  if (savedModelId && !hasModelId(savedModelId)) {
    return {
      modelId: "",
      source: "stale_missing",
      staleStoredModelId: savedModelId,
    };
  }

  if (modelIds.length === 1) {
    return {
      modelId: modelIds[0],
      source: "single_available",
      staleStoredModelId: null,
    };
  }

  if (modelIds.length === 0) {
    return {
      modelId: "",
      source: "no_models",
      staleStoredModelId: null,
    };
  }

  return {
    modelId: "",
    source: "unselected",
    staleStoredModelId: null,
  };
}
