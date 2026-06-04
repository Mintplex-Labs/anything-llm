import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  ArrowClockwise,
  X,
  Warning,
  Desktop,
} from "@phosphor-icons/react";
import useLoginMode from "@/hooks/useLoginMode";
import SwarmsyOnboarding from "@/models/swarmsyOnboarding";
import showToast from "@/utils/toast";
import {
  hasDesktopLocalSettingsBridge,
  mirrorDesktopLocalUserFirstRunCompleted,
  mirrorDesktopLocalUserOllamaModelSelection,
  persistDesktopFirstRunCompleted,
  persistLocalUserOllamaModelSelection,
  readDesktopFirstRunCompleted,
  readDesktopLocalUserFirstRunCompleted,
  readLocalUserOllamaModelSelection,
  resolveLocalUserOllamaModelSelection,
} from "@/components/SwarmsyFirstRunOnboarding/localUserOllamaSelection";
import { LOCAL_USER_SETTINGS_SYNC_EVENT } from "@/components/SwarmsyLocalUserSettingsHub/useLocalUserSettingsHub";

export const DESKTOP_FIRST_RUN_RELAUNCH_EVENT =
  "anythingllm_swarmsy_desktop_first_run_relaunch";

const DEFAULT_MODEL = "llama3.1:8b";
const WIZARD_STEPS = [
  "Welcome",
  "Runtime",
  "Ollama",
  "Models",
  "Select Model",
  "Ready",
];

function resolveDesktopBridge(targetWindow = window) {
  return targetWindow?.swarmsyDesktop?.foundation || null;
}

function hasTrustedDesktopBridge(targetWindow) {
  const scopedWindow =
    targetWindow || (typeof window !== "undefined" ? window : null);
  if (!scopedWindow) return false;
  return hasDesktopLocalSettingsBridge({ targetWindow: scopedWindow });
}

function normalizeModel(model = null, index = 0) {
  const name = String(model?.name || model?.id || "").trim();
  if (!name) return null;
  return { id: String(model?.id || name || `model-${index}`).trim(), name };
}

function normalizeOllamaStatus(response = null) {
  const models = Array.isArray(response?.models)
    ? response.models.map(normalizeModel).filter(Boolean)
    : [];
  return {
    status: response?.status || "error",
    reachable: response?.reachable === true,
    endpoint: response?.endpoint || null,
    message: response?.message || null,
    models,
  };
}

function checkTone(status) {
  if (status === "ready") return "border-emerald-500/30 bg-emerald-500/10";
  if (status === "blocked") return "border-red-500/30 bg-red-500/10";
  return "border-amber-500/30 bg-amber-500/10";
}

function dispatchSettingsSync(model = "") {
  window.dispatchEvent(
    new CustomEvent(LOCAL_USER_SETTINGS_SYNC_EVENT, {
      detail: { reason: "desktop_first_run_wizard", model },
    })
  );
}

