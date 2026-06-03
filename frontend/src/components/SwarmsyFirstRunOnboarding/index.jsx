import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowClockwise,
  CheckCircle,
  SpinnerGap,
  WarningCircle,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import SwarmsyOnboarding from "@/models/swarmsyOnboarding";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { PENDING_HOME_MESSAGE } from "@/utils/constants";
import { buildPendingHomeMessage } from "@/utils/pendingHomeMessage";
import {
  ACTION_HUB_GROUPS,
  ACTION_HUB_HELPER_COPY,
  INTAKE_LOCAL_USER_MODEL_REQUIRED_MESSAGE,
  INTAKE_LOCAL_USER_MODEL_UNVERIFIED_MESSAGE,
  ACTION_HUB_TITLE,
  getActionHubActionState,
} from "./actionHub";
import {
  getIntakeStarterMessage,
  getLocalUserOllamaRuntimeSelection,
} from "./handoff";
import {
  buildCampaignDayStarterMessage,
  canUseCampaignCalendar,
  getCampaignCalendarBlockedMessage,
} from "./campaignCalendar";
import {
  buildMemoryLockStarterMessage,
  canContinueFromMemoryLock,
  MEMORY_LOCK_BLOCKED_MESSAGE,
  MEMORY_LOCK_EMPTY_ERROR,
} from "./memoryLock";
import {
  buildProofReviewStarterMessage,
  canReviewProof,
  getProofTrackerBlockedMessage,
  PROOF_TRACKER_DOCTRINE_UNAVAILABLE_MESSAGE,
  PROOF_TRACKER_HIVE_MISSING_MESSAGE,
  PROOF_TRACKER_UNDERLOADED_MESSAGE,
} from "./proofTracker";
import {
  hasDesktopLocalSettingsBridge,
  mirrorDesktopLocalUserOllamaModelSelection,
  persistLocalUserOllamaModelSelection,
  readLocalUserOllamaModelSelection,
  readDesktopLocalUserSettingsForBackup,
  restoreDesktopLocalUserSettingsFromBackup,
  resolveLocalUserOllamaModelSelection,
} from "./localUserOllamaSelection";
import {
  exportLocalUserBackupV2,
  importLocalUserBackupV2,
  resolveLocalUserBackupImportModelState,
} from "@/utils/localUserBackup";
import SwarmsyLocalUserSettingsHub from "@/components/SwarmsyLocalUserSettingsHub";
import { LOCAL_USER_SETTINGS_SYNC_EVENT } from "@/components/SwarmsyLocalUserSettingsHub/useLocalUserSettingsHub";

const IDENTITY_MODES = [
  {
    id: "face",
    label: "Face Identity Mode",
    description: "Build in public with SPARKY guiding the intake.",
  },
  {
    id: "hidden",
    label: "Hidden Identity Mode",
    description: "Build the hidden identity path before going public.",
  },
  {
    id: "existing-project",
    label: "Existing Project",
    description: "Continue from an existing project workspace when ready.",
  },
  {
    id: "memory-lock",
    label: "Load Memory Lock",
    description: "Continue a returning SWARMSY project from your latest lock.",
  },
];
const MEMORY_LOCK_ERROR_ID = "swarmsy-memory-lock-error";
const PROOF_TRACKER_ERROR_ID = "swarmsy-proof-tracker-error";
const CAMPAIGN_DATE_EMPTY_ERROR = "Pick a date to create a campaign day.";
const IMPORTED_LOCAL_OLLAMA_MODEL_PENDING_MESSAGE =
  "Imported Ollama model saved. SWARMSY will restore it after Ollama status is verified.";
const IMPORTED_LOCAL_OLLAMA_MODEL_MISSING_MESSAGE =
  "Imported Ollama model is not currently installed. Select a model to continue.";

function getDefaultCampaignDate() {
  const now = new Date();
  const timezoneOffsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().slice(0, 10);
}

function createFallbackStatus(message) {
  return {
    success: false,
    mode: "swarmsy_onboarding",
    workspace: {
      exists: false,
      state: "setup_needed",
      ready: false,
    },
    doctrine: {
      statusAvailable: false,
      docsRootAvailable: false,
      requiredMissing: null,
      requiredNonLoadable: null,
      optionalMissing: null,
      requiredLoadable: null,
      requiredAttached: null,
      requiredPendingIngestion: null,
      ingestionRequired: null,
      note: message,
    },
    nextAction: {
      type: "check_onboarding_status",
      label: "Check HIVE Readiness",
    },
  };
}

const LOCAL_OLLAMA_UI_STATES = new Set([
  "checking",
  "reachable",
  "unreachable",
  "no_models",
  "error",
]);

function normalizeLocalUserModel(model = null, index = 0) {
  const name = String(model?.name || model?.id || "").trim();
  if (!name) return null;
  const rawId = String(model?.id ?? "").trim();
  return {
    id: rawId || name || `model-${index}`,
    name,
  };
}

function normalizeLocalUserOllamaStatus(response = null) {
  if (response?.mode !== "local_user" || response?.source === "fallback")
    return null;
  const status = LOCAL_OLLAMA_UI_STATES.has(response?.status)
    ? response.status
    : "error";
  const models = Array.isArray(response?.models)
    ? response.models.map(normalizeLocalUserModel).filter(Boolean)
    : [];

  return {
    status,
    models,
    endpoint: response?.endpoint || null,
    message: response?.message || null,
  };
}

function localOllamaStatusTone(status = "checking") {
  if (status === "reachable") return "success";
  if (status === "unreachable" || status === "error") return "warning";
  return "neutral";
}

function localOllamaStatusTitle(status = "checking") {
  if (status === "checking") return "Checking Local User Mode Ollama status...";
  if (status === "reachable") return "Ollama is reachable.";
  if (status === "no_models")
    return "Ollama is reachable, but no models are installed.";
  if (status === "unreachable") return "Ollama was not detected.";
  return "Ollama status could not be confirmed.";
}

function doctrineUnavailable(status) {
  const doctrine = status?.doctrine || {};
  return (
    doctrine.statusAvailable !== true ||
    doctrine.docsRootAvailable !== true ||
    Number(doctrine.requiredMissing || 0) > 0 ||
    Number(doctrine.requiredNonLoadable || 0) > 0
  );
}

