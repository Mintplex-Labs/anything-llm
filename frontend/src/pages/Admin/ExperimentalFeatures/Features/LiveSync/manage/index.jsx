import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import System from "@/models/system";
import DocumentSyncQueueRow from "./DocumentSyncQueueRow";

export default function LiveDocumentSyncManager() {
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
                Watched documents
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-theme-text-secondary">
              These are all the documents that are currently being watched in
              your instance. The content of these documents will be periodically
              synced.
            </p>
          </div>
          <div className="overflow-x-auto">
            <WatchedDocumentsContainer />
          </div>
        </div>
      </div>
    </div>
  );
}

function WatchedDocumentsContainer() {
  const [loading, setLoading] = useState(true);
  const [queues, setQueues] = useState([]);

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
        highlightColor="var(--theme-bg-primary)"
        baseColor="var(--theme-bg-secondary)"
        count={1}
        className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
        containerClassName="flex w-full"
      />
    );
  }

  return (
    <table className="w-full text-sm text-left rounded-lg mt-6 min-w-[640px]">
      <thead className="text-theme-text-secondary text-xs leading-[18px] font-bold uppercase border-white/10 border-b">
        <tr>
          <th scope="col" className="px-6 py-3 rounded-tl-lg">
            Document Name
          </th>
          <th scope="col" className="px-6 py-3">
            Last Synced
          </th>
          <th scope="col" className="px-6 py-3">
            Time until next refresh
          </th>
          <th scope="col" className="px-6 py-3">
            Created On
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
