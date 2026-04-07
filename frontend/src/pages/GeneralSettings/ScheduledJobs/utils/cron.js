import cronstrue from "cronstrue";

export const CRON_PRESETS = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Daily at midnight", value: "0 0 * * *" },
  { label: "Daily at 9:00 AM", value: "0 9 * * *" },
  { label: "Weekly on Monday at 9:00 AM", value: "0 9 * * 1" },
  { label: "Monthly on the 1st", value: "0 0 1 * *" },
  { label: "Generate from description", value: "generate" },
  { label: "Custom", value: "custom" },
];

export function cronToHuman(cron) {
  return CRON_PRESETS.find((p) => p.value === cron)?.label || cron;
}

// Render a 5-field cron expression as plain English using cronstrue.
// Falls back to the raw expression if parsing fails.
export function humanizeCron(cron) {
  if (!cron) return "";
  try {
    return cronstrue.toString(cron, { throwExceptionOnParseError: false });
  } catch {
    return cron;
  }
}
