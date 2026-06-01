const LOCAL_USER_OLLAMA_MODEL_STORAGE_KEY =
  "anythingllm_swarmsy_local_user_ollama_model";

function resolveStorage(storage) {
  if (storage) return storage;
  if (typeof window === "undefined") return null;
  return window.localStorage || null;
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
    if (modelIds.length === 1) {
      return {
        modelId: modelIds[0],
        source: "single_available_after_stale",
        staleStoredModelId: savedModelId,
      };
    }

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
