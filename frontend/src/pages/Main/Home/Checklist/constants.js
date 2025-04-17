import {
  SquaresFour,
  ChatDots,
  Files,
  ChatCenteredText,
  UsersThree,
} from "@phosphor-icons/react";
import SlashCommandIcon from "./ChecklistItem/icons/SlashCommand";
import paths from "@/utils/paths";
const noop = () => {};

export const CHECKLIST_UPDATED_EVENT = "anythingllm_checklist_updated";
export const CHECKLIST_STORAGE_KEY = "anythingllm_checklist_completed";
export const CHECKLIST_HIDDEN = "anythingllm_checklist_dismissed";

/**
 * @typedef {Object} ChecklistItemHandlerParams
 * @property {Object[]} workspaces - Array of workspaces
 * @property {Function} navigate - Function to navigate to a path
 * @property {Function} setSelectedWorkspace - Function to set the selected workspace
 * @property {Function} showManageWsModal - Function to show the manage workspace modal
 * @property {Function} showToast - Function to show a toast
 * @property {Function} showNewWsModal - Function to show the new workspace modal
 */

/**
 * @typedef {Object} ChecklistItem
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} action
 * @property {(params: ChecklistItemHandlerParams) => boolean} handler
 * @property {string} icon
 * @property {boolean} completed
 */

/** @type {ChecklistItem[]} */
export const CHECKLIST_ITEMS = [
  {
    id: "create_workspace",
    title: "Create a workspace",
    description: "Create your first workspace to get started",
    action: "Create",
    handler: ({ showNewWsModal = noop }) => {
      showNewWsModal();
      return true;
    },
    icon: SquaresFour,
  },
  {
    id: "send_chat",
    title: "Send a chat",
    description: "Start a conversation with your AI assistant",
    action: "Chat",
    handler: ({
      workspaces = [],
      navigate = noop,
      showToast = noop,
      showNewWsModal = noop,
    }) => {
      if (workspaces.length === 0) {
        showToast(
          "Please create a workspace before starting a chat.",
          "warning",
          { clear: true }
        );
        showNewWsModal();
        return false;
      }
      navigate(paths.workspace.chat(workspaces[0].slug));
      return true;
    },
    icon: ChatDots,
  },
  {
    id: "embed_document",
    title: "Embed a document",
    description: "Add your first document to your workspace",
    action: "Embed",
    handler: ({
      workspaces = [],
      setSelectedWorkspace = noop,
      showManageWsModal = noop,
      showToast = noop,
      showNewWsModal = noop,
    }) => {
      if (workspaces.length === 0) {
        showToast(
          "Please create a workspace before embedding documents.",
          "warning",
          { clear: true }
        );
        showNewWsModal();
        return false;
      }
      setSelectedWorkspace(workspaces[0]);
      showManageWsModal();
      return true;
    },
    icon: Files,
  },
  {
    id: "setup_system_prompt",
    title: "Set up a system prompt",
    description: "Configure your AI assistant's behavior",
    action: "Set Up",
    handler: ({
      workspaces = [],
      navigate = noop,
      showNewWsModal = noop,
      showToast = noop,
    }) => {
      if (workspaces.length === 0) {
        showToast(
          "Please create a workspace before setting up system prompts.",
          "warning",
          { clear: true }
        );
        showNewWsModal();
        return false;
      }
      navigate(
        paths.workspace.settings.chatSettings(workspaces[0].slug, {
          search: { action: "focus-system-prompt" },
        })
      );
      return true;
    },
    icon: ChatCenteredText,
  },
  {
    id: "define_slash_command",
    title: "Define a slash command",
    description: "Create custom commands for your assistant",
    action: "Define",
    handler: ({
      workspaces = [],
      navigate = noop,
      showNewWsModal = noop,
      showToast = noop,
    }) => {
      if (workspaces.length === 0) {
        showToast(
          "Please create a workspace before setting up slash commands.",
          "warning",
          { clear: true }
        );
        showNewWsModal();
        return false;
      }
      navigate(
        paths.workspace.chat(workspaces[0].slug, {
          search: { action: "open-new-slash-command-modal" },
        })
      );
      return true;
    },
    icon: SlashCommandIcon,
  },
  {
    id: "visit_community",
    title: "Visit Community Hub",
    description: "Explore community resources and templates",
    action: "Browse",
    handler: () => window.open(paths.communityHub.website(), "_blank"),
    icon: UsersThree,
  },
];
