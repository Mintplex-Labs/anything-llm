import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useLoginMode from "@/hooks/useLoginMode";
import SwarmsyOnboarding from "@/models/swarmsyOnboarding";
import showToast from "@/utils/toast";
import {
  persistLocalUserOllamaModelSelection,
  readLocalUserOllamaModelSelection,
  resolveLocalUserOllamaModelSelection,
  hasDesktopLocalSettingsBridge,
  readDesktopLocalUserOllamaModelSelection,
  mirrorDesktopLocalUserOllamaModelSelection,
  readDesktopLocalUserSettingsForBackup,
  restoreDesktopLocalUserSettingsFromBackup,
  hasDesktopLocalBackupBridge,
  exportDesktopLocalUserBackup,
  importDesktopLocalUserBackup,
} from "@/components/SwarmsyFirstRunOnboarding/localUserOllamaSelection";
import {
  exportLocalUserBackupV2,
  importLocalUserBackupV2,
  resolveLocalUserBackupImportModelState,
  isDesktopLocalUserBackup,
} from "@/utils/localUserBackup";
import {
  diagnosticFromResult,
  getDiagnosticForCode,
} from "@/utils/desktopDiagnostics";

export const LOCAL_USER_SETTINGS_SYNC_EVENT =
  "anythingllm_swarmsy_local_user_settings_sync";

const LOCAL_OLLAMA_UI_STATES = new Set([
  "checking",
  "reachable",
  "unreachable",
  "no_models",
  "error",
]);

const IMPORTED_LOCAL_OLLAMA_MODEL_PENDING_MESSAGE =
  "Imported Ollama model saved. SWARMSY will restore it after Ollama status is verified.";
const IMPORTED_LOCAL_OLLAMA_MODEL_MISSING_MESSAGE =
  "Imported Ollama model is not currently installed. Select a model to continue.";
const SAVED_MODEL_UNVERIFIED_MESSAGE =
  "Saved model is pending verification while Ollama is unavailable. Retry when Ollama is reachable.";
const SAVED_MODEL_MISSING_MESSAGE =
  "Your saved Ollama model is not currently installed. Select a model to continue.";

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
  if (response?.mode !== "local_user" || response?.source === "fallback") {
    return null;
  }
  const status = LOCAL_OLLAMA_UI_STATES.has(response?.status)
    ? response.status
    : "error";

  return {
    status,
    models: Array.isArray(response?.models)
      ? response.models.map(normalizeLocalUserModel).filter(Boolean)
      : [],
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

function getSavedModelName(modelId, models = []) {
  if (!modelId) return "";
  const hit = models.find((model) => model.id === modelId);
  return hit?.name || modelId;
}

function dispatchLocalUserSettingsSync(detail = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(LOCAL_USER_SETTINGS_SYNC_EVENT, { detail })
  );
}

