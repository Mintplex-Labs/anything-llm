import { useTranslation } from "react-i18next";

/**
 * Per-status text styling per the run history figma:
 * - non-terminal (queued, running) → italic zinc-400
 * - completed → white medium
 * - failed / timed_out → red-400
 * @param {string} status - The status of the run.
 * @returns {string} The styled status text.
 */
function getStatusesMap(t) {
  return {
    completed: {
      text: t("scheduledJobs.status.completed"),
      style: "font-medium text-white light:text-slate-950",
    },
    failed: {
      text: t("scheduledJobs.status.failed"),
      style: "text-red-400 light:text-red-600",
    },
    timed_out: {
      text: t("scheduledJobs.status.timed_out"),
      style: "text-red-400 light:text-red-600",
    },
    running: {
      text: t("scheduledJobs.status.running"),
      style: "italic text-zinc-400 light:text-slate-600",
    },
    queued: {
      text: t("scheduledJobs.status.queued"),
      style: "italic text-zinc-400 light:text-slate-600",
    },
    default: {
      text: "—",
      style: "text-zinc-400 light:text-slate-600",
    },
  };
}

/**
 * Status text shown in the run history table. Plain text — no pill — to
 * match the run history figma.
 * @param {string} status - The status of the run.
 * @returns {string} The status text.
 */
export default function StatusBadge({ status }) {
  const { t } = useTranslation();
  const statusesMap = getStatusesMap(t);
  const { text, style } = statusesMap[status] || statusesMap.default;
  return <span className={`text-sm ${style}`}>{text}</span>;
}
