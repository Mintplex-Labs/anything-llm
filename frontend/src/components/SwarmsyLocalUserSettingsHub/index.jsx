import { useRef } from "react";
import { ArrowClockwise, SpinnerGap } from "@phosphor-icons/react";
import SwarmsyDesktopDiagnosticsPanel from "@/components/SwarmsyDesktopDiagnosticsPanel";
import { DESKTOP_FIRST_RUN_RELAUNCH_EVENT } from "@/components/SwarmsyDesktopFirstRunWizard";
import { hasDesktopLocalSettingsBridge } from "@/components/SwarmsyFirstRunOnboarding/localUserOllamaSelection";

const LOCAL_OLLAMA_SETUP_GUIDANCE = [
  "Ollama was not detected.",
  "Start Ollama or configure a compatible endpoint.",
  "SWARMSY does not auto-install Ollama or auto-download models.",
];

function toneClasses(tone = "neutral") {
  if (tone === "success") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-100 light:text-emerald-800";
  }

  if (tone === "warning") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-100 light:text-amber-800";
  }

  return "border-theme-sidebar-border bg-theme-bg-secondary text-theme-text-primary";
}

export default function SwarmsyLocalUserSettingsHub({
  controller,
  className = "",
}) {
  const backupImportInputRef = useRef(null);

  if (!controller) return null;

  const {
    isLoginModePending,
    isHostedAdminMode,
    isLocalUserMode,
    isCheckingLocalOllama,
    isCheckingLocalImageEngine,
    localOllamaStatus,
    localImageEngineStatus,
    localOllamaStatusTone,
    localOllamaStatusTitle,
    hasVerifiedLocalOllamaModels,
    selectedLocalOllamaModel,
    savedLocalOllamaModel,
    currentModelLabel,
    localOllamaSelectionMessage,
    desktopDiagnostics,
    checkLocalUserOllama,
    checkLocalImageEngine,
    onSelectLocalOllamaModel,
    exportBackupToFile,
    importBackupFromText,
  } = controller;

  const safeLocalImageEngineStatus = localImageEngineStatus || {
    success: false,
    mode: "local_user",
    available: false,
    engine: "comfyui",
    url: "http://localhost:8188",
    message: "Local image engine status has not been checked yet.",
  };
  const safeCheckLocalImageEngine =
    typeof checkLocalImageEngine === "function"
      ? checkLocalImageEngine
      : () => {};
  const isHostedBoundary = isHostedAdminMode && !isLocalUserMode;
  const showNeutralPendingState = isLoginModePending && !isHostedBoundary;
  const title = showNeutralPendingState
    ? "Checking environment..."
    : localOllamaStatusTitle;
  const hasTrustedDesktopBridge =
    typeof window !== "undefined" &&
    hasDesktopLocalSettingsBridge({ targetWindow: window });

  function handleSelectLocalOllamaModel(nextModelId) {
    const normalizedModelId = String(nextModelId || "").trim();
    onSelectLocalOllamaModel(normalizedModelId);
  }

  function relaunchDesktopFirstRunWizard() {
    window.dispatchEvent(new CustomEvent(DESKTOP_FIRST_RUN_RELAUNCH_EVENT));
  }

  function handleImportBackupFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      await importBackupFromText(String(e?.target?.result || ""));
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  return (
    <div
      className={`rounded-2xl border p-5 ${
        isHostedAdminMode || isLocalUserMode
          ? toneClasses(localOllamaStatusTone)
          : toneClasses("neutral")
      } ${className}`}
    >
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em]">
          Local User Settings Hub
        </p>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm leading-6">
          Manage Local User Mode status, Ollama model selection, and
          browser-side backup/import in one place.
        </p>
        <p className="text-xs opacity-80">
          Local User data belongs to this browser profile. Hosted/admin server
          data is outside this scope.
        </p>
      </div>

      {isHostedBoundary ? (
        <div className="mt-4 rounded-lg border border-theme-sidebar-border bg-theme-bg-secondary p-3 text-sm">
          Local User Mode is not active in this hosted/admin environment.
        </div>
      ) : showNeutralPendingState ? (
        <div className="mt-4 rounded-lg border border-theme-sidebar-border bg-theme-bg-secondary p-3 text-sm">
          Checking environment before Local User actions are available.
        </div>
      ) : (
        <>
          <div className="mt-4 flex items-start justify-between gap-4">
            <div className="space-y-2">
              {localOllamaStatus.message && (
                <p className="text-sm leading-6">{localOllamaStatus.message}</p>
              )}
              {localOllamaStatus.endpoint && (
                <p className="text-xs opacity-80">
                  Endpoint: {localOllamaStatus.endpoint}
                </p>
              )}
              {savedLocalOllamaModel && !hasVerifiedLocalOllamaModels && (
                <p className="text-xs font-medium">
                  Saved model (unverified): {savedLocalOllamaModel}
                </p>
              )}
              {currentModelLabel && (
                <p className="text-xs opacity-80">
                  Current model: {currentModelLabel}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              {hasTrustedDesktopBridge && (
                <button
                  type="button"
                  onClick={relaunchDesktopFirstRunWizard}
                  className="flex items-center justify-center gap-x-2 rounded-lg border border-theme-sidebar-border bg-theme-bg-secondary px-4 py-2 text-sm font-medium text-theme-text-primary transition hover:bg-theme-bg-menu"
                >
                  First-run wizard
                </button>
              )}
              <button
                type="button"
                onClick={checkLocalUserOllama}
                disabled={isCheckingLocalOllama}
                className="flex items-center justify-center gap-x-2 rounded-lg border border-theme-sidebar-border bg-theme-bg-secondary px-4 py-2 text-sm font-medium text-theme-text-primary transition hover:bg-theme-bg-menu disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCheckingLocalOllama ? (
                  <SpinnerGap className="animate-spin" size={18} />
                ) : (
                  <ArrowClockwise size={18} />
                )}
                Check again
              </button>
            </div>
          </div>

          {localOllamaStatus.status === "unreachable" && (
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-6">
              {LOCAL_OLLAMA_SETUP_GUIDANCE.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          )}

          {localOllamaStatus.status === "no_models" && (
            <p className="mt-4 text-sm leading-6">
              Ollama is connected, but no installed models were reported yet.
            </p>
          )}

          {localOllamaStatus.models.length > 0 && (
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em]">
                  Installed Ollama models
                </h3>
                <ul className="grid gap-2 md:grid-cols-2">
                  {localOllamaStatus.models.map((model) => (
                    <li
                      key={model.id}
                      className="rounded-lg border border-theme-sidebar-border bg-theme-bg-secondary px-3 py-2 text-sm font-medium text-theme-text-primary"
                    >
                      {model.name}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="local-user-ollama-model"
                  className="text-sm font-semibold uppercase tracking-[0.2em]"
                >
                  Selected Ollama model
                </label>
                <select
                  id="local-user-ollama-model"
                  value={selectedLocalOllamaModel}
                  onChange={(event) =>
                    handleSelectLocalOllamaModel(event.target.value)
                  }
                  className="w-full rounded-lg border border-theme-sidebar-border bg-theme-bg-secondary px-3 py-2 text-sm text-theme-text-primary outline-none focus:border-teal"
                >
                  {(localOllamaStatus.models.length > 1 ||
                    !selectedLocalOllamaModel) && (
                    <option value="">Select an installed model</option>
                  )}
                  {localOllamaStatus.models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs opacity-80">
                  Model selection stays in Local User browser storage (fallback)
                  and, in trusted desktop mode, is mirrored to a local desktop
                  settings file.
                </p>
                {localOllamaSelectionMessage && (
                  <p className="text-xs font-medium text-amber-200 light:text-amber-800">
                    {localOllamaSelectionMessage}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 rounded-lg border border-theme-sidebar-border bg-theme-bg-secondary p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-theme-text-secondary">
                  Local Image Engine
                </p>
                <h3 className="text-base font-semibold text-theme-text-primary">
                  {safeLocalImageEngineStatus.available
                    ? "Connected"
                    : "Not connected"}
                </h3>
                <p className="text-sm text-theme-text-secondary">
                  Engine: {safeLocalImageEngineStatus.engine || "comfyui"}
                </p>
                <p className="text-xs opacity-80">
                  URL:{" "}
                  {safeLocalImageEngineStatus.url || "http://localhost:8188"}
                </p>
                {safeLocalImageEngineStatus.message && (
                  <p className="text-sm leading-6">
                    {safeLocalImageEngineStatus.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={safeCheckLocalImageEngine}
                disabled={isCheckingLocalImageEngine}
                className="flex items-center justify-center gap-x-2 rounded-lg border border-theme-sidebar-border bg-theme-bg-secondary px-4 py-2 text-sm font-medium text-theme-text-primary transition hover:bg-theme-bg-menu disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCheckingLocalImageEngine ? (
                  <SpinnerGap className="animate-spin" size={18} />
                ) : (
                  <ArrowClockwise size={18} />
                )}
                Check image engine
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-theme-sidebar-border bg-theme-bg-secondary p-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-theme-text-secondary">
                Local User Data
              </p>
              <h3 className="text-base font-semibold text-theme-text-primary">
                Backup, Export, and Import
              </h3>
              <p className="text-sm text-theme-text-secondary">
                This backup covers browser-side SWARMSY Local User settings
                only, plus trusted desktop local settings file state when the
                desktop bridge is available. It does not export hosted server
                data, secrets, API keys, or auth tokens.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={exportBackupToFile}
                className="rounded-lg border border-theme-sidebar-border bg-theme-bg-secondary px-4 py-2 text-sm font-medium text-theme-text-primary transition hover:bg-theme-bg-menu"
              >
                Export Backup
              </button>
              <button
                type="button"
                onClick={() => backupImportInputRef.current?.click()}
                className="rounded-lg border border-theme-sidebar-border bg-theme-bg-secondary px-4 py-2 text-sm font-medium text-theme-text-primary transition hover:bg-theme-bg-menu"
              >
                Import Backup
              </button>
              <input
                ref={backupImportInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleImportBackupFile}
                aria-hidden="true"
              />
            </div>
          </div>

          <SwarmsyDesktopDiagnosticsPanel
            diagnostics={desktopDiagnostics}
            className="mt-6"
          />
        </>
      )}
    </div>
  );
}
