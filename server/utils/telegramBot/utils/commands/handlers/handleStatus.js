const { Workspace } = require("../../../../../models/workspace");
const { WorkspaceThread } = require("../../../../../models/workspaceThread");
const {
  resolveWorkspaceProvider,
  sendFormattedMessage,
} = require("../../../utils");

/**
 * /status - Show current workspace, thread, and model info.
 * @param {import("../index").BotContext} ctx
 * @param {number} chatId
 */
async function handleStatus(ctx, chatId) {
  const state = ctx.getState(chatId);
  const workspace = await Workspace.get({ slug: state.workspaceSlug });
  if (!workspace) {
    await ctx.bot.sendMessage(chatId, "No workspace configured.");
    return;
  }

  let threadName = "Default";
  if (state.threadSlug) {
    const thread = await WorkspaceThread.get({ slug: state.threadSlug });
    if (thread) threadName = thread.name;
  }

  const markdown = [];

  markdown.push(`# Workspace:
${workspace.name}

# Thread:
_${threadName}_
--------------------------------`);

  const AIbitat = require("../../../../agents/aibitat");
  const { provider, model } = resolveWorkspaceProvider(workspace);
  const agentConfig = { provider, model };
  const agentProvider = new AIbitat(agentConfig).getProviderForConfig(
    agentConfig
  );
  const nativeToolCalling = await agentProvider.supportsNativeToolCalling?.();

  markdown.push(`# LLM Provider: 
${provider}

# LLM Model: 
${model}

# Native Tool Calling: 
${nativeToolCalling ? "Enabled" : "Disabled"}

# Chat Mode: 
${workspace.chatMode ?? "chat"}`);

  if (workspace.chatMode === "automatic" && !nativeToolCalling) {
    markdown.unshift(
      `<blockquote>**⚠️ Note**\nNative tool calling is unavailable for this provider/model. You can only use tools with the @agent command.</blockquote>`
    );
  }

  if (workspace.chatMode === "chat") {
    if (nativeToolCalling) {
      markdown.unshift(
        `<blockquote>**💡 Tip**\nChange this workspace's chat mode to "automatic" to use tools without the @agent command.</blockquote>`
      );
    } else {
      markdown.unshift(
        `<blockquote>**⚠️ Note**\nNative tool calling is unavailable for this provider/model. You can only use tools with the @agent command.</blockquote>`
      );
    }
  }

  await sendFormattedMessage(ctx.bot, chatId, markdown.join("\n"), {
    format: true,
    escapeHtml: false,
  });
}

module.exports = { handleStatus };
