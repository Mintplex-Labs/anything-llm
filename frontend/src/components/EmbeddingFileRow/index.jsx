import {
  CheckCircle,
  XCircle,
  CircleNotch,
  Clock,
  X,
} from "@phosphor-icons/react";
import { middleTruncate } from "@/utils/directories";

/**
 * @param {string} filename
 */
const getDisplayName = (filename) => {
  const base = filename.split("/").pop() || filename;
  return base.replace(
    /-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.json$/,
    ""
  );
};

const STATUS_STYLES = {
  pending: {
    icon: (
      <Clock
        size={16}
        className="text-slate-100 light:text-slate-900/40 shrink-0"
        weight="regular"
      />
    ),
    textColor: "text-slate-100 light:text-slate-900/70",
    label: "Queued",
  },
  embedding: {
    icon: (
      <CircleNotch
        size={16}
        className="text-slate-100 light:text-slate-900/40 animate-spin shrink-0"
        weight="bold"
      />
    ),
    textColor: "text-slate-100 light:text-slate-900/70",
    label: "Embedding",
  },
  complete: {
    icon: (
      <CheckCircle
        size={16}
        className="text-green-400 light:text-green-600 shrink-0"
        weight="fill"
      />
    ),
    textColor: "text-green-400 light:text-green-600",
    label: "Complete",
  },
  failed: {
    icon: (
      <XCircle
        size={16}
        className="text-red-400 light:text-red-600 shrink-0"
        weight="fill"
      />
    ),
    textColor: "text-red-400 light:text-red-600",
    label: "Failed",
  },
};

export default function EmbeddingFileRow({
  filename,
  status: fileStatus,
  onRemove,
}) {
  const { status, chunksProcessed = 0, totalChunks = 0 } = fileStatus;
  const displayName = getDisplayName(filename);
  const isEmbedding = status === "embedding";
  const pct =
    isEmbedding && totalChunks > 0
      ? Math.round((chunksProcessed / totalChunks) * 100)
      : 0;

  return (
    <div className="text-slate-100 light:text-slate-900 text-xs grid grid-cols-12 py-2 pl-3.5 pr-3.5 h-[34px] items-center border-b border-white/5">
      <div className="col-span-7 flex items-center gap-x-2 overflow-hidden">
        {STATUS_STYLES[status]?.icon || STATUS_STYLES.pending.icon}
        <p
          className={`whitespace-nowrap overflow-hidden text-ellipsis ${
            status === "failed" ? "text-red-400" : ""
          }`}
          title={displayName}
        >
          {middleTruncate(displayName, 40)}
        </p>
      </div>
      <div className="col-span-5 flex justify-end items-center gap-x-2">
        {isEmbedding ? (
          <div className="flex items-center gap-x-2 w-full justify-end">
            <div className="w-20 h-[1.5px] bg-white/10 light:bg-sky-900/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-white light:bg-sky-400 rounded-full transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs whitespace-nowrap w-8 text-right">{pct}%</p>
          </div>
        ) : (
          <div className="flex items-center gap-x-2">
            <p
              className={`text-xs italic whitespace-nowrap flex gap-2 justify-center items-center ${STATUS_STYLES[status]?.textColor}`}
            >
              {STATUS_STYLES[status]?.label || "Queued"}
            </p>
            {onRemove && (
              <button
                onClick={onRemove}
                className="border-none hover:bg-white/10 light:hover:bg-sky-900/10 rounded p-0.5 transition-colors"
                title="Remove from queue"
              >
                <X
                  size={14}
                  className="text-slate-100 light:text-slate-900/40 hover:text-slate-100 light:hover:text-slate-900"
                />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
