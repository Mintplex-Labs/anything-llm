import { useNavigate } from "react-router-dom";
import { Play, PencilSimple, X } from "@phosphor-icons/react";
import paths from "@/utils/paths";
import { humanizeCron } from "../utils/cron";
import { useTranslation } from "react-i18next";

// One row of the scheduled-jobs list. Clicking the name navigates to the
// run history; CRUD callbacks come from the parent.
export default function JobRow({ job, onTrigger, onToggle, onEdit, onDelete }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  // A job has at most one in-flight run; disable "Run now" while it's queued
  // or running so users get visible feedback that their click registered and
  // so the backend dedup never has to drop a manual trigger silently.
  const inFlight =
    job.latestRun?.status === "running" || job.latestRun?.status === "queued";

  const statusText = job.latestRun
    ? t(`scheduledJobs.status.${job.latestRun.status}`, job.latestRun.status)
    : t("scheduledJobs.row.neverRun");

  const stop = (handler) => (e) => {
    e.stopPropagation();
    handler();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(paths.settings.scheduledJobRuns(job.id))}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(paths.settings.scheduledJobRuns(job.id));
        }
      }}
      className="flex items-center justify-between px-4 h-14 hover:bg-white/5 light:hover:bg-slate-200 transition-colors cursor-pointer"
      title={t("scheduledJobs.row.viewRuns")}
    >
      <span className="w-[150px] text-sm font-medium text-white light:text-slate-950 truncate">
        {job.name}
      </span>
      <span className="w-[180px] text-sm text-zinc-400 light:text-slate-600 truncate">
        {humanizeCron(job.schedule, i18n.language)}
      </span>
      <span className="w-[120px] text-sm text-zinc-400 light:text-slate-600 truncate">
        {statusText}
      </span>
      <span className="w-[180px] text-sm text-zinc-400 light:text-slate-600 truncate">
        {job.lastRunAt ? new Date(job.lastRunAt).toLocaleString() : "—"}
      </span>
      <span className="w-[180px] text-sm text-zinc-400 light:text-slate-600 truncate">
        {job.enabled && job.nextRunAt
          ? new Date(job.nextRunAt).toLocaleString()
          : "—"}
      </span>
      <div className="w-[140px] flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={stop(() => onDelete(job.id))}
          className="border-none p-2 rounded-full text-zinc-400 light:text-slate-950 hover:text-red-400 light:hover:text-red-600 hover:bg-white/10 light:hover:bg-slate-300/50 transition-colors"
          title={t("scheduledJobs.row.delete")}
        >
          <X className="h-4 w-4 shrink-0" />
        </button>
        <button
          type="button"
          onClick={stop(() => onEdit(job))}
          className="border-none p-2 rounded-full text-zinc-400 light:text-slate-950 hover:text-white light:hover:text-slate-700 hover:bg-white/10 light:hover:bg-slate-300/50 transition-colors"
          title={t("scheduledJobs.row.edit")}
        >
          <PencilSimple className="h-4 w-4 shrink-0" />
        </button>
        <button
          type="button"
          onClick={stop(() => onTrigger(job.id))}
          disabled={inFlight}
          className="border-none p-2 rounded-full text-zinc-400 light:text-slate-950 hover:text-white light:hover:text-slate-700 hover:bg-white/10 light:hover:bg-slate-300/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          title={t("scheduledJobs.row.runNow")}
        >
          <Play className="h-4 w-4 shrink-0" />
        </button>
        <button
          type="button"
          role="switch"
          aria-checked={job.enabled}
          onClick={stop(() => onToggle(job.id))}
          title={
            job.enabled
              ? t("scheduledJobs.row.disable")
              : t("scheduledJobs.row.enable")
          }
          className={`border-none relative h-[15px] w-7 rounded-full p-0.5 transition-colors ${
            job.enabled ? "bg-green-400" : "bg-zinc-600 light:bg-slate-300"
          }`}
        >
          <span
            className={`block h-3 w-3 rounded-full bg-white shadow transition-transform ${
              job.enabled ? "translate-x-[13px]" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
