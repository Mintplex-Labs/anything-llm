const { v4: uuidv4 } = require("uuid");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { resetMemory } = require("./commands/reset");
const { generateImage } = require("./commands/img");
const { convertToPromptHistory } = require("../helpers/chat/responses");
const { SlashCommandPresets } = require("../../models/slashCommandsPresets");
const { SystemPromptVariables } = require("../../models/systemPromptVariables");

const VALID_COMMANDS = {
  "/reset": resetMemory,
  "/img": generateImage,
};

/**
 * Checks if a command exactly matches a built-in system command (eg: /reset)
 * so a preset cannot shadow it. Commands that merely extend a built-in name
 * (eg: /reset-all) are valid user-defined presets.
 * @param {string} command - the formatted command to check (eg: /reset)
 * @returns {boolean}
 */
function isReservedCommand(command = "") {
  return Object.keys(VALID_COMMANDS).includes(String(command).toLowerCase());
}

async function grepCommand(message, user = null) {
  const userPresets = await SlashCommandPresets.getUserPresets(user?.id);
  const availableCommands = Object.keys(VALID_COMMANDS);

  // Check if the message starts with any built-in command. Like the preset
  // matching below, require the command to not be part of a longer command
  // (e.g. don't match /reset in /reset-all) so preset commands that extend a
  // built-in name are not hijacked.
  for (let i = 0; i < availableCommands.length; i++) {
    const cmd = availableCommands[i];
    const re = new RegExp(`^(${cmd})(?![a-z0-9_-])`, "i");
    if (re.test(message)) {
      return cmd;
    }
  }

  return expandPresetCommands(message, userPresets);
}

/**
 * @description This function will do recursive replacement of all slash commands with their corresponding prompts.
 * @notice This function is used for API calls and is not user-scoped. THIS FUNCTION DOES NOT SUPPORT PRESET COMMANDS.
 * @returns {Promise<string>}
 */
async function grepAllSlashCommands(message) {
  return expandPresetCommands(message, await SlashCommandPresets.where({}));
}

/**
 * Replaces only the given user's preset commands with their prompts. Built-in
 * commands like /reset are left as typed.
 * @param {string} message
 * @param {import("@prisma/client").users|null} user - null in single-user mode
 * @returns {Promise<string>}
 */
async function grepUserSlashCommands(message, user = null) {
  return expandPresetCommands(
    message,
    await SlashCommandPresets.getUserPresets(user?.id)
  );
}

/**
 * Replaces every preset command in the message with its prompt. Allows
 * multiple commands in one message.
 * @param {string} message
 * @param {{command: string, prompt: string}[]} presets
 * @returns {string}
 */
function expandPresetCommands(message, presets = []) {
  let updatedMessage = message;
  for (const preset of presets) {
    // Match the command when it starts the message or follows a space (`lead`),
    // and is not part of a longer command (e.g. don't match /weather in /weatherman).
    // `lead` is captured so we can keep the space when swapping in the prompt.
    const regex = new RegExp(`(^|\\s)(${preset.command})(?![a-z0-9_-])`, "g");
    updatedMessage = updatedMessage.replace(
      regex,
      (_match, lead) => `${lead}${preset.prompt}`
    );
  }

  return updatedMessage;
}

async function recentChatHistory({
  user = null,
  workspace,
  thread = null,
  messageLimit = 20,
  apiSessionId = null,
}) {
  const rawHistory = (
    await WorkspaceChats.where(
      {
        workspaceId: workspace.id,
        user_id: user?.id || null,
        thread_id: thread?.id || null,
        api_session_id: apiSessionId || null,
        include: true,
      },
      messageLimit,
      { id: "desc" }
    )
  ).reverse();
  return { rawHistory, chatHistory: convertToPromptHistory(rawHistory) };
}

/**
 * @typedef {Object} ChatPromptOptions
 * @property {string} [prompt] - The current user message. Used to rerank injected memories.
 * @property {object[]} [rawHistory] - Recent chat history rows. Used to rerank injected memories.
 * @property {boolean} [skipMemories] - When true, no stored memories are looked up or injected.
 * Set this for unauthenticated contexts (eg: embeds) where there is no real user identity.
 */

/**
 * Returns the base prompt for the chat with memories appended (when enabled).
 * Also does variable substitution on the prompt if there are any defined variables.
 * @param {Object|null} workspace - the workspace object
 * @param {Object|null} user - the user object
 * @param {ChatPromptOptions} [opts]
 * @returns {Promise<string>}
 */
async function chatPrompt(workspace, user = null, opts = {}) {
  const { SystemSettings } = require("../../models/systemSettings");
  const { promptWithMemories } = require("../memories");
  const basePrompt =
    workspace?.openAiPrompt ?? SystemSettings.saneDefaultSystemPrompt;
  const systemPrompt = await SystemPromptVariables.expandSystemPromptVariables(
    basePrompt,
    user?.id,
    workspace?.id
  );

  // Memories are scoped per-user, but in single-user mode they are stored with a
  // null userId. Never inject them into anonymous/unauthenticated contexts.
  if (opts.skipMemories === true) return systemPrompt;

  return promptWithMemories({
    systemPrompt,
    userId: user?.id ?? null,
    workspaceId: workspace?.id,
    prompt: opts.prompt ?? "",
    rawHistory: opts.rawHistory ?? [],
  });
}

// We use this util function to deduplicate sources from similarity searching
// if the document is already pinned.
// Eg: You pin a csv, if we RAG + full-text that you will get the same data
// points both in the full-text and possibly from RAG - result in bad results
// even if the LLM was not even going to hallucinate.
function sourceIdentifier(sourceDocument) {
  if (!sourceDocument?.title || !sourceDocument?.published) return uuidv4();
  return `title:${sourceDocument.title}-timestamp:${sourceDocument.published}`;
}

module.exports = {
  sourceIdentifier,
  recentChatHistory,
  chatPrompt,
  grepCommand,
  grepAllSlashCommands,
  grepUserSlashCommands,
  isReservedCommand,
  VALID_COMMANDS,
};
