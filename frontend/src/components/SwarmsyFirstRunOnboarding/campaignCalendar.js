export const CAMPAIGN_DAY_PROMPT_PATH =
  "docs/swarmsy/living-icon-engine/prompts/09_SWARMSY_DAY_1_PR_CAMPAIGN_BUILDER.md";

export const CAMPAIGN_CALENDAR_HIVE_MISSING_MESSAGE =
  "Create your SWARMSY HIVE before using the campaign calendar.";

export const CAMPAIGN_CALENDAR_UNDERLOADED_MESSAGE =
  "Load required doctrine docs before using the campaign calendar.";

export const CAMPAIGN_CALENDAR_DOCTRINE_UNAVAILABLE_MESSAGE =
  "Doctrine readiness cannot be confirmed. Check HIVE readiness before using the campaign calendar.";

export function canUseCampaignCalendar(status) {
  return Boolean(
    status?.workspace?.exists &&
      status?.workspace?.ready &&
      status?.workspace?.slug &&
      status?.doctrine?.statusAvailable === true &&
      status?.doctrine?.docsRootAvailable === true &&
      Number(status?.doctrine?.requiredMissing || 0) === 0 &&
      Number(status?.doctrine?.requiredNonLoadable || 0) === 0
  );
}

export function getCampaignCalendarBlockedMessage(status) {
  if (!status?.workspace?.exists) {
    return CAMPAIGN_CALENDAR_HIVE_MISSING_MESSAGE;
  }

  if (
    status?.doctrine?.statusAvailable !== true ||
    status?.doctrine?.docsRootAvailable !== true
  ) {
    return CAMPAIGN_CALENDAR_DOCTRINE_UNAVAILABLE_MESSAGE;
  }

  if (
    !status?.workspace?.ready ||
    Number(status?.doctrine?.requiredMissing || 0) > 0 ||
    Number(status?.doctrine?.requiredNonLoadable || 0) > 0
  ) {
    return CAMPAIGN_CALENDAR_UNDERLOADED_MESSAGE;
  }

  if (!status?.workspace?.slug) {
    return CAMPAIGN_CALENDAR_DOCTRINE_UNAVAILABLE_MESSAGE;
  }

  return null;
}

export function buildCampaignDayStarterMessage({
  selectedDate,
  campaignFocus,
  proofAssetsResults,
}) {
  const trimmedDate = `${selectedDate || ""}`.trim();
  if (!trimmedDate) return null;

  const trimmedFocus = `${campaignFocus || ""}`.trim() || "Not provided.";
  const trimmedProof = `${proofAssetsResults || ""}`.trim() || "Not provided.";

  return `Create a SWARMSY campaign-day plan for the selected date.

Selected date:
${trimmedDate}

Campaign focus:
${trimmedFocus}

Proof/assets/results to consider:
${trimmedProof}

Use the existing Day 1 campaign builder as the campaign-day engine:
${CAMPAIGN_DAY_PROMPT_PATH}

Before creating the campaign-day output, check whether you have enough locked project state from my intake, identity pack, memory lock, or existing project notes.

If enough state exists, produce the campaign-day pack for this selected date only.

If not enough state exists, do not invent missing facts. Ask only for the minimum missing information needed.

Selected date only.
Do not create Day 2.
Do not create Week 2.
Do not create a 30-day calendar unless I explicitly ask.
Keep claims proof-safe.
Replace spam with signal.
Break the mould, not the law.`;
}
