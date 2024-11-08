import CTAButton from "@/components/lib/CTAButton";
import CommunityHubImportItemSteps from "../..";
import showToast from "@/utils/toast";
import System from "@/models/system";
import paths from "@/utils/paths";

export default function SlashCommand({ item, setStep }) {
  async function handleSubmit() {
    try {
      const { preset, error } = await System.createSlashCommandPreset({
        command: item.command,
        prompt: item.prompt,
        description: item.description,
      });
      if (error) throw new Error(error);
      showToast(
        `Slash command ${preset.command} imported successfully!`,
        "success"
      );
      setStep(CommunityHubImportItemSteps.completed.key);
    } catch (e) {
      console.error(e);
      showToast("Failed to import slash command.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col mt-4 gap-y-4">
      <div className="flex flex-col gap-y-1">
        <h2 className="text-base text-white font-semibold">
          Review Slash Command "{item.name}"
        </h2>
        {item.creatorUsername && (
          <p className="text-white/60 text-xs font-mono">
            Created by{" "}
            <a
              href={paths.communityHub.profile(item.creatorUsername)}
              target="_blank"
              className="hover:text-blue-500 hover:underline"
            >
              @{item.creatorUsername}
            </a>
          </p>
        )}
      </div>
      <div className="flex flex-col gap-y-[25px] text-white/80 text-sm">
        <p>
          Slash commands are used to prefill information into a prompt while
          chatting with a AnythingLLM workspace.
          <br />
          <br />
          The slash command will be available during chatting by simply invoking
          it with{" "}
          <code className="font-mono bg-zinc-900 px-1 py-0.5 rounded-md text-sm">
            {item.command}
          </code>{" "}
          like you would any other command.
        </p>

        <div className="flex flex-col gap-y-2 mt-2">
          <div className="w-full text-white text-md gap-x-2 flex items-center">
            <p className="text-white/60 w-fit font-mono bg-zinc-900 px-2 py-1 rounded-md text-sm whitespace-pre-line">
              {item.command}
            </p>
          </div>

          <div className="w-full text-white text-md flex flex-col gap-y-2">
            <p className="text-white/60 font-mono bg-zinc-900 p-4 rounded-md text-sm whitespace-pre-line max-h-[calc(200px)] overflow-y-auto">
              {item.prompt}
            </p>
          </div>
        </div>
      </div>
      <CTAButton
        className="text-dark-text w-full mt-[18px] h-[34px] hover:bg-accent"
        onClick={handleSubmit}
      >
        Import slash command
      </CTAButton>
    </div>
  );
}