function statusCopy(status) {
  if (status?.success === false && doctrineUnavailable(status)) {
    return {
      title: "Doctrine readiness cannot be confirmed right now.",
      description: "Check your local/server setup or try again.",
      tone: "warning",
    };
  }

  if (!status?.workspace?.exists) {
    return {
      title: "No SWARMSY HIVE found.",
      description: "Create your HIVE to begin.",
      tone: "warning",
    };
  }

  if (doctrineUnavailable(status)) {
    return {
      title: "Doctrine readiness cannot be confirmed right now.",
      description: "Check your local/server setup or try again.",
      tone: "warning",
    };
  }

  if (!status.workspace.ready) {
    return {
      title:
        "Your SWARMSY HIVE exists, but the doctrine docs are not fully loaded yet.",
      description: "Load required doctrine docs before starting intake.",
      tone: "warning",
    };
  }

  return {
    title: "Your SWARMSY HIVE is ready.",
    description: "Choose how you want to build.",
    tone: "success",
  };
}

function toneClasses(tone = "neutral") {
  if (tone === "success") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-100 light:text-emerald-800";
  }

  if (tone === "warning") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-100 light:text-amber-800";
  }

  return "border-theme-sidebar-border bg-theme-bg-secondary text-theme-text-primary";
}

function friendlyFailedItem(item = {}) {
  return {
    path: item.path || item.file || item.name || "Unknown doctrine doc",
    reason: item.reason || item.message || "Unknown failure.",
  };
}

function ActionButton({ busy, icon: Icon, children, ...props }) {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-x-2 rounded-lg border border-theme-sidebar-border bg-theme-bg-secondary px-4 py-2 text-sm font-medium text-theme-text-primary transition hover:bg-theme-bg-menu disabled:cursor-not-allowed disabled:opacity-60"
      {...props}
      disabled={busy || props.disabled}
    >
      {busy ? (
        <SpinnerGap className="animate-spin" size={18} />
      ) : (
        <Icon size={18} />
      )}
      {children}
    </button>
  );
}

