import { useNavigate } from "react-router-dom";
import { Eye, Play, Power, PencilSimple, Trash } from "@phosphor-icons/react";
import { humanizeCron } from "../utils/cron";
import StatusBadge from "./StatusBadge";
import { useTranslation } from "react-i18next";

// One row of the scheduled-jobs list. Owns its own action buttons and the
// "View runs" navigation; CRUD callbacks come from the parent.
export default function JobRow({ job, onTrigger, onToggle, onEdit, onDelete }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  // A job has at most one in-flight run; disable "Run now" while it's queued
  // or running so users get visible feedback that their click registered and
  // so the backend dedup never has to drop a manual trigger silently.
  const inFlight =
    job.latestRun?.status === "running" || job.latestRun?.status === "queued";
  return (
    <tr className="border-b border-white/5 hover:bg-theme-bg-primary/30">
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${job.enabled ? "bg-green-400" : "bg-gray-500"}`}
          />
          <span className="text-theme-text-primary font-medium">
            {job.name}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-theme-text-secondary">
        {humanizeCron(job.schedule, i18n.language)}
      </td>
      <td className="px-6 py-4">
        {job.latestRun ? (
          <StatusBadge status={job.latestRun.status} />
        ) : (
          <span className="text-theme-text-secondary text-xs">
            {t("scheduledJobs.row.neverRun")}
          </span>
        )}
      </td>
      <td className="px-6 py-4 text-theme-text-secondary text-xs">
        {job.lastRunAt ? new Date(job.lastRunAt).toLocaleString() : "—"}
      </td>
      <td className="px-6 py-4 text-theme-text-secondary text-xs">
        {job.enabled && job.nextRunAt
          ? new Date(job.nextRunAt).toLocaleString()
          : "—"}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate(`/settings/scheduled-jobs/${job.id}/runs`)}
            className="p-1.5 rounded-lg hover:bg-theme-bg-primary text-theme-text-secondary hover:text-theme-text-primary transition-colors"
            title={t("scheduledJobs.row.viewRuns")}
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onTrigger(job.id)}
            disabled={inFlight}
            className="p-1.5 rounded-lg hover:bg-theme-bg-primary text-theme-text-secondary hover:text-theme-text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-theme-text-secondary"
            title={t("scheduledJobs.row.runNow")}
          >
            <Play className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onToggle(job.id)}
            className={`p-1.5 rounded-lg hover:bg-theme-bg-primary transition-colors ${
              job.enabled
                ? "text-green-400 hover:text-yellow-400"
                : "text-gray-500 hover:text-green-400"
            }`}
            title={
              job.enabled
                ? t("scheduledJobs.row.disable")
                : t("scheduledJobs.row.enable")
            }
          >
            <Power className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(job)}
            className="p-1.5 rounded-lg hover:bg-theme-bg-primary text-theme-text-secondary hover:text-theme-text-primary transition-colors"
            title={t("scheduledJobs.row.edit")}
          >
            <PencilSimple className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(job.id)}
            className="p-1.5 rounded-lg hover:bg-theme-bg-primary text-theme-text-secondary hover:text-red-400 transition-colors"
            title={t("scheduledJobs.row.delete")}
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
