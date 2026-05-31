import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowClockwise,
  ArrowSquareOut,
  CheckCircle,
  SpinnerGap,
  WarningCircle,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import SwarmsyOnboarding from "@/models/swarmsyOnboarding";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";

const INTAKE_PROMPT_PATH =
  "docs/swarmsy/living-icon-engine/prompts/01_SWARMSY_USER_INTAKE_76_QUESTIONS.md";

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
    description:
      "Prepare for a future memory-lock handoff without adding a viewer here.",
  },
];

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

function intakeGuidance(mode, status, existingProjectWorkspace) {
  if (!mode) return null;

  if (mode === "face") {
    return {
      title: "Start my SWARMSY intake.",
      description: `Open ${status?.workspace?.name || "SWARMSY HIVE"} and have SPARKY run the intake from ${INTAKE_PROMPT_PATH}.`,
      nextLabel: "Open SWARMSY HIVE",
      href: status?.workspace?.slug
        ? paths.workspace.chat(status.workspace.slug)
        : null,
    };
  }

  if (mode === "hidden") {
    return {
      title: "Start my SWARMSY intake.",
      description: `Open ${status?.workspace?.name || "SWARMSY HIVE"} and have SPARKY run the hidden-identity intake from ${INTAKE_PROMPT_PATH}.`,
      nextLabel: "Open SWARMSY HIVE",
      href: status?.workspace?.slug
        ? paths.workspace.chat(status.workspace.slug)
        : null,
    };
  }

  if (mode === "existing-project") {
    return {
      title: "Existing project handoff stays as the next action in this PR.",
      description: existingProjectWorkspace?.slug
        ? "Open your current project workspace, then wire the intake/chat handoff in the next PR."
        : "An existing project workspace was not detected here yet. Keep the choice visible and wire project handoff in the next PR.",
      nextLabel: existingProjectWorkspace?.slug
        ? "Open Existing Project"
        : null,
      href: existingProjectWorkspace?.slug
        ? paths.workspace.chat(existingProjectWorkspace.slug)
        : null,
    };
  }

  return {
    title:
      "Memory Lock handoff stays visible, but the viewer is not in scope here.",
    description:
      "Keep this mode selectable now, then add the Memory Lock viewer and chat handoff in the next PR.",
    nextLabel: status?.workspace?.slug ? "Open SWARMSY HIVE" : null,
    href: status?.workspace?.slug
      ? paths.workspace.chat(status.workspace.slug)
      : null,
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

export default function SwarmsyFirstRunOnboarding({
  children = null,
  fallbackWorkspace = null,
}) {
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [showIntakeGuidance, setShowIntakeGuidance] = useState(false);
  const [lastActionResult, setLastActionResult] = useState(null);

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
    if (status?.workspace?.ready) return;
    setSelectedMode(null);
    setShowIntakeGuidance(false);
  }, [status?.workspace?.ready]);

  const existingProjectWorkspace = useMemo(() => {
    if (!fallbackWorkspace?.slug) return null;
    if (fallbackWorkspace.slug === status?.workspace?.slug) return null;
    return fallbackWorkspace;
  }, [fallbackWorkspace, status?.workspace?.slug]);

  const activeStatus = status || createFallbackStatus();
  const copy = statusCopy(activeStatus);
  const intakeNextStep = intakeGuidance(
    selectedMode,
    activeStatus,
    existingProjectWorkspace
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
            icon={ArrowClockwise}
            busy={busyAction === "refresh"}
            onClick={refreshReadiness}
          >
            Check HIVE Readiness
          </ActionButton>

          {activeStatus?.workspace?.ready && (
            <ActionButton
              icon={ArrowSquareOut}
              busy={false}
              disabled={!selectedMode}
              onClick={() => setShowIntakeGuidance(true)}
            >
              Start SWARMSY Intake
            </ActionButton>
          )}
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
                      setSelectedMode(mode.id);
                      setShowIntakeGuidance(false);
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
          </div>
        )}

        {showIntakeGuidance && intakeNextStep && (
          <div className="rounded-2xl border border-theme-sidebar-border bg-theme-bg-secondary p-5">
            <h2 className="text-lg font-semibold text-theme-text-primary">
              {intakeNextStep.title}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-theme-text-secondary">
              {intakeNextStep.description}
            </p>
            {(selectedMode === "face" || selectedMode === "hidden") && (
              <p className="mt-3 text-xs leading-5 text-theme-text-secondary">
                Chat handoff stays as a clear next action here. This PR does not
                invent the intake; it leaves the direct chat wiring to the next
                slice if more automation is needed.
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-3">
              {intakeNextStep.href && (
                <ActionButton
                  icon={ArrowSquareOut}
                  busy={false}
                  onClick={() => navigate(intakeNextStep.href)}
                >
                  {intakeNextStep.nextLabel}
                </ActionButton>
              )}
              <ActionButton
                icon={ArrowClockwise}
                busy={busyAction === "refresh"}
                onClick={refreshReadiness}
              >
                Check HIVE Readiness
              </ActionButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
