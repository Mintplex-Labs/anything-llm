"use strict";

// Server-side readiness mirror for the desktop wizard rules.
// The wizard owns renderer-only runtime/bridge/storage collection today; keep
// these rules aligned with the wizard until a dedicated production readiness
// endpoint can safely accept trusted desktop context.
// TODO(desktop-readiness): route wizard checks through this helper once desktop
// bridge/runtime status can be supplied to a safe server endpoint without
// exposing local paths or Hosted/Admin data.
const { detectLocalOllama } = require("./localUserOllama");
const {
  getDiagnosticForCode,
  sortDiagnostics,
} = require("./desktopDiagnostics");

const READINESS_LEVELS = Object.freeze({
  READY: "ready",
  WARNING: "warning",
  BLOCKED: "blocked",
});

const CHECK_IDS = Object.freeze({
  RUNTIME_AVAILABLE: "runtime_available",
  STORAGE_AVAILABLE: "storage_available",
  DESKTOP_BRIDGE_AVAILABLE: "desktop_bridge_available",
  OLLAMA_AVAILABLE: "ollama_available",
  MODEL_AVAILABLE: "model_available",
});

function normalizeModels(models = []) {
  return (Array.isArray(models) ? models : [])
    .map((model) => {
      const name = String(model?.name || model?.id || "").trim();
      if (!name) return null;
      const id = String(model?.id || name).trim();
      return { id: id || name, name };
    })
    .filter(Boolean);
}

function makeCheck({
  id,
  status,
  title,
  message,
  action = null,
  diagnosticCode = null,
  metadata = {},
}) {
  const diagnostic = diagnosticCode
    ? getDiagnosticForCode(diagnosticCode)
    : null;
  return {
    id,
    status,
    title,
    message,
    action,
    diagnosticCode: diagnostic?.code || diagnosticCode || null,
    diagnostic,
    metadata,
  };
}

function resolveOverallStatus(checks = []) {
  if (checks.some((check) => check.status === READINESS_LEVELS.BLOCKED)) {
    return READINESS_LEVELS.BLOCKED;
  }
  if (checks.some((check) => check.status === READINESS_LEVELS.WARNING)) {
    return READINESS_LEVELS.WARNING;
  }
  return READINESS_LEVELS.READY;
}

function runtimeCheck(runtimeStatus = null) {
  if (runtimeStatus?.ok && runtimeStatus?.responding !== false) {
    return makeCheck({
      id: CHECK_IDS.RUNTIME_AVAILABLE,
      status: READINESS_LEVELS.READY,
      title: "Desktop runtime is ready",
      message:
        "The SWARMSY Desktop runtime launcher is available and responding.",
      metadata: { startUrl: runtimeStatus?.startUrl || null },
    });
  }

  return makeCheck({
    id: CHECK_IDS.RUNTIME_AVAILABLE,
    status: READINESS_LEVELS.BLOCKED,
    title: "Desktop runtime needs attention",
    message:
      runtimeStatus?.message ||
      "The SWARMSY Desktop runtime is not responding.",
    action:
      "Restart SWARMSY Desktop or start the local runtime, then run the readiness check again.",
    diagnosticCode:
      runtimeStatus?.diagnosticCode || "runtime_healthcheck_failed",
    metadata: { reason: runtimeStatus?.reason || null },
  });
}

function storageCheck(storageStatus = null) {
  const mode = storageStatus?.layout?.mode || storageStatus?.mode || null;

  if (storageStatus?.ok && mode === "local_user") {
    return makeCheck({
      id: CHECK_IDS.STORAGE_AVAILABLE,
      status: READINESS_LEVELS.READY,
      title: "Local User storage is ready",
      message: "The Local User storage contract is available.",
      metadata: {},
    });
  }

  return makeCheck({
    id: CHECK_IDS.STORAGE_AVAILABLE,
    status: READINESS_LEVELS.BLOCKED,
    title: "Local User storage is unavailable",
    message:
      storageStatus?.message ||
      "The Local User storage contract could not be verified.",
    action:
      "Restart SWARMSY Desktop and verify the Local User data directory is writable.",
    diagnosticCode: storageStatus?.diagnosticCode || "storage_contract_invalid",
    metadata: { reason: storageStatus?.reason || null },
  });
}

function desktopBridgeCheck(bridgeStatus = null) {
  if (bridgeStatus?.ok) {
    return makeCheck({
      id: CHECK_IDS.DESKTOP_BRIDGE_AVAILABLE,
      status: READINESS_LEVELS.READY,
      title: "Desktop bridge is ready",
      message:
        "The trusted desktop bridge is available for Local User settings.",
    });
  }

  return makeCheck({
    id: CHECK_IDS.DESKTOP_BRIDGE_AVAILABLE,
    status: READINESS_LEVELS.BLOCKED,
    title: "Desktop bridge is unavailable",
    message:
      bridgeStatus?.message ||
      "The trusted desktop bridge could not be reached.",
    action:
      "Open SWARMSY from the Desktop app instead of a hosted/admin browser session.",
    diagnosticCode: bridgeStatus?.diagnosticCode || "untrusted_origin",
    metadata: { reason: bridgeStatus?.reason || null },
  });
}