export default function SwarmsyDesktopFirstRunWizard() {
  const loginMode = useLoginMode();
  const isHostedAdminMode = loginMode === "multi";
  const [visible, setVisible] = useState(false);
  const [manualLaunch, setManualLaunch] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [runtimeStatus, setRuntimeStatus] = useState(null);
  const [storageStatus, setStorageStatus] = useState(null);
  const [ollamaStatus, setOllamaStatus] = useState({
    status: "checking",
    reachable: false,
    models: [],
  });
  const [selectedModel, setSelectedModel] = useState(
    readLocalUserOllamaModelSelection()
  );

  const desktopBridgeAvailable = useMemo(() => {
    if (typeof window === "undefined") return false;
    return hasTrustedDesktopBridge(window);
  }, [visible]);

  const runReadinessChecks = useCallback(async () => {
    if (typeof window === "undefined" || isHostedAdminMode) return;
    const bridge = resolveDesktopBridge(window);
    setIsChecking(true);
    try {
      const runtime =
        typeof bridge?.getRuntimeStatus === "function"
          ? await bridge.getRuntimeStatus()
          : { ok: false, responding: false, reason: "bridge_unavailable" };
      setRuntimeStatus(runtime);

      const storage =
        typeof bridge?.getStorageContract === "function"
          ? await bridge.getStorageContract()
          : null;
      setStorageStatus(
        storage?.layout?.mode === "local_user"
          ? { ok: true, mode: "local_user" }
          : { ok: false, reason: "storage_contract_invalid" }
      );

      const ollama = normalizeOllamaStatus(
        await SwarmsyOnboarding.localUserOllamaStatus()
      );
      setOllamaStatus(ollama);

      const storedModelId = readLocalUserOllamaModelSelection();
      const resolved = resolveLocalUserOllamaModelSelection({
        models: ollama.models,
        selectedModelId: storedModelId,
        storedModelId,
      });
      if (resolved.modelId) setSelectedModel(resolved.modelId);
    } finally {
      setIsChecking(false);
    }
  }, [isHostedAdminMode]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    async function boot() {
      if (loginMode === null || isHostedAdminMode) return;
      if (!hasTrustedDesktopBridge(window)) return;
      const desktopCompletion = await readDesktopLocalUserFirstRunCompleted({
        targetWindow: window,
      });
      const completed = desktopCompletion.ok
        ? desktopCompletion.completed
        : readDesktopFirstRunCompleted();
      if (!completed) {
        setVisible(true);
        void runReadinessChecks();
      }
    }
    void boot();
  }, [isHostedAdminMode, loginMode, runReadinessChecks]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    function relaunch() {
      if (isHostedAdminMode || !hasTrustedDesktopBridge(window)) return;
      setManualLaunch(true);
      setVisible(true);
      setStepIndex(0);
      void runReadinessChecks();
    }
    window.addEventListener(DESKTOP_FIRST_RUN_RELAUNCH_EVENT, relaunch);
    return () =>
      window.removeEventListener(DESKTOP_FIRST_RUN_RELAUNCH_EVENT, relaunch);
  }, [isHostedAdminMode, runReadinessChecks]);

  const runtimeCheck = runtimeStatus?.ok && runtimeStatus?.responding !== false;
  const storageCheck = storageStatus?.ok;
  const ollamaCheck = ollamaStatus.reachable && ollamaStatus.status !== "error";
  const installedModelsAvailable = ollamaStatus.models.length > 0;
  const modelCheck = ollamaCheck && installedModelsAvailable;
  const selectedModelInstalled =
    !selectedModel ||
    ollamaStatus.models.some((model) => model.id === selectedModel);
  const runtimeStepReady =
    runtimeCheck && storageCheck && desktopBridgeAvailable;
  const selectedModelReady = !!selectedModel && selectedModelInstalled;
  const canFinish =
    runtimeStepReady && ollamaCheck && modelCheck && selectedModelReady;
  const canAdvanceFromCurrentStep =
    stepIndex === 0 ||
    (stepIndex === 1 && runtimeStepReady) ||
    (stepIndex === 2 && ollamaCheck) ||
    (stepIndex === 3 && modelCheck) ||
    (stepIndex === 4 && selectedModelReady);
  const currentStepHint =
    stepIndex === 1 && !runtimeStepReady
      ? "Runtime, storage, and trusted desktop bridge checks must pass before continuing. You can still skip setup and return later."
      : stepIndex === 2 && !ollamaCheck
        ? "Install or start Ollama manually, then check again before continuing."
        : stepIndex === 3 && !modelCheck
          ? ollamaCheck
            ? `Pull a model manually, for example: ollama pull ${DEFAULT_MODEL}`
            : "Start or check Ollama before verifying installed models."
          : stepIndex === 4 && !selectedModelReady
            ? "Select an installed Ollama model before continuing to Ready."
            : null;

  function goBack() {
    setStepIndex((current) => Math.max(0, current - 1));
  }

  function goNext() {
    if (!canAdvanceFromCurrentStep) return;
    setStepIndex((current) => Math.min(WIZARD_STEPS.length - 1, current + 1));
  }

  const checks = [
    {
      id: "runtime_available",
      label: "Desktop runtime",
      status: runtimeCheck ? "ready" : "blocked",
      message: runtimeCheck
        ? "Runtime launcher is available and responding."
        : "Restart SWARMSY Desktop or start the local runtime, then check again.",
      diagnostic: runtimeCheck ? null : "runtime_healthcheck_failed",
    },
    {
      id: "storage_available",
      label: "Local User storage",
      status: storageCheck ? "ready" : "blocked",
      message: storageCheck
        ? "Local User storage contract is available."
        : "Local User storage could not be verified.",
      diagnostic: storageCheck ? null : "storage_contract_invalid",
    },
    {
      id: "desktop_bridge_available",
      label: "Desktop bridge",
      status: desktopBridgeAvailable ? "ready" : "blocked",
      message: desktopBridgeAvailable
        ? "Trusted desktop bridge can persist Local User settings."
        : "Open this flow from SWARMSY Desktop, not hosted/admin mode.",
      diagnostic: desktopBridgeAvailable ? null : "untrusted_origin",
    },
    {
      id: "ollama_available",
      label: "Ollama",
      status: ollamaCheck ? "ready" : "warning",
      message: ollamaCheck
        ? ollamaStatus.message || "Ollama is reachable."
        : "Install or start Ollama: https://ollama.com",
      diagnostic: ollamaCheck ? null : "ollama_unreachable",
    },
    {
      id: "model_available",
      label: "Installed model",
      status: modelCheck && selectedModelInstalled ? "ready" : "warning",
      message: !ollamaCheck
        ? "Models could not be verified until Ollama is reachable. Start or check Ollama first."
        : modelCheck
          ? "At least one installed model is available."
          : `No models found. Run: ollama pull ${DEFAULT_MODEL}`,
      diagnostic: !ollamaCheck
        ? null
        : modelCheck
          ? selectedModelInstalled
            ? null
            : "selected_model_missing"
          : "no_models_installed",
    },
  ];

  const completeWizard = useCallback(async () => {
    if (!hasTrustedDesktopBridge(window)) {
      showToast(
        "SWARMSY Desktop setup completion can only be saved from the trusted desktop app.",
        "warning"
      );
      return false;
    }

    const mirrored = await mirrorDesktopLocalUserFirstRunCompleted(true, {
      targetWindow: window,
    });
    if (!mirrored?.ok) {
      showToast(
        "SWARMSY Desktop setup completion could not be saved. Check Desktop Local User settings and try again.",
        "warning"
      );
      return false;
    }

    persistDesktopFirstRunCompleted(true);
    setVisible(false);
    setManualLaunch(false);
    showToast("SWARMSY Desktop setup saved.", "success");
    return true;
  }, []);

  const skipWizard = useCallback(async () => {
    const saved = await completeWizard();
    if (saved) return;

    setVisible(false);
    setManualLaunch(false);
    setStepIndex(0);
  }, [completeWizard]);

  function closeManualWizard() {
    setVisible(false);
    setManualLaunch(false);
    setStepIndex(0);
  }

  const handleDismissWizard = manualLaunch ? closeManualWizard : skipWizard;

  const selectModel = useCallback(async (modelId) => {
    const normalized = String(modelId || "").trim();
    setSelectedModel(normalized);
    persistLocalUserOllamaModelSelection(normalized);
    const mirrored = await mirrorDesktopLocalUserOllamaModelSelection(
      normalized,
      {
        targetWindow: window,
      }
    );
    if (!mirrored?.ok) {
      showToast(
        "Desktop local settings sync failed. Browser Local User storage remains active.",
        "warning"
      );
    }
    dispatchSettingsSync(normalized);
  }, []);

  if (!visible || isHostedAdminMode) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm">
      <section className="max-h-full w-full max-w-4xl overflow-y-auto rounded-2xl border border-theme-sidebar-border bg-theme-bg-primary p-6 text-theme-text-primary shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-theme-text-secondary">
              SWARMSY Desktop first-run setup
            </p>
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Desktop size={26} /> Welcome to SWARMSY Desktop
            </h2>
            <p className="text-sm leading-6 text-theme-text-secondary">
              Follow these readiness checks to confirm the desktop runtime,
              Ollama, installed models, and Local User settings before your
              first chat. This wizard never installs software or downloads
              models.
            </p>
          </div>
          <button
            type="button"
            aria-label={
              manualLaunch
                ? "Close SWARMSY Desktop first-run wizard"
                : "Skip SWARMSY Desktop first-run wizard"
            }
            onClick={handleDismissWizard}
            className="rounded-lg border border-theme-sidebar-border p-2 hover:bg-theme-bg-secondary"
          >
            <X size={18} />
          </button>
        </div>

        <ol className="mt-6 grid gap-2 md:grid-cols-6">
          {WIZARD_STEPS.map((step, index) => (
            <li
              key={step}
              className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                index === stepIndex
                  ? "border-teal bg-teal/10 text-teal"
                  : "border-theme-sidebar-border bg-theme-bg-secondary"
              }`}
            >
              Step {index + 1}: {step}
            </li>
          ))}
        </ol>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {checks.map((check) => (
            <div
              key={check.id}
              className={`rounded-xl border p-4 ${checkTone(check.status)}`}
            >
              <div className="flex items-start gap-3">
                {check.status === "ready" ? (
                  <CheckCircle className="mt-0.5 text-emerald-300" size={22} />
                ) : (
                  <Warning className="mt-0.5 text-amber-300" size={22} />
                )}
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{check.label}</p>
                  <p className="text-sm text-theme-text-secondary">
                    {check.message}
                  </p>
                  {check.diagnostic && (
                    <p className="text-xs text-theme-text-secondary">
                      Diagnostic: {check.diagnostic}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-theme-sidebar-border bg-theme-bg-secondary p-4">
          <label
            htmlFor="desktop-first-run-model"
            className="text-sm font-semibold uppercase tracking-[0.2em]"
          >
            Select model
          </label>
          {ollamaStatus.models.length > 0 ? (
            <select
              id="desktop-first-run-model"
              value={selectedModel}
              onChange={(event) => selectModel(event.target.value)}
              className="mt-2 w-full rounded-lg border border-theme-sidebar-border bg-theme-bg-primary px-3 py-2 text-sm outline-none focus:border-teal"
            >
              <option value="">Select an installed model</option>
              {ollamaStatus.models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          ) : (
            <p className="mt-2 text-sm text-theme-text-secondary">
              {!ollamaCheck ? (
                "Models could not be verified. Start or check Ollama first, then run readiness checks again."
              ) : (
                <>
                  No models were reported. Install one manually with:{" "}
                  <code>ollama pull {DEFAULT_MODEL}</code>
                </>
              )}
            </p>
          )}
          {ollamaStatus.endpoint && (
            <p className="mt-2 text-xs text-theme-text-secondary">
              Ollama endpoint: {ollamaStatus.endpoint}
            </p>
          )}
        </div>

        {currentStepHint && (
          <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-theme-text-secondary">
            {currentStepHint}
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-between gap-3">
          <button
            type="button"
            onClick={runReadinessChecks}
            disabled={isChecking}
            className="flex items-center gap-2 rounded-lg border border-theme-sidebar-border px-4 py-2 text-sm font-medium hover:bg-theme-bg-secondary disabled:opacity-60"
          >
            <ArrowClockwise
              className={isChecking ? "animate-spin" : ""}
              size={18}
            />
            Check again
          </button>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleDismissWizard}
              className="rounded-lg border border-theme-sidebar-border px-4 py-2 text-sm font-medium hover:bg-theme-bg-secondary"
            >
              {manualLaunch ? "Close" : "Skip for now"}
            </button>
            <button
              type="button"
              onClick={goBack}
              disabled={stepIndex === 0}
              className="rounded-lg border border-theme-sidebar-border px-4 py-2 text-sm font-medium hover:bg-theme-bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Back
            </button>
            {stepIndex < WIZARD_STEPS.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!canAdvanceFromCurrentStep}
                className="rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={completeWizard}
                disabled={!canFinish}
                className="rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Ready — finish setup
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
