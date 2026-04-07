import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import {
  PlusCircle,
  Play,
  Trash,
  PencilSimple,
  Eye,
  Power,
} from "@phosphor-icons/react";
import ScheduledJobs from "@/models/scheduledJobs";
import useWebPushNotifications from "@/hooks/useWebPushNotifications";
import usePolling from "@/hooks/usePolling";
import NewJobModal from "./NewJobModal";
import ModalWrapper from "@/components/ModalWrapper";
import { useModal } from "@/hooks/useModal";
import CTAButton from "@/components/lib/CTAButton";
import showToast from "@/utils/toast";
import { cronToHuman } from "./utils/cron";

function StatusBadge({ status }) {
  const colors = {
    running: "bg-yellow-500/20 text-yellow-400",
    completed: "bg-green-500/20 text-green-400",
    failed: "bg-red-500/20 text-red-400",
    timed_out: "bg-orange-500/20 text-orange-400",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-gray-500/20 text-gray-400"}`}
    >
      {status?.replace("_", " ") || "—"}
    </span>
  );
}

export default function ScheduledJobsPage() {
  useWebPushNotifications();
  const navigate = useNavigate();
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
    if (!window.confirm("Are you sure you want to delete this scheduled job?"))
      return;
    await ScheduledJobs.delete(id);
    showToast("Job deleted", "success");
    fetchJobs();
  };

  const handleToggle = async (id) => {
    await ScheduledJobs.toggle(id);
    fetchJobs();
  };

  const handleTrigger = async (id) => {
    const { success, error } = await ScheduledJobs.trigger(id);
    if (success) {
      showToast("Job triggered successfully", "success");
    } else {
      showToast(error || "Failed to trigger job", "error");
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
                Scheduled Jobs
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-theme-text-secondary">
              Create recurring AI tasks that run on a schedule. Each job runs a
              prompt with optional tools and saves the result for review.
            </p>
          </div>

          <div className="w-full justify-end flex pt-6 pb-4">
            <CTAButton onClick={handleCreate}>
              <PlusCircle className="h-4 w-4" weight="bold" /> New Job
            </CTAButton>
          </div>

          {loading ? (
            <div className="text-theme-text-secondary text-sm">Loading...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-theme-text-secondary text-sm">
                No scheduled jobs yet. Create one to get started.
              </p>
            </div>
          ) : (
            <table className="w-full text-sm text-left rounded-lg overflow-hidden">
              <thead className="text-theme-text-secondary text-xs uppercase border-b border-white/10">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Schedule</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Last Run</th>
                  <th className="px-6 py-3">Next Run</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b border-white/5 hover:bg-theme-bg-primary/30"
                  >
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
                      {cronToHuman(job.schedule)}
                    </td>
                    <td className="px-6 py-4">
                      {job.latestRun ? (
                        <StatusBadge status={job.latestRun.status} />
                      ) : (
                        <span className="text-theme-text-secondary text-xs">
                          Never run
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-theme-text-secondary text-xs">
                      {job.lastRunAt
                        ? new Date(job.lastRunAt).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-theme-text-secondary text-xs">
                      {job.enabled && job.nextRunAt
                        ? new Date(job.nextRunAt).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/settings/scheduled-jobs/${job.id}/runs`)
                          }
                          className="p-1.5 rounded-lg hover:bg-theme-bg-primary text-theme-text-secondary hover:text-theme-text-primary transition-colors"
                          title="View runs"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleTrigger(job.id)}
                          className="p-1.5 rounded-lg hover:bg-theme-bg-primary text-theme-text-secondary hover:text-theme-text-primary transition-colors"
                          title="Run now"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggle(job.id)}
                          className={`p-1.5 rounded-lg hover:bg-theme-bg-primary transition-colors ${
                            job.enabled
                              ? "text-green-400 hover:text-yellow-400"
                              : "text-gray-500 hover:text-green-400"
                          }`}
                          title={job.enabled ? "Disable" : "Enable"}
                        >
                          <Power className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(job)}
                          className="p-1.5 rounded-lg hover:bg-theme-bg-primary text-theme-text-secondary hover:text-theme-text-primary transition-colors"
                          title="Edit"
                        >
                          <PencilSimple className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="p-1.5 rounded-lg hover:bg-theme-bg-primary text-theme-text-secondary hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
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
