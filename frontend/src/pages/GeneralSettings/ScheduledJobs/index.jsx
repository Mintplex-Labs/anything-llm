import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import { PlusCircle } from "@phosphor-icons/react";
import ScheduledJobs from "@/models/scheduledJobs";
import useWebPushNotifications from "@/hooks/useWebPushNotifications";
import usePolling from "@/hooks/usePolling";
import NewJobModal from "./NewJobModal";
import ModalWrapper from "@/components/ModalWrapper";
import { useModal } from "@/hooks/useModal";
import CTAButton from "@/components/lib/CTAButton";
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
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white/10 border-b-2">
            <div className="items-center flex gap-x-4">
              <p className="text-lg leading-6 font-bold text-theme-text-primary">
                {t("scheduledJobs.title")}
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-theme-text-secondary">
              {t("scheduledJobs.description")}
            </p>
          </div>

          <div className="w-full justify-end flex pt-6 pb-4">
            <CTAButton onClick={handleCreate}>
              <PlusCircle className="h-4 w-4" weight="bold" />{" "}
              {t("scheduledJobs.newJob")}
            </CTAButton>
          </div>

          {loading ? (
            <div className="text-theme-text-secondary text-sm">
              {t("scheduledJobs.loading")}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-theme-text-secondary text-sm">
                {t("scheduledJobs.empty")}
              </p>
            </div>
          ) : (
            <table className="w-full text-sm text-left rounded-lg overflow-hidden">
              <thead className="text-theme-text-secondary text-xs uppercase border-b border-white/10">
                <tr>
                  <th className="px-6 py-3">{t("scheduledJobs.table.name")}</th>
                  <th className="px-6 py-3">
                    {t("scheduledJobs.table.schedule")}
                  </th>
                  <th className="px-6 py-3">
                    {t("scheduledJobs.table.status")}
                  </th>
                  <th className="px-6 py-3">
                    {t("scheduledJobs.table.lastRun")}
                  </th>
                  <th className="px-6 py-3">
                    {t("scheduledJobs.table.nextRun")}
                  </th>
                  <th className="px-6 py-3 text-right">
                    {t("scheduledJobs.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
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
              </tbody>
            </table>
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
