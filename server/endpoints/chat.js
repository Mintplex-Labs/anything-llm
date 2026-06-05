const { v4: uuidv4 } = require("uuid");
const { reqBody, userFromSession, multiUserMode } = require("../utils/http");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
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
const {
  normalizeUseApiIntent,
  isOnlineChatProvider,
  useApiSsePayload,
  useApiProviderSelectedSsePayload,
  useApiRoutingFailedSsePayload,
  localOnlyProviderBlockedSsePayload,
  buildUseApiRuntimeWorkspace,
} = require("../utils/swarmsy/useApiChat");
const { WorkspaceThread } = require("../models/workspaceThread");
const { User } = require("../models/user");
const { getModelTag } = require("./utils");
const { getBaseLLMProviderModel } = require("../utils/helpers");
const {
  applyRuntimeSelectionToWorkspace,
} = require("../utils/swarmsy/runtimeSelection");

function chatQuotaAbortPayload(user) {
  return {
    id: uuidv4(),
    type: "abort",
    textResponse: null,
    sources: [],
    close: true,
    error: `You have met your maximum 24 hour chat quota of ${user.dailyMessageLimit} chats. Try again later.`,
  };
}

function effectiveChatProvider(workspace) {
  return workspace?.chatProvider || process.env.LLM_PROVIDER || "openai";
}

function selectedUseApiModel(apiRuntime) {
  return (
    apiRuntime?.workspace?.chatModel ||
    getBaseLLMProviderModel({ provider: apiRuntime?.provider }) ||
    getModelTag()
  );
}

