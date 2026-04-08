import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import {
  ArrowLeft,
  ChatText,
  Brain,
  Wrench,
  FileArrowDown,
} from "@phosphor-icons/react";
import ScheduledJobs from "@/models/scheduledJobs";
import usePolling from "@/hooks/usePolling";
import showToast from "@/utils/toast";
import paths from "@/utils/paths";
import renderMarkdown from "@/utils/chat/markdown";
import CollapsibleSection from "./components/CollapsibleSection";
import ToolCallCard from "./components/ToolCallCard";
import GeneratedFileCard from "./components/GeneratedFileCard";

const STATUS_COLORS = {
  completed: "text-green-400",
  failed: "text-red-400",
  timed_out: "text-orange-400",
  running: "text-yellow-400",
};

export default function RunDetailPage() {
  const { id, runId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [run, setRun] = useState(null);
  const [job, setJob] = useState(null);
  const [continuing, setContinuing] = useState(false);

  useEffect(() => {
    fetchRun();
  }, [runId]);

  const fetchRun = async () => {
    const data = await ScheduledJobs.getRun(runId);
    setRun(data.run);
    setJob(data.job);
    setLoading(false);

    if (data.run && !data.run.readAt) {
      ScheduledJobs.markRunRead(runId);
    }
  };

  // Poll every 3s while a run is in progress so the trace/status updates live.
  // Stops automatically once the run reaches a terminal state.
  usePolling(fetchRun, 3000, run?.status === "running");

  const handleContinueInThread = async () => {
    setContinuing(true);
    const { workspaceSlug, threadSlug, error } =
      await ScheduledJobs.continueInThread(runId);

    if (error || !workspaceSlug || !threadSlug) {
      showToast(error || "Failed to create thread", "error");
      setContinuing(false);
      return;
    }

    navigate(paths.workspace.thread(workspaceSlug, threadSlug));
  };

  const result = run?.result || {};

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          {loading ? (
            <p className="text-theme-text-secondary text-sm">
              Loading run details...
            </p>
          ) : !run ? (
            <p className="text-theme-text-secondary text-sm">Run not found.</p>
          ) : (
            <>
              <RunHeader
                job={job}
                run={run}
                result={result}
                continuing={continuing}
                onBack={() => navigate(`/settings/scheduled-jobs/${id}/runs`)}
                onContinueInThread={handleContinueInThread}
              />

              <div className="mt-6 space-y-4">
                <PromptSection prompt={job?.prompt} />

                {run.error && <ErrorSection error={run.error} />}

                {result.thoughts?.length && (
                  <AgentThoughtsSection result={result} />
                )}

                {result.toolCalls?.length && (
                  <ToolCallsSection result={result} />
                )}

                {result.generatedFiles?.length && (
                  <GeneratedFilesSection result={result} />
                )}

                {result.text && <FinalResponseSection result={result} />}

                {result.metrics && Object.keys(result.metrics).length > 0 && (
                  <MetricsSection metrics={result.metrics} />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function RunHeader({
  job,
  run,
  result,
  continuing,
  onBack,
  onContinueInThread,
}) {
  return (
    <div className="w-full flex flex-col gap-y-1 pb-6 border-white/10 border-b-2">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-theme-text-secondary hover:text-theme-text-primary text-sm mb-2 transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg leading-6 font-bold text-theme-text-primary">
            {job?.name || "Unknown Job"} — Run #{run.id}
          </p>
          <div className="flex items-center gap-4 mt-1">
            <span
              className={`text-sm font-medium ${STATUS_COLORS[run.status] || "text-gray-400"}`}
            >
              {run.status?.replace("_", " ")}
            </span>
            <span className="text-xs text-theme-text-secondary">
              {new Date(run.startedAt).toLocaleString()}
            </span>
            {result.duration && (
              <span className="text-xs text-theme-text-secondary">
                Duration: {(result.duration / 1000).toFixed(1)}s
              </span>
            )}
          </div>
        </div>
        {run.status === "completed" && (
          <button
            onClick={onContinueInThread}
            disabled={continuing}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-button hover:bg-secondary-btn rounded-lg transition-colors disabled:opacity-50"
          >
            <ChatText className="h-4 w-4" />
            {continuing ? "Creating..." : "Continue in Thread"}
          </button>
        )}
      </div>
    </div>
  );
}

function PromptSection({ prompt }) {
  return (
    <div className="border border-white/10 rounded-lg p-4">
      <p className="text-xs text-theme-text-secondary mb-2 uppercase font-medium">
        Prompt
      </p>
      <p className="text-sm text-theme-text-primary whitespace-pre-wrap">
        {prompt || "—"}
      </p>
    </div>
  );
}

function ErrorSection({ error }) {
  return (
    <div className="border border-red-500/20 rounded-lg p-4 bg-red-500/5">
      <p className="text-xs text-red-400 mb-1 uppercase font-medium">Error</p>
      <p className="text-sm text-red-300">{error}</p>
    </div>
  );
}

function AgentThoughtsSection({ result }) {
  return (
    <CollapsibleSection
      title={`Thinking (${result.thoughts.length} steps)`}
      icon={Brain}
    >
      <div className="space-y-2">
        {result.thoughts.map((thought, i) => (
          <div
            key={i}
            className="flex items-start gap-2 text-sm text-theme-text-secondary"
          >
            <span className="text-xs text-theme-text-secondary/50 mt-0.5 min-w-[20px]">
              {i + 1}.
            </span>
            <span>{thought}</span>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
}

function ToolCallsSection({ result }) {
  return (
    <CollapsibleSection
      title={`Tool Calls (${result.toolCalls.length})`}
      icon={Wrench}
    >
      <div className="space-y-3">
        {result.toolCalls.map((toolCall, i) => (
          <ToolCallCard key={i} toolCall={toolCall} />
        ))}
      </div>
    </CollapsibleSection>
  );
}

function GeneratedFilesSection({ result }) {
  return (
    <CollapsibleSection
      title={`Generated Files (${result.generatedFiles.length})`}
      icon={FileArrowDown}
      defaultOpen={true}
    >
      <div className="space-y-2">
        {result.generatedFiles.map((file, i) => (
          <GeneratedFileCard key={i} file={file} />
        ))}
      </div>
    </CollapsibleSection>
  );
}

function FinalResponseSection({ result }) {
  return (
    <CollapsibleSection title="Response" icon={ChatText} defaultOpen={true}>
      <div
        className="text-sm text-theme-text-primary markdown"
        dangerouslySetInnerHTML={{
          __html: renderMarkdown(result.text),
        }}
      />
    </CollapsibleSection>
  );
}
function MetricsSection({ metrics }) {
  return (
    <div className="border border-white/10 rounded-lg p-4">
      <p className="text-xs text-theme-text-secondary mb-2 uppercase font-medium">
        Metrics
      </p>
      <div className="flex gap-6 text-xs text-theme-text-secondary">
        {metrics.prompt_tokens != null && (
          <span>
            Prompt tokens:{" "}
            <span className="text-theme-text-primary">
              {metrics.prompt_tokens}
            </span>
          </span>
        )}
        {metrics.completion_tokens != null && (
          <span>
            Completion tokens:{" "}
            <span className="text-theme-text-primary">
              {metrics.completion_tokens}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
