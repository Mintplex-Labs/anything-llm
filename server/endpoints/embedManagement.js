const { EmbedChats } = require("../models/embedChats");
const { EmbedConfig } = require("../models/embedConfig");
const { EventLogs } = require("../models/eventLogs");
const { WorkspaceUser } = require("../models/workspaceUsers");
const { reqBody, userFromSession } = require("../utils/http");
const { validEmbedConfigId } = require("../utils/middleware/embedMiddleware");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const {
  chatHistoryViewable,
} = require("../utils/middleware/chatHistoryViewable");

function embedManagementEndpoints(app) {
  if (!app) return;

  app.get(
    "/embeds",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager, ROLES.default])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        let embeds;

        // Default users only see embeds for their assigned workspaces
        if (user?.role === ROLES.default) {
          const userWorkspaces = await WorkspaceUser.where({ user_id: user.id });
          const workspaceIds = userWorkspaces.map(ws => ws.workspace_id);
          if (workspaceIds.length === 0) {
            return response.status(200).json({ embeds: [] });
          }
          embeds = await EmbedConfig.whereWithWorkspace(
            { workspace_id: { in: workspaceIds } },
            null,
            { createdAt: "desc" }
          );
        } else {
          embeds = await EmbedConfig.whereWithWorkspace({}, null, {
            createdAt: "desc",
          });
        }

        response.status(200).json({ embeds });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/embeds/new",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager, ROLES.default])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const data = reqBody(request);
        const { embed, message: error } = await EmbedConfig.new(data, user?.id);
        await EventLogs.logEvent(
          "embed_created",
          { embedId: embed.id },
          user?.id
        );
        response.status(200).json({ embed, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/embed/update/:embedId",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager, ROLES.default]), validEmbedConfigId],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const { embedId } = request.params;
        const updates = reqBody(request);
        const { success, error } = await EmbedConfig.update(embedId, updates);
        await EventLogs.logEvent("embed_updated", { embedId }, user?.id);
        response.status(200).json({ success, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/embed/:embedId",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager, ROLES.default]), validEmbedConfigId],
    async (request, response) => {
      try {
        const { embedId } = request.params;
        await EmbedConfig.delete({ id: Number(embedId) });
        await EventLogs.logEvent(
          "embed_deleted",
          { embedId },
          response?.locals?.user?.id
        );
        response.status(200).json({ success: true, error: null });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/embed/chats",
    [chatHistoryViewable, validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager, ROLES.default])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const { offset = 0, limit = 20 } = reqBody(request);
        let embedChats;
        let totalChats;

        // Default users only see chats for embeds in their assigned workspaces
        if (user?.role === ROLES.default) {
          const userWorkspaces = await WorkspaceUser.where({ user_id: user.id });
          const workspaceIds = userWorkspaces.map(ws => ws.workspace_id);
          if (workspaceIds.length === 0) {
            return response.status(200).json({ chats: [], hasPages: false, totalChats: 0 });
          }
          embedChats = await EmbedChats.whereWithEmbedAndWorkspace(
            { embed_config: { workspace_id: { in: workspaceIds } } },
            limit,
            { id: "desc" },
            offset * limit
          );
          totalChats = await EmbedChats.count({ embed_config: { workspace_id: { in: workspaceIds } } });
        } else {
          embedChats = await EmbedChats.whereWithEmbedAndWorkspace(
            {},
            limit,
            { id: "desc" },
            offset * limit
          );
          totalChats = await EmbedChats.count();
        }

        const hasPages = totalChats > (offset + 1) * limit;
        response.status(200).json({ chats: embedChats, hasPages, totalChats });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/embed/chats/:chatId",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager, ROLES.default])],
    async (request, response) => {
      try {
        const { chatId } = request.params;
        await EmbedChats.delete({ id: Number(chatId) });
        response.status(200).json({ success: true, error: null });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  // Get conversations (global view, grouped by conversation_id)
  app.post(
    "/embed/chats/conversations",
    [chatHistoryViewable, validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager, ROLES.default])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const { offset = 0, limit = 20, startDate, endDate } = reqBody(request);

        // Get all conversations (global view)
        const conversations = await EmbedChats.getConversations(
          null,  // NULL = global across all embeds
          offset,
          limit,
          startDate ? new Date(startDate) : null,
          endDate ? new Date(endDate) : null
        );

        // Filter by workspace permissions for default users
        let filteredConversations = conversations;
        if (user?.role === ROLES.default) {
          const userWorkspaces = await WorkspaceUser.where({ user_id: user.id });
          const workspaceIds = userWorkspaces.map(ws => ws.workspace_id);

          // Get embed configs for user's workspaces
          const allowedEmbeds = await EmbedConfig.where({
            workspace_id: { in: workspaceIds }
          });
          const allowedEmbedIds = allowedEmbeds.map(e => e.id);

          // Filter conversations
          filteredConversations = conversations.filter(conv =>
            allowedEmbedIds.includes(conv.embed_id)
          );
        }

        // Count total conversations for pagination
        const { Prisma } = require("@prisma/client");
        const prisma = require("../utils/prisma");

        const dateConditions = [];
        if (startDate) {
          dateConditions.push(Prisma.sql`AND createdAt >= ${new Date(startDate)}`);
        }
        if (endDate) {
          dateConditions.push(Prisma.sql`AND createdAt <= ${new Date(endDate)}`);
        }

        const totalCount = await prisma.$queryRaw`
          SELECT COUNT(DISTINCT COALESCE(conversation_id, session_id)) as count
          FROM embed_chats
          WHERE 1=1
            ${dateConditions.length > 0 ? Prisma.join(dateConditions, " ") : Prisma.empty}
            AND include = 1
        `;

        const hasMore = (offset + limit) < Number(totalCount[0]?.count || 0);
        const total = Number(totalCount[0]?.count || 0);

        response.status(200).json({
          success: true,
          conversations: filteredConversations,
          hasMore,
          totalCount: total,
        });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  // Analytics: Get basic statistics for an embed
  app.post(
    "/embed/:embedId/analytics/overview",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager, ROLES.default])],
    async (request, response) => {
      try {
        const { embedId } = request.params;
        const { startDate, endDate } = reqBody(request);

        const stats = await EmbedChats.getBasicStats(
          Number(embedId),
          startDate ? new Date(startDate) : null,
          endDate ? new Date(endDate) : null
        );

        response.status(200).json({ success: true, stats });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  // Analytics: Get conversations list for an embed
  app.post(
    "/embed/:embedId/analytics/conversations",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager, ROLES.default])],
    async (request, response) => {
      try {
        const { embedId } = request.params;
        const { offset = 0, limit = 20, startDate, endDate } = reqBody(request);

        const conversations = await EmbedChats.getConversations(
          Number(embedId),
          offset,
          limit,
          startDate ? new Date(startDate) : null,
          endDate ? new Date(endDate) : null
        );

        // Count total conversations for pagination
        const { Prisma } = require("@prisma/client");
        const prisma = require("../utils/prisma");

        const dateConditions = [];
        if (startDate) {
          dateConditions.push(Prisma.sql`AND createdAt >= ${new Date(startDate)}`);
        }
        if (endDate) {
          dateConditions.push(Prisma.sql`AND createdAt <= ${new Date(endDate)}`);
        }

        const totalCount = await prisma.$queryRaw`
          SELECT COUNT(DISTINCT COALESCE(conversation_id, session_id)) as count
          FROM embed_chats
          WHERE embed_id = ${Number(embedId)}
            ${dateConditions.length > 0 ? Prisma.join(dateConditions, " ") : Prisma.empty}
            AND include = 1
        `;

        const hasMore = (offset + limit) < Number(totalCount[0]?.count || 0);
        const total = Number(totalCount[0]?.count || 0);

        // Debug: Check for BigInt values
        console.log("Conversations sample:", conversations[0]);
        console.log("Types:", {
          first: typeof conversations[0]?.first_chat_id,
          count: typeof conversations[0]?.message_count,
        });

        response.status(200).json({
          success: true,
          conversations,
          hasMore,
          totalCount: total,
        });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  // Analytics: Get conversation details
  app.get(
    "/embed/:embedId/conversation/:sessionId",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager, ROLES.default])],
    async (request, response) => {
      try {
        const { embedId, sessionId } = request.params;

        const messages = await EmbedChats.getConversationDetails(
          sessionId,
          Number(embedId)
        );

        response.status(200).json({ success: true, messages });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  // DSGVO: Clear all chats (global or per-embed)
  app.delete(
    "/embed-chats/clear/:embedId",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const { embedId } = request.params;
        const user = await userFromSession(request, response);

        if (Number(embedId) === -1) {
          // Global: Delete ALL embed chats
          const count = await EmbedChats.count();
          await EmbedChats.delete({});
          await EventLogs.logEvent(
            "embed_chats_cleared_all",
            { deletedCount: count },
            user?.id
          );
          response.status(200).json({ success: true, deletedCount: count });
        } else {
          // Per Widget: Delete all chats for this embed
          const count = await EmbedChats.count({ embed_id: Number(embedId) });
          await EmbedChats.delete({ embed_id: Number(embedId) });
          await EventLogs.logEvent(
            "embed_chats_cleared",
            { embedId: Number(embedId), deletedCount: count },
            user?.id
          );
          response.status(200).json({ success: true, deletedCount: count });
        }
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );
}

module.exports = { embedManagementEndpoints };
