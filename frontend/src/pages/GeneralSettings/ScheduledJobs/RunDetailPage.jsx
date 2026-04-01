import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import RunDetailViewer from "./RunDetailViewer";

export default function RunDetailPage() {
  const { id, runId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <RunDetailViewer
          runId={runId}
          onBack={() => navigate(`/settings/scheduled-jobs/${id}/runs`)}
        />
      </div>
    </div>
  );
}
