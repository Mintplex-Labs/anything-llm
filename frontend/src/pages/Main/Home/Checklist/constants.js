import {
  SquaresFour,
  ChatDots,
  Files,
  ChatCenteredText,
  UsersThree,
} from "@phosphor-icons/react";
import SlashCommandIcon from "./ChecklistItem/icons/SlashCommand";

export const CHECKLIST_UPDATED_EVENT = "anythingllm_checklist_updated";
export const CHECKLIST_STORAGE_KEY = "anythingllm_checklist_completed";
export const CHECKLIST_HIDDEN = "anythingllm_checklist_dismissed";
export const CHECKLIST_ITEMS = [
  {
    id: "create_workspace",
    title: "Create a workspace",
    description: "Create your first workspace to get started",
    action: "Create",
    handler: "createWorkspace",
    icon: SquaresFour,
    completed: false,
  },
  {
    id: "send_chat",
    title: "Send a chat",
    description: "Start a conversation with your AI assistant",
    action: "Chat",
    handler: "sendChat",
    icon: ChatDots,
    completed: false,
  },
  {
    id: "embed_document",
    title: "Embed a document",
    description: "Add your first document to your workspace",
    action: "Embed",
    handler: "embedDocument",
    icon: Files,
    completed: false,
  },
  {
    id: "setup_system_prompt",
    title: "Set up a system prompt",
    description: "Configure your AI assistant's behavior",
    action: "Set Up",
    handler: "setSystemPrompt",
    icon: ChatCenteredText,
    completed: false,
  },
  {
    id: "define_slash_command",
    title: "Define a slash command",
    description: "Create custom commands for your assistant",
    action: "Define",
    handler: "setSlashCommand",
    icon: SlashCommandIcon,
    completed: false,
  },
  {
    id: "visit_community",
    title: "Visit Community Hub",
    description: "Explore community resources and templates",
    action: "Browse",
    handler: "visitCommunityHub",
    icon: UsersThree,
    completed: false,
  },
];
