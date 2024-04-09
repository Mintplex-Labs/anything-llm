const { v4: uuidv4 } = require("uuid");
const { reqBody, userFromSession, multiUserMode } = require("../utils/http");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { WorkspaceChats } = require("../models/workspaceChats");
const { SystemSettings } = require("../models/systemSettings");
const { Telemetry } = require("../models/telemetry");
const { streamChatWithWorkspace } = require("../utils/chats/stream");
const {
  ROLES,
  flexUserRoleValid,
} = require("../utils/middleware/multiUserProtected");
const { EventLogs } = require("../models/eventLogs");
const {
  validWorkspaceAndThreadSlug,
  validWorkspaceSlug,
} = require("../utils/middleware/validWorkspace");
const { writeResponseChunk } = require("../utils/helpers/chat/responses");
const AIbitat = require("../utils/agents/abitat");
const { websocket, experimental_webBrowsing } = require("../utils/agents/abitat/plugins");

function chatEndpoints(app) {
  if (!app) return;

  app.post(
    "/workspace/:slug/stream-chat",
    [validatedRequest, flexUserRoleValid([ROLES.all]), validWorkspaceSlug],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const { message } = reqBody(request);
        const workspace = response.locals.workspace;

        if (!message?.length) {
          response.status(400).json({
            id: uuidv4(),
            type: "abort",
            textResponse: null,
            sources: [],
            close: true,
            error: !message?.length ? "Message is empty." : null,
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

        await streamChatWithWorkspace(
          response,
          workspace,
          message,
          workspace?.chatMode,
          user
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
        const { message } = reqBody(request);
        const workspace = response.locals.workspace;
        const thread = response.locals.thread;

        if (!message?.length) {
          response.status(400).json({
            id: uuidv4(),
            type: "abort",
            textResponse: null,
            sources: [],
            close: true,
            error: !message?.length ? "Message is empty." : null,
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
          workspace?.chatMode,
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

  app.ws("/agent-invocation/:uuid", async function (ws, request) {
    const Agent = {
      HUMAN: '🧑',
      AI: '🤖',
    }

    try {
      ws.on('message', function (msg) {
        console.log('GOT MESSAGE', { msg })
        if (ws?.handleFeedback) ws.handleFeedback(msg);
      });

      ws.on('close', function () {
        console.log('Socket killed');
        return;
      });

      console.log('Socket online and waiting...', request.params.uuid);

      const aibitat = new AIbitat({
        provider: 'openai',
        model: 'gpt-3.5-turbo',
      })
        .use(websocket({ socket: ws }))
        .use(experimental_webBrowsing())
        .agent(Agent.HUMAN, {
          interrupt: 'ALWAYS',
          role: 'You are a human assistant.',
        })
        .agent(Agent.AI, {
          role: 'You are a helpful ai assistant who likes to chat with the user who an also browse the web for questions it does not know or have real-time access to.',
          functions: ['web-browsing'],
        })

      await aibitat.start({
        from: Agent.HUMAN,
        to: Agent.AI,
        content: `How are you doing today?`,
      })
    } catch (error) {
      console.error("Failed to communicate over upgrades protocol.")
    }
  });
}

module.exports = { chatEndpoints };
