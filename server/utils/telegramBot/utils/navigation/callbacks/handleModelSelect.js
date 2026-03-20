const { Workspace } = require("../../../../../models/workspace");
const { getCustomModels } = require("../../../../helpers/customModels");
const { resolveWorkspaceProvider } = require("../../index");

/**
 * Handle model selection for a workspace.
 * @param {object} params
 * @param {import("../../commands/index").BotContext} params.ctx
 * @param {number} params.chatId
 * @param {{id: string}} params.query
 * @param {number} params.messageId
 * @param {string} params.data
 */
async function handleModelSelect({ ctx, chatId, query, messageId, data } = {}) {
  const parts = data.slice(4).split(":");
  const workspaceId = parseInt(parts[0], 10);
  const modelIdPrefix = parts.slice(1).join(":");

  const workspace = await Workspace.get({ id: workspaceId });
  if (!workspace) {
    await ctx.bot.answerCallbackQuery(query.id, {
      text: "Workspace not found.",
    });
    return;
  }

  const { provider } = resolveWorkspaceProvider(workspace);
  const { models } = await getCustomModels(provider);
  const selectedModel = models?.find((m) => {
    const id = m.id || m.name;
    return id === modelIdPrefix || id.startsWith(modelIdPrefix);
  });

  if (!selectedModel) {
    await ctx.bot.answerCallbackQuery(query.id, {
      text: "Model not found.",
    });
    return;
  }

  const modelId = selectedModel.id || selectedModel.name;
  await Workspace.update(workspace.id, { chatModel: modelId });

  await ctx.bot.answerCallbackQuery(query.id, { text: "Model updated!" });
  await ctx.bot.deleteMessage(chatId, messageId);
  await ctx.bot.sendMessage(
    chatId,
    `Model changed to "${selectedModel.name || modelId}" in "${workspace.name}".`
  );
}

module.exports = { handleModelSelect };
