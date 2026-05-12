import Sidebar from "@/components/SettingsSidebar";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { formatDateTime24 } from "@/utils/dates";
import { ArrowClockwise, CaretDown, CaretUp } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import { useTranslation } from "react-i18next";

export default function BatchJobs() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [retryingJobId, setRetryingJobId] = useState(null);
  const { t } = useTranslation();

  async function fetchJobs() {
    setLoading(true);
    const { jobs: _jobs = [] } = await System.embeddingBatchJobs();
    setJobs(_jobs);
    setLoading(false);
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  async function handleRetry(jobId) {
    setRetryingJobId(jobId);
    const result = await System.retryEmbeddingBatchJob(jobId);
    setRetryingJobId(null);
    if (!result.success) {
      showToast(result.error || t("batch-jobs.retry.failed"), "error");
      return;
    }
    showToast(t("batch-jobs.retry.started"), "success");
    await fetchJobs();
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white/10 border-b-2">
            <p className="text-lg leading-6 font-bold text-theme-text-primary">
              {t("batch-jobs.title")}
            </p>
            <p className="text-xs leading-[18px] font-base text-theme-text-secondary mt-2">
              {t("batch-jobs.description")}
            </p>
          </div>
          <div className="overflow-x-auto mt-6">
            {loading ? (
              <Skeleton.default
                height="60vh"
                width="100%"
                highlightColor="var(--theme-bg-primary)"
                baseColor="var(--theme-bg-secondary)"
                count={1}
              />
            ) : jobs.length === 0 ? (
              <div className="w-full min-h-[260px] flex flex-col items-center justify-center text-center">
                <p className="text-base font-semibold text-theme-text-primary">
                  当前无任务
                </p>
                <p className="text-sm text-theme-text-secondary mt-2">
                  No batch jobs currently running.
                </p>
              </div>
            ) : (
              <JobsTable
                jobs={jobs}
                onRetry={handleRetry}
                retryingJobId={retryingJobId}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function JobsTable({ jobs, onRetry, retryingJobId }) {
  const { t } = useTranslation();
  return (
    <table className="w-full text-xs text-left rounded-lg min-w-[1220px] border-spacing-0">
      <thead className="text-theme-text-secondary text-xs leading-[18px] font-bold uppercase border-white/10 border-b">
        <tr>
          <th className="px-4 py-3">{t("batch-jobs.table.job-id")}</th>
          <th className="px-4 py-3">{t("batch-jobs.table.workspace")}</th>
          <th className="px-4 py-3">{t("batch-jobs.table.status")}</th>
          <th className="px-4 py-3">{t("batch-jobs.table.retry-count")}</th>
          <th className="px-4 py-3">{t("batch-jobs.table.next-retry")}</th>
          <th className="px-4 py-3">{t("batch-jobs.table.created")}</th>
          <th className="px-4 py-3">{t("batch-jobs.table.updated")}</th>
          <th className="px-4 py-3">{t("batch-jobs.table.error")}</th>
          <th className="px-4 py-3">{t("batch-jobs.table.action")}</th>
          <th className="px-4 py-3" />
        </tr>
      </thead>
      <tbody>
        {jobs.map((job) => (
          <JobRow
            key={job.jobId}
            job={job}
            onRetry={onRetry}
            retrying={retryingJobId === job.jobId}
          />
        ))}
      </tbody>
    </table>
  );
}

function JobRow({ job, onRetry, retrying }) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();
  const canRetry =
    !!job.batchId && !["completed", "cancelled"].includes(job.status);

  return (
    <>
      <tr className="bg-transparent text-white text-opacity-80 text-xs font-medium border-b border-white/10 h-12">
        <td className="px-4 py-2 font-mono max-w-[180px] truncate">
          {job.jobId}
        </td>
        <td className="px-4 py-2">{job.workspaceSlug}</td>
        <td className="px-4 py-2">
          <StatusBadge status={job.status} />
        </td>
        <td className="px-4 py-2">{job.retryCount || 0}</td>
        <td className="px-4 py-2 whitespace-nowrap">
          {formatDateTime24(job.nextRetryAt)}
        </td>
        <td className="px-4 py-2 whitespace-nowrap">
          {formatDateTime24(job.createdAt)}
        </td>
        <td className="px-4 py-2 whitespace-nowrap">
          {formatDateTime24(job.updatedAt)}
        </td>
        <td className="px-4 py-2 max-w-[220px] truncate">
          {job.lastTransientError || job.lastError || "--"}
        </td>
        <td className="px-4 py-2">
          {canRetry ? (
            <button
              type="button"
              disabled={retrying}
              onClick={() => onRetry(job.jobId)}
              className="flex items-center gap-x-1 text-theme-text-secondary hover:text-theme-text-primary disabled:opacity-60"
            >
              <ArrowClockwise size={16} />
              {retrying
                ? t("batch-jobs.retry.working")
                : t("batch-jobs.retry.label")}
            </button>
          ) : (
            <span className="text-theme-text-secondary">--</span>
          )}
        </td>
        <td className="px-4 py-2">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-x-1 text-theme-text-secondary hover:text-theme-text-primary"
          >
            {expanded ? <CaretUp size={18} /> : <CaretDown size={18} />}
            Events
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-theme-bg-primary">
          <td colSpan="10" className="px-4 py-4">
            <div className="rounded-lg bg-theme-bg-secondary p-3 border-white/10 border">
              {(job.events || []).length === 0 ? (
                <p className="text-theme-text-secondary">No events</p>
              ) : (
                <div className="flex flex-col gap-y-2">
                  {job.events.map((event) => (
                    <div
                      key={event.id}
                      className="grid grid-cols-12 gap-x-3 text-theme-text-primary"
                    >
                      <span className="col-span-3 whitespace-nowrap">
                        {formatDateTime24(event.occurredAt)}
                      </span>
                      <span className="col-span-2">{event.event}</span>
                      <pre className="col-span-7 overflow-x-auto text-theme-text-secondary">
                        {event.metadata || "{}"}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function StatusBadge({ status }) {
  const colors = {
    queued: "bg-slate-600/20 text-slate-200 light:text-slate-700",
    file_uploaded: "bg-blue-600/20 text-blue-300 light:text-blue-700",
    submitted: "bg-blue-600/20 text-blue-300 light:text-blue-700",
    polling: "bg-yellow-600/20 text-yellow-300 light:text-yellow-700",
    retrying: "bg-orange-600/20 text-orange-300 light:text-orange-700",
    completed: "bg-green-600/20 text-green-300 light:text-green-700",
    failed: "bg-red-600/20 text-red-300 light:text-red-700",
    cancelled: "bg-red-600/20 text-red-300 light:text-red-700",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        colors[status] || colors.queued
      }`}
    >
      {status}
    </span>
  );
}
