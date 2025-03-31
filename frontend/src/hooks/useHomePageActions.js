import { useNavigate } from "react-router-dom";
import Workspace from "@/models/workspace";
import paths from "@/utils/paths";
import { useNewWorkspaceModal } from "@/components/Modals/NewWorkspace";
import { useManageWorkspaceModal } from "@/components/Modals/ManageWorkspace";

export function useHomePageActions() {
  const navigate = useNavigate();
  const { showModal } = useManageWorkspaceModal();
  const { showModal: showNewWsModal } = useNewWorkspaceModal();

  const sendChat = async () => {
    const workspaces = await Workspace.all();
    if (workspaces.length > 0) {
      navigate(paths.workspace.chat(workspaces[0].slug));
    }
  };

  const embedDocument = async () => {
    const workspaces = await Workspace.all();
    if (workspaces.length > 0) {
      showModal();
    }
  };

  const createWorkspace = () => {
    showNewWsModal();
  };

  const chatWithAgent = async () => {
    const workspaces = await Workspace.all();
    if (workspaces.length > 0) {
      navigate(paths.workspace.chat(workspaces[0].slug));
      window.location.hash = "#agent";
    }
  };

  const buildAgentFlow = () => {
    navigate(paths.workspace.settings.agentBuilder());
  };

  const setSlashCommand = async () => {
    const workspaces = await Workspace.all();
    if (workspaces.length > 0) {
      navigate(paths.workspace.chat(workspaces[0].slug));
      window.location.hash = "#slash-commands";
    }
  };

  const setSystemPrompt = async () => {
    const workspaces = await Workspace.all();
    if (workspaces.length > 0) {
      navigate(paths.workspace.settings.chatSettings(workspaces[0].slug));
      window.location.hash = "#system-prompts";
    }
  };

  const visitCommunityHub = () => {
    window.location.href = paths.communityHub.website();
  };

  return {
    sendChat,
    embedDocument,
    createWorkspace,
    chatWithAgent,
    buildAgentFlow,
    setSlashCommand,
    setSystemPrompt,
    visitCommunityHub,
  };
}
