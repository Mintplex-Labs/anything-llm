const { Workspace } = require("../../../../../models/workspace");
const { WorkspaceThread } = require("../../../../../models/workspaceThread");
const { WorkspaceChats } = require("../../../../../models/workspaceChats");
const { convertToChatHistory } = require("../../../../helpers/chat/responses");
const { sendBatchedMessages } = require("../../../utils");
const { escapeHTML } = require("../../format");

const DEFAULT_HISTORY_COUNT = 10;
const MAX_HISTORY_COUNT = 50;
// Escaped length of one history message. An exchange holds two of them plus
// labels and the header, which keeps it within one 4096-character Telegram
// message.
const MAX_HISTORY_MESSAGE_LENGTH = 1800;

/**
 * Escape a history message for HTML and cut the escaped text if it is too
 * long. The cut is made after escaping because escaping can grow the text up
 * to five times. A half emoji (lone high surrogate) or an entity left partial
 * by the cut is dropped.
 * @param {string} content
 * @returns {string}
 */
function historyMessageHTML(content = "") {
  const escaped = escapeHTML(content);
  if (escaped.length <= MAX_HISTORY_MESSAGE_LENGTH) return escaped;
  const cut = escaped
    .slice(0, MAX_HISTORY_MESSAGE_LENGTH)
    .replace(/[\uD800-\uDBFF]$/, "")
    .replace(/&[a-z]*$/, "");
  return `${cut}…`;
}

/**
 * /history [count] - Show recent chat history.
 * @param {import("../index").BotContext} ctx
 * @param {number} chatId
 * @param {string} [messageText] - Full message text to parse count from
 */
async function handleHistory(ctx, chatId, messageText = "") {
  const state = ctx.getState(chatId);
  const workspace = await Workspace.get({ slug: state.workspaceSlug });
  if (!workspace) {
    await ctx.bot.sendMessage(chatId, "No workspace configured.");
    return;
  }

  // In group chats Telegram sends the command as /history@BotName 25
  const match = messageText.match(/^\/history(?:@\w+)?\s+(\d+)/);
  const count = match
    ? Math.min(parseInt(match[1], 10), MAX_HISTORY_COUNT)
    : DEFAULT_HISTORY_COUNT;

  const thread = state.threadSlug
    ? await WorkspaceThread.get({ slug: state.threadSlug })
    : null;

  const rawChats = await WorkspaceChats.where(
    {
      workspaceId: workspace.id,
      user_id: null,
      thread_id: thread?.id || null,
      api_session_id: null,
      include: true,
    },
    count,
    { id: "desc" }
  );

  if (!rawChats.length) {
    await ctx.bot.sendMessage(chatId, "No messages yet in this thread.");
    return;
  }

  const history = convertToChatHistory(rawChats.reverse());

  const exchanges = [];
  for (let i = 0; i < history.length; i++) {
    const entry = history[i];
    if (entry.role === "user") {
      let block = `<b>You:</b> ${historyMessageHTML(entry.content || "")}`;
      if (i + 1 < history.length && history[i + 1].role === "assistant") {
        block += `\n\n<b>AI:</b> ${historyMessageHTML(history[i + 1].content || "")}`;
        i++;
      }
      exchanges.push(block);
    } else if (entry.role === "assistant") {
      exchanges.push(`<b>AI:</b> ${historyMessageHTML(entry.content || "")}`);
    }
  }

  if (!exchanges.length) return;

  const threadName = thread?.name || "Default";
  const header = `<b>${escapeHTML(workspace.name)} → ${escapeHTML(threadName)}</b>\nLast ${exchanges.length} message(s)\n\n`;

  await sendBatchedMessages(ctx.bot, chatId, exchanges, {
    header,
    separator: "\n\n———\n\n",
    sendOptions: { parse_mode: "HTML" },
  });
}

module.exports = { handleHistory };