export function useLocalUserSettingsHub() {
  const loginMode = useLoginMode();
  const isLoginModePending = loginMode === null;
  const isHostedAdminMode = loginMode === "multi";
  const [isLocalUserMode, setIsLocalUserMode] = useState(false);
  const [isCheckingLocalOllama, setIsCheckingLocalOllama] = useState(false);
  const [desktopDiagnostics, setDesktopDiagnostics] = useState([]);
  const [localOllamaStatus, setLocalOllamaStatus] = useState({
    status: "checking",
    models: [],
    endpoint: null,
    message: null,
  });
  const [selectedLocalOllamaModel, setSelectedLocalOllamaModel] = useState("");
  const [localOllamaSelectionMessage, setLocalOllamaSelectionMessage] =
    useState(null);
  const [savedLocalOllamaModel, setSavedLocalOllamaModel] = useState(
    readLocalUserOllamaModelSelection()
  );

  const localOllamaRefreshControllerRef = useRef(null);
  const hasConfirmedLocalUserModeRef = useRef(false);

  const addDiagnostic = useCallback((code) => {
    const entry = getDiagnosticForCode(code);
    if (!entry) return;
    setDesktopDiagnostics((prev) => {
      if (prev.some((d) => d.code === entry.code)) return prev;
      return [...prev, entry];
    });
  }, []);

  const removeDiagnosticsByCode = useCallback((codes) => {
    const codeSet = new Set(Array.isArray(codes) ? codes : [codes]);
    setDesktopDiagnostics((prev) => prev.filter((d) => !codeSet.has(d.code)));
  }, []);

  const clearDiagnostics = useCallback(() => {
    setDesktopDiagnostics([]);
  }, []);

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

  const syncDesktopLocalSettingsToBrowserStorage = useCallback(async () => {
    if (typeof window === "undefined") return false;
    if (!hasDesktopLocalSettingsBridge({ targetWindow: window })) return false;

    const desktopSettings = await readDesktopLocalUserOllamaModelSelection({
      targetWindow: window,
    });
    if (!desktopSettings.ok || !desktopSettings.modelId) return false;

    persistLocalUserOllamaModelSelection(desktopSettings.modelId);
    const storedModelId = readLocalUserOllamaModelSelection();
    setSavedLocalOllamaModel(storedModelId);

    const hasVerifiedDesktopRestoreModels =
      localOllamaStatus.status === "reachable" ||
      localOllamaStatus.status === "no_models";
    if (!hasVerifiedDesktopRestoreModels) return true;

    const restoredModelIsInstalled = localOllamaStatus.models.some(
      (model) => model.id === storedModelId
    );
    if (restoredModelIsInstalled) {
      setSelectedLocalOllamaModel(storedModelId);
      setLocalOllamaSelectionMessage(null);
    } else {
      setSelectedLocalOllamaModel("");
      setLocalOllamaSelectionMessage(SAVED_MODEL_MISSING_MESSAGE);
    }
    return true;
  }, [localOllamaStatus.models, localOllamaStatus.status]);

  const mirrorModelSelectionToDesktopSettings = useCallback(
    async (nextModelId) => {
      if (typeof window === "undefined") return;
      if (!hasDesktopLocalSettingsBridge({ targetWindow: window })) return;

      const mirrored = await mirrorDesktopLocalUserOllamaModelSelection(
        nextModelId,
        { targetWindow: window }
      );
      if (!mirrored.ok) {
        showToast(
          "Desktop local settings sync failed. Browser Local User storage remains active.",
          "warning"
        );
      }
    },
    []
  );

  const releaseLocalUserOllamaRequest = useCallback((controller) => {
    if (localOllamaRefreshControllerRef.current !== controller) return false;
    localOllamaRefreshControllerRef.current = null;
    return true;
  }, []);

  const syncLocalUserOllamaStatus = useCallback(
    async ({ signal } = {}) => {
      if (signal?.aborted || !isLatestLocalUserOllamaRequest(signal))
        return null;
      setIsCheckingLocalOllama(true);
      setLocalOllamaStatus((current) => ({
        ...current,
        status: "checking",
        models: [],
        endpoint: null,
        message: null,
      }));
      removeDiagnosticsByCode([
        "ollama_unreachable",
        "ollama_not_installed",
        "no_models_installed",
        "local_provider_unavailable",
      ]);

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
            addDiagnostic("local_provider_unavailable");
            setIsLocalUserMode(true);
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

        if (normalizedStatus.status === "unreachable") {
          addDiagnostic("ollama_unreachable");
        } else if (normalizedStatus.status === "no_models") {
          addDiagnostic("no_models_installed");
        }

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
      } finally {
        if (!signal?.aborted && isLatestLocalUserOllamaRequest(signal)) {
          setIsCheckingLocalOllama(false);
        }
      }
    },
    [addDiagnostic, isLatestLocalUserOllamaRequest, removeDiagnosticsByCode]
  );

  const checkLocalUserOllama = useCallback(async () => {
    if (isLoginModePending || isHostedAdminMode) return;
    const controller = beginLocalUserOllamaRequest();
    try {
      await syncLocalUserOllamaStatus({ signal: controller.signal });
    } finally {
      releaseLocalUserOllamaRequest(controller);
    }
  }, [
    beginLocalUserOllamaRequest,
    isLoginModePending,
    isHostedAdminMode,
    releaseLocalUserOllamaRequest,
    syncLocalUserOllamaStatus,
  ]);

  useEffect(() => {
    if (isLoginModePending) {
      setIsLocalUserMode(false);
      setIsCheckingLocalOllama(false);
      setLocalOllamaStatus({
        status: "checking",
        models: [],
        endpoint: null,
        message: null,
      });
      return;
    }

    if (isHostedAdminMode) {
      setIsLocalUserMode(false);
      setIsCheckingLocalOllama(false);
      setLocalOllamaStatus({
        status: "error",
        models: [],
        endpoint: null,
        message: null,
      });
      return;
    }

    const controller = beginLocalUserOllamaRequest();
    syncLocalUserOllamaStatus({ signal: controller.signal }).finally(() => {
      releaseLocalUserOllamaRequest(controller);
    });
  }, [
    beginLocalUserOllamaRequest,
    isLoginModePending,
    isHostedAdminMode,
    releaseLocalUserOllamaRequest,
    syncLocalUserOllamaStatus,
  ]);

  useEffect(() => {
    if (isLoginModePending || isHostedAdminMode || !isLocalUserMode) return;
    syncDesktopLocalSettingsToBrowserStorage().catch(() => {});
  }, [
    isHostedAdminMode,
    isLocalUserMode,
    isLoginModePending,
    syncDesktopLocalSettingsToBrowserStorage,
  ]);

  useEffect(() => {
    return () => localOllamaRefreshControllerRef.current?.abort();
  }, []);

  const hasVerifiedLocalOllamaModels =
    localOllamaStatus.status === "reachable" ||
    localOllamaStatus.status === "no_models";

  useEffect(() => {
    const storedModelId = readLocalUserOllamaModelSelection();
    setSavedLocalOllamaModel(storedModelId);

    removeDiagnosticsByCode(["selected_model_missing", "selected_model_stale"]);

    if (!hasVerifiedLocalOllamaModels) {
      if (storedModelId) {
        setLocalOllamaSelectionMessage(SAVED_MODEL_UNVERIFIED_MESSAGE);
        addDiagnostic("selected_model_stale");
      } else {
        setLocalOllamaSelectionMessage(null);
      }
      return;
    }

    const resolved = resolveLocalUserOllamaModelSelection({
      models: localOllamaStatus.models,
      selectedModelId: selectedLocalOllamaModel,
      storedModelId,
    });

    if (resolved.modelId) {
      persistLocalUserOllamaModelSelection(resolved.modelId);
      setSavedLocalOllamaModel(resolved.modelId);
    }

    if (resolved.modelId !== selectedLocalOllamaModel) {
      setSelectedLocalOllamaModel(resolved.modelId);
    }

    if (resolved.source === "stale_missing") {
      setLocalOllamaSelectionMessage(SAVED_MODEL_MISSING_MESSAGE);
      addDiagnostic("selected_model_missing");
      return;
    }

    if (
      resolved.source === "single_available" &&
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
    addDiagnostic,
    hasVerifiedLocalOllamaModels,
    localOllamaStatus.models,
    removeDiagnosticsByCode,
    selectedLocalOllamaModel,
  ]);

  useEffect(() => {
    function syncFromBroadcast() {
      const storedModelId = readLocalUserOllamaModelSelection();
      setSavedLocalOllamaModel(storedModelId);
      if (!hasVerifiedLocalOllamaModels) return;

      const installed = localOllamaStatus.models.some(
        (model) => model.id === storedModelId
      );
      if (installed || !storedModelId) {
        setSelectedLocalOllamaModel(storedModelId || "");
      }
    }

    window.addEventListener(LOCAL_USER_SETTINGS_SYNC_EVENT, syncFromBroadcast);
    return () =>
      window.removeEventListener(
        LOCAL_USER_SETTINGS_SYNC_EVENT,
        syncFromBroadcast
      );
  }, [hasVerifiedLocalOllamaModels, localOllamaStatus.models]);

  const selectedLocalOllamaModelIsInstalled =
    selectedLocalOllamaModel &&
    localOllamaStatus.models.some(
      (model) => model.id === selectedLocalOllamaModel
    );

  const onSelectLocalOllamaModel = useCallback(
    (nextModelId) => {
      const normalizedModelId = String(nextModelId || "").trim();
      setSelectedLocalOllamaModel(normalizedModelId);
      persistLocalUserOllamaModelSelection(normalizedModelId);
      setSavedLocalOllamaModel(readLocalUserOllamaModelSelection());
      setLocalOllamaSelectionMessage(null);
      void mirrorModelSelectionToDesktopSettings(normalizedModelId);
      dispatchLocalUserSettingsSync({
        reason: "model_selection",
        model: normalizedModelId,
      });
    },
    [mirrorModelSelectionToDesktopSettings]
  );

  const exportBackupToFile = useCallback(async () => {
    removeDiagnosticsByCode(["backup_export_failed"]);
    if (
      typeof window !== "undefined" &&
      isLocalUserMode &&
      !isHostedAdminMode &&
      hasDesktopLocalBackupBridge({ targetWindow: window })
    ) {
      const desktopResult = await exportDesktopLocalUserBackup({
        targetWindow: window,
      });
      if (desktopResult?.ok) {
        showToast("Desktop Local User backup exported.", "success");
        return;
      }
      const desktopDiag = diagnosticFromResult(
        desktopResult,
        "backup_export_failed"
      );
      if (desktopDiag) addDiagnostic(desktopDiag.code);
    }

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
    a.click?.();
    URL.revokeObjectURL(url);
    showToast("Local User backup exported.", "success");
  }, [
    addDiagnostic,
    isHostedAdminMode,
    isLocalUserMode,
    removeDiagnosticsByCode,
  ]);

  const importBackupFromText = useCallback(
    async (rawText = "") => {
      removeDiagnosticsByCode(["backup_import_failed", "model_restore_failed"]);
      try {
        const data = JSON.parse(rawText);
        let result;
        let restoredModelId = "";
        let shouldMirrorBrowserModel = false;
        let mirrorModelId = "";

        if (
          isDesktopLocalUserBackup(data) &&
          typeof window !== "undefined" &&
          isLocalUserMode &&
          !isHostedAdminMode &&
          hasDesktopLocalBackupBridge({ targetWindow: window })
        ) {
          const desktopImport = await importDesktopLocalUserBackup(rawText, {
            targetWindow: window,
          });
          if (!desktopImport?.ok) {
            const errors =
              desktopImport?.errors?.join(" ") || desktopImport?.reason;
            showToast(`Import failed: ${errors}`, "error");
            const desktopDiag = diagnosticFromResult(
              desktopImport,
              "backup_import_failed"
            );
            if (desktopDiag) addDiagnostic(desktopDiag.code);
            return false;
          }
          restoredModelId = String(
            desktopImport?.restoredState?.ollamaModel ||
              desktopImport?.settings?.state?.ollamaModel ||
              ""
          ).trim();
          persistLocalUserOllamaModelSelection(restoredModelId);
          result = {
            success: true,
            restored: restoredModelId ? ["ollamaModel"] : [],
          };
        } else {
          result = await importLocalUserBackupV2(data, {
            applyDesktopLocalSettings: async (state) => {
              if (typeof window === "undefined") return { ok: false };
              return restoreDesktopLocalUserSettingsFromBackup(state, {
                targetWindow: window,
              });
            },
          });
          if (!result.success) {
            showToast(`Import failed: ${result.errors.join(" ")}`, "error");
            addDiagnostic("backup_import_failed");
            return false;
          }

          const browserModelWasRestored =
            result?.restored?.includes("ollamaModel");
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
          restoredModelId = importModelState.restoredModelId;
          shouldMirrorBrowserModel = importModelState.shouldMirrorBrowserModel;
          mirrorModelId = importModelState.mirrorModelId;
        }

        setSavedLocalOllamaModel(restoredModelId);
        if (shouldMirrorBrowserModel) {
          void mirrorModelSelectionToDesktopSettings(mirrorModelId);
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
            addDiagnostic("model_restore_failed");
          }
        } else {
          setSelectedLocalOllamaModel("");
          setLocalOllamaSelectionMessage(
            IMPORTED_LOCAL_OLLAMA_MODEL_PENDING_MESSAGE
          );
          try {
            await checkLocalUserOllama();
          } catch {
            showToast(
              "Backup imported, but SWARMSY could not refresh Local User Mode Ollama status.",
              "warning"
            );
          }
        }

        dispatchLocalUserSettingsSync({
          reason: "backup_import",
          model: restoredModelId || "",
        });

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
        addDiagnostic("backup_import_failed");
        return false;
      }
    },
    [
      addDiagnostic,
      checkLocalUserOllama,
      hasVerifiedLocalOllamaModels,
      isHostedAdminMode,
      isLocalUserMode,
      localOllamaStatus.models,
      mirrorModelSelectionToDesktopSettings,
      removeDiagnosticsByCode,
    ]
  );

  const currentModelLabel = useMemo(
    () =>
      getSavedModelName(
        selectedLocalOllamaModel || savedLocalOllamaModel,
        localOllamaStatus.models
      ),
    [localOllamaStatus.models, savedLocalOllamaModel, selectedLocalOllamaModel]
  );

  return {
    isLoginModePending,
    isHostedAdminMode,
    isLocalUserMode,
    isCheckingLocalOllama,
    localOllamaStatus,
    localOllamaStatusTone: localOllamaStatusTone(localOllamaStatus.status),
    localOllamaStatusTitle: localOllamaStatusTitle(localOllamaStatus.status),
    hasVerifiedLocalOllamaModels,
    selectedLocalOllamaModel,
    selectedLocalOllamaModelIsInstalled,
    savedLocalOllamaModel,
    currentModelLabel,
    localOllamaSelectionMessage,
    mirrorsDesktopLocalSettings: true,
    desktopDiagnostics,
    clearDiagnostics,
    checkLocalUserOllama,
    onSelectLocalOllamaModel,
    exportBackupToFile,
    importBackupFromText,
  };
}
