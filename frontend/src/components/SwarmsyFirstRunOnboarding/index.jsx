import { useCallback, useEffect, useState } from "react";
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
import { canStartSwarmsyIntake, getIntakeStarterMessage } from "./handoff";
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
const CAMPAIGN_DATE_EMPTY_ERROR = "Pick a date to create a campaign day.";

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
  const [campaignDate, setCampaignDate] = useState(getDefaultCampaignDate);
  const [campaignFocus, setCampaignFocus] = useState("");
  const [campaignProofAssets, setCampaignProofAssets] = useState("");
  const activeStatus = status || createFallbackStatus();
  const canLoadMemoryLock = canContinueFromMemoryLock(activeStatus);
  const canUseCalendar = canUseCampaignCalendar(activeStatus);
  const campaignBlockedMessage =
    getCampaignCalendarBlockedMessage(activeStatus);

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

  const copy = statusCopy(activeStatus);
  const intakeStarter = getIntakeStarterMessage(selectedMode);
  const canStartIntake = canStartSwarmsyIntake(activeStatus, selectedMode);
  const canCreateCampaignDay = canUseCalendar && Boolean(campaignDate?.trim());

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
    if (!activeStatus?.workspace?.exists) {
      showToast("Create your SWARMSY HIVE before starting intake.", "warning");
      return;
    }

    if (doctrineUnavailable(activeStatus)) {
      showToast("Doctrine readiness cannot be confirmed right now.", "warning");
      return;
    }

    if (!activeStatus?.workspace?.ready) {
      showToast(
        "Load required doctrine docs before starting intake.",
        "warning"
      );
      return;
    }

    if (!activeStatus?.workspace?.slug || !intakeStarter) {
      showToast(
        "Select an identity mode to prepare the SWARMSY intake handoff.",
        "warning"
      );
      return;
    }

    sessionStorage.setItem(
      PENDING_HOME_MESSAGE,
      JSON.stringify({ message: intakeStarter, attachments: [] })
    );
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
    if (!canLoadMemoryLock) {
      showToast(MEMORY_LOCK_BLOCKED_MESSAGE, "warning");
      return;
    }

    const starterMessage = buildMemoryLockStarterMessage(memoryLockInput);
    if (!starterMessage) {
      setMemoryLockError(MEMORY_LOCK_EMPTY_ERROR);
      return;
    }

    try {
      sessionStorage.setItem(
        PENDING_HOME_MESSAGE,
        JSON.stringify({ message: starterMessage, attachments: [] })
      );
    } catch {
      setMemoryLockError(
        "This memory lock could not be stored for chat handoff. Paste a shorter lock or enable browser session storage, then try again."
      );
      return;
    }
    navigate(paths.workspace.chat(activeStatus.workspace.slug));
  }

  function createCampaignDay() {
    if (!canUseCalendar) {
      showToast(campaignBlockedMessage, "warning");
      return;
    }

    if (!campaignDate?.trim()) {
      showToast(CAMPAIGN_DATE_EMPTY_ERROR, "warning");
      return;
    }

    const starterMessage = buildCampaignDayStarterMessage({
      selectedDate: campaignDate,
      campaignFocus,
      proofAssetsResults: campaignProofAssets,
    });

    if (!starterMessage) {
      showToast(CAMPAIGN_DATE_EMPTY_ERROR, "warning");
      return;
    }

    try {
      sessionStorage.setItem(
        PENDING_HOME_MESSAGE,
        JSON.stringify({ message: starterMessage, attachments: [] })
      );
    } catch {
      showToast(
        "This campaign handoff could not be stored for chat handoff. Use shorter inputs and try again.",
        "error"
      );
      return;
    }

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

        <div className="flex flex-wrap gap-3">
          {!activeStatus?.workspace?.exists && (
            <ActionButton
              icon={CheckCircle}
              busy={busyAction === "create-hive"}
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
                onClick={ingestRequiredDocs}
              >
                Load Required Doctrine Docs
              </ActionButton>
            )}

          <ActionButton
            icon={CheckCircle}
            busy={false}
            disabled={!canLoadMemoryLock}
            onClick={openMemoryLockPanel}
          >
            Load Memory Lock
          </ActionButton>

          <ActionButton
            icon={CheckCircle}
            busy={false}
            disabled={!canStartIntake}
            onClick={startIntake}
          >
            Start SWARMSY Intake
          </ActionButton>

          <ActionButton
            icon={ArrowClockwise}
            busy={busyAction === "refresh"}
            onClick={refreshReadiness}
          >
            Check HIVE Readiness
          </ActionButton>
        </div>

        {!canLoadMemoryLock && (
          <p className="text-sm text-theme-text-secondary">
            {MEMORY_LOCK_BLOCKED_MESSAGE}
          </p>
        )}

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

        {activeStatus?.workspace?.ready && (
          <div className="rounded-2xl border border-theme-sidebar-border bg-theme-bg-secondary p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-theme-text-secondary">
              Identity mode
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {IDENTITY_MODES.map((mode) => {
                const selected = selectedMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
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
                        : "border-theme-sidebar-border hover:bg-theme-bg-menu"
                    }`}
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

            {memoryLockPanelOpen && (
              <div className="mt-4 rounded-2xl border border-theme-sidebar-border bg-theme-bg-menu p-4">
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-theme-text-primary">
                    Paste your latest SWARMSY memory lock.
                  </h3>
                  <p className="text-sm text-theme-text-secondary">
                    SPARKY will continue from this state instead of restarting
                    your identity.
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
                  className="mt-4 min-h-[220px] w-full rounded-2xl border border-theme-sidebar-border bg-theme-bg-secondary p-3 text-sm text-theme-text-primary outline-none focus:border-teal"
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
                    onClick={closeMemoryLockPanel}
                    className="rounded-lg border border-theme-sidebar-border px-4 py-2 text-sm font-medium text-theme-text-primary transition hover:bg-theme-bg-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={continueFromMemoryLock}
                    className="rounded-lg border border-teal bg-teal px-4 py-2 text-sm font-medium text-black transition hover:opacity-90"
                  >
                    Continue from Memory Lock
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="rounded-2xl border border-theme-sidebar-border bg-theme-bg-secondary p-5">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-theme-text-secondary">
              SWARMSY Campaign Calendar
            </h2>
            <p className="text-sm text-theme-text-secondary">
              Pick a day and send SPARKY a campaign command.
            </p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="block text-sm text-theme-text-primary">
              <span className="mb-1 block text-theme-text-secondary">
                Selected date
              </span>
              <input
                type="date"
                value={campaignDate}
                disabled={!canUseCalendar}
                onChange={(event) => setCampaignDate(event.target.value)}
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
                disabled={!canUseCalendar}
                onChange={(event) => setCampaignFocus(event.target.value)}
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
              disabled={!canUseCalendar}
              onChange={(event) => setCampaignProofAssets(event.target.value)}
              placeholder="Optional proof, assets, or result context."
              className="min-h-[120px] w-full rounded-lg border border-theme-sidebar-border bg-theme-bg-menu px-3 py-2 text-sm text-theme-text-primary outline-none focus:border-teal disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>

          {campaignBlockedMessage && (
            <p className="mt-3 text-sm text-theme-text-secondary">
              {campaignBlockedMessage}
            </p>
          )}

          <div className="mt-4">
            <button
              type="button"
              disabled={!canCreateCampaignDay}
              onClick={createCampaignDay}
              className="rounded-lg border border-teal bg-teal px-4 py-2 text-sm font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Create Campaign Day
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
