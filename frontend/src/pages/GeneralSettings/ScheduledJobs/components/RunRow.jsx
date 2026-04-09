import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Circle, Eye } from "@phosphor-icons/react";
import paths from "@/utils/paths";
import StatusBadge from "./StatusBadge";

// Format a run's elapsed time as ms / s / m. Only used here so it lives
// alongside the row component.
function formatDuration(run) {
  if (!run.completedAt || !run.startedAt) return "—";
  const ms =
    new Date(run.completedAt).getTime() - new Date(run.startedAt).getTime();
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

// One row of the run history table for a job. Shows status, timestamps,
// duration, error preview, and a link to the run detail page.
export default function RunRow({ run, jobId }) {
  const unreadAndTerminal =
    !run.readAt && run.status !== "running" && run.status !== "queued";

  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <tr className="border-b border-white/5 hover:bg-theme-bg-primary/30">
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 relative">
          {unreadAndTerminal && (
            <Circle
              weight="fill"
              className="h-2 w-2 text-blue-400 absolute -left-4"
            />
          )}
          <StatusBadge status={run.status} />
        </div>
      </td>
      <td className="px-6 py-4 text-theme-text-secondary text-xs">
        {new Date(run.startedAt).toLocaleString()}
      </td>
      <td className="px-6 py-4 text-theme-text-secondary text-xs">
        {formatDuration(run)}
      </td>
      <td className="px-6 py-4 text-red-400 text-xs max-w-[200px] truncate">
        {run.error || "—"}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() =>
              navigate(paths.settings.scheduledJobRunDetail(jobId, run.id))
            }
            className="p-1.5 rounded-lg hover:bg-theme-bg-primary text-theme-text-secondary hover:text-theme-text-primary transition-colors"
            title={t("scheduledJobs.runRow.viewDetails")}
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
