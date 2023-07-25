const { v4: uuidv4 } = require("uuid");
const { reqBody, userFromSession, multiUserMode } = require("../utils/http");
const { Workspace } = require("../models/workspace");
const { chatWithWorkspace } = require("../utils/chats");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { WorkspaceChats } = require("../models/workspaceChats");
const { SystemSettings } = require("../models/systemSettings");

function chatEndpoints(app) {
  if (!app) return;

  app.post(
    "/workspace/:slug/chat",
    [validatedRequest],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const { slug } = request.params;
        const { message, mode = "query" } = reqBody(request);
        const workspace = multiUserMode(response)
          ? await Workspace.getWithUser(user, `slug = '${slug}'`)
          : await Workspace.get(`slug = '${slug}'`);

        if (!workspace) {
          response.sendStatus(400).end();
          return;
        }

        if (multiUserMode(response) && user.role !== "admin") {
          const limitMessages =
            (await SystemSettings.get(`label = 'limit_user_messages'`))
              ?.value === "true";

          if (limitMessages) {
            const systemLimit = Number(
              (await SystemSettings.get(`label = 'message_limit'`))?.value
            );
            if (!!systemLimit) {
              const currentChatCount = await WorkspaceChats.count(
                `user_id = ${user.id} AND createdAt > datetime(CURRENT_TIMESTAMP, '-1 days')`
              );
              if (currentChatCount >= systemLimit) {
                response.status(500).json({
                  id: uuidv4(),
                  type: "abort",
                  textResponse: null,
                  sources: [],
                  close: true,
                  error: `You have met your maximum 24 hour chat quota of ${systemLimit} chats set by the instance administrators. Try again later.`,
                });
                return;
              }
            }
          }
        }

        const result = await chatWithWorkspace(workspace, message, mode, user);
        response.status(200).json({ ...result });
      } catch (e) {
        response.status(500).json({
          id: uuidv4(),
          type: "abort",
          textResponse: null,
          sources: [],
          close: true,
          error: e.message,
        });
      }
    }
  );
}

module.exports = { chatEndpoints };
