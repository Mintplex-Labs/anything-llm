import { useNavigate } from "react-router-dom";
import paths from "@/utils/paths";
import Workspace from "@/models/workspace";
import { useTranslation } from "react-i18next";

export default function ExploreFeatures() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const chatWithAgent = async () => {
    const workspaces = await Workspace.all();
    if (workspaces.length > 0) {
      const firstWorkspace = workspaces[0];
      navigate(
        paths.workspace.chat(firstWorkspace.slug, {
          search: { action: "set-agent-chat" },
        })
      );
    }
  };

  const buildAgentFlow = () => navigate(paths.agents.builder());
  const setSlashCommand = async () => {
    const workspaces = await Workspace.all();
    if (workspaces.length > 0) {
      const firstWorkspace = workspaces[0];
      navigate(
        paths.workspace.chat(firstWorkspace.slug, {
          search: { action: "open-new-slash-command-modal" },
        })
      );
    }
  };

  const exploreSlashCommands = () => {
    window.open(paths.communityHub.viewMoreOfType("slash-commands"), "_blank");
  };

  const setSystemPrompt = async () => {
    const workspaces = await Workspace.all();
    if (workspaces.length > 0) {
      const firstWorkspace = workspaces[0];
      navigate(
        paths.workspace.settings.chatSettings(firstWorkspace.slug, {
          search: { action: "focus-system-prompt" },
        })
      );
    }
  };

  const managePromptVariables = () => {
    navigate(paths.settings.systemPromptVariables());
  };

  return (
    <div>
      <h1 className="text-theme-home-text uppercase text-sm font-semibold mb-4">
        {t("main-page.exploreMore.title")}
      </h1>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FeatureCard
          title={t("main-page.exploreMore.features.customAgents.title")}
          description={t(
            "main-page.exploreMore.features.customAgents.description"
          )}
          primaryAction={t(
            "main-page.exploreMore.features.customAgents.primaryAction"
          )}
          secondaryAction={t(
            "main-page.exploreMore.features.customAgents.secondaryAction"
          )}
          onPrimaryAction={chatWithAgent}
          onSecondaryAction={buildAgentFlow}
          isNew={true}
        />
        <FeatureCard
          title={t("main-page.exploreMore.features.slashCommands.title")}
          description={t(
            "main-page.exploreMore.features.slashCommands.description"
          )}
          primaryAction={t(
            "main-page.exploreMore.features.slashCommands.primaryAction"
          )}
          secondaryAction={t(
            "main-page.exploreMore.features.slashCommands.secondaryAction"
          )}
          onPrimaryAction={setSlashCommand}
          onSecondaryAction={exploreSlashCommands}
          isNew={false}
        />
        <FeatureCard
          title={t("main-page.exploreMore.features.systemPrompts.title")}
          description={t(
            "main-page.exploreMore.features.systemPrompts.description"
          )}
          primaryAction={t(
            "main-page.exploreMore.features.systemPrompts.primaryAction"
          )}
          secondaryAction={t(
            "main-page.exploreMore.features.systemPrompts.secondaryAction"
          )}
          onPrimaryAction={setSystemPrompt}
          onSecondaryAction={managePromptVariables}
          isNew={true}
        />
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
    <div className="border border-theme-home-border rounded-lg py-4 px-5 flex flex-col justify-between gap-y-4">
      <div className="flex flex-col gap-y-2">
        <h2 className="text-theme-home-text font-semibold flex items-center gap-x-2">
          {title}
        </h2>
        <p className="text-theme-home-text-secondary text-sm">{description}</p>
      </div>
      <div className="flex flex-col gap-y-[10px]">
        <button
          onClick={onPrimaryAction}
          className="w-full h-[36px] border border-white/20 light:border-theme-home-button-secondary-border light:hover:border-theme-home-button-secondary-border-hover text-white rounded-lg text-theme-home-button-primary-text text-sm font-medium flex items-center justify-center gap-x-2.5 transition-all duration-200 light:hover:bg-transparent hover:bg-theme-home-button-secondary-hover hover:text-theme-home-button-secondary-hover-text"
        >
          {primaryAction}
        </button>
        {secondaryAction && (
          <div className="relative w-full">
            {isNew && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 px-2 font-semibold rounded-md text-[10px] text-theme-checklist-item-text bg-theme-checklist-item-bg light:bg-white/60">
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
