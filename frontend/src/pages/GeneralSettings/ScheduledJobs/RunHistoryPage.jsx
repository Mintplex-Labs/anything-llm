import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import { ArrowLeft } from "@phosphor-icons/react";
import ScheduledJobs from "@/models/scheduledJobs";
import usePolling from "@/hooks/usePolling";
import showToast from "@/utils/toast";
import paths from "@/utils/paths";
import RunRow from "./components/RunRow";
import { humanizeCron } from "./utils/cron";

export default function RunHistoryPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const hasInFlightRun = runs.some(
    (r) => r.status === "queued" || r.status === "running"
  );

  const fetchRuns = async () => {
    const { runs: foundRuns } = await ScheduledJobs.runs(id);
    setRuns(foundRuns || []);
    setLoading(false);
  };

  useEffect(() => {
    ScheduledJobs.get(id).then(({ job }) => setJob(job));
    fetchRuns();
  }, [id]);

  // Poll every 5s while visible so new runs appear and running statuses update.
  usePolling(fetchRuns, 5000);

  const handleRunNow = async () => {
    setTriggering(true);
    const { success, skipped, error } = await ScheduledJobs.trigger(id);
    setTriggering(false);
    if (!success) {
      showToast(error || t("scheduledJobs.toast.triggerFailed"), "error");
      return;
    }

    if (skipped) {
      showToast(
        t(
          "scheduledJobs.toast.triggerSkipped",
          "A run is already in progress for this job"
        ),
        "info"
      );
    } else {
      showToast(t("scheduledJobs.toast.triggered"), "success");
    }
    fetchRuns();
  };

  if (loading) {
    return (
      <RunHistoryLayout job={job}>
        <div className="flex flex-col items-center justify-center gap-8 py-24 text-center">
          <p className="text-zinc-400 light:text-slate-600 text-sm">
            {t("scheduledJobs.loading")}
          </p>
        </div>
      </RunHistoryLayout>
    );
  }

  return (
    <RunHistoryLayout job={job}>
      <div className="pt-8">
        <div className="flex items-center px-4 pb-[18px] text-xs font-semibold uppercase tracking-[1.4px] text-zinc-400 light:text-slate-600">
          <span className="w-[200px]">
            {t("scheduledJobs.runHistory.table.status")}
          </span>
          <span className="w-[260px]">
            {t("scheduledJobs.runHistory.table.started")}
          </span>
          <span className="w-[160px]">
            {t("scheduledJobs.runHistory.table.duration")}
          </span>
          <span className="flex-1">
            {t("scheduledJobs.runHistory.table.error")}
          </span>
        </div>
        <div className="h-px w-full bg-white/10 light:bg-slate-300" />

        {runs.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-8 py-24 text-center">
            <div className="flex flex-col gap-1.5">
              <p className="text-base font-semibold text-zinc-50 light:text-slate-950">
                {t("scheduledJobs.runHistory.emptyTitle")}
              </p>
              <p className="text-sm font-medium text-zinc-400 light:text-slate-600">
                {t("scheduledJobs.runHistory.emptySubtitle")}
              </p>
            </div>
            <button
              type="button"
              onClick={handleRunNow}
              disabled={triggering || hasInFlightRun}
              className="border-none h-9 px-5 rounded-lg bg-zinc-50 text-zinc-950 light:bg-slate-900 light:text-white text-sm font-medium hover:bg-zinc-200 light:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {t("scheduledJobs.runHistory.runNow")}
            </button>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-white/5 light:divide-slate-200">
            {runs.map((run) => (
              <RunRow
                key={run.id}
                run={run}
                jobId={job?.id}
                onKilled={fetchRuns}
              />
            ))}
          </div>
        )}
      </div>
    </RunHistoryLayout>
  );
}

function RunHistoryLayout({ job, children }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-2 pb-6 border-white/10 light:border-slate-300 border-b-2">
            <button
              type="button"
              onClick={() => navigate(paths.settings.scheduledJobs())}
              className="border-none flex items-center gap-2 text-zinc-400 light:text-slate-600 hover:text-zinc-50 light:hover:text-slate-950 text-sm transition-colors w-fit"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("scheduledJobs.runHistory.back")}
            </button>
            <p className="text-lg leading-7 font-semibold text-zinc-50 light:text-slate-950">
              {t("scheduledJobs.runHistory.title", {
                name: job?.name || "...",
              })}
            </p>
            <p className="text-xs text-zinc-400 light:text-slate-600">
              {t("scheduledJobs.runHistory.schedule")}{" "}
              <code>{humanizeCron(job?.schedule, i18n.language) || "—"}</code>
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
