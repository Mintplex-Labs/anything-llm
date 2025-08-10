import { CircleNotch } from "@phosphor-icons/react";
import { DOCUMENT_STATUS_LABELS, isProcessingStatus } from "@/utils/documentStatus";

export default function StatusBadge({ status }) {
  if (!status) return null;
  const upper = status.toUpperCase();
  const label = DOCUMENT_STATUS_LABELS[upper] || upper;

  if (upper === "READY") {
    return (
      <span className="bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-3xl">
        {label}
      </span>
    );
  }
  if (upper === "FAILED") {
    return (
      <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-3xl">
        {label}
      </span>
    );
  }

  if (isProcessingStatus(upper)) {
    return (
      <span className="flex items-center gap-1 text-[10px] text-white">
        <CircleNotch size={10} className="animate-spin" />
        {label}
      </span>
    );
  }

  return null;
}
