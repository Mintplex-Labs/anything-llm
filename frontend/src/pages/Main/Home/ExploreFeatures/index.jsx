import { useNavigate } from "react-router-dom";
import paths from "@/utils/paths";
import Workspace from "@/models/workspace";
import { useState, useEffect } from "react";
import useUser from "@/hooks/useUser";
import System from "@/models/system";

export default function ExploreFeatures() {
  const navigate = useNavigate();
  const [isMultiUser, setIsMultiUser] = useState(false);
  const { user } = useUser();
  const isDefaultUser = isMultiUser && user?.role === "default";
  const isManager = isMultiUser && user?.role === "manager";

  useEffect(() => {
    System.isMultiUserMode().then(setIsMultiUser);
  }, []);

  const chatWithAgent = async () => {
    const workspaces = await Workspace.all();
    if (workspaces.length > 0) {
      const firstWorkspace = workspaces[0];
      navigate(paths.workspace.chat(firstWorkspace.slug));
      window.location.hash = "#agent";
    }
  };

  const buildAgentFlow = () => {
    navigate(paths.workspace.settings.agentBuilder());
  };

  const setSlashCommand = async () => {
    const workspaces = await Workspace.all();
    if (workspaces.length > 0) {
      const firstWorkspace = workspaces[0];
      navigate(paths.workspace.chat(firstWorkspace.slug));
      window.location.hash = "#slash-commands";
    }
  };

  const exploreSlashCommands = () => {
    window.location.href = paths.communityHub.viewMoreOfType("slash-commands");
  };

  const setSystemPrompt = async () => {
    const workspaces = await Workspace.all();
    if (workspaces.length > 0) {
      const firstWorkspace = workspaces[0];
      navigate(paths.workspace.settings.chatSettings(firstWorkspace.slug));
      window.location.hash = "#system-prompts";
    }
  };

  const exploreSystemPrompts = () => {
    window.location.href = paths.communityHub.viewMoreOfType("system-prompts");
  };

  return (
    <div>
      <h1 className="text-theme-home-text uppercase text-sm font-semibold mb-4">
        Explore our features
      </h1>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FeatureCard
          title="Utilize Agent Skills"
          description="Enabling powerful automation and workflow extensions for your specific needs."
          primaryAction="Chat with Agent"
          secondaryAction={
            !isDefaultUser && !isManager ? "Build Agent Flow" : null
          }
          onPrimaryAction={chatWithAgent}
          onSecondaryAction={buildAgentFlow}
          isNew={true}
        />
        <FeatureCard
          title="Slash Commands"
          description="Enabling powerful automation and workflow extensions for your specific needs."
          primaryAction="Set Slash Command"
          secondaryAction="Explore on Hub"
          onPrimaryAction={setSlashCommand}
          onSecondaryAction={exploreSlashCommands}
          isNew={true}
        />
        {!isDefaultUser && (
          <FeatureCard
            title="System Prompts"
            description="Enabling powerful automation and workflow extensions for your specific needs."
            primaryAction="Setup System Prompt"
            secondaryAction="Explore on Hub"
            onPrimaryAction={setSystemPrompt}
            onSecondaryAction={exploreSystemPrompts}
            isNew={true}
          />
        )}
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  primaryAction,
  secondaryAction,
  onPrimaryAction,
  onSecondaryAction,
  isNew,
}) {
  return (
    <div className="border border-theme-home-border rounded-lg py-4 px-5 flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <h2 className="text-theme-home-text font-semibold flex items-center gap-x-2">
          {title}
        </h2>
        <p className="text-theme-home-text-secondary text-sm">{description}</p>
      </div>
      <div className="flex flex-col gap-y-[10px]">
        <button
          onClick={onPrimaryAction}
          className="w-full h-[36px] bg-white light:bg-theme-home-button-primary rounded-lg text-black text-sm font-medium flex items-center justify-center gap-x-2.5 transition-all duration-200 hover:bg-white/90 light:hover:bg-theme-home-button-primary-hover"
        >
          {primaryAction}
        </button>
        {secondaryAction && (
          <div className="relative w-full">
            {isNew && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 border border-theme-home-border px-2 font-semibold rounded-md text-[10px] text-theme-home-text">
                New
              </div>
            )}
            <button
              onClick={onSecondaryAction}
              className="w-full h-[36px] bg-theme-home-button-secondary rounded-lg text-theme-home-button-secondary-text text-sm font-medium flex items-center justify-center transition-all duration-200 hover:bg-theme-home-button-secondary-hover hover:text-theme-home-button-secondary-hover-text"
            >
              {secondaryAction}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
