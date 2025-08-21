import CTAButton from "@/components/lib/CTAButton";
import CommunityHubImportItemSteps from "../..";
import showToast from "@/utils/toast";
import paths from "@/utils/paths";
import { CircleNotch } from "@phosphor-icons/react";
import { useState } from "react";
import AgentFlows from "@/models/agentFlows";
import { safeJsonParse } from "@/utils/request";

export default function AgentFlow({ item, setStep }) {
  const flowInfo = safeJsonParse(item.flow, { steps: [] });
  const [loading, setLoading] = useState(false);

  async function importAgentFlow() {
    try {
      setLoading(true);
      const { success, error, flow } = await AgentFlows.saveFlow(
        item.name,
        flowInfo
      );
      if (!success) throw new Error(error);
      if (!!flow?.uuid) await AgentFlows.toggleFlow(flow.uuid, true); // Enable the flow automatically after import

      showToast(`Agent flow imported successfully!`, "success");
      setStep(CommunityHubImportItemSteps.completed.key);
    } catch (e) {
      console.error(e);
      showToast(`Failed to import agent flow. ${e.message}`, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col mt-4 gap-y-4">
      <div className="flex flex-col gap-y-1">
        <h2 className="text-base text-theme-text-primary font-semibold">
          Import Agent Flow &quot;{item.name}&quot;
        </h2>
        {item.creatorUsername && (
          <p className="text-white/60 light:text-theme-text-secondary text-xs font-mono">
            Created by{" "}
            <a
              href={paths.communityHub.profile(item.creatorUsername)}
              target="_blank"
              className="hover:text-blue-500 hover:underline"
              rel="noreferrer"
            >
              @{item.creatorUsername}
            </a>
          </p>
        )}
      </div>
      <div className="flex flex-col gap-y-[25px] text-white/80 light:text-theme-text-secondary text-sm">
        <p>
          Agent flows allow you to create reusable sequences of actions that can
          be triggered by your agent.
        </p>
        <div className="flex flex-col gap-y-2">
          <p className="font-semibold">Flow Details:</p>
          <p>Description: {item.description}</p>
          <p className="font-semibold">Steps ({flowInfo.steps.length}):</p>
          <ul className="list-disc pl-6">
            {flowInfo.steps.map((step, index) => (
              <li key={index}>{step.type}</li>
            ))}
          </ul>
        </div>
      </div>
      <CTAButton
        disabled={loading}
        className="text-dark-text w-full mt-[18px] h-[34px] hover:bg-accent"
        onClick={importAgentFlow}
      >
        {loading ? <CircleNotch size={16} className="animate-spin" /> : null}
        {loading ? "Importing..." : "Import agent flow"}
      </CTAButton>
    </div>
  );
}
