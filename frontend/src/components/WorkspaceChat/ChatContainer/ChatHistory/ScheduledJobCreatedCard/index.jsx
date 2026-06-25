import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarCheck, ArrowRight } from "@phosphor-icons/react";
import paths from "@/utils/paths";

/**
 * Card rendered in agent chat when a scheduled job is created via the
 * create-scheduled-job tool. Clicking it navigates to the job's run history.
 * @param {{content: {jobId: number|string, jobName?: string, schedule?: string, nextRun?: string}}} props
 */
function ScheduledJobCreatedCard({ props }) {
  const navigate = useNavigate();
  const { jobId, jobName, schedule } = props.content || {};

  const goToJob = () => {
    if (!jobId) return;
    navigate(paths.settings.scheduledJobRuns(jobId));
  };

  return (
    <div className="flex justify-center w-full my-2">
      <div className="w-full max-w-[750px] mr-4">
        <button
          type="button"
          onClick={goToJob}
          disabled={!jobId}
          className="w-full flex items-center justify-between bg-zinc-800 light:bg-slate-100 light:border light:border-slate-200/50 rounded-xl px-2 py-1 hover:bg-zinc-700 light:hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-x-3 min-w-0">
            <div className="bg-sky-100 text-sky-700 rounded-lg flex items-center justify-center flex-shrink-0 h-[48px] w-[48px]">
              <CalendarCheck size={24} weight="bold" />
            </div>
            <div className="flex flex-col min-w-0 text-left">
              <p className="text-white light:text-slate-900 text-sm font-medium truncate leading-snug">
                {jobName || "Scheduled job"}
              </p>
              <p className="text-zinc-400 light:text-slate-500 text-xs leading-snug truncate">
                Scheduled job created{schedule ? ` · ${schedule}` : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-x-2 px-4 py-2 rounded-lg border border-zinc-600 light:border-theme-sidebar-border text-white light:text-theme-text-primary text-sm font-medium flex-shrink-0 ml-4">
            <span>View job</span>
            <ArrowRight size={16} weight="bold" />
          </div>
        </button>
      </div>
    </div>
  );
}

export default memo(ScheduledJobCreatedCard);
