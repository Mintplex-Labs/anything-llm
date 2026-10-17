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
const { WorkspaceThread } = require("../models/workspaceThread");
const { User } = require("../models/user");
const { getModelTag } = require("./utils");

function setStreamHeaders(response) {
  response.setHeader("Cache-Control", "no-cache");
  response.setHeader("Content-Type", "text/event-stream");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Connection", "keep-alive");
}

function writeQuotaExceeded(response, user) {
  setStreamHeaders(response);
  writeResponseChunk(response, {
    id: uuidv4(),
    type: "abort",
    textResponse: null,
    sources: [],
    close: true,
    error: `You have met your maximum 24 hour chat quota of ${user.dailyMessageLimit} chats. Try again later.`,
  });
  response.end();
}

function chatEndpoints(app) {
  if (!app) return;

  app.post(
    "/workspace/:slug/stream-chat",
    [validatedRequest, flexUserRoleValid([ROLES.all]), validWorkspaceSlug],
    async (request, response) => {
      let quotaReservationId = null;
      try {
        const user = await userFromSession(request, response);
        const {
          message,
          attachments = [],
          reasoningEffort = null,
        } = reqBody(request);
        const workspace = response.locals.workspace;

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

        const quota = multiUserMode(response)
          ? await User.reserveChatQuota(user)
          : { allowed: true, reservationId: null };
        if (!quota.allowed) {
          writeQuotaExceeded(response, user);
          return;
        }
        quotaReservationId = quota.reservationId;

        setStreamHeaders(response);
        response.flushHeaders();

        const streamResult = await streamChatWithWorkspace(
          response,
          workspace,
          message,
          workspace?.chatMode,
          user,
          null,
          attachments,
          typeof reasoningEffort === "string" ? reasoningEffort : null,
          quotaReservationId
        );
        if (streamResult?.quotaReservationTransferred)
          quotaReservationId = null;
        await Telemetry.sendTelemetry("sent_chat", {
          multiUserMode: multiUserMode(response),
          LLMSelection: process.env.LLM_PROVIDER || "openai",
          Embedder: process.env.EMBEDDING_ENGINE || "inherit",
          VectorDbSelection: process.env.VECTOR_DB || "lancedb",
          multiModal: Array.isArray(attachments) && attachments?.length !== 0,
          TTSSelection: process.env.TTS_PROVIDER || "native",
          LLMModel: getModelTag(),
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
        if (!response.headersSent) setStreamHeaders(response);
        writeResponseChunk(response, {
          id: uuidv4(),
          type: "abort",
          textResponse: null,
          sources: [],
          close: true,
          error: e.message,
        });
        response.end();
      } finally {
        if (quotaReservationId) {
          await User.releaseChatQuotaReservation(quotaReservationId).catch(
            (error) =>
              console.error("Failed to release chat quota reservation", error)
          );
        }
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
      let quotaReservationId = null;
      try {
        const user = await userFromSession(request, response);
        const {
          message,
          attachments = [],
          reasoningEffort = null,
        } = reqBody(request);
        const workspace = response.locals.workspace;
        const thread = response.locals.thread;

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

        const quota = multiUserMode(response)
          ? await User.reserveChatQuota(user)
          : { allowed: true, reservationId: null };
        if (!quota.allowed) {
          writeQuotaExceeded(response, user);
          return;
        }
        quotaReservationId = quota.reservationId;

        setStreamHeaders(response);
        response.flushHeaders();

        const streamResult = await streamChatWithWorkspace(
          response,
          workspace,
          message,
          workspace?.chatMode,
          user,
          thread,
          attachments,
          typeof reasoningEffort === "string" ? reasoningEffort : null,
          quotaReservationId
        );
        if (streamResult?.quotaReservationTransferred)
          quotaReservationId = null;

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
          LLMSelection: process.env.LLM_PROVIDER || "openai",
          Embedder: process.env.EMBEDDING_ENGINE || "inherit",
          VectorDbSelection: process.env.VECTOR_DB || "lancedb",
          multiModal: Array.isArray(attachments) && attachments?.length !== 0,
          TTSSelection: process.env.TTS_PROVIDER || "native",
          LLMModel: getModelTag(),
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
        if (!response.headersSent) setStreamHeaders(response);
        writeResponseChunk(response, {
          id: uuidv4(),
          type: "abort",
          textResponse: null,
          sources: [],
          close: true,
          error: e.message,
        });
        response.end();
      } finally {
        if (quotaReservationId) {
          await User.releaseChatQuotaReservation(quotaReservationId).catch(
            (error) =>
              console.error("Failed to release chat quota reservation", error)
          );
        }
      }
    }
  );
}

module.exports = { chatEndpoints };