export default function SwarmsyFirstRunOnboarding({ children = null }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [lastActionResult, setLastActionResult] = useState(null);
  const [memoryLockInput, setMemoryLockInput] = useState("");
  const [memoryLockError, setMemoryLockError] = useState("");
  const [memoryLockPanelOpen, setMemoryLockPanelOpen] = useState(false);
  const [proofReviewInput, setProofReviewInput] = useState("");
  const [proofReviewError, setProofReviewError] = useState("");
  const [proofReviewPanelOpen, setProofReviewPanelOpen] = useState(false);
  const [campaignDate, setCampaignDate] = useState(getDefaultCampaignDate);
  const [campaignFocus, setCampaignFocus] = useState("");
  const [campaignProofAssets, setCampaignProofAssets] = useState("");
  const [isLocalUserMode, setIsLocalUserMode] = useState(false);
  const [localOllamaStatus, setLocalOllamaStatus] = useState({
    status: "checking",
    models: [],
    endpoint: null,
    message: null,
  });
  const [selectedLocalOllamaModel, setSelectedLocalOllamaModel] = useState("");
  const [localOllamaSelectionMessage, setLocalOllamaSelectionMessage] =
    useState(null);
  const localOllamaRefreshControllerRef = useRef(null);
  const hasConfirmedLocalUserModeRef = useRef(false);
  const activeStatus = status || createFallbackStatus();
  const canLoadMemoryLock = canContinueFromMemoryLock(activeStatus);
  const canUseProofTracker = canReviewProof(activeStatus);
  const proofTrackerBlockedMessage =
    getProofTrackerBlockedMessage(activeStatus);
  const canUseCalendar = canUseCampaignCalendar(activeStatus);
  const campaignBlockedMessage =
    getCampaignCalendarBlockedMessage(activeStatus);

  const beginLocalUserOllamaRequest = useCallback(() => {
    localOllamaRefreshControllerRef.current?.abort();
    const controller = new AbortController();
    localOllamaRefreshControllerRef.current = controller;
    return controller;
  }, []);

  const isLatestLocalUserOllamaRequest = useCallback((signal) => {
    if (!signal) return true;
    return localOllamaRefreshControllerRef.current?.signal === signal;
  }, []);

  const releaseLocalUserOllamaRequest = useCallback((controller) => {
    if (localOllamaRefreshControllerRef.current !== controller) return false;
    localOllamaRefreshControllerRef.current = null;
    return true;
  }, []);

  const loadStatus = useCallback(async () => {
    const response = await SwarmsyOnboarding.status();
    if (response?.success || response?.mode === "swarmsy_onboarding") {
      setStatus(response);
      return response;
    }

    const fallbackStatus = createFallbackStatus(
      response?.message ||
        "Doctrine readiness cannot be confirmed right now. Check your local/server setup or try again."
    );
    setStatus(fallbackStatus);
    return fallbackStatus;
  }, []);

  const syncLocalUserOllamaStatus = useCallback(
    async ({ signal } = {}) => {
      if (signal?.aborted || !isLatestLocalUserOllamaRequest(signal))
        return null;
      setLocalOllamaStatus((current) => ({
        ...current,
        status: "checking",
        models: [],
        endpoint: null,
        message: null,
      }));
      try {
        const response = await SwarmsyOnboarding.localUserOllamaStatus({
          signal,
        });
        if (signal?.aborted || !isLatestLocalUserOllamaRequest(signal))
          return null;
        if (response?.source === "fallback") {
          if (hasConfirmedLocalUserModeRef.current) {
            setLocalOllamaStatus({
              status: "error",
              models: [],
              endpoint: null,
              message:
                response?.message ||
                "Failed to resolve SWARMSY local-user Ollama status.",
            });
          } else {
            setIsLocalUserMode(false);
          }
          return null;
        }
        const normalizedStatus = normalizeLocalUserOllamaStatus(response);
        if (!normalizedStatus) {
          setIsLocalUserMode(false);
          return null;
        }

        hasConfirmedLocalUserModeRef.current = true;
        setIsLocalUserMode(true);
        setLocalOllamaStatus(normalizedStatus);
        return normalizedStatus;
      } catch (error) {
        if (
          signal?.aborted ||
          error?.name === "AbortError" ||
          !isLatestLocalUserOllamaRequest(signal)
        ) {
          return null;
        }
        throw error;
      }
    },
    [isLatestLocalUserOllamaRequest]
  );

  useEffect(() => {
    let canceled = false;

    async function syncStatus() {
      setLoading(true);
      const nextStatus = await loadStatus();
      if (!canceled) {
        setStatus(nextStatus);
        setLoading(false);
      }
    }

    syncStatus();
    return () => {
      canceled = true;
    };
  }, [loadStatus]);

  useEffect(() => {
    if (canLoadMemoryLock) return;
    setSelectedMode(null);
    setMemoryLockPanelOpen(false);
    setMemoryLockInput("");
    setMemoryLockError("");
  }, [canLoadMemoryLock]);

  useEffect(() => {
    if (canUseProofTracker) return;
    setProofReviewPanelOpen(false);
    setProofReviewInput("");
    setProofReviewError("");
  }, [canUseProofTracker]);

  useEffect(() => {
    const controller = beginLocalUserOllamaRequest();
    syncLocalUserOllamaStatus({ signal: controller.signal }).finally(() => {
      releaseLocalUserOllamaRequest(controller);
    });
  }, [
    beginLocalUserOllamaRequest,
    releaseLocalUserOllamaRequest,
    syncLocalUserOllamaStatus,
  ]);

  useEffect(() => {
    return () => localOllamaRefreshControllerRef.current?.abort();
  }, []);

  useEffect(() => {
    const hasVerifiedLocalOllamaModels =
      localOllamaStatus.status === "reachable" ||
      localOllamaStatus.status === "no_models";
    if (!hasVerifiedLocalOllamaModels) {
      setLocalOllamaSelectionMessage(null);
      return;
    }

    const selectedModel = localOllamaStatus.models.find(
      (model) => model.id === selectedLocalOllamaModel
    );
    const resolved = resolveLocalUserOllamaModelSelection({
      models: localOllamaStatus.models,
      selectedModelId: selectedLocalOllamaModel,
      storedModelId: readLocalUserOllamaModelSelection(),
    });

    if (resolved.modelId) {
      persistLocalUserOllamaModelSelection(resolved.modelId);
    }

    if (resolved.modelId !== selectedLocalOllamaModel) {
      setSelectedLocalOllamaModel(resolved.modelId);
    }

    if (resolved.source === "stale_missing") {
      setLocalOllamaSelectionMessage(
        "Your saved Ollama model is not currently installed. Select a model to continue."
      );
      return;
    }

    if (
      resolved.source === "single_available" &&
      !selectedModel &&
      localOllamaStatus.models.length === 1
    ) {
      const selectedName =
        localOllamaStatus.models[0]?.name || resolved.modelId;
      setLocalOllamaSelectionMessage(
        `Only one installed Ollama model was found, so it was selected automatically: ${selectedName}.`
      );
      return;
    }

    setLocalOllamaSelectionMessage(null);
  }, [
    localOllamaStatus.models,
    localOllamaStatus.status,
    selectedLocalOllamaModel,
  ]);

  useEffect(() => {
    function syncFromSettingsHub() {
      const restoredModelId = readLocalUserOllamaModelSelection();
      if (!restoredModelId) {
        setSelectedLocalOllamaModel("");
        setLocalOllamaSelectionMessage(null);
        return;
      }

      if (!hasVerifiedLocalOllamaModels) {
        setSelectedLocalOllamaModel("");
        setLocalOllamaSelectionMessage(
          IMPORTED_LOCAL_OLLAMA_MODEL_PENDING_MESSAGE
        );
        return;
      }

      const importedModelIsInstalled = localOllamaStatus.models.some(
        (model) => model.id === restoredModelId
      );

      if (importedModelIsInstalled) {
        setSelectedLocalOllamaModel(restoredModelId);
        setLocalOllamaSelectionMessage(null);
      } else {
        setSelectedLocalOllamaModel("");
        setLocalOllamaSelectionMessage(
          IMPORTED_LOCAL_OLLAMA_MODEL_MISSING_MESSAGE
        );
      }
    }

    window.addEventListener(
      LOCAL_USER_SETTINGS_SYNC_EVENT,
      syncFromSettingsHub
    );
    return () =>
      window.removeEventListener(
        LOCAL_USER_SETTINGS_SYNC_EVENT,
        syncFromSettingsHub
      );
  }, [localOllamaStatus.status, localOllamaStatus.models]);

  const copy = statusCopy(activeStatus);
  const intakeStarter = getIntakeStarterMessage(selectedMode);
  const canCreateCampaignDay = canUseCalendar && Boolean(campaignDate?.trim());
  const actionHubState = getActionHubActionState({
    status: activeStatus,
    selectedMode,
    busyAction,
    runtimeMode: isLocalUserMode ? "local_user" : "hosted_admin",
    localOllamaStatus: localOllamaStatus.status,
    selectedLocalOllamaModel,
    localOllamaModels: localOllamaStatus.models,
  });
  const selectedIdentityMode = IDENTITY_MODES.find(
    (mode) => mode.id === selectedMode && mode.id !== "memory-lock"
  );
  const buildGroup = ACTION_HUB_GROUPS.find((group) => group.id === "build");
  const continueGroup = ACTION_HUB_GROUPS.find(
    (group) => group.id === "continue"
  );
  const launchGroup = ACTION_HUB_GROUPS.find((group) => group.id === "launch");
  const verifyGroup = ACTION_HUB_GROUPS.find((group) => group.id === "verify");
  const localOllamaTone = localOllamaStatusTone(localOllamaStatus.status);
  const localOllamaTitle = localOllamaStatusTitle(localOllamaStatus.status);
  const hasVerifiedLocalOllamaModels =
    localOllamaStatus.status === "reachable" ||
    localOllamaStatus.status === "no_models";
  const selectedLocalOllamaModelIsInstalled =
    selectedLocalOllamaModel &&
    localOllamaStatus.models.some(
      (model) => model.id === selectedLocalOllamaModel
    );

  async function refreshReadiness() {
    setBusyAction("refresh");
    setLastActionResult(null);
    const nextStatus = await loadStatus();
    if (!nextStatus?.success) {
      showToast(
        nextStatus?.doctrine?.note ||
          nextStatus?.message ||
          "Doctrine readiness cannot be confirmed right now.",
        "warning"
      );
    }
    setBusyAction(null);
  }

  async function checkLocalUserOllama() {
    if (busyAction) return;

    setBusyAction("local-ollama-refresh");

    const controller = beginLocalUserOllamaRequest();

    try {
      await syncLocalUserOllamaStatus({ signal: controller.signal });
    } finally {
      if (
        releaseLocalUserOllamaRequest(controller) &&
        !controller.signal.aborted
      ) {
        setBusyAction(null);
      }
    }
  }

  async function exportBackupToFile() {
    const backup = await exportLocalUserBackupV2({
      readDesktopLocalSettings: async () => {
        if (typeof window === "undefined") return { ok: false };
        return readDesktopLocalUserSettingsForBackup({ targetWindow: window });
      },
    });
    const json = JSON.stringify(backup, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `swarmsy-local-user-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Local User backup exported.", "success");
  }

  async function importBackupFromText(rawText = "") {
    try {
      const data = JSON.parse(rawText);
      const result = await importLocalUserBackupV2(data, {
        applyDesktopLocalSettings: async (state) => {
          if (typeof window === "undefined") return { ok: false };
          return restoreDesktopLocalUserSettingsFromBackup(state, {
            targetWindow: window,
          });
        },
      });
      if (!result.success) {
        showToast(`Import failed: ${result.errors.join(" ")}`, "error");
        return false;
      }

      const browserModelWasRestored = result?.restored?.includes("ollamaModel");
      const browserRestoredModelId = browserModelWasRestored
        ? readLocalUserOllamaModelSelection()
        : "";
      const desktopRestoredModelId = String(
        result?.restoredDesktopState?.ollamaModel || ""
      ).trim();
      const importModelState = resolveLocalUserBackupImportModelState({
        browserModelWasRestored,
        browserRestoredModelId,
        desktopRestoredModelId,
      });
      const restoredModelId = importModelState.restoredModelId;
      if (importModelState.shouldMirrorBrowserModel) {
        if (
          typeof window !== "undefined" &&
          hasDesktopLocalSettingsBridge({ targetWindow: window })
        ) {
          void mirrorDesktopLocalUserOllamaModelSelection(
            importModelState.mirrorModelId,
            { targetWindow: window }
          );
        }
      }
      if (!restoredModelId) {
        setSelectedLocalOllamaModel("");
        setLocalOllamaSelectionMessage(null);
      } else if (hasVerifiedLocalOllamaModels) {
        const importedModelIsInstalled = localOllamaStatus.models.some(
          (model) => model.id === restoredModelId
        );

        if (importedModelIsInstalled) {
          setSelectedLocalOllamaModel(restoredModelId);
          setLocalOllamaSelectionMessage(null);
        } else {
          setSelectedLocalOllamaModel("");
          setLocalOllamaSelectionMessage(
            IMPORTED_LOCAL_OLLAMA_MODEL_MISSING_MESSAGE
          );
        }
      } else {
        setSelectedLocalOllamaModel("");
        setLocalOllamaSelectionMessage(
          IMPORTED_LOCAL_OLLAMA_MODEL_PENDING_MESSAGE
        );

        const controller = beginLocalUserOllamaRequest();
        try {
          await syncLocalUserOllamaStatus({ signal: controller.signal });
        } catch {
          showToast(
            "Backup imported, but SWARMSY could not refresh Local User Mode Ollama status.",
            "warning"
          );
        } finally {
          releaseLocalUserOllamaRequest(controller);
        }
      }

      window.dispatchEvent(
        new CustomEvent(LOCAL_USER_SETTINGS_SYNC_EVENT, {
          detail: {
            reason: "backup_import",
            model: restoredModelId || "",
          },
        })
      );

      showToast(
        `Backup imported. ${result.restored.length} setting(s) restored.`,
        "success"
      );
      return true;
    } catch {
      showToast(
        "Could not read backup file. The file must be valid JSON.",
        "error"
      );
      return false;
    }
  }

  async function createHive() {
    setBusyAction("create-hive");
    setLastActionResult(null);
    const result = await SwarmsyOnboarding.createHive();
    setLastActionResult({ kind: "create-hive", ...result });
    if (result?.success) {
      showToast("SWARMSY HIVE is ready for a readiness check.", "success");
      await loadStatus();
    } else {
      showToast(result?.message || "Failed to create SWARMSY HIVE.", "error");
    }
    setBusyAction(null);
  }

  async function ingestRequiredDocs() {
    setBusyAction("ingest-docs");
    const result = await SwarmsyOnboarding.ingestRequiredDocs();
    setLastActionResult({ kind: "ingest-docs", ...result });
    if (result?.success && !result?.partial) {
      showToast(
        result?.message || "SWARMSY required docs ingested successfully.",
        "success"
      );
    } else if (result?.success && result?.partial) {
      showToast("Some doctrine docs could not be loaded.", "warning");
    } else {
      showToast(
        result?.message || "Failed to ingest required doctrine docs.",
        "error"
      );
    }
    await loadStatus();
    setBusyAction(null);
  }

  function startIntake() {
    const disabledReason = actionHubState.actions.startIntake.disabledReason;
    if (disabledReason) {
      showToast(disabledReason, "warning");
      return;
    }
    if (isLocalUserMode) {
      if (!hasVerifiedLocalOllamaModels) {
        showToast(INTAKE_LOCAL_USER_MODEL_UNVERIFIED_MESSAGE, "warning");
        return;
      }
      if (!selectedLocalOllamaModel || !selectedLocalOllamaModelIsInstalled) {
        showToast(INTAKE_LOCAL_USER_MODEL_REQUIRED_MESSAGE, "warning");
        return;
      }
    }

    const runtimeSelection = getLocalUserOllamaRuntimeSelection({
      mode: isLocalUserMode ? "local_user" : "hosted_admin",
      model: selectedLocalOllamaModel,
    });

    const handoffPayload = {
      message: intakeStarter,
      attachments: [],
    };
    if (runtimeSelection) {
      handoffPayload.runtime = runtimeSelection;
    }

    setBusyAction("start-intake");
    try {
      sessionStorage.setItem(
        PENDING_HOME_MESSAGE,
        JSON.stringify(
          buildPendingHomeMessage({
            ...handoffPayload,
            workspaceSlug: activeStatus.workspace.slug,
            threadSlug: null,
          })
        )
      );
    } catch {
      showToast(
        "The intake handoff could not be stored for chat. Enable browser session storage or try again.",
        "error"
      );
      setBusyAction(null);
      return;
    }
    navigate(paths.workspace.chat(activeStatus.workspace.slug));
  }

  function openMemoryLockPanel() {
    if (!canLoadMemoryLock) {
      showToast(MEMORY_LOCK_BLOCKED_MESSAGE, "warning");
      return;
    }

    setSelectedMode("memory-lock");
    setMemoryLockError("");
    setMemoryLockPanelOpen(true);
  }

  function closeMemoryLockPanel() {
    setMemoryLockError("");
    setMemoryLockInput("");
    setMemoryLockPanelOpen(false);
    if (selectedMode === "memory-lock") {
      setSelectedMode(null);
    }
  }

  function continueFromMemoryLock() {
    setBusyAction("memory-lock");
    if (!canLoadMemoryLock) {
      showToast(MEMORY_LOCK_BLOCKED_MESSAGE, "warning");
      setBusyAction(null);
      return;
    }

    const starterMessage = buildMemoryLockStarterMessage(memoryLockInput);
    if (!starterMessage) {
      setMemoryLockError(MEMORY_LOCK_EMPTY_ERROR);
      setBusyAction(null);
      return;
    }

    try {
      sessionStorage.setItem(
        PENDING_HOME_MESSAGE,
        JSON.stringify(
          buildPendingHomeMessage({
            message: starterMessage,
            attachments: [],
            workspaceSlug: activeStatus.workspace.slug,
            threadSlug: null,
          })
        )
      );
    } catch {
      setMemoryLockError(
        "This memory lock could not be stored for chat handoff. Paste a shorter lock or enable browser session storage, then try again."
      );
      setBusyAction(null);
      return;
    }
    navigate(paths.workspace.chat(activeStatus.workspace.slug));
  }

  function createCampaignDay() {
    setBusyAction("campaign-calendar");
    if (!canUseCalendar) {
      showToast(campaignBlockedMessage, "warning");
      setBusyAction(null);
      return;
    }

    if (!campaignDate?.trim()) {
      showToast(CAMPAIGN_DATE_EMPTY_ERROR, "warning");
      setBusyAction(null);
      return;
    }

    const starterMessage = buildCampaignDayStarterMessage({
      selectedDate: campaignDate,
      campaignFocus,
      proofAssetsResults: campaignProofAssets,
    });

    if (!starterMessage) {
      showToast(CAMPAIGN_DATE_EMPTY_ERROR, "warning");
      setBusyAction(null);
      return;
    }

    try {
      sessionStorage.setItem(
        PENDING_HOME_MESSAGE,
        JSON.stringify(
          buildPendingHomeMessage({
            message: starterMessage,
            attachments: [],
            workspaceSlug: activeStatus.workspace.slug,
            threadSlug: null,
          })
        )
      );
    } catch {
      showToast(
        "This campaign handoff could not be stored for chat handoff. Use shorter inputs and try again.",
        "error"
      );
      setBusyAction(null);
      return;
    }

    navigate(paths.workspace.chat(activeStatus.workspace.slug));
  }

  function openProofReviewPanel() {
    if (!canUseProofTracker) {
      showToast(proofTrackerBlockedMessage, "warning");
      return;
    }

    setProofReviewError("");
    setProofReviewPanelOpen(true);
  }

  function closeProofReviewPanel() {
    setProofReviewError("");
    setProofReviewInput("");
    setProofReviewPanelOpen(false);
  }

  function sendProofReviewToSparky() {
    setBusyAction("proof-review");
    if (!activeStatus?.workspace?.exists) {
      showToast(PROOF_TRACKER_HIVE_MISSING_MESSAGE, "warning");
      setBusyAction(null);
      return;
    }

    if (
      activeStatus?.doctrine?.statusAvailable !== true ||
      activeStatus?.doctrine?.docsRootAvailable !== true
    ) {
      showToast(PROOF_TRACKER_DOCTRINE_UNAVAILABLE_MESSAGE, "warning");
      setBusyAction(null);
      return;
    }

    if (
      !activeStatus?.workspace?.ready ||
      Number(activeStatus?.doctrine?.requiredMissing || 0) > 0 ||
      Number(activeStatus?.doctrine?.requiredNonLoadable || 0) > 0
    ) {
      showToast(PROOF_TRACKER_UNDERLOADED_MESSAGE, "warning");
      setBusyAction(null);
      return;
    }

    if (!activeStatus?.workspace?.slug) {
      showToast(PROOF_TRACKER_DOCTRINE_UNAVAILABLE_MESSAGE, "warning");
      setBusyAction(null);
      return;
    }

    const starterMessage = buildProofReviewStarterMessage(proofReviewInput);

    try {
      sessionStorage.setItem(
        PENDING_HOME_MESSAGE,
        JSON.stringify(
          buildPendingHomeMessage({
            message: starterMessage,
            attachments: [],
            workspaceSlug: activeStatus.workspace.slug,
            threadSlug: null,
          })
        )
      );
    } catch {
      setProofReviewError(
        "This proof note could not be stored for chat handoff. Paste a shorter note or enable browser session storage, then try again."
      );
      setBusyAction(null);
      return;
    }

    closeProofReviewPanel();
    navigate(paths.workspace.chat(activeStatus.workspace.slug));
  }

  if (
    !loading &&
    activeStatus?.mode &&
    activeStatus.mode !== "swarmsy_onboarding"
  )
    return children;

  const failedItems = (lastActionResult?.failed || []).map(friendlyFailedItem);

  if (loading) {
    return (
      <div
        style={{ height: "calc(100% - 32px)" }}
        className="transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-zinc-900 light:bg-white w-full h-full overflow-hidden border-none light:border light:border-theme-modal-border"
      >
        <div className="flex h-full w-full items-center justify-center">
          <SpinnerGap
            size={28}
            className="animate-spin text-theme-text-secondary"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ height: "calc(100% - 32px)" }}
      className="transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-zinc-900 light:bg-white w-full h-full overflow-y-auto border-none light:border light:border-theme-modal-border"
    >
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col gap-y-6 px-6 py-8 md:px-10">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-theme-text-secondary">
            Welcome to SWARMSY HIVE.
          </p>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-theme-text-primary md:text-4xl">
              SPARKY is your project manager.
            </h1>
            <p className="max-w-2xl text-base text-theme-text-secondary">
              Are we building you as the face, or building a hidden identity?
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.4fr,0.9fr]">
          <div className={`rounded-2xl border p-5 ${toneClasses(copy.tone)}`}>
            <div className="flex items-start gap-3">
              {copy.tone === "success" ? (
                <CheckCircle size={22} weight="fill" className="mt-0.5" />
              ) : (
                <WarningCircle size={22} weight="fill" className="mt-0.5" />
              )}
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">{copy.title}</h2>
                <p className="text-sm leading-6">{copy.description}</p>
                {activeStatus?.doctrine?.note && (
                  <p className="text-xs leading-5 opacity-80">
                    {activeStatus.doctrine.note}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-theme-sidebar-border bg-theme-bg-secondary p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-theme-text-secondary">
              HIVE snapshot
            </h2>
            <div className="mt-4 space-y-3 text-sm text-theme-text-primary">
              <div>
                <p className="text-theme-text-secondary">Workspace</p>
                <p className="font-medium">
                  {activeStatus?.workspace?.exists
                    ? activeStatus.workspace.name
                    : "Missing"}
                </p>
              </div>
              <div>
                <p className="text-theme-text-secondary">Readiness</p>
                <p className="font-medium">
                  {activeStatus?.workspace?.ready
                    ? "Ready"
                    : activeStatus?.workspace?.state || "setup_needed"}
                </p>
              </div>
              <div>
                <p className="text-theme-text-secondary">Doctrine docs</p>
                <p className="font-medium">
                  {activeStatus?.doctrine?.statusAvailable
                    ? `${activeStatus.doctrine.requiredAttached ?? 0}/${activeStatus.doctrine.requiredLoadable ?? 0} loaded`
                    : "Unavailable"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {isLocalUserMode && (
          <SwarmsyLocalUserSettingsHub
            controller={{
              isHostedAdminMode: false,
              isLocalUserMode,
              isCheckingLocalOllama: busyAction === "local-ollama-refresh",
              localOllamaStatus,
              localOllamaStatusTone: localOllamaTone,
              localOllamaStatusTitle: localOllamaTitle,
              hasVerifiedLocalOllamaModels,
              selectedLocalOllamaModel,
              savedLocalOllamaModel: readLocalUserOllamaModelSelection(),
              currentModelLabel:
                localOllamaStatus.models.find(
                  (model) => model.id === selectedLocalOllamaModel
                )?.name ||
                selectedLocalOllamaModel ||
                readLocalUserOllamaModelSelection(),
              localOllamaSelectionMessage,
              checkLocalUserOllama,
              onSelectLocalOllamaModel: (nextModelId) => {
                const normalizedModelId = String(nextModelId || "").trim();
                setSelectedLocalOllamaModel(normalizedModelId);
                persistLocalUserOllamaModelSelection(normalizedModelId);
                setLocalOllamaSelectionMessage(null);
                if (
                  typeof window !== "undefined" &&
                  hasDesktopLocalSettingsBridge({ targetWindow: window })
                ) {
                  void mirrorDesktopLocalUserOllamaModelSelection(
                    normalizedModelId,
                    {
                      targetWindow: window,
                    }
                  ).then((mirrored) => {
                    if (!mirrored.ok) {
                      showToast(
                        "Desktop local settings sync failed. Browser Local User storage remains active.",
                        "warning"
                      );
                    }
                  });
                }
                window.dispatchEvent(
                  new CustomEvent(LOCAL_USER_SETTINGS_SYNC_EVENT, {
                    detail: {
                      reason: "model_selection",
                      model: normalizedModelId,
                    },
                  })
                );
              },
              exportBackupToFile,
              importBackupFromText,
            }}
          />
        )}

        <div className="flex flex-wrap gap-3">
          {!activeStatus?.workspace?.exists && (
            <ActionButton
              icon={CheckCircle}
              busy={busyAction === "create-hive"}
              disabled={Boolean(busyAction) && busyAction !== "create-hive"}
              onClick={createHive}
            >
              Create SWARMSY HIVE
            </ActionButton>
          )}

          {activeStatus?.workspace?.exists &&
            !activeStatus?.workspace?.ready &&
            !doctrineUnavailable(activeStatus) && (
              <ActionButton
                icon={CheckCircle}
                busy={busyAction === "ingest-docs"}
                disabled={Boolean(busyAction) && busyAction !== "ingest-docs"}
                onClick={ingestRequiredDocs}
              >
                Load Required Doctrine Docs
              </ActionButton>
            )}

          <ActionButton
            icon={ArrowClockwise}
            busy={busyAction === "refresh"}
            disabled={Boolean(busyAction) && busyAction !== "refresh"}
            onClick={refreshReadiness}
          >
            Check HIVE Readiness
          </ActionButton>
        </div>

        {lastActionResult?.kind === "ingest-docs" &&
          (lastActionResult?.partial || !lastActionResult?.success) && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-amber-100 light:text-amber-900">
              <h2 className="text-base font-semibold">
                Some doctrine docs could not be loaded.
              </h2>
              <p className="mt-2 text-sm">Review the failed items or retry.</p>
              {failedItems.length > 0 && (
                <ul className="mt-3 space-y-2 text-sm">
                  {failedItems.map((item) => (
                    <li key={`${item.path}-${item.reason}`}>
                      <span className="font-medium">{item.path}</span>:{" "}
                      {item.reason}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

        {activeStatus?.workspace?.exists && (
          <div className="rounded-2xl border border-theme-sidebar-border bg-theme-bg-secondary p-5">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-theme-text-secondary">
                {ACTION_HUB_TITLE}
              </p>
              <h2 className="text-2xl font-semibold text-theme-text-primary">
                Choose the next command for SPARKY.
              </h2>
              <p className="max-w-3xl text-sm text-theme-text-secondary">
                {ACTION_HUB_HELPER_COPY}
              </p>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-theme-sidebar-border bg-theme-bg-menu p-5">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-theme-text-secondary">
                    {buildGroup.title}
                  </h3>
                  <p className="text-sm text-theme-text-secondary">
                    {buildGroup.description}
                  </p>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {IDENTITY_MODES.map((mode) => {
                    const selected =
                      selectedMode === mode.id ||
                      (mode.id === "memory-lock" && memoryLockPanelOpen);
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        disabled={Boolean(busyAction)}
                        onClick={() => {
                          if (mode.id === "memory-lock") {
                            openMemoryLockPanel();
                            return;
                          }

                          setMemoryLockPanelOpen(false);
                          setMemoryLockInput("");
                          setMemoryLockError("");
                          setSelectedMode(mode.id);
                        }}
                        className={`rounded-2xl border p-4 text-left transition ${
                          selected
                            ? "border-teal bg-teal/10"
                            : "border-theme-sidebar-border hover:bg-theme-bg-secondary"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        <p className="text-base font-semibold text-theme-text-primary">
                          {mode.label}
                        </p>
                        <p className="mt-2 text-sm text-theme-text-secondary">
                          {mode.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 rounded-2xl border border-theme-sidebar-border bg-theme-bg-secondary p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-theme-text-secondary">
                    {buildGroup.actions.join(" · ")}
                  </p>
                  <p className="mt-2 text-sm text-theme-text-secondary">
                    {selectedIdentityMode
                      ? `${selectedIdentityMode.label} selected. ${selectedIdentityMode.description}`
                      : "Choose Face Identity Mode, Hidden Identity Mode, or Existing Project before starting intake."}
                  </p>
                  {actionHubState.actions.startIntake.disabledReason && (
                    <p className="mt-3 text-sm text-theme-text-secondary">
                      {actionHubState.actions.startIntake.disabledReason}
                    </p>
                  )}
                  <div className="mt-4">
                    <ActionButton
                      icon={CheckCircle}
                      busy={actionHubState.actions.startIntake.busy}
                      disabled={actionHubState.actions.startIntake.disabled}
                      onClick={startIntake}
                    >
                      Start Intake
                    </ActionButton>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-theme-sidebar-border bg-theme-bg-menu p-5">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-theme-text-secondary">
                    {continueGroup.title}
                  </h3>
                  <p className="text-sm text-theme-text-secondary">
                    {continueGroup.description}
                  </p>
                </div>

                <div className="mt-4 rounded-2xl border border-theme-sidebar-border bg-theme-bg-secondary p-4">
                  <p className="text-base font-semibold text-theme-text-primary">
                    {continueGroup.actions[0]}
                  </p>
                  <p className="mt-2 text-sm text-theme-text-secondary">
                    {continueGroup.description}
                  </p>
                  {actionHubState.actions.loadMemoryLock.disabledReason && (
                    <p className="mt-3 text-sm text-theme-text-secondary">
                      {actionHubState.actions.loadMemoryLock.disabledReason}
                    </p>
                  )}
                  <div className="mt-4">
                    <ActionButton
                      icon={CheckCircle}
                      busy={actionHubState.actions.loadMemoryLock.busy}
                      disabled={actionHubState.actions.loadMemoryLock.disabled}
                      onClick={openMemoryLockPanel}
                    >
                      Load Memory Lock
                    </ActionButton>
                  </div>
                </div>

                {memoryLockPanelOpen && (
                  <div className="mt-4 rounded-2xl border border-theme-sidebar-border bg-theme-bg-secondary p-4">
                    <div className="space-y-2">
                      <h3 className="text-base font-semibold text-theme-text-primary">
                        Paste your latest SWARMSY memory lock.
                      </h3>
                      <p className="text-sm text-theme-text-secondary">
                        SPARKY will continue from this state instead of
                        restarting your identity.
                      </p>
                    </div>

                    <textarea
                      aria-label="SWARMSY memory lock"
                      aria-describedby={
                        memoryLockError ? MEMORY_LOCK_ERROR_ID : undefined
                      }
                      aria-invalid={Boolean(memoryLockError)}
                      value={memoryLockInput}
                      onChange={(event) => {
                        setMemoryLockInput(event.target.value);
                        if (memoryLockError) {
                          setMemoryLockError("");
                        }
                      }}
                      placeholder="Paste your SWARMSY memory lock here."
                      className="mt-4 min-h-[220px] w-full rounded-2xl border border-theme-sidebar-border bg-theme-bg-menu p-3 text-sm text-theme-text-primary outline-none focus:border-teal"
                    />

                    {memoryLockError && (
                      <p
                        id={MEMORY_LOCK_ERROR_ID}
                        role="alert"
                        className="mt-3 text-sm text-red-400"
                      >
                        {memoryLockError}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        disabled={Boolean(busyAction)}
                        onClick={closeMemoryLockPanel}
                        className="rounded-lg border border-theme-sidebar-border px-4 py-2 text-sm font-medium text-theme-text-primary transition hover:bg-theme-bg-menu disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Cancel
                      </button>
                      <ActionButton
                        icon={CheckCircle}
                        busy={busyAction === "memory-lock"}
                        disabled={
                          Boolean(busyAction) && busyAction !== "memory-lock"
                        }
                        onClick={continueFromMemoryLock}
                      >
                        Continue from Memory Lock
                      </ActionButton>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-theme-sidebar-border bg-theme-bg-menu p-5">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-theme-text-secondary">
                    {launchGroup.title}
                  </h3>
                  <p className="text-sm text-theme-text-secondary">
                    {launchGroup.description}
                  </p>
                </div>

                <div className="mt-4 rounded-2xl border border-theme-sidebar-border bg-theme-bg-secondary p-4">
                  <p className="text-base font-semibold text-theme-text-primary">
                    {launchGroup.actions[0]}
                  </p>
                  <p className="mt-2 text-sm text-theme-text-secondary">
                    {launchGroup.description}
                  </p>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <label className="block text-sm text-theme-text-primary">
                      <span className="mb-1 block text-theme-text-secondary">
                        Selected date
                      </span>
                      <input
                        type="date"
                        value={campaignDate}
                        disabled={
                          actionHubState.actions.campaignCalendar.disabled
                        }
                        onChange={(event) =>
                          setCampaignDate(event.target.value)
                        }
                        className="w-full rounded-lg border border-theme-sidebar-border bg-theme-bg-menu px-3 py-2 text-sm text-theme-text-primary outline-none focus:border-teal disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </label>

                    <label className="block text-sm text-theme-text-primary">
                      <span className="mb-1 block text-theme-text-secondary">
                        Campaign focus (optional)
                      </span>
                      <input
                        type="text"
                        value={campaignFocus}
                        disabled={
                          actionHubState.actions.campaignCalendar.disabled
                        }
                        onChange={(event) =>
                          setCampaignFocus(event.target.value)
                        }
                        placeholder="Optional focus for this day."
                        className="w-full rounded-lg border border-theme-sidebar-border bg-theme-bg-menu px-3 py-2 text-sm text-theme-text-primary outline-none focus:border-teal disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </label>
                  </div>

                  <label className="mt-3 block text-sm text-theme-text-primary">
                    <span className="mb-1 block text-theme-text-secondary">
                      Proof/assets/results to consider (optional)
                    </span>
                    <textarea
                      value={campaignProofAssets}
                      disabled={
                        actionHubState.actions.campaignCalendar.disabled
                      }
                      onChange={(event) =>
                        setCampaignProofAssets(event.target.value)
                      }
                      placeholder="Optional proof, assets, or result context."
                      className="min-h-[120px] w-full rounded-lg border border-theme-sidebar-border bg-theme-bg-menu px-3 py-2 text-sm text-theme-text-primary outline-none focus:border-teal disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </label>

                  {actionHubState.actions.campaignCalendar.disabledReason && (
                    <p className="mt-3 text-sm text-theme-text-secondary">
                      {actionHubState.actions.campaignCalendar.disabledReason}
                    </p>
                  )}

                  <div className="mt-4">
                    <ActionButton
                      icon={CheckCircle}
                      busy={actionHubState.actions.campaignCalendar.busy}
                      disabled={
                        actionHubState.actions.campaignCalendar.disabled ||
                        !canCreateCampaignDay
                      }
                      onClick={createCampaignDay}
                    >
                      Create Campaign Day
                    </ActionButton>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-theme-sidebar-border bg-theme-bg-menu p-5">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-theme-text-secondary">
                    {verifyGroup.title}
                  </h3>
                  <p className="text-sm text-theme-text-secondary">
                    {verifyGroup.description}
                  </p>
                </div>

                <div className="mt-4 rounded-2xl border border-theme-sidebar-border bg-theme-bg-secondary p-4">
                  <p className="text-base font-semibold text-theme-text-primary">
                    {verifyGroup.actions[0]}
                  </p>
                  <p className="mt-2 text-sm text-theme-text-secondary">
                    {verifyGroup.description}
                  </p>

                  {!proofReviewPanelOpen ? (
                    <div className="mt-4 space-y-3">
                      {actionHubState.actions.reviewProof.disabledReason && (
                        <p className="text-sm text-theme-text-secondary">
                          {actionHubState.actions.reviewProof.disabledReason}
                        </p>
                      )}
                      <ActionButton
                        icon={CheckCircle}
                        busy={actionHubState.actions.reviewProof.busy}
                        disabled={actionHubState.actions.reviewProof.disabled}
                        onClick={openProofReviewPanel}
                      >
                        Review Proof / Find Proof Gaps
                      </ActionButton>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-2xl border border-theme-sidebar-border bg-theme-bg-menu p-4">
                      <p className="text-sm text-theme-text-secondary">
                        Paste proof, links, notes, screenshot descriptions,
                        sales results, comments, press mentions, product
                        details, or campaign results.
                      </p>
                      <textarea
                        aria-label="SWARMSY proof review notes"
                        aria-describedby={
                          proofReviewError ? PROOF_TRACKER_ERROR_ID : undefined
                        }
                        aria-invalid={Boolean(proofReviewError)}
                        value={proofReviewInput}
                        onChange={(event) => {
                          setProofReviewInput(event.target.value);
                          if (proofReviewError) {
                            setProofReviewError("");
                          }
                        }}
                        placeholder="Paste proof, links, notes, screenshot descriptions, sales results, comments, press mentions, product details, or campaign results."
                        className="mt-3 min-h-[180px] w-full rounded-2xl border border-theme-sidebar-border bg-theme-bg-secondary p-3 text-sm text-theme-text-primary outline-none focus:border-teal"
                      />
                      {proofReviewError && (
                        <p
                          id={PROOF_TRACKER_ERROR_ID}
                          role="alert"
                          className="mt-3 text-sm text-red-400"
                        >
                          {proofReviewError}
                        </p>
                      )}
                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="button"
                          disabled={Boolean(busyAction)}
                          onClick={closeProofReviewPanel}
                          className="rounded-lg border border-theme-sidebar-border px-4 py-2 text-sm font-medium text-theme-text-primary transition hover:bg-theme-bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Cancel
                        </button>
                        <ActionButton
                          icon={CheckCircle}
                          busy={busyAction === "proof-review"}
                          disabled={
                            Boolean(busyAction) && busyAction !== "proof-review"
                          }
                          onClick={sendProofReviewToSparky}
                        >
                          Send Proof Review to SPARKY
                        </ActionButton>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
