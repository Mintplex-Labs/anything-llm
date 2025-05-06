import {
  SquaresFour,
  ChatDots,
  Files,
  ChatCenteredText,
  UsersThree,
} from "@phosphor-icons/react";
import SlashCommandIcon from "./ChecklistItem/icons/SlashCommand";
import paths from "@/utils/paths";
import { t } from "i18next";

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

/**
 * Function to generate the checklist items
 * @returns {ChecklistItem[]}
 */
export const CHECKLIST_ITEMS = () => [
  {
    id: "create_workspace",
    title: t("main-page.checklist.tasks.create_workspace.title"),
    description: t("main-page.checklist.tasks.create_workspace.description"),
    action: t("main-page.checklist.tasks.create_workspace.action"),
    handler: ({ showNewWsModal = noop }) => {
      showNewWsModal();
      return true;
    },
    icon: SquaresFour,
  },
  {
    id: "send_chat",
    title: t("main-page.checklist.tasks.send_chat.title"),
    description: t("main-page.checklist.tasks.send_chat.description"),
    action: t("main-page.checklist.tasks.send_chat.action"),
    handler: ({
      workspaces = [],
      navigate = noop,
      showToast = noop,
      showNewWsModal = noop,
    }) => {
      if (workspaces.length === 0) {
        showToast(t("main-page.noWorkspaceError"), "warning", {
          clear: true,
        });
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
    title: t("main-page.checklist.tasks.embed_document.title"),
    description: t("main-page.checklist.tasks.embed_document.description"),
    action: t("main-page.checklist.tasks.embed_document.action"),
    handler: ({
      workspaces = [],
      setSelectedWorkspace = noop,
      showManageWsModal = noop,
      showToast = noop,
      showNewWsModal = noop,
    }) => {
      if (workspaces.length === 0) {
        showToast(t("main-page.noWorkspaceError"), "warning", {
          clear: true,
        });
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
    title: t("main-page.checklist.tasks.setup_system_prompt.title"),
    description: t("main-page.checklist.tasks.setup_system_prompt.description"),
    action: t("main-page.checklist.tasks.setup_system_prompt.action"),
    handler: ({
      workspaces = [],
      navigate = noop,
      showNewWsModal = noop,
      showToast = noop,
    }) => {
      if (workspaces.length === 0) {
        showToast(t("main-page.noWorkspaceError"), "warning", {
          clear: true,
        });
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
    title: t("main-page.checklist.tasks.define_slash_command.title"),
    description: t(
      "main-page.checklist.tasks.define_slash_command.description"
    ),
    action: t("main-page.checklist.tasks.define_slash_command.action"),
    handler: ({
      workspaces = [],
      navigate = noop,
      showNewWsModal = noop,
      showToast = noop,
    }) => {
      if (workspaces.length === 0) {
        showToast(t("main-page.noWorkspaceError"), "warning", { clear: true });
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
    title: t("main-page.checklist.tasks.visit_community.title"),
    description: t("main-page.checklist.tasks.visit_community.description"),
    action: t("main-page.checklist.tasks.visit_community.action"),
    handler: () => {
      window.open(paths.communityHub.website(), "_blank");
      return true;
    },
    icon: UsersThree,
  },
];
