const { v4: uuidv4 } = require("uuid");
const { reqBody, userFromSession, multiUserMode } = require("../utils/http");
const { Workspace } = require("../models/workspace");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { WorkspaceChats } = require("../models/workspaceChats");
const { SystemSettings } = require("../models/systemSettings");
const { Telemetry } = require("../models/telemetry");
const {
  streamChatWithWorkspace,
  writeResponseChunk,
  VALID_CHAT_MODE,
} = require("../utils/chats/stream");
const {
  ROLES,
  flexUserRoleValid,
} = require("../utils/middleware/multiUserProtected");
const { EventLogs } = require("../models/eventLogs");
const {
  validWorkspaceAndThreadSlug,
} = require("../utils/middleware/validWorkspace");

function chatEndpoints(app) {
  if (!app) return;

  app.post(
    "/workspace/:slug/stream-chat",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const { slug } = request.params;
        const { message, mode = "query" } = reqBody(request);

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

        await EventLogs.logEvent(
          "sent_chat",
          {
            workspaceName: workspace?.name,
            chatModel: workspace?.chatModel || "System Default",
          },
          user?.id
        );
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
    }
  );

  app.post(
    "/workspace/:slug/thread/:threadSlug/stream-chat",
    [
      validatedRequest,
      flexUserRoleValid([ROLES.all]),
      validWorkspaceAndThreadSlug,
    ],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const { message, mode = "query" } = reqBody(request);
        const workspace = response.locals.workspace;
        const thread = response.locals.thread;

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
              // Chat qty includes all threads because any user can freely
              // create threads and would bypass this rule.
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

        await streamChatWithWorkspace(
          response,
          workspace,
          message,
          mode,
          user,
          thread
        );
        await Telemetry.sendTelemetry("sent_chat", {
          multiUserMode: multiUserMode(response),
          LLMSelection: process.env.LLM_PROVIDER || "openai",
          Embedder: process.env.EMBEDDING_ENGINE || "inherit",
          VectorDbSelection: process.env.VECTOR_DB || "pinecone",
        });

        await EventLogs.logEvent(
          "sent_chat",
          {
            workspaceName: workspace.name,
            thread: thread.name,
            chatModel: workspace?.chatModel || "System Default",
          },
          user?.id
        );
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
    }
  );
}

module.exports = { chatEndpoints };
