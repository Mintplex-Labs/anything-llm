import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import System from "@/models/system";
import DocumentSyncQueueRow from "./DocumentSyncQueueRow";
import { useTranslation } from "react-i18next";
export default function LiveDocumentSyncManager() {
  const { t } = useTranslation();
  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
            <div className="items-center flex gap-x-4">
              <p className="text-lg leading-6 font-bold text-white">
                {t("liveDocumentSyncManager.pageTitle")}
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
              {t("liveDocumentSyncManager.pageDescription")}
            </p>
          </div>
          <WatchedDocumentsContainer />
        </div>
      </div>
    </div>
  );
}

function WatchedDocumentsContainer() {
  const [loading, setLoading] = useState(true);
  const [queues, setQueues] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchData() {
      const _queues = await System.experimentalFeatures.liveSync.queues();
      setQueues(_queues);
      setLoading(false);
    }
    fetchData();
  }, []);

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
    <table className="w-full text-sm text-left rounded-lg mt-6">
      <thead className="text-white text-opacity-80 text-xs leading-[18px] font-bold uppercase border-white border-b border-opacity-60">
        <tr>
          <th scope="col" className="px-6 py-3 rounded-tl-lg">
            {t("liveDocumentSyncManager.tableHeaders.documentName")}
          </th>
          <th scope="col" className="px-6 py-3">
            {t("liveDocumentSyncManager.tableHeaders.lastSynced")}
          </th>
          <th scope="col" className="px-6 py-3">
            {t("liveDocumentSyncManager.tableHeaders.timeUntilNextRefresh")}
          </th>
          <th scope="col" className="px-6 py-3">
            {t("liveDocumentSyncManager.tableHeaders.createdOn")}
          </th>
          <th scope="col" className="px-6 py-3 rounded-tr-lg">
            {" "}
          </th>
        </tr>
      </thead>
      <tbody>
        {queues.map((queue) => (
          <DocumentSyncQueueRow key={queue.id} queue={queue} />
        ))}
      </tbody>
    </table>
  );
}
