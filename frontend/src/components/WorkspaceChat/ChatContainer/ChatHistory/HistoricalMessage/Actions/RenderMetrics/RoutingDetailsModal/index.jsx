import { X } from "@phosphor-icons/react";
import ModalWrapper from "@/components/ModalWrapper";

/**
 * @param {number} duration - duration in milliseconds
 * @returns {string}
 */
function formatDuration(duration) {
  try {
    return duration < 1
      ? `${(duration * 1000).toFixed(0)}ms`
      : `${duration.toFixed(3)}s`;
  } catch {
    return "";
  }
}

/**
 * @param {number} outputTps
 * @returns {string}
 */
function formatTps(outputTps) {
  try {
    return outputTps < 1000
      ? outputTps.toFixed(2)
      : outputTps.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } catch {
    return "";
  }
}

export default function RoutingDetailsModal({ routedTo, metrics, onClose }) {
  if (!routedTo) return null;

  return (
    <ModalWrapper isOpen={true}>
      <div className="bg-zinc-900 light:bg-white border border-zinc-700 light:border-slate-300 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-white light:text-slate-900">
            Routing Details
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-400 light:text-slate-500 hover:text-white light:hover:text-slate-900 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex flex-col gap-y-3">
          <DetailRow label="Router" value={routedTo.routerName || "Unknown"} />
          <DetailRow label="Routed to" value={routedTo.model} />
          <DetailRow label="Provider" value={routedTo.provider} />
          <DetailRow
            label="Matched rule"
            value={
              routedTo.isFallback
                ? "None (fallback)"
                : `${routedTo.ruleTitle || "Unknown"}${routedTo.ruleType === "llm" ? " (LLM classified)" : ""}`
            }
          />
          {metrics?.duration && (
            <DetailRow
              label="Response time"
              value={formatDuration(metrics.duration)}
            />
          )}
          {metrics?.outputTps && (
            <DetailRow
              label="Throughput"
              value={`${formatTps(metrics.outputTps)} tok/s`}
            />
          )}
        </div>
      </div>
    </ModalWrapper>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-zinc-400 light:text-slate-500">
        {label}
      </span>
      <span className="text-sm font-mono text-white light:text-slate-900">
        {value}
      </span>
    </div>
  );
}