function ollamaCheck(ollamaStatus = null) {
  if (ollamaStatus?.reachable && ollamaStatus?.status !== "error") {
    return makeCheck({
      id: CHECK_IDS.OLLAMA_AVAILABLE,
      status: READINESS_LEVELS.READY,
      title: "Ollama is reachable",
      message: ollamaStatus?.message || "Ollama is installed and reachable.",
      metadata: { endpoint: ollamaStatus?.endpoint || null },
    });
  }

  return makeCheck({
    id: CHECK_IDS.OLLAMA_AVAILABLE,
    status: READINESS_LEVELS.WARNING,
    title: "Ollama is not reachable",
    message: ollamaStatus?.message || "SWARMSY could not reach Ollama.",
    action: "Install or start Ollama: https://ollama.com",
    diagnosticCode: "ollama_unreachable",
    metadata: {
      endpoint: ollamaStatus?.endpoint || null,
      reason: ollamaStatus?.reason || null,
    },
  });
}

function modelCheck({
  ollamaStatus = null,
  selectedModel = "",
  defaultModel = "llama3.1:8b",
} = {}) {
  const models = normalizeModels(ollamaStatus?.models);
  const normalizedSelected = String(selectedModel || "").trim();
  const ollamaReachable =
    ollamaStatus?.reachable === true && ollamaStatus?.status !== "error";

  if (!ollamaReachable) {
    return makeCheck({
      id: CHECK_IDS.MODEL_AVAILABLE,
      status: READINESS_LEVELS.WARNING,
      title: "Models could not be verified",
      message: "Installed models cannot be verified until Ollama is reachable.",
      action: "Start or check Ollama, then run readiness checks again.",
      diagnosticCode: null,
      metadata: {
        models,
        selectedModel: normalizedSelected || null,
        defaultModel,
      },
    });
  }

  if (models.length === 0) {
    return makeCheck({
      id: CHECK_IDS.MODEL_AVAILABLE,
      status: READINESS_LEVELS.WARNING,
      title: "No Ollama models installed",
      message: "Ollama is reachable, but no installed models were reported.",
      action: `Run: ollama pull ${defaultModel}`,
      diagnosticCode: "no_models_installed",
      metadata: {
        models,
        selectedModel: normalizedSelected || null,
        defaultModel,
      },
    });
  }

  if (
    normalizedSelected &&
    !models.some((model) => model.id === normalizedSelected)
  ) {
    return makeCheck({
      id: CHECK_IDS.MODEL_AVAILABLE,
      status: READINESS_LEVELS.WARNING,
      title: "Selected model is missing",
      message: "Your saved Ollama model is not installed anymore.",
      action:
        "Select one of the installed models in the first-run wizard or Local User settings.",
      diagnosticCode: "selected_model_missing",
      metadata: { models, selectedModel: normalizedSelected },
    });
  }

  return makeCheck({
    id: CHECK_IDS.MODEL_AVAILABLE,
    status: READINESS_LEVELS.READY,
    title: normalizedSelected
      ? "Selected model is ready"
      : "Installed models are available",
    message: normalizedSelected
      ? `The selected model (${normalizedSelected}) is installed.`
      : "At least one installed Ollama model is available for selection.",
    metadata: { models, selectedModel: normalizedSelected || null },
  });
}

async function getDesktopReadiness({
  runtimeStatus = null,
  storageStatus = null,
  desktopBridgeStatus = null,
  ollamaStatus = null,
  selectedModel = "",
  defaultModel = "llama3.1:8b",
  detectOllama = detectLocalOllama,
} = {}) {
  const resolvedOllamaStatus = ollamaStatus || (await detectOllama());
  const checks = [
    runtimeCheck(runtimeStatus),
    storageCheck(storageStatus),
    desktopBridgeCheck(desktopBridgeStatus),
    ollamaCheck(resolvedOllamaStatus),
    modelCheck({
      ollamaStatus: resolvedOllamaStatus,
      selectedModel,
      defaultModel,
    }),
  ];

  const diagnostics = sortDiagnostics(
    checks.map((check) => check.diagnostic).filter(Boolean)
  );

  return {
    mode: "local_user_desktop",
    status: resolveOverallStatus(checks),
    checks,
    diagnostics,
    models: normalizeModels(resolvedOllamaStatus?.models),
    selectedModel: String(selectedModel || "").trim() || null,
  };
}

module.exports = {
  CHECK_IDS,
  READINESS_LEVELS,
  getDesktopReadiness,
  normalizeModels,
  runtimeCheck,
  storageCheck,
  desktopBridgeCheck,
  ollamaCheck,
  modelCheck,
  resolveOverallStatus,
};
