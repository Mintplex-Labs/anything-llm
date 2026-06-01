const { Workspace } = require("../../../../../models/workspace");
const { WorkspaceThread } = require("../../../../../models/workspaceThread");
const { WorkspaceChats } = require("../../../../../models/workspaceChats");

const SOURCES_PER_PAGE = 6;

/**
 * Check if a source is a web source (identified by link:// prefix in chunkSource).
 * @param {object} source
 * @returns {boolean}
 */
function isWebSource(source) {
  return source?.chunkSource?.startsWith("link://");
}

/**
 * Get a display title for a source.
 * @param {object} source
 * @param {number} index
 * @returns {string}
 */
function getSourceTitle(source, index) {
  if (source.title) return source.title;
  if (source.id) return source.id;
  return `Source ${index + 1}`;
}

/**
 * Truncate text to a maximum length.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
function truncateText(text, maxLength = 30) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

/**
 * Get the last assistant message for the current workspace/thread.
 * @param {number} workspaceId
 * @param {number|null} threadId
 * @returns {Promise<{sources: object[], text: string}|null>}
 */
async function getLastAssistantMessage(workspaceId, threadId) {
  const chat = await WorkspaceChats.get(
    {
      workspaceId,
      user_id: null,
      thread_id: threadId || null,
      api_session_id: null,
      include: true,
    },
    1,
    { id: "desc" }
  );

  if (!chat) return null;

  try {
    const response = JSON.parse(chat.response);
    return {
      sources: response.sources || [],
      text: response.text || "",
    };
  } catch {
    return null;
  }
}

/**
 * Build the sources menu with pagination.
 * @param {object[]} sources
 * @param {number} page
 * @returns {{text: string, buttons: object[][]}}
 */
function buildSourcesMenu(sources, page = 0) {
  const totalPages = Math.ceil(sources.length / SOURCES_PER_PAGE);
  const safePage = Math.max(0, Math.min(page, totalPages - 1));
  const startIdx = safePage * SOURCES_PER_PAGE;
  const pageSources = sources.slice(startIdx, startIdx + SOURCES_PER_PAGE);

  const buttons = pageSources.map((source, idx) => {
    const globalIdx = startIdx + idx;
    const isWeb = isWebSource(source);
    const emoji = isWeb ? "🌐" : "📄";
    const title = truncateText(getSourceTitle(source, globalIdx), 28);
    return [
      {
        text: `${emoji} ${title}`,
        callback_data: `src:${globalIdx}`,
      },
    ];
  });

  const navRow = [];
  if (safePage > 0) {
    navRow.push({ text: "← Prev", callback_data: `srcpg:${safePage - 1}` });
  }
  if (safePage < totalPages - 1) {
    navRow.push({ text: "Next →", callback_data: `srcpg:${safePage + 1}` });
  }
  if (navRow.length) buttons.push(navRow);

  buttons.push([{ text: "Close", callback_data: "src:close" }]);

  const text =
    totalPages > 1
      ? `📚 <b>Citations</b> (${safePage + 1}/${totalPages}, ${sources.length} total)\n\nSelect a source to view:`
      : `📚 <b>Citations</b> (${sources.length} source${sources.length > 1 ? "s" : ""})\n\nSelect a source to view:`;

  return { text, buttons };
}

/**
 * Show the sources menu for the /proof command.
 * @param {import("../index").BotContext} ctx
 * @param {number} chatId
 * @param {number} page
 * @param {number|null} messageId - If provided, edits existing message
 */
async function showSourcesMenu(ctx, chatId, page = 0, messageId = null) {
  const state = ctx.getState(chatId);
  const workspace = await Workspace.get({ slug: state.workspaceSlug });
  if (!workspace) {
    await ctx.bot.sendMessage(chatId, "No workspace configured.");
    return;
  }

  const thread = state.threadSlug
    ? await WorkspaceThread.get({ slug: state.threadSlug })
    : null;

  const lastMessage = await getLastAssistantMessage(
    workspace.id,
    thread?.id || null
  );

  if (!lastMessage) {
    const text = "There are no citations for the previous reply.";
    if (messageId) {
      await ctx.bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
      });
    } else {
      await ctx.bot.sendMessage(chatId, text);
    }
    return;
  }

  const { sources } = lastMessage;
  if (!sources || sources.length === 0) {
    const text = "The previous reply has no citations available.";
    if (messageId) {
      await ctx.bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
      });
    } else {
      await ctx.bot.sendMessage(chatId, text);
    }
    return;
  }

  // Store sources in state for callback handlers to access
  ctx.setState(chatId, { _proofSources: sources });

  const { text, buttons } = buildSourcesMenu(sources, page);
  const opts = {
    parse_mode: "HTML",
    reply_markup: { inline_keyboard: buttons },
  };

  if (messageId) {
    await ctx.bot.editMessageText(text, {
      chat_id: chatId,
      message_id: messageId,
      ...opts,
    });
  } else {
    await ctx.bot.sendMessage(chatId, text, opts);
  }
}

/**
 * /proof - Show citations from the previous assistant message.
 * @param {import("../index").BotContext} ctx
 * @param {number} chatId
 */
async function handleProof(ctx, chatId) {
  await showSourcesMenu(ctx, chatId, 0, null);
}

module.exports = {
  handleProof,
  showSourcesMenu,
  isWebSource,
  getSourceTitle,
  SOURCES_PER_PAGE,
};
