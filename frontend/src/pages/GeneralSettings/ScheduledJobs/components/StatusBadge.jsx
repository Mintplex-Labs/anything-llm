const STATUS_COLORS = {
  running: "bg-yellow-500/20 text-yellow-400",
  completed: "bg-green-500/20 text-green-400",
  failed: "bg-red-500/20 text-red-400",
  timed_out: "bg-orange-500/20 text-orange-400",
};

// Pill badge for a scheduled-job-run status. Used in the jobs list and the
// run history table to keep the visual treatment consistent.
export default function StatusBadge({ status }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        STATUS_COLORS[status] || "bg-gray-500/20 text-gray-400"
      }`}
    >
      {status?.replace("_", " ") || "—"}
    </span>
  );
}
