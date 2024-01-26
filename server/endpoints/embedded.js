const { v4: uuidv4 } = require("uuid");
const { reqBody, userFromSession, multiUserMode } = require("../utils/http");
const { Workspace } = require("../models/workspace");
const { WorkspaceChats } = require("../models/workspaceChats");
const { SystemSettings } = require("../models/systemSettings");
const { Telemetry } = require("../models/telemetry");
const {
  streamChatWithWorkspace,
  writeResponseChunk,
  VALID_CHAT_MODE,
} = require("../utils/chats/stream");

function embeddedEndpoints(app) {
  if (!app) return;

  //http://localhost:3001/api/workspace/${userId}/embedded-chat
  app.post("/workspace/:userId/embedded-chat", async (request, response) => {
    try {
      //   const user = await userFromSession(request, response);
      const user = {
        id: 1,
        username: "admin",
        password:
          "$2b$10$nRP1SfL1GnFGdcGmimxTpe2sa3nLVz1msy48O.V5q/zXDRFG4bkJC",
        pfpFilename: null,
        role: "admin",
        suspended: 0,
        createdAt: "2024-01-23T00:45:53.416Z",
        lastUpdatedAt: "2024-01-23T00:45:53.416Z",
      };
      const { userId } = request.params;
      const { message, mode = "query" } = reqBody(request);

      console.log("message:", message);

      const slug = "hello";

      console.log("slug", slug);

      const workspace = multiUserMode(response)
        ? await Workspace.getWithUser(user, { slug })
        : await Workspace.get({ slug });

      if (!workspace) {
        response.sendStatus(400).end();
        return;
      }

      if (!message?.length || !VALID_CHAT_MODE.includes(mode)) {
        response.status(400).json({
          id: uuidv4(),
          type: "abort",
          textResponse: null,
          sources: [],
          close: true,
          error: !message?.length
            ? "Message is empty."
            : `${mode} is not a valid mode.`,
        });
        return;
      }

      response.setHeader("Cache-Control", "no-cache");
      response.setHeader("Content-Type", "text/event-stream");
      response.setHeader("Access-Control-Allow-Origin", "*");
      response.setHeader("Connection", "keep-alive");
      response.flushHeaders();

      if (multiUserMode(response) && user.role !== ROLES.admin) {
        const limitMessagesSetting = await SystemSettings.get({
          label: "limit_user_messages",
        });
        const limitMessages = limitMessagesSetting?.value === "true";

        if (limitMessages) {
          const messageLimitSetting = await SystemSettings.get({
            label: "message_limit",
          });
          const systemLimit = Number(messageLimitSetting?.value);

          if (!!systemLimit) {
            const currentChatCount = await WorkspaceChats.count({
              user_id: user.id,
              createdAt: {
                gte: new Date(new Date() - 24 * 60 * 60 * 1000),
              },
            });

            if (currentChatCount >= systemLimit) {
              writeResponseChunk(response, {
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

      await streamChatWithWorkspace(response, workspace, message, mode, user);
      await Telemetry.sendTelemetry("sent_chat", {
        multiUserMode: multiUserMode(response),
        LLMSelection: process.env.LLM_PROVIDER || "openai",
        Embedder: process.env.EMBEDDING_ENGINE || "inherit",
        VectorDbSelection: process.env.VECTOR_DB || "pinecone",
      });
      response.end();
    } catch (e) {
      console.error(e);
      writeResponseChunk(response, {
        id: uuidv4(),
        type: "abort",
        textResponse: null,
        sources: [],
        close: true,
        error: e.message,
      });
      response.end();
    }
  });
}

module.exports = { embeddedEndpoints };
