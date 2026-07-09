import { useRef } from "react";
import { Trash } from "@phosphor-icons/react";
import { stripUuidAndJsonFromString } from "@/components/Modals/ManageWorkspace/Documents/Directory/utils";
import moment from "moment";
import System from "@/models/system";

export default function DocumentSyncQueueCard({ queue }) {
  const cardRef = useRef(null);

  const handleDelete = async () => {
    cardRef?.current?.remove();
    await System.experimentalFeatures.liveSync.setWatchStatusForDocument(
      queue.workspaceDoc.workspace.slug,
      queue.workspaceDoc.docpath,
      false
    );
  };

  return (
    <div
      ref={cardRef}
      className="rounded-xl border border-white/10 bg-theme-bg-primary/50 p-4 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-theme-text-primary break-words min-w-0 leading-snug">
          {stripUuidAndJsonFromString(queue.workspaceDoc.filename)}
        </p>
        <button
          type="button"
          onClick={handleDelete}
          aria-label="Bỏ theo dõi tài liệu"
          className="border-none font-medium p-1.5 rounded-lg text-theme-text-primary hover:text-red-500 shrink-0"
        >
          <Trash className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2 text-xs sm:text-sm">
        <div className="flex flex-col gap-0.5">
          <span className="text-theme-text-secondary uppercase text-[11px] font-bold tracking-wide">
            Lần đồng bộ cuối
          </span>
          <span className="text-theme-text-primary/90">
            {moment(queue.lastSyncedAt).fromNow()}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-theme-text-secondary uppercase text-[11px] font-bold tracking-wide">
            Làm mới tiếp theo
          </span>
          <span className="text-theme-text-primary/90 break-words">
            {moment(queue.nextSyncAt).format("lll")}
            <span className="text-xs text-theme-text-secondary ml-1">
              ({moment(queue.nextSyncAt).fromNow()})
            </span>
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-theme-text-secondary uppercase text-[11px] font-bold tracking-wide">
            Ngày tạo
          </span>
          <span className="text-theme-text-primary/90">
            {moment(queue.createdAt).format("lll")}
          </span>
        </div>
      </div>
    </div>
  );
}
