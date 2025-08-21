import CTAButton from "@/components/lib/CTAButton";
import CommunityHubImportItemSteps from "../..";
import { useEffect, useState } from "react";
import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";
import paths from "@/utils/paths";
import CommunityHub from "@/models/communityHub";

export default function SystemPrompt({ item, setStep }) {
  const [destinationWorkspaceSlug, setDestinationWorkspaceSlug] =
    useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  useEffect(() => {
    async function getWorkspaces() {
      const workspaces = await Workspace.all();
      setWorkspaces(workspaces);
      setDestinationWorkspaceSlug(workspaces[0].slug);
    }
    getWorkspaces();
  }, []);

  async function handleSubmit() {
    showToast("Applying system prompt to workspace...", "info");
    const { error } = await CommunityHub.applyItem(item.importId, {
      workspaceSlug: destinationWorkspaceSlug,
    });
    if (error) {
      return showToast(`Failed to apply system prompt. ${error}`, "error", {
        clear: true,
      });
    }

    showToast("System prompt applied to workspace.", "success", {
      clear: true,
    });
    setStep(CommunityHubImportItemSteps.completed.key);
  }

  return (
    <div className="flex flex-col mt-4 gap-y-4">
      <div className="flex flex-col gap-y-1">
        <h2 className="text-base text-theme-text-primary font-semibold">
          Review System Prompt "{item.name}"
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
          System prompts are used to guide the behavior of the AI agents and can
          be applied to any existing workspace.
        </p>

        <div className="flex flex-col gap-y-2">
          <p className="text-white/60 light:text-theme-text-secondary font-semibold">
            Provided system prompt:
          </p>
          <div className="w-full text-theme-text-primary text-md flex flex-col max-h-[calc(300px)] overflow-y-auto">
            <p className="text-white/60 light:text-theme-text-secondary font-mono bg-zinc-900 light:bg-slate-200 px-2 py-1 rounded-md text-sm whitespace-pre-line">
              {item.prompt}
            </p>
          </div>
        </div>

        <div className="flex flex-col w-60">
          <label className="text-theme-text-primary text-sm font-semibold block mb-3">
            Apply to Workspace
          </label>
          <select
            name="destinationWorkspaceSlug"
            required={true}
            onChange={(e) => setDestinationWorkspaceSlug(e.target.value)}
            className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
          >
            <optgroup label="Available workspaces">
              {workspaces.map((workspace) => (
                <option key={workspace.id} value={workspace.slug}>
                  {workspace.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>
      {destinationWorkspaceSlug && (
        <CTAButton
          className="text-dark-text w-full mt-[18px] h-[34px] hover:bg-accent"
          onClick={handleSubmit}
        >
          Apply system prompt to workspace
        </CTAButton>
      )}
    </div>
  );
}
