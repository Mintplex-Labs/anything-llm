import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import ScheduledJobs from "@/models/scheduledJobs";
import useWebPushNotifications from "@/hooks/useWebPushNotifications";
import usePolling from "@/hooks/usePolling";
import NewJobModal from "./NewJobModal";
import ModalWrapper from "@/components/ModalWrapper";
import { useModal } from "@/hooks/useModal";
import showToast from "@/utils/toast";
import JobRow from "./components/JobRow";

export default function ScheduledJobsPage() {
  const { t } = useTranslation();
  useWebPushNotifications();
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);

  const fetchJobs = async () => {
    const { jobs: foundJobs } = await ScheduledJobs.list();
    setJobs(foundJobs || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Poll every 5s while tab is visible so status badges and run timestamps stay in sync.
  usePolling(fetchJobs, 5000);

  const handleDelete = async (id) => {
    if (!window.confirm(t("scheduledJobs.confirmDelete"))) return;
    await ScheduledJobs.delete(id);
    showToast(t("scheduledJobs.toast.deleted"), "success");
    fetchJobs();
  };

  const handleToggle = async (id) => {
    const result = await ScheduledJobs.toggle(id);
    if (result?.error) {
      showToast(result.error, "error");
    }
    fetchJobs();
  };

  const handleTrigger = async (id) => {
    const { success, error } = await ScheduledJobs.trigger(id);
    if (success) {
      showToast(t("scheduledJobs.toast.triggered"), "success");
    } else {
      showToast(error || t("scheduledJobs.toast.triggerFailed"), "error");
    }
    fetchJobs();
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    openModal();
  };

  const handleCreate = () => {
    setEditingJob(null);
    openModal();
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex items-end justify-between gap-x-4 pb-6 border-white/10 light:border-slate-300 border-b-2">
            <div className="flex flex-col gap-y-2">
              <p className="text-lg leading-7 font-semibold text-zinc-50 light:text-slate-950">
                {t("scheduledJobs.title")}
              </p>
              <p className="text-xs leading-4 text-zinc-400 light:text-slate-600 max-w-[700px]">
                {t("scheduledJobs.description")}
              </p>
            </div>
            {!loading && jobs.length > 0 && (
              <button
                type="button"
                onClick={handleCreate}
                className="h-9 px-5 rounded-lg bg-zinc-50 text-zinc-950 light:bg-slate-900 light:text-white text-sm font-medium hover:bg-zinc-200 light:hover:bg-slate-800 transition-colors shrink-0"
              >
                {t("scheduledJobs.newJob")}
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-zinc-400 light:text-slate-600 text-sm pt-8">
              {t("scheduledJobs.loading")}
            </div>
          ) : (
            <div className="pt-8">
              <div className="flex items-center justify-between px-4 pb-[18px] text-xs font-semibold uppercase tracking-[1.4px] text-zinc-400 light:text-slate-600">
                <span className="w-[150px]">
                  {t("scheduledJobs.table.name")}
                </span>
                <span className="w-[180px]">
                  {t("scheduledJobs.table.schedule")}
                </span>
                <span className="w-[120px]">
                  {t("scheduledJobs.table.status")}
                </span>
                <span className="w-[180px]">
                  {t("scheduledJobs.table.lastRun")}
                </span>
                <span className="w-[180px]">
                  {t("scheduledJobs.table.nextRun")}
                </span>
                <span className="w-[140px] text-right">
                  {t("scheduledJobs.table.actions")}
                </span>
              </div>
              <div className="h-px w-full bg-white/10 light:bg-slate-300" />

              {jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-8 py-24 text-center">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-base font-semibold text-zinc-50 light:text-slate-950">
                      {t("scheduledJobs.emptyTitle")}
                    </p>
                    <p className="text-sm font-medium text-zinc-400 light:text-slate-600">
                      {t("scheduledJobs.emptySubtitle")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCreate}
                    className="h-9 px-5 rounded-lg bg-zinc-50 text-zinc-950 light:bg-slate-900 light:text-white text-sm font-medium hover:bg-zinc-200 light:hover:bg-slate-800 transition-colors"
                  >
                    {t("scheduledJobs.newJob")}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-white/5 light:divide-slate-300">
                  {jobs.map((job) => (
                    <JobRow
                      key={job.id}
                      job={job}
                      onTrigger={handleTrigger}
                      onToggle={handleToggle}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ModalWrapper isOpen={isOpen}>
        <NewJobModal
          job={editingJob}
          onClose={closeModal}
          onSaved={() => {
            closeModal();
            fetchJobs();
          }}
        />
      </ModalWrapper>
    </div>
  );
}
