const { safeJsonParse } = require("../utils/http");
const prisma = require("../utils/prisma");

/**
 * @typedef {Object} EmbedChat
 * @property {number} id
 * @property {number} embed_id
 * @property {string} prompt
 * @property {string} response
 * @property {string} connection_information
 * @property {string} session_id
 * @property {boolean} include
 * @property {boolean|null} feedbackScore
 */

const EmbedChats = {
  validations: {
    // Embed visitors can only mark a reply as good or clear it.
    feedbackScore: (value = null) => (value === true ? true : null),
  },

  /**
   * Stores a prompt and its reply for an embed session.
   * @param {object} params
   * @param {number} params.embedId
   * @param {string} params.prompt
   * @param {object} [params.response] - reply text, type, sources, and metrics
   * @param {object} [params.connection_information]
   * @param {string} params.sessionId
   * @param {boolean} [params.include] - `false` stores the chat outside the session's visible history
   * @returns {Promise<{chat: EmbedChat|null, message: string|null}>}
   */
  new: async function ({
    embedId,
    prompt,
    response = {},
    connection_information = {},
    sessionId,
    include = true,
  }) {
    try {
      const chat = await prisma.embed_chats.create({
        data: {
          prompt,
          embed_id: Number(embedId),
          response: JSON.stringify(response),
          connection_information: JSON.stringify(connection_information),
          session_id: String(sessionId),
          include: include !== false,
        },
      });
      return { chat, message: null };
    } catch (error) {
      console.error(error.message);
      return { chat: null, message: error.message };
    }
  },

  /**
   * Loops through each chat and filters out the sources from the response object.
   * We do this when returning /history of an embed to the frontend to prevent inadvertent leaking
   * of private sources the user may not have intended to share with users.
   * @param {EmbedChat[]} chats
   * @returns {EmbedChat[]} Returns a new array of chats with the sources filtered out of responses
   */
  filterSources: function (chats) {
    return chats.map((chat) => {
      const { response, ...rest } = chat;
      const { sources: _sources, ...responseRest } = safeJsonParse(response);
      return { ...rest, response: JSON.stringify(responseRest) };
    });
  },

  /**
   * Fetches chats for a given embed and session id.
   * @param {number} embedId the id of the embed to fetch chats for
   * @param {string} sessionId the id of the session to fetch chats for
   * @param {number|null} limit the maximum number of chats to fetch
   * @param {string|null} orderBy the order to fetch chats in
   * @param {boolean} filterSources whether to filter out the sources from the response (default: false)
   * @returns {Promise<EmbedChat[]>} Returns an array of chats for the given embed and session
   */
  forEmbedByUser: async function (
    embedId = null,
    sessionId = null,
    limit = null,
    orderBy = null,
    filterSources = false
  ) {
    if (!embedId || !sessionId) return [];

    try {
      const chats = await prisma.embed_chats.findMany({
        where: {
          embed_id: Number(embedId),
          session_id: String(sessionId),
          include: true,
        },
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : { orderBy: { id: "asc" } }),
      });
      return filterSources ? this.filterSources(chats) : chats;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  markHistoryInvalid: async function (embedId = null, sessionId = null) {
    if (!embedId || !sessionId) return [];

    try {
      await prisma.embed_chats.updateMany({
        where: {
          embed_id: Number(embedId),
          session_id: String(sessionId),
        },
        data: {
          include: false,
        },
      });
      return;
    } catch (error) {
      console.error(error.message);
    }
  },

  /**
   * Sets or clears the feedback score on an embed chat.
   * @param {number} chatId
   * @param {boolean|null} feedbackScore - `true` marks the reply as good, anything else clears it
   * @returns {Promise<boolean>} whether the update succeeded
   */
  updateFeedbackScore: async function (chatId = null, feedbackScore = null) {
    if (!chatId) return false;
    try {
      await prisma.embed_chats.update({
        where: { id: Number(chatId) },
        data: { feedbackScore: this.validations.feedbackScore(feedbackScore) },
      });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  get: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const chat = await prisma.embed_chats.findFirst({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      return chat || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  delete: async function (clause = {}) {
    try {
      await prisma.embed_chats.deleteMany({
        where: clause,
      });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  where: async function (
    clause = {},
    limit = null,
    orderBy = null,
    offset = null
  ) {
    try {
      const chats = await prisma.embed_chats.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(offset !== null ? { skip: offset } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      return chats;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  whereWithEmbedAndWorkspace: async function (
    clause = {},
    limit = null,
    orderBy = null,
    offset = null
  ) {
    try {
      const chats = await prisma.embed_chats.findMany({
        where: clause,
        include: {
          embed_config: {
            select: {
              workspace: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        ...(limit !== null ? { take: limit } : {}),
        ...(offset !== null ? { skip: offset } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      return chats;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  count: async function (clause = {}) {
    try {
      const count = await prisma.embed_chats.count({
        where: clause,
      });
      return count;
    } catch (error) {
      console.error(error.message);
      return 0;
    }
  },
};

module.exports = { EmbedChats };
