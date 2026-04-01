import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import ScheduledJobs from "@/models/scheduledJobs";
import RunHistory from "./RunHistory";
import paths from "@/utils/paths";

export default function RunHistoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    ScheduledJobs.get(id).then(({ job }) => setJob(job));
  }, [id]);

  if (!job) return null;

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <RunHistory
          job={job}
          onBack={() => navigate(paths.settings.scheduledJobs())}
          onViewRun={(runId) =>
            navigate(`/settings/scheduled-jobs/${id}/runs/${runId}`)
          }
        />
      </div>
    </div>
  );
}
