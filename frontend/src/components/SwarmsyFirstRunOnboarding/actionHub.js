import { canStartSwarmsyIntake } from "./handoff";
import {
  canUseCampaignCalendar,
  getCampaignCalendarBlockedMessage,
} from "./campaignCalendar";
import {
  canContinueFromMemoryLock,
  MEMORY_LOCK_BLOCKED_MESSAGE,
} from "./memoryLock";
import { canReviewProof, getProofTrackerBlockedMessage } from "./proofTracker";

export const ACTION_HUB_TITLE = "SWARMSY HIVE Action Hub";
export const ACTION_HUB_HELPER_COPY =
  "Every action routes through your HIVE and keeps the project moving.";
export const ACTION_BUSY_MESSAGE =
  "Another SWARMSY action is already running. Wait for it to finish.";
export const INTAKE_MODE_REQUIRED_MESSAGE =
  "Choose Face Identity Mode, Hidden Identity Mode, or Existing Project first.";
export const INTAKE_HIVE_MISSING_MESSAGE =
  "Create your SWARMSY HIVE before starting intake.";
export const INTAKE_UNDERLOADED_MESSAGE =
  "Load required doctrine docs before starting intake.";
export const INTAKE_DOCTRINE_UNAVAILABLE_MESSAGE =
  "Doctrine readiness cannot be confirmed. Check HIVE readiness before starting intake.";
export const ACTION_HUB_GROUPS = [
  {
    id: "build",
    title: "Build",
    description:
      "Begin the 76-question SWARMSY intake and choose the right project mode.",
    actions: ["Start Intake", "Existing Project"],
  },
  {
    id: "continue",
    title: "Continue",
    description: "Continue an existing project without restarting.",
    actions: ["Load Memory Lock"],
  },
  {
    id: "launch",
    title: "Launch",
    description: "Pick a date and create a campaign-day command.",
    actions: ["Campaign Calendar"],
  },
  {
    id: "verify",
    title: "Verify",
    description: "Check what claims are safe before posting.",
    actions: ["Review Proof / Find Proof Gaps"],
  },
];

export function isActionHubReady(status) {
  return Boolean(
    status?.workspace?.exists &&
      canContinueFromMemoryLock(status) &&
      canUseCampaignCalendar(status) &&
      canReviewProof(status)
  );
}

export function getIntakeDisabledMessage(status, selectedMode) {
  if (!status?.workspace?.exists) {
    return INTAKE_HIVE_MISSING_MESSAGE;
  }

  if (
    status?.doctrine?.statusAvailable !== true ||
    status?.doctrine?.docsRootAvailable !== true
  ) {
    return INTAKE_DOCTRINE_UNAVAILABLE_MESSAGE;
  }

  if (
    !status?.workspace?.ready ||
    Number(status?.doctrine?.requiredMissing || 0) > 0 ||
    Number(status?.doctrine?.requiredNonLoadable || 0) > 0
  ) {
    return INTAKE_UNDERLOADED_MESSAGE;
  }

  if (!status?.workspace?.slug) {
    return INTAKE_DOCTRINE_UNAVAILABLE_MESSAGE;
  }

  if (!selectedMode || selectedMode === "memory-lock") {
    return INTAKE_MODE_REQUIRED_MESSAGE;
  }

  if (!canStartSwarmsyIntake(status, selectedMode)) {
    return INTAKE_MODE_REQUIRED_MESSAGE;
  }

  return null;
}

function getBusyReasonForAction(actionId, busyAction) {
  if (!busyAction || busyAction === actionId) return null;
  return ACTION_BUSY_MESSAGE;
}

export function getActionHubActionState({ status, selectedMode, busyAction }) {
  const globallyBusy = Boolean(busyAction);
  const intakeDisabledMessage = getIntakeDisabledMessage(status, selectedMode);
  const memoryLockBlockedMessage = canContinueFromMemoryLock(status)
    ? null
    : MEMORY_LOCK_BLOCKED_MESSAGE;
  const campaignBlockedMessage = getCampaignCalendarBlockedMessage(status);
  const proofBlockedMessage = getProofTrackerBlockedMessage(status);

  return {
    ready: isActionHubReady(status),
    actions: {
      startIntake: {
        busy: busyAction === "start-intake",
        disabled: globallyBusy || Boolean(intakeDisabledMessage),
        disabledReason:
          getBusyReasonForAction("start-intake", busyAction) ||
          intakeDisabledMessage,
      },
      loadMemoryLock: {
        busy: busyAction === "memory-lock",
        disabled: globallyBusy || Boolean(memoryLockBlockedMessage),
        disabledReason:
          getBusyReasonForAction("memory-lock", busyAction) ||
          memoryLockBlockedMessage,
      },
      campaignCalendar: {
        busy: busyAction === "campaign-calendar",
        disabled: globallyBusy || Boolean(campaignBlockedMessage),
        disabledReason:
          getBusyReasonForAction("campaign-calendar", busyAction) ||
          campaignBlockedMessage,
      },
      reviewProof: {
        busy: busyAction === "proof-review",
        disabled: globallyBusy || Boolean(proofBlockedMessage),
        disabledReason:
          getBusyReasonForAction("proof-review", busyAction) ||
          proofBlockedMessage,
      },
    },
  };
}
