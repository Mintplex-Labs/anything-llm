import Sidebar from "@/components/SettingsSidebar";
import useQuery from "@/hooks/useQuery";
import System from "@/models/system";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import LogRow from "./LogRow";
import showToast from "@/utils/toast";
import CTAButton from "@/components/lib/CTAButton";

export default function AdminLogs() {
  const handleResetLogs = async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear all event logs? This action is irreversible."
      )
    )
      return;
    const { success, error } = await System.clearEventLogs();
    if (success) {
      showToast("Event logs cleared successfully.", "success");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      showToast(`Failed to clear logs: ${error}`, "error");
    }
  };
  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
            <div className="flex gap-x-4 items-center">
              <p className="text-lg leading-6 font-bold text-white">
                Event Logs
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
              View all actions and events happening on this instance for
              monitoring.
            </p>
          </div>
          <div className="w-full justify-end flex">
            <CTAButton
              onClick={handleResetLogs}
              className="mt-3 mr-0 -mb-14 z-10"
            >
              Clear Event Logs
            </CTAButton>
          </div>
          <LogsContainer />
        </div>
      </div>
    </div>
  );
}

function LogsContainer() {
  const query = useQuery();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [offset, setOffset] = useState(Number(query.get("offset") || 0));
  const [canNext, setCanNext] = useState(false);

  const handlePrevious = () => {
    setOffset(Math.max(offset - 1, 0));
  };
  const handleNext = () => {
    setOffset(offset + 1);
  };

  useEffect(() => {
    async function fetchLogs() {
      const { logs: _logs, hasPages = false } = await System.eventLogs(offset);
      setLogs(_logs);
      setCanNext(hasPages);
      setLoading(false);
    }
    fetchLogs();
  }, [offset]);

  if (loading) {
    return (
      <Skeleton.default
        height="80vh"
        width="100%"
        highlightColor="#3D4147"
        baseColor="#2C2F35"
        count={1}
        className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
        containerClassName="flex w-full"
      />
    );
  }

  return (
    <>
      <table className="w-full text-sm text-left rounded-lg mt-6">
        <thead className="text-white text-opacity-80 text-xs leading-[18px] font-bold uppercase border-white border-b border-opacity-60">
          <tr>
            <th scope="col" className="px-6 py-3 rounded-tl-lg">
              Event Type
            </th>
            <th scope="col" className="px-6 py-3">
              User
            </th>
            <th scope="col" className="px-6 py-3">
              Occurred At
            </th>
            <th scope="col" className="px-6 py-3 rounded-tr-lg">
              {" "}
            </th>
          </tr>
        </thead>
        <tbody>
          {!!logs && logs.map((log) => <LogRow key={log.id} log={log} />)}
        </tbody>
      </table>
      <div className="flex w-full justify-between items-center mt-6">
        <button
          onClick={handlePrevious}
          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-200 text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 disabled:invisible"
          disabled={offset === 0}
        >
          Previous Page
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-200 text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 disabled:invisible"
          disabled={!canNext}
        >
          Next Page
        </button>
      </div>
    </>
  );
}
