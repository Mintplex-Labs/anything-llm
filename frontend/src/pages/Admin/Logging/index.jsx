import Sidebar from "@/components/SettingsSidebar";
import useQuery from "@/hooks/useQuery";
import System from "@/models/system";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import LogRow from "./LogRow";
import showToast from "@/utils/toast";
import CTAButton from "@/components/lib/CTAButton";
import { useTranslation } from "react-i18next";

export default function AdminLogs() {
  const query = useQuery();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [offset, setOffset] = useState(Number(query.get("offset") || 0));
  const [canNext, setCanNext] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchLogs() {
      const { logs: _logs, hasPages = false } = await System.eventLogs(offset);
      setLogs(_logs);
      setCanNext(hasPages);
      setLoading(false);
    }
    fetchLogs();
  }, [offset]);

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
      setLogs([]);
      setCanNext(false);
      setOffset(0);
    } else {
      showToast(`Failed to clear logs: ${error}`, "error");
    }
  };

  const handlePrevious = () => {
    setOffset(Math.max(offset - 1, 0));
  };

  const handleNext = () => {
    setOffset(offset + 1);
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
            <div className="flex gap-x-4 items-center">
              <p className="text-lg leading-6 font-bold text-theme-text-primary">
                {t("event.title")}
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-theme-text-secondary mt-2">
              {t("event.description")}
            </p>
          </div>
          <div className="w-full justify-end flex">
            <CTAButton
              onClick={handleResetLogs}
              className="mt-3 mr-0 mb-4 md:-mb-14 z-10"
            >
              {t("event.clear")}
            </CTAButton>
          </div>
          <div className="overflow-x-auto mt-6">
            <LogsContainer
              loading={loading}
              logs={logs}
              offset={offset}
              canNext={canNext}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function LogsContainer({
  loading,
  logs,
  offset,
  canNext,
  handleNext,
  handlePrevious,
}) {
  const { t } = useTranslation();
  if (loading) {
    return (
      <Skeleton.default
        height="80vh"
        width="100%"
        highlightColor="var(--theme-bg-primary)"
        baseColor="var(--theme-bg-secondary)"
        count={1}
        className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm"
        containerClassName="flex w-full"
      />
    );
  }

  return (
    <>
      <table className="w-full text-sm text-left rounded-lg min-w-[640px] border-spacing-0">
        <thead className="text-theme-text-secondary text-xs leading-[18px] font-bold uppercase border-white/10 border-b">
          <tr>
            <th scope="col" className="px-6 py-3 rounded-tl-lg">
              {t("event.table.type")}
            </th>
            <th scope="col" className="px-6 py-3">
              {t("event.table.user")}
            </th>
            <th scope="col" className="px-6 py-3">
              {t("event.table.occurred")}
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
          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-200 light:text-theme-text-secondary light:border-theme-sidebar-border text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 disabled:invisible"
          disabled={offset === 0}
        >
          {t("common.previous")}
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-200 light:text-theme-text-secondary light:border-theme-sidebar-border text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 disabled:invisible"
          disabled={!canNext}
        >
          {t("common.next")}
        </button>
      </div>
    </>
  );
}
