import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import { ArrowLeft } from "@phosphor-icons/react";
import ScheduledJobs from "@/models/scheduledJobs";
import usePolling from "@/hooks/usePolling";
import paths from "@/utils/paths";
import RunRow from "./components/RunRow";

export default function RunHistoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white/10 border-b-2">
            <button
              onClick={() => navigate(paths.settings.scheduledJobs())}
              className="flex items-center gap-2 text-theme-text-secondary hover:text-theme-text-primary text-sm mb-2 transition-colors w-fit"
            >
              <ArrowLeft className="h-4 w-4" /> Back to jobs
            </button>
            <p className="text-lg leading-6 font-bold text-theme-text-primary">
              Run History: {job?.name || "..."}
            </p>
            {job && (
              <p className="text-xs text-theme-text-secondary">
                Schedule: <code>{job.schedule}</code>
              </p>
            )}
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="text-theme-text-secondary text-sm">
                Loading...
              </div>
            ) : runs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-theme-text-secondary text-sm">
                  No runs yet for this job.
                </p>
              </div>
            ) : (
              <table className="w-full text-sm text-left rounded-lg overflow-hidden">
                <thead className="text-theme-text-secondary text-xs uppercase border-b border-white/10">
                  <tr>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Started</th>
                    <th className="px-6 py-3">Duration</th>
                    <th className="px-6 py-3">Error</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map((run) => (
                    <RunRow key={run.id} run={run} jobId={job?.id} />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
