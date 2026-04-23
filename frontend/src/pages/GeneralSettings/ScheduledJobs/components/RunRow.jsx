import { useNavigate } from "react-router-dom";
import { Circle } from "@phosphor-icons/react";
import moment from "moment";
import paths from "@/utils/paths";
import StatusBadge from "./StatusBadge";

/**
 * Format a run's elapsed time as ms / s / m.
 * @param {Object} run - The run object.
 * @returns {string} The formatted duration.
 */
function formatDuration(run) {
  if (!run.completedAt || !run.startedAt) return "—";
  const duration = moment.duration(
    moment(run.completedAt).diff(moment(run.startedAt))
  );
  const ms = duration.asMilliseconds();
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${duration.asSeconds().toFixed(1)}s`;
  return `${duration.asMinutes().toFixed(1)}m`;
}

/**
 * One row of the run history table. The whole row is clickable and
 * navigates to the run detail page.
 * @param {Object} run - The run object.
 * @param {string} jobId - The ID of the job.
 * @returns {React.ReactNode} The rendered row.
 */
export default function RunRow({ run, jobId }) {
  const navigate = useNavigate();
  const unreadAndTerminal =
    !run.readAt && run.status !== "running" && run.status !== "queued";

  return (
    <button
      type="button"
      onClick={() =>
        navigate(paths.settings.scheduledJobRunDetail(jobId, run.id))
      }
      className="border-none flex items-center px-4 h-14 hover:bg-white/5 light:hover:bg-slate-200 transition-colors text-left w-full"
    >
      <div className="w-[200px] flex items-center gap-2 relative">
        {unreadAndTerminal && (
          <Circle
            weight="fill"
            className="h-2 w-2 text-blue-400 light:text-blue-600 absolute -left-4"
          />
        )}
        <StatusBadge status={run.status} />
      </div>
      <span className="w-[260px] text-sm font-medium text-white light:text-slate-950 truncate">
        {new Date(run.startedAt).toLocaleString()}
      </span>
      <span className="w-[160px] text-sm font-medium text-white light:text-slate-950 truncate">
        {formatDuration(run)}
      </span>
      <span
        className={`flex-1 text-sm truncate pr-4 ${
          run.error
            ? "text-red-400 light:text-red-600 italic"
            : "font-medium text-white light:text-slate-950"
        }`}
      >
        {run.error || "—"}
      </span>
    </button>
  );
}
