import { useTranslation } from "react-i18next";

// Per-status text styling per the run history figma:
// - non-terminal (queued, running) → italic zinc-400
// - completed → white medium
// - failed / timed_out → red-400
const STATUS_STYLES = {
  queued: "italic text-zinc-400",
  running: "italic text-zinc-400",
  completed: "font-medium text-white",
  failed: "text-red-400",
  timed_out: "text-red-400",
};

// Status text shown in the run history table. Plain text — no pill — to
// match the run history figma.
export default function StatusBadge({ status }) {
  const { t } = useTranslation();
  const statusLabels = {
    completed: t("scheduledJobs.runDetail.status.completed"),
    failed: t("scheduledJobs.runDetail.status.failed"),
    timed_out: t("scheduledJobs.runDetail.status.timed_out"),
    running: t("scheduledJobs.runDetail.status.running"),
    queued: t("scheduledJobs.runDetail.status.queued"),
  };
  const label = status ? statusLabels[status] || status.replace("_", " ") : "—";
  return (
    <span className={`text-sm ${STATUS_STYLES[status] || "text-zinc-400"}`}>
      {label}
    </span>
  );
}
