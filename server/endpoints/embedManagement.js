const { EmbedChats } = require("../models/embedChats");
const { EmbedConfig } = require("../models/embedConfig");
const { reqBody, userFromSession } = require("../utils/http");
const { validEmbedConfigId } = require("../utils/middleware/embedMiddleware");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { validatedRequest } = require("../utils/middleware/validatedRequest");

function embedManagementEndpoints(app) {
  if (!app) return;

  app.get(
    "/embeds",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (_, response) => {
      try {
        const embeds = await EmbedConfig.whereWithWorkspace({}, null, {
          createdAt: "desc",
        });
        response.status(200).json({ embeds });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/embeds/new",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const user = userFromSession(request, response);
        const data = reqBody(request);
        const { embed, message: error } = await EmbedConfig.new(data, user?.id);
        response.status(200).json({ embed, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/embed/update/:embedId",
    [validatedRequest, flexUserRoleValid([ROLES.admin]), validEmbedConfigId],
    async (request, response) => {
      try {
        const { embedId } = request.params;
        const updates = reqBody(request);
        const { success, error } = await EmbedConfig.update(embedId, updates);
        response.status(200).json({ success, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/embed/:embedId",
    [validatedRequest, flexUserRoleValid([ROLES.admin]), validEmbedConfigId],
    async (request, response) => {
      try {
        const { embedId } = request.params;
        await EmbedConfig.delete({ id: Number(embedId) });
        response.status(200).json({ success: true, error: null });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/embed/chats",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { offset = 0, limit = 20 } = reqBody(request);
        const embedChats = await EmbedChats.whereWithEmbedAndWorkspace(
          {},
          limit,
          { id: "desc" },
          offset * limit
        );
        const totalChats = await EmbedChats.count();
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
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
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
}

module.exports = { embedManagementEndpoints };
