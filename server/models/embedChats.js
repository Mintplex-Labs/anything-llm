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
 * @property {string|null} conversation_id
 * @property {boolean} include
 */

const EmbedChats = {
  new: async function ({
    embedId,
    prompt,
    response = {},
    connection_information = {},
    sessionId,
    conversationId = null,
  }) {
    try {
      const chat = await prisma.embed_chats.create({
        data: {
          prompt,
          embed_id: Number(embedId),
          response: JSON.stringify(response),
          connection_information: JSON.stringify(connection_information),
          session_id: String(sessionId),
          conversation_id: conversationId ? String(conversationId) : null,
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
      const { sources, ...responseRest } = safeJsonParse(response);
      return { ...rest, response: JSON.stringify(responseRest) };
    });
  },

  /**
   * Fetches chats for a given embed and identifier (session_id or conversation_id).
   * @param {number} embedId the id of the embed to fetch chats for
   * @param {string} identifierId the id of the session or conversation to fetch chats for
   * @param {number|null} limit the maximum number of chats to fetch
   * @param {string|null} orderBy the order to fetch chats in
   * @param {string|boolean} identifierType 'session_id' or 'conversation_id' (default: 'session_id' for backwards compatibility), or boolean for filterSources (legacy)
   * @returns {Promise<EmbedChat[]>} Returns an array of chats for the given embed and identifier
   */
  forEmbedByUser: async function (
    embedId = null,
    identifierId = null,
    limit = null,
    orderBy = null,
    identifierType = 'session_id'
  ) {
    if (!embedId || !identifierId) return [];

    // Legacy support: If identifierType is boolean, it's the old filterSources parameter
    let filterSources = false;
    if (typeof identifierType === 'boolean') {
      filterSources = identifierType;
      identifierType = 'session_id';
    }

    try {
      // Build WHERE clause dynamically based on identifier type
      const whereClause = {
        embed_id: Number(embedId),
        include: true,
      };

      if (identifierType === 'conversation_id') {
        whereClause.conversation_id = String(identifierId);
      } else {
        whereClause.session_id = String(identifierId);
      }

      const chats = await prisma.embed_chats.findMany({
        where: whereClause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : { orderBy: { id: "asc" } }),
      });
      return filterSources ? this.filterSources(chats) : chats;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  markHistoryInvalid: async function (
    embedId = null,
    identifierId = null,
    identifierType = 'session_id'
  ) {
    if (!embedId || !identifierId) return [];

    try {
      // Build WHERE clause dynamically
      const whereClause = {
        embed_id: Number(embedId),
      };

      if (identifierType === 'conversation_id') {
        whereClause.conversation_id = String(identifierId);
      } else {
        whereClause.session_id = String(identifierId);
      }

      await prisma.embed_chats.updateMany({
        where: whereClause,
        data: {
          include: false,
        },
      });
      return;
    } catch (error) {
      console.error(error.message);
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

  countForWorkspaceInDateRange: async function (
    workspaceId,
    startDate,
    endDate
  ) {
    try {
      const count = await prisma.embed_chats.count({
        where: {
          embed_config: {
            workspace_id: workspaceId,
          },
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
      return count;
    } catch (error) {
      console.error(error.message);
      return 0;
    }
  },

  /**
   * Analytics: Get conversations grouped by conversation_id (or session_id for backwards compatibility)
   * @param {number} embedId - The embed config ID
   * @param {number} offset - Pagination offset
   * @param {number} limit - Maximum number of conversations to return
   * @param {Date|null} startDate - Optional start date filter
   * @param {Date|null} endDate - Optional end date filter
   * @returns {Promise<Array>} Array of conversation summaries
   */
  getConversations: async function (
    embedId = null,  // NULL = global view across all embeds
    offset = 0,
    limit = 20,
    startDate = null,
    endDate = null
  ) {
    try {
      const { Prisma } = require("@prisma/client");

      // Build WHERE conditions
      const whereConditions = [];
      if (embedId !== null) {
        whereConditions.push(Prisma.sql`WHERE embed_id = ${embedId}`);
      } else {
        whereConditions.push(Prisma.sql`WHERE 1=1`);  // Global view
      }
      if (startDate) {
        whereConditions.push(Prisma.sql`AND createdAt >= ${startDate}`);
      }
      if (endDate) {
        whereConditions.push(Prisma.sql`AND createdAt <= ${endDate}`);
      }

      // SQLite GROUP BY Query to get conversation summaries
      // Use conversation_id for grouping (fallback to session_id for backwards compatibility)
      const conversations = await prisma.$queryRaw`
        SELECT
          COALESCE(conversation_id, session_id) as conversation_id,
          session_id,
          embed_id,
          first_chat_id,
          started_at,
          last_message_at,
          message_count,
          conversation_number
        FROM (
          SELECT
            conversation_id,
            session_id,
            embed_id,
            MIN(id) as first_chat_id,
            MIN(createdAt) as started_at,
            MAX(createdAt) as last_message_at,
            COUNT(*) as message_count,
            ROW_NUMBER() OVER (ORDER BY MIN(createdAt) DESC) as conversation_number
          FROM embed_chats
          ${whereConditions.length > 0 ? Prisma.join(whereConditions, " ") : Prisma.empty}
          GROUP BY COALESCE(conversation_id, session_id), session_id, embed_id
        )
        ORDER BY last_message_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;

      // Convert BigInt to Number for JSON serialization
      const conversationsNormalized = conversations.map((conv) => ({
        conversation_id: conv.conversation_id,
        session_id: conv.session_id,
        embed_id: Number(conv.embed_id),
        first_chat_id: Number(conv.first_chat_id),
        started_at: Number(conv.started_at),
        last_message_at: Number(conv.last_message_at),
        message_count: Number(conv.message_count),
        conversation_number: Number(conv.conversation_number),
      }));

      // Get preview texts and embed info for all conversations in one query (performance optimization)
      if (conversationsNormalized.length > 0) {
        const firstChatIds = conversationsNormalized.map(
          (c) => c.first_chat_id
        );
        const firstChats = await prisma.embed_chats.findMany({
          where: { id: { in: firstChatIds } },
          select: {
            id: true,
            prompt: true,
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
        });

        // Map previews and embed info to conversations
        const dataMap = new Map(
          firstChats.map((chat) => [
            chat.id,
            {
              preview:
                chat.prompt.substring(0, 100) +
                (chat.prompt.length > 100 ? "..." : ""),
              workspace: chat.embed_config?.workspace?.name || null,
            },
          ])
        );

        for (const conv of conversationsNormalized) {
          const data = dataMap.get(conv.first_chat_id);
          conv.preview = data?.preview || "";
          conv.workspace = data?.workspace || null;
        }
      }

      return conversationsNormalized;
    } catch (error) {
      console.error("getConversations error:", error.message);
      return [];
    }
  },

  /**
   * Analytics: Get all messages for a specific conversation
   * @param {string} conversationId - The conversation ID (or session ID for backwards compatibility)
   * @param {number} embedId - The embed config ID
   * @returns {Promise<Array>} Array of chat messages
   */
  getConversationDetails: async function (conversationId, embedId) {
    try {
      return await prisma.embed_chats.findMany({
        where: {
          OR: [
            { conversation_id: String(conversationId) },
            { session_id: String(conversationId) }, // Backwards compatibility
          ],
          embed_id: Number(embedId),
        },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          prompt: true,
          response: true,
          createdAt: true,
          conversation_id: true,
          session_id: true,
        },
      });
    } catch (error) {
      console.error("getConversationDetails error:", error.message);
      return [];
    }
  },

  /**
   * Analytics: Get basic statistics for an embed
   * @param {number} embedId - The embed config ID
   * @param {Date|null} startDate - Optional start date filter
   * @param {Date|null} endDate - Optional end date filter
   * @returns {Promise<Object>} Statistics object
   */
  getBasicStats: async function (
    embedId,
    startDate = null,
    endDate = null
  ) {
    try {
      const { Prisma } = require("@prisma/client");

      // Build WHERE clause
      const where = { embed_id: Number(embedId) };
      if (startDate && endDate) {
        where.createdAt = { gte: startDate, lte: endDate };
      }

      // Build date conditions for raw queries
      const dateConditions = [];
      if (startDate) {
        dateConditions.push(Prisma.sql`AND createdAt >= ${startDate}`);
      }
      if (endDate) {
        dateConditions.push(Prisma.sql`AND createdAt <= ${endDate}`);
      }

      // Get total chats
      const totalChats = await prisma.embed_chats.count({ where });

      // Get unique conversations count (using conversation_id, fallback to session_id)
      const uniqueConversations = await prisma.$queryRaw`
        SELECT COUNT(DISTINCT COALESCE(conversation_id, session_id)) as count
        FROM embed_chats
        WHERE embed_id = ${embedId}
          ${dateConditions.length > 0 ? Prisma.join(dateConditions, " ") : Prisma.empty}
      `;

      // Calculate word counts (SQLite string functions)
      const wordCounts = await prisma.$queryRaw`
        SELECT
          SUM(LENGTH(prompt) - LENGTH(REPLACE(prompt, ' ', '')) + 1) as total_words_prompt,
          SUM(LENGTH(response) - LENGTH(REPLACE(response, ' ', '')) + 1) as total_words_response,
          AVG(LENGTH(prompt) - LENGTH(REPLACE(prompt, ' ', '')) + 1) as avg_words_prompt,
          AVG(LENGTH(response) - LENGTH(REPLACE(response, ' ', '')) + 1) as avg_words_response,
          MAX(LENGTH(prompt) - LENGTH(REPLACE(prompt, ' ', '')) + 1) as max_words_prompt,
          MAX(LENGTH(response) - LENGTH(REPLACE(response, ' ', '')) + 1) as max_words_response
        FROM embed_chats
        WHERE embed_id = ${embedId}
          ${dateConditions.length > 0 ? Prisma.join(dateConditions, " ") : Prisma.empty}
      `;

      // Calculate days in range if dates provided
      const days =
        startDate && endDate
          ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
          : null;

      const conversationCount = Number(uniqueConversations[0]?.count) || 0;
      const wordsPrompt = Number(wordCounts[0]?.total_words_prompt) || 0;
      const wordsResponse = Number(wordCounts[0]?.total_words_response) || 0;
      const avgWordsPrompt = Number(wordCounts[0]?.avg_words_prompt) || 0;
      const avgWordsResponse = Number(wordCounts[0]?.avg_words_response) || 0;
      const maxWordsPrompt = Number(wordCounts[0]?.max_words_prompt) || 0;
      const maxWordsResponse = Number(wordCounts[0]?.max_words_response) || 0;

      return {
        total_chats: totalChats,
        unique_conversations: conversationCount, // Updated to use conversation_id
        unique_sessions: conversationCount, // Deprecated, kept for backwards compatibility
        total_words_prompt: wordsPrompt,
        total_words_response: wordsResponse,
        avg_words_prompt: Math.round(avgWordsPrompt),
        avg_words_response: Math.round(avgWordsResponse),
        max_words_prompt: maxWordsPrompt,
        max_words_response: maxWordsResponse,
        avg_chats_per_conversation:
          conversationCount > 0 ? totalChats / conversationCount : 0,
        avg_chats_per_day: days ? totalChats / days : null,
      };
    } catch (error) {
      console.error("getBasicStats error:", error.message);
      return {
        total_chats: 0,
        unique_conversations: 0,
        unique_sessions: 0, // Deprecated, kept for backwards compatibility
        total_words_prompt: 0,
        total_words_response: 0,
        avg_words_prompt: 0,
        avg_words_response: 0,
        max_words_prompt: 0,
        max_words_response: 0,
        avg_chats_per_conversation: 0,
        avg_chats_per_day: null,
      };
    }
  },
};

module.exports = { EmbedChats };
