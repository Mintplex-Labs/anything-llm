import { useEffect, useState } from "react";
import { ArrowLeft, Eye, Circle } from "@phosphor-icons/react";
import ScheduledJobs from "@/models/scheduledJobs";

function StatusBadge({ status }) {
  const colors = {
    running: "bg-yellow-500/20 text-yellow-400",
    completed: "bg-green-500/20 text-green-400",
    failed: "bg-red-500/20 text-red-400",
    timed_out: "bg-orange-500/20 text-orange-400",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-gray-500/20 text-gray-400"}`}
    >
      {status?.replace("_", " ") || "—"}
    </span>
  );
}

export default function RunHistory({ job, onBack, onViewRun }) {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRuns();
  }, [job.id]);

  const fetchRuns = async () => {
    const { runs: foundRuns } = await ScheduledJobs.runs(job.id);
    setRuns(foundRuns || []);
    setLoading(false);
  };

  const formatDuration = (run) => {
    if (!run.completedAt || !run.startedAt) return "—";
    const ms =
      new Date(run.completedAt).getTime() - new Date(run.startedAt).getTime();
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  return (
    <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
      <div className="w-full flex flex-col gap-y-1 pb-6 border-white/10 border-b-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-theme-text-secondary hover:text-theme-text-primary text-sm mb-2 transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" /> Back to jobs
        </button>
        <p className="text-lg leading-6 font-bold text-theme-text-primary">
          Run History: {job.name}
        </p>
        <p className="text-xs text-theme-text-secondary">
          Schedule: <code>{job.schedule}</code>
        </p>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="text-theme-text-secondary text-sm">Loading...</div>
        ) : runs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-theme-text-secondary text-sm">
              No runs yet for this job.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm text-left rounded-lg overflow-hidden">
            <thead className="text-theme-text-secondary text-xs uppercase border-b border-white/10">
              <tr>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Started</th>
                <th className="px-6 py-3">Duration</th>
                <th className="px-6 py-3">Error</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <tr
                  key={run.id}
                  className="border-b border-white/5 hover:bg-theme-bg-primary/30"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 relative">
                      {!run.readAt && run.status !== "running" && (
                        <Circle
                          weight="fill"
                          className="h-2 w-2 text-blue-400 absolute -left-4"
                        />
                      )}
                      <StatusBadge status={run.status} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-theme-text-secondary text-xs">
                    {new Date(run.startedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-theme-text-secondary text-xs">
                    {formatDuration(run)}
                  </td>
                  <td className="px-6 py-4 text-red-400 text-xs max-w-[200px] truncate">
                    {run.error || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => onViewRun(run.id)}
                        className="p-1.5 rounded-lg hover:bg-theme-bg-primary text-theme-text-secondary hover:text-theme-text-primary transition-colors"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
