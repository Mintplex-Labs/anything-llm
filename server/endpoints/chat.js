const {v4: uuidv4} = require("uuid");
const {reqBody, userFromSession, multiUserMode} = require("../utils/http");
const {Workspace} = require("../models/workspace");
const {chatWithWorkspace, convertToChatHistory} = require("../utils/chats");
const {validatedRequest} = require("../utils/middleware/validatedRequest");
const {ThreadChats} = require("../models/threadChats");
const {SystemSettings} = require("../models/systemSettings");
const {Telemetry} = require("../models/telemetry");
const {
  streamChatWithWorkspace,
  writeResponseChunk,
} = require("../utils/chats/stream");
const {Threads} = require("../models/threads");

function chatEndpoints(app) {
  if (!app) return;

  app.post(
    "/workspace/:slug/thread/:threadId/stream-chat",
    [validatedRequest],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const {slug, threadId} = request.params;
        const {message, mode = "query"} = reqBody(request);

        const workspace = multiUserMode(response)
          ? await Workspace.getWithUser(user, {slug})
          : await Workspace.get({slug});

        const thread = multiUserMode(response)
          ? await Threads.get({id: Number(threadId), workspace_id: workspace.id, user_id: user.id})
          : await Threads.get({id: Number(threadId), workspace_id: workspace.id});

        if (!workspace || !thread) {
          response.sendStatus(400).end();
          return;
        }

        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Content-Type", "text/event-stream");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Connection", "keep-alive");
        response.flushHeaders();

        if (multiUserMode(response) && user.role !== "admin") {
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
              const currentChatCount = await ThreadChats.count({
                thread_id: thread.id,
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

        await streamChatWithWorkspace(response, workspace, thread, message, mode, user);
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
    }
  );

  app.post(
    "/workspace/:slug/thread/:threadId/chat",
    [validatedRequest],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const {slug, threadId} = request.params;
        const {message, mode = "query"} = reqBody(request);

        const workspace = multiUserMode(response)
          ? await Workspace.getWithUser(user, {slug})
          : await Workspace.get({slug});

        const thread = multiUserMode(response)
          ? await Threads.get({id: Number(threadId), workspace_id: workspace.id, user_id: user.id})
          : await Threads.get({id: Number(threadId), workspace_id: workspace.id});

        if (!workspace || !thread) {
          response.sendStatus(400).end();
          return;
        }

        if (multiUserMode(response) && user.role !== "admin") {
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
              const currentChatCount = await ThreadChats.count({
                thread_id: thread.id,
                createdAt: {
                  gte: new Date(new Date() - 24 * 60 * 60 * 1000),
                },
              });

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

        const result = await chatWithWorkspace(workspace, thread, message, mode, user);
        await Telemetry.sendTelemetry(
          "sent_chat",
          {
            multiUserMode: multiUserMode(response),
            LLMSelection: process.env.LLM_PROVIDER || "openai",
            Embedder: process.env.EMBEDDING_ENGINE || "inherit",
            VectorDbSelection: process.env.VECTOR_DB || "pinecone",
          },
          user?.id
        );
        response.status(200).json({...result});
      } catch (e) {
        console.error(e);
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

  app.get(
    "/workspace/:slug/thread/:threadId/chat",
    [validatedRequest],
    async (request, response) => {
      try {
        const {slug, threadId} = request.params;
        const user = await userFromSession(request, response);
        const workspace = multiUserMode(response)
          ? await Workspace.getWithUser(user, {slug})
          : await Workspace.get({slug});

        if (!workspace) {
          response.sendStatus(400).end();
          return;
        }

        const thread = await Threads.get({
          id: Number(threadId),
          workspace_id: workspace.id,
          user_id: user?.id
        });

        if (!thread) {
          response.sendStatus(400).end();
          return;
        }

        const history = await ThreadChats.forWorkspaceByThread(workspace.id, thread.id);

        response.status(200).json({history: convertToChatHistory(history)});
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );
}

module.exports = {chatEndpoints};
