const {
  multiUserMode,
  userFromSession,
  reqBody,
  safeJsonParse,
} = require("../utils/http");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { Telemetry } = require("../models/telemetry");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { EventLogs } = require("../models/eventLogs");
const { WorkspaceThread } = require("../models/workspaceThread");
const {
  validWorkspaceSlug,
  validWorkspaceAndThreadSlug,
} = require("../utils/middleware/validWorkspace");
const { WorkspaceChats } = require("../models/workspaceChats");
const { convertToChatHistory } = require("../utils/helpers/chat/responses");

function workspaceThreadEndpoints(app) {
  if (!app) return;

  app.post(
    "/workspace/:slug/thread/new",
    [validatedRequest, flexUserRoleValid([ROLES.all]), validWorkspaceSlug],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const workspace = response.locals.workspace;
        const { thread, message } = await WorkspaceThread.new(
          workspace,
          user?.id
        );
        await Telemetry.sendTelemetry(
          "workspace_thread_created",
          {
            multiUserMode: multiUserMode(response),
            LLMSelection: process.env.LLM_PROVIDER || "openai",
            Embedder: process.env.EMBEDDING_ENGINE || "inherit",
            VectorDbSelection: process.env.VECTOR_DB || "lancedb",
            TTSSelection: process.env.TTS_PROVIDER || "native",
          },
          user?.id
        );

        await EventLogs.logEvent(
          "workspace_thread_created",
          {
            workspaceName: workspace?.name || "Unknown Workspace",
          },
          user?.id
        );
        response.status(200).json({ thread, message });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/workspace/:slug/threads",
    [validatedRequest, flexUserRoleValid([ROLES.all]), validWorkspaceSlug],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const workspace = response.locals.workspace;
        const threads = await WorkspaceThread.where({
          workspace_id: workspace.id,
          user_id: user?.id || null,
        });
        response.status(200).json({ threads });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/workspace/:slug/thread/:threadSlug",
    [
      validatedRequest,
      flexUserRoleValid([ROLES.all]),
      validWorkspaceAndThreadSlug,
    ],
    async (_, response) => {
      try {
        const thread = response.locals.thread;
        await WorkspaceThread.delete({ id: thread.id });
        response.sendStatus(200).end();
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/workspace/:slug/thread-bulk-delete",
    [validatedRequest, flexUserRoleValid([ROLES.all]), validWorkspaceSlug],
    async (request, response) => {
      try {
        const { slugs = [] } = reqBody(request);
        if (slugs.length === 0) return response.sendStatus(200).end();

        const user = await userFromSession(request, response);
        const workspace = response.locals.workspace;
        await WorkspaceThread.delete({
          slug: { in: slugs },
          user_id: user?.id ?? null,
          workspace_id: workspace.id,
        });
        response.sendStatus(200).end();
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/workspace/:slug/thread/:threadSlug/chats",
    [
      validatedRequest,
      flexUserRoleValid([ROLES.all]),
      validWorkspaceAndThreadSlug,
    ],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const workspace = response.locals.workspace;
        const thread = response.locals.thread;
        const history = await WorkspaceChats.where(
          {
            workspaceId: workspace.id,
            user_id: user?.id || null,
            thread_id: thread.id,
            api_session_id: null, // Do not include API session chats.
            include: true,
          },
          null,
          { id: "asc" }
        );

        response.status(200).json({ history: convertToChatHistory(history) });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/workspace/:slug/thread/:threadSlug/update",
    [
      validatedRequest,
      flexUserRoleValid([ROLES.all]),
      validWorkspaceAndThreadSlug,
    ],
    async (request, response) => {
      try {
        const data = reqBody(request);
        const currentThread = response.locals.thread;
        const { thread, message } = await WorkspaceThread.update(
          currentThread,
          data
        );
        response.status(200).json({ thread, message });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/workspace/:slug/thread/:threadSlug/delete-edited-chats",
    [
      validatedRequest,
      flexUserRoleValid([ROLES.all]),
      validWorkspaceAndThreadSlug,
    ],
    async (request, response) => {
      try {
        const { startingId } = reqBody(request);
        const user = await userFromSession(request, response);
        const workspace = response.locals.workspace;
        const thread = response.locals.thread;

        await WorkspaceChats.delete({
          workspaceId: Number(workspace.id),
          thread_id: Number(thread.id),
          user_id: user?.id,
          id: { gte: Number(startingId) },
        });

        response.sendStatus(200).end();
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/workspace/:slug/thread/:threadSlug/update-chat",
    [
      validatedRequest,
      flexUserRoleValid([ROLES.all]),
      validWorkspaceAndThreadSlug,
    ],
    async (request, response) => {
      try {
        const { chatId, newText = null } = reqBody(request);
        if (!newText || !String(newText).trim())
          throw new Error("Cannot save empty response");

        const user = await userFromSession(request, response);
        const workspace = response.locals.workspace;
        const thread = response.locals.thread;
        const existingChat = await WorkspaceChats.get({
          workspaceId: workspace.id,
          thread_id: thread.id,
          user_id: user?.id,
          id: Number(chatId),
        });
        if (!existingChat) throw new Error("Invalid chat.");

        const chatResponse = safeJsonParse(existingChat.response, null);
        if (!chatResponse) throw new Error("Failed to parse chat response");

        await WorkspaceChats._update(existingChat.id, {
          response: JSON.stringify({
            ...chatResponse,
            text: String(newText),
          }),
        });

        response.sendStatus(200).end();
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );
}

module.exports = { workspaceThreadEndpoints };
