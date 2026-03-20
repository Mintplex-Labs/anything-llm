const { escapeHTML } = require("../../format");
const {
  isWebSource,
  getSourceTitle,
} = require("../../commands/handlers/handleProof");

/**
 * Truncate source text for display.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
function truncateSourceText(text, maxLength = 3500) {
  if (!text) return "(No content available)";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 20) + "\n\n[...truncated]";
}

/**
 * Extract URL from a web source.
 * @param {object} source
 * @returns {string|null}
 */
function extractWebUrl(source) {
  if (!source?.chunkSource?.startsWith("link://")) return null;
  return source.chunkSource.replace("link://", "");
}

/**
 * Handle source selection - shows source content or prompts to open web link.
 * @param {object} params
 * @param {import("../../commands/index").BotContext} params.ctx
 * @param {number} params.chatId
 * @param {{id: string}} params.query
 * @param {number} params.messageId
 * @param {string} params.data
 */
async function handleSourceSelect({
  ctx,
  chatId,
  query,
  messageId,
  data,
} = {}) {
  // Handle close action
  if (data === "src:close") {
    await ctx.bot.deleteMessage(chatId, messageId);
    await ctx.bot.answerCallbackQuery(query.id);
    return;
  }

  const sourceIdx = parseInt(data.slice(4), 10);
  const state = ctx.getState(chatId);
  const sources = state._proofSources;

  if (!sources || sourceIdx < 0 || sourceIdx >= sources.length) {
    await ctx.bot.answerCallbackQuery(query.id, {
      text: "Source not found. Please try /proof again.",
    });
    return;
  }

  const source = sources[sourceIdx];
  const title = getSourceTitle(source, sourceIdx);

  if (isWebSource(source)) {
    const url = extractWebUrl(source);
    if (!url) {
      await ctx.bot.answerCallbackQuery(query.id, {
        text: "Invalid web source URL.",
      });
      return;
    }

    const text = `🌐 <b>${escapeHTML(title)}</b>\n\nOpen this website:`;
    await ctx.bot.editMessageText(text, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔗 Open Website", url }],
          [{ text: "← Back to Sources", callback_data: "src:back" }],
        ],
      },
    });
  } else {
    const content = truncateSourceText(source.text);
    const text = `📄 <b>${escapeHTML(title)}</b>\n\n<blockquote expandable>${escapeHTML(content)}</blockquote>`;

    await ctx.bot.editMessageText(text, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "← Back to Sources", callback_data: "src:back" }],
        ],
      },
    });
  }

  await ctx.bot.answerCallbackQuery(query.id);
}

module.exports = { handleSourceSelect };
