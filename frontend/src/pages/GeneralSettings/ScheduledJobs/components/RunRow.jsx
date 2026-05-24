import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Circle, Stop } from "@phosphor-icons/react";
import moment from "moment";
import paths from "@/utils/paths";
import StatusBadge from "./StatusBadge";
import ScheduledJobs from "@/models/scheduledJobs";
import showToast from "@/utils/toast";
import { formatDuration } from "@/utils/numbers";

/**
 * Format a run's elapsed time as ms / s / m.
 * @param {Object} run - The run object.
 * @returns {string} The formatted duration.
 */
function formatRunDuration(run) {
  if (!run.completedAt || !run.startedAt) return "—";
  const duration = moment.duration(
    moment(run.completedAt).diff(moment(run.startedAt))
  );
  return formatDuration(duration.asSeconds());
}

/**
 * One row of the run history table. The whole row is clickable and
 * navigates to the run detail page.
 * @param {Object} run - The run object.
 * @param {string} jobId - The ID of the job.
 * @param {function} onKilled - Callback when a run is killed (to refresh the list).
 * @returns {React.ReactNode} The rendered row.
 */
export default function RunRow({ run, jobId, onKilled }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [killing, setKilling] = useState(false);
  const unreadAndTerminal =
    !run.readAt && !["running", "queued"].includes(run.status);
  const isKillable = ["running", "queued"].includes(run.status);

  const handleKill = async (e) => {
    e.stopPropagation();
    setKilling(true);
    const { success, error } = await ScheduledJobs.killRun(run.id);
    setKilling(false);

    if (!success) {
      showToast(error || t("scheduledJobs.toast.killFailed"), "error");
      return;
    }

    showToast(t("scheduledJobs.toast.killed"), "success");
    onKilled?.();
  };

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
        {isKillable && (
          <button
            type="button"
            onClick={handleKill}
            disabled={killing}
            title={t("scheduledJobs.runHistory.stopJob")}
            className="border-none ml-2 p-1.5 rounded bg-red-500/20 text-red-400 light:bg-red-100 light:text-red-600 hover:bg-red-500/30 light:hover:bg-red-200 transition-colors disabled:opacity-50"
          >
            <Stop className="h-3.5 w-3.5" weight="bold" />
          </button>
        )}
        <StatusBadge status={run.status} />
      </div>
      <span className="w-[260px] text-sm font-medium text-white light:text-slate-950 truncate">
        {new Date(run.startedAt).toLocaleString()}
      </span>
      <span className="w-[160px] text-sm font-medium text-white light:text-slate-950 truncate">
        {formatRunDuration(run)}
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