function parseSseDataChunk(chunk) {
  const text = Buffer.isBuffer(chunk) ? chunk.toString("utf8") : String(chunk);
  const match = text.match(/^data:\s*(.*)\n\n$/s);
  if (!match) return null;

  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function isAbortOrErrorChunk(payload) {
  if (!payload || typeof payload !== "object") return false;
  if (payload.type === "abort") return true;
  if (payload.error && payload.error !== false) return true;
  return false;
}

async function streamUseApiChat({
  response,
  apiRuntime,
  message,
  user,
  thread = null,
  attachments = [],
}) {
  const originalWrite = response.write;
  let streamFailed = false;

  if (typeof originalWrite === "function") {
    response.write = (chunk, ...args) => {
      const payload = parseSseDataChunk(chunk);
      if (isAbortOrErrorChunk(payload)) {
        streamFailed = true;
        return true;
      }

      return originalWrite.call(response, chunk, ...args);
    };
  }

  try {
    await streamChatWithWorkspace(
      response,
      apiRuntime.workspace,
      message,
      apiRuntime.workspace?.chatMode,
      user,
      thread,
      attachments
    );
  } finally {
    if (typeof originalWrite === "function") {
      response.write = originalWrite;
    }
  }

  return { failed: streamFailed };
}

function logUseApiRoutingFailure(apiRuntime, err = null) {
  console.error("Use API chat routing failed", {
    provider: apiRuntime?.provider,
    source: apiRuntime?.source,
    name: err?.name,
  });
}

function chatEndpoints(app) {
  if (!app) return;

  app.post(
    "/workspace/:slug/stream-chat",
    [validatedRequest, flexUserRoleValid([ROLES.all]), validWorkspaceSlug],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const {
          message,
          attachments = [],
          runtime = null,
          useApi,
        } = reqBody(request);
        const workspace = response.locals.workspace;
        const runtimeWorkspace = multiUserMode(response)
          ? workspace
          : applyRuntimeSelectionToWorkspace(workspace, runtime).workspace;

        if (typeof message !== "string" || message.trim().length === 0) {
          response.status(400).json({
            id: uuidv4(),
            type: "abort",
            textResponse: null,
            sources: [],
            close: true,
            error: "Message is empty.",
          });
          return;
        }

        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Content-Type", "text/event-stream");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Connection", "keep-alive");
        response.flushHeaders();

        if (multiUserMode(response) && !(await User.canSendChat(user))) {
          writeResponseChunk(response, chatQuotaAbortPayload(user));
          return;
        }

        if (normalizeUseApiIntent(useApi)) {
          const apiRuntime = buildUseApiRuntimeWorkspace({ workspace });
          if (apiRuntime.status) {
            writeResponseChunk(
              response,
              useApiSsePayload({
                uuid: uuidv4(),
                hasProviderConfig: false,
              })
            );
            response.end();
            return;
          }

          writeResponseChunk(
            response,
            useApiProviderSelectedSsePayload({
              uuid: uuidv4(),
              provider: apiRuntime.provider,
              source: apiRuntime.source,
            })
          );

          let apiStreamFailed = false;
          let apiFailureLogged = false;
          try {
            const streamResult = await streamUseApiChat({
              response,
              apiRuntime,
              message,
              user,
              attachments,
            });
            apiStreamFailed = streamResult.failed;
          } catch (err) {
            apiStreamFailed = true;
            apiFailureLogged = true;
            logUseApiRoutingFailure(apiRuntime, err);
          }

          if (apiStreamFailed) {
            if (!apiFailureLogged) logUseApiRoutingFailure(apiRuntime);
            writeResponseChunk(
              response,
              useApiRoutingFailedSsePayload({ uuid: uuidv4() })
            );
            response.end();
            return;
          }

          await Telemetry.sendTelemetry("sent_chat", {
            multiUserMode: multiUserMode(response),
            LLMSelection: apiRuntime.provider,
            Embedder: process.env.EMBEDDING_ENGINE || "inherit",
            VectorDbSelection: process.env.VECTOR_DB || "lancedb",
            multiModal: Array.isArray(attachments) && attachments?.length !== 0,
            TTSSelection: process.env.TTS_PROVIDER || "native",
            LLMModel: selectedUseApiModel(apiRuntime),
            useApi: true,
          });

          await EventLogs.logEvent(
            "sent_chat",
            {
              workspaceName: workspace?.name,
              chatModel: apiRuntime.workspace?.chatModel || "System Default",
              useApi: true,
              provider: apiRuntime.provider,
            },
            user?.id
          );
          response.end();
          return;
        }

        if (isOnlineChatProvider(effectiveChatProvider(runtimeWorkspace))) {
          writeResponseChunk(
            response,
            localOnlyProviderBlockedSsePayload({ uuid: uuidv4() })
          );
          response.end();
          return;
        }

        await streamChatWithWorkspace(
          response,
          runtimeWorkspace,
          message,
          runtimeWorkspace?.chatMode,
          user,
          null,
          attachments
        );
        await Telemetry.sendTelemetry("sent_chat", {
          multiUserMode: multiUserMode(response),
          LLMSelection:
            runtimeWorkspace?.chatProvider ||
            process.env.LLM_PROVIDER ||
            "openai",
          Embedder: process.env.EMBEDDING_ENGINE || "inherit",
          VectorDbSelection: process.env.VECTOR_DB || "lancedb",
          multiModal: Array.isArray(attachments) && attachments?.length !== 0,
          TTSSelection: process.env.TTS_PROVIDER || "native",
          LLMModel: runtimeWorkspace?.chatModel || getModelTag(),
        });

        await EventLogs.logEvent(
          "sent_chat",
          {
            workspaceName: workspace?.name,
            chatModel: runtimeWorkspace?.chatModel || "System Default",
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
        const {
          message,
          attachments = [],
          runtime = null,
          useApi,
        } = reqBody(request);
        const workspace = response.locals.workspace;
        const thread = response.locals.thread;
        const runtimeWorkspace = multiUserMode(response)
          ? workspace
          : applyRuntimeSelectionToWorkspace(workspace, runtime).workspace;

        if (typeof message !== "string" || message.trim().length === 0) {
          response.status(400).json({
            id: uuidv4(),
            type: "abort",
            textResponse: null,
            sources: [],
            close: true,
            error: "Message is empty.",
          });
          return;
        }

        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Content-Type", "text/event-stream");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Connection", "keep-alive");
        response.flushHeaders();

        if (multiUserMode(response) && !(await User.canSendChat(user))) {
          writeResponseChunk(response, chatQuotaAbortPayload(user));
          return;
        }

        if (normalizeUseApiIntent(useApi)) {
          const apiRuntime = buildUseApiRuntimeWorkspace({ workspace });
          if (apiRuntime.status) {
            writeResponseChunk(
              response,
              useApiSsePayload({
                uuid: uuidv4(),
                hasProviderConfig: false,
              })
            );
            response.end();
            return;
          }

          writeResponseChunk(
            response,
            useApiProviderSelectedSsePayload({
              uuid: uuidv4(),
              provider: apiRuntime.provider,
              source: apiRuntime.source,
            })
          );

          let apiStreamFailed = false;
          let apiFailureLogged = false;
          try {
            const streamResult = await streamUseApiChat({
              response,
              apiRuntime,
              message,
              user,
              thread,
              attachments,
            });
            apiStreamFailed = streamResult.failed;
          } catch (err) {
            apiStreamFailed = true;
            apiFailureLogged = true;
            logUseApiRoutingFailure(apiRuntime, err);
          }

          if (apiStreamFailed) {
            if (!apiFailureLogged) logUseApiRoutingFailure(apiRuntime);
            writeResponseChunk(
              response,
              useApiRoutingFailedSsePayload({ uuid: uuidv4() })
            );
            response.end();
            return;
          }

          await Telemetry.sendTelemetry("sent_chat", {
            multiUserMode: multiUserMode(response),
            LLMSelection: apiRuntime.provider,
            Embedder: process.env.EMBEDDING_ENGINE || "inherit",
            VectorDbSelection: process.env.VECTOR_DB || "lancedb",
            multiModal: Array.isArray(attachments) && attachments?.length !== 0,
            TTSSelection: process.env.TTS_PROVIDER || "native",
            LLMModel: selectedUseApiModel(apiRuntime),
            useApi: true,
          });

          await EventLogs.logEvent(
            "sent_chat",
            {
              workspaceName: workspace?.name,
              thread: thread.name,
              chatModel: apiRuntime.workspace?.chatModel || "System Default",
              useApi: true,
              provider: apiRuntime.provider,
            },
            user?.id
          );
          response.end();
          return;
        }

        if (isOnlineChatProvider(effectiveChatProvider(runtimeWorkspace))) {
          writeResponseChunk(
            response,
            localOnlyProviderBlockedSsePayload({ uuid: uuidv4() })
          );
          response.end();
          return;
        }

        await streamChatWithWorkspace(
          response,
          runtimeWorkspace,
          message,
          runtimeWorkspace?.chatMode,
          user,
          thread,
          attachments
        );

        // If thread was renamed emit event to frontend via special `action` response.
        await WorkspaceThread.autoRenameThread({
          thread,
          workspace,
          user,
          prompt: message,
          onRename: (thread) => {
            writeResponseChunk(response, {
              action: "rename_thread",
              thread: {
                slug: thread.slug,
                name: thread.name,
              },
            });
          },
        });

        await Telemetry.sendTelemetry("sent_chat", {
          multiUserMode: multiUserMode(response),
          LLMSelection:
            runtimeWorkspace?.chatProvider ||
            process.env.LLM_PROVIDER ||
            "openai",
          Embedder: process.env.EMBEDDING_ENGINE || "inherit",
          VectorDbSelection: process.env.VECTOR_DB || "lancedb",
          multiModal: Array.isArray(attachments) && attachments?.length !== 0,
          TTSSelection: process.env.TTS_PROVIDER || "native",
          LLMModel: runtimeWorkspace?.chatModel || getModelTag(),
        });

        await EventLogs.logEvent(
          "sent_chat",
          {
            workspaceName: workspace?.name,
            thread: thread.name,
            chatModel: runtimeWorkspace?.chatModel || "System Default",
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
