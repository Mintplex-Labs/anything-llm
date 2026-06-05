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
  hasConnectedOnlineProviderConfig,
  isOnlineChatProvider,
  useApiSsePayload,
  localOnlyProviderBlockedSsePayload,
} = require("../utils/swarmsy/useApiChat");
const { WorkspaceThread } = require("../models/workspaceThread");
const { User } = require("../models/user");
const { getModelTag } = require("./utils");
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
          writeResponseChunk(
            response,
            useApiSsePayload({
              uuid: uuidv4(),
              hasProviderConfig: hasConnectedOnlineProviderConfig(),
            })
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
          writeResponseChunk(
            response,
            useApiSsePayload({
              uuid: uuidv4(),
              hasProviderConfig: hasConnectedOnlineProviderConfig(),
            })
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
