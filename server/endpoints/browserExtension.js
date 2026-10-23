const { v4: uuidv4 } = require("uuid");
const { Workspace } = require("../models/workspace");
const { WorkspaceThread } = require("../models/workspaceThread");
const { BrowserExtensionApiKey } = require("../models/browserExtensionApiKey");
const { Document } = require("../models/documents");
const {
  validBrowserExtensionApiKey,
} = require("../utils/middleware/validBrowserExtensionApiKey");
const { CollectorApi } = require("../utils/collectorApi");
const {
  reqBody,
  multiUserMode,
  userFromSession,
  safeJsonParse,
} = require("../utils/http");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { Telemetry } = require("../models/telemetry");
const { User } = require("../models/user");
const { ApiChatHandler } = require("../utils/chats/apiChatHandler");
const { writeResponseChunk } = require("../utils/helpers/chat/responses");
const { WorkspaceChats } = require("../models/workspaceChats");
const {
  downloadGeneratedFile,
  serveGeneratedImage,
} = require("./agentFileServer");
const {
  BrowserExtensionEventListener,
  makeAgentInteractive,
  resolveClientReply,
} = require("../utils/browserExtension/interactiveAgent");
const { AgentSkillWhitelist } = require("../models/agentSkillWhitelist");

/** Pages per message; enough for a comparison without flooding the context window. */
const MAX_CONTEXT_PAGES = 5;
/** Characters kept per page, roughly 7k tokens, so five pages fit most models. */
const MAX_PAGE_CHARACTERS = 30_000;

function browserExtensionEndpoints(app) {
  if (!app) return;

  app.get(
    "/browser-extension/check",
    [validBrowserExtensionApiKey],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const workspaces = multiUserMode(response)
          ? await Workspace.whereWithUser(user)
          : await Workspace.where();

        const apiKeyId = response.locals.apiKey.id;
        response.status(200).json({
          connected: true,
          workspaces,
          apiKeyId,
        });
      } catch (error) {
        console.error(error);
        response
          .status(500)
          .json({ connected: false, error: "Failed to fetch workspaces" });
      }
    }
  );

  app.delete(
    "/browser-extension/disconnect",
    [validBrowserExtensionApiKey],
    async (_request, response) => {
      try {
        const apiKeyId = response.locals.apiKey.id;
        const { success, error } =
          await BrowserExtensionApiKey.delete(apiKeyId);
        if (!success) throw new Error(error);
        response.status(200).json({ success: true });
      } catch (error) {
        console.error(error);
        response
          .status(500)
          .json({ error: "Failed to disconnect and revoke API key" });
      }
    }
  );

  app.get(
    "/browser-extension/workspaces",
    [validBrowserExtensionApiKey],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const workspaces = multiUserMode(response)
          ? await Workspace.whereWithUser(user)
          : await Workspace.where();

        response.status(200).json({ workspaces });
      } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Failed to fetch workspaces" });
      }
    }
  );

  app.post(
    "/browser-extension/embed-content",
    [validBrowserExtensionApiKey],
    async (request, response) => {
      try {
        const { workspaceId, textContent, metadata } = reqBody(request);
        const user = await userFromSession(request, response);
        const workspace = multiUserMode(response)
          ? await Workspace.getWithUser(user, { id: parseInt(workspaceId) })
          : await Workspace.get({ id: parseInt(workspaceId) });

        if (!workspace) {
          response.status(404).json({ error: "Workspace not found" });
          return;
        }

        const Collector = new CollectorApi();
        const { success, reason, documents } = await Collector.processRawText(
          textContent,
          metadata
        );

        if (!success) {
          response.status(500).json({ success: false, error: reason });
          return;
        }

        const { failedToEmbed = [], errors = [] } = await Document.addDocuments(
          workspace,
          [documents[0].location],
          user?.id
        );

        if (failedToEmbed.length > 0) {
          response.status(500).json({ success: false, error: errors[0] });
          return;
        }

        await Telemetry.sendTelemetry("browser_extension_embed_content");
        response.status(200).json({ success: true });
      } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Failed to embed content" });
      }
    }
  );

  app.post(
    "/browser-extension/upload-content",
    [validBrowserExtensionApiKey],
    async (request, response) => {
      try {
        const { textContent, metadata } = reqBody(request);
        const Collector = new CollectorApi();
        const { success, reason } = await Collector.processRawText(
          textContent,
          metadata
        );

        if (!success) {
          response.status(500).json({ success: false, error: reason });
          return;
        }

        await Telemetry.sendTelemetry("browser_extension_upload_content");
        response.status(200).json({ success: true });
      } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Failed to embed content" });
      }
    }
  );

  // Side panel chats live in regular workspace threads so they show up in
  // the app and can be continued there.
  app.post(
    "/browser-extension/threads",
    [validBrowserExtensionApiKey],
    async (request, response) => {
      try {
        const { workspaceId } = reqBody(request);
        const user = await userFromSession(request, response);
        const workspace = multiUserMode(response)
          ? await Workspace.getWithUser(user, { id: parseInt(workspaceId) })
          : await Workspace.get({ id: parseInt(workspaceId) });
        if (!workspace)
          return response.status(403).json({ error: "Workspace not found" });

        const { thread, message } = await WorkspaceThread.new(
          workspace,
          user?.id ?? null
        );
        if (!thread) return response.status(500).json({ error: message });
        return response.status(200).json({ thread: { id: thread.id } });
      } catch (error) {
        console.error(error);
        return response.status(500).json({ error: "Failed to create thread" });
      }
    }
  );

  app.post(
    "/browser-extension/stream-chat",
    [validBrowserExtensionApiKey],
    async (request, response) => {
      try {
        const {
          workspaceId,
          threadId,
          message,
          context = [],
          attachments = [],
        } = reqBody(request);
        const user = await userFromSession(request, response);
        const workspace = multiUserMode(response)
          ? await Workspace.getWithUser(user, { id: parseInt(workspaceId) })
          : await Workspace.get({ id: parseInt(workspaceId) });
        if (!workspace)
          return response.status(403).json({ error: "Workspace not found" });

        const thread = Number.isInteger(Number(threadId))
          ? await WorkspaceThread.get({
              id: Number(threadId),
              workspace_id: workspace.id,
              user_id: user?.id ?? null,
            })
          : null;
        if (!thread)
          return response.status(404).json({ error: "Thread not found" });

        if (typeof message !== "string" || message.trim().length === 0)
          return response.status(400).json({ error: "Message is empty." });

        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Content-Type", "text/event-stream");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Connection", "keep-alive");
        response.flushHeaders();

        if (multiUserMode(response) && !(await User.canSendChat(user))) {
          writeResponseChunk(response, {
            id: uuidv4(),
            type: "abort",
            textResponse: null,
            sources: [],
            close: true,
            error: `You have met your maximum 24 hour chat quota of ${user.dailyMessageLimit} chats. Try again later.`,
          });
          return response.end();
        }

        const listener = new BrowserExtensionEventListener(response);
        await ApiChatHandler.streamChat({
          response,
          workspace,
          message,
          user,
          thread,
          attachments: Array.isArray(attachments) ? attachments : [],
          contextDocuments: pagesToContextDocuments(context),
          agentEventListener: listener,
          onAgentReady: (agentHandler) => {
            // Setting the agent up can take a while; a panel that already left
            // must not start a run nobody is listening to.
            if (response.destroyed)
              throw new Error("Client disconnected before the agent started.");
            makeAgentInteractive(agentHandler, listener, user?.id ?? null);
            // A panel that leaves while the agent waits on an answer ends the
            // run instead of parking it for the full timeout. Closing the
            // listener lets streamChat settle and save what the agent did.
            response.on("close", () => {
              if (response.writableFinished) return;
              agentHandler.aibitat?.abort();
              listener.close();
            });
          },
        });
        if (response.destroyed) await dropUnansweredReply(thread);
        await WorkspaceThread.autoRenameThread({
          thread,
          workspace,
          user,
          prompt: message,
        });
        await Telemetry.sendTelemetry("browser_extension_chat");
        response.end();
      } catch (error) {
        console.error(error);
        writeResponseChunk(response, {
          id: uuidv4(),
          type: "abort",
          textResponse: null,
          sources: [],
          close: true,
          error: error.message,
        });
        response.end();
      }
    }
  );

  // Answers a tool approval or clarifying question the agent asked mid-stream.
  app.post(
    "/browser-extension/agent-reply",
    [validBrowserExtensionApiKey],
    async (request, response) => {
      const { requestId, reply } = reqBody(request);
      const user = await userFromSession(request, response);
      const resolved = resolveClientReply(
        String(requestId),
        reply && typeof reply === "object" ? reply : {},
        user?.id ?? null
      );
      if (!resolved)
        return response
          .status(404)
          .json({ error: "No pending request with that id." });
      return response.status(200).json({ success: true });
    }
  );

  // "Always allow" on a tool approval card.
  app.post(
    "/browser-extension/agent-skills/whitelist",
    [validBrowserExtensionApiKey],
    async (request, response) => {
      try {
        const { skillName } = reqBody(request);
        if (typeof skillName !== "string" || !skillName.trim())
          return response.status(400).json({ error: "skillName is required" });
        const user = await userFromSession(request, response);
        const { success, error } = await AgentSkillWhitelist.add(
          skillName.trim(),
          user?.id ?? null
        );
        return response.status(success ? 200 : 400).json({ success, error });
      } catch (error) {
        console.error(error);
        return response.status(500).json({ error: error.message });
      }
    }
  );

  app.get(
    "/browser-extension/generated-files/:filename",
    [validBrowserExtensionApiKey],
    downloadGeneratedFile
  );

  app.get(
    "/browser-extension/generated-images/:filename",
    [validBrowserExtensionApiKey],
    serveGeneratedImage
  );

  // Internal endpoints for managing API keys
  app.get(
    "/browser-extension/api-keys",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const apiKeys = multiUserMode(response)
          ? await BrowserExtensionApiKey.whereWithUser(user)
          : await BrowserExtensionApiKey.where();

        response.status(200).json({ success: true, apiKeys });
      } catch (error) {
        console.error(error);
        response
          .status(500)
          .json({ success: false, error: "Failed to fetch API keys" });
      }
    }
  );

  app.post(
    "/browser-extension/api-keys/new",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const { apiKey, error } = await BrowserExtensionApiKey.create(
          user?.id || null
        );
        if (error) throw new Error(error);
        response.status(200).json({
          apiKey: apiKey.key,
        });
      } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Failed to create API key" });
      }
    }
  );

  app.delete(
    "/browser-extension/api-keys/:id",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const { id } = request.params;
        const user = await userFromSession(request, response);

        if (multiUserMode(response) && user.role !== ROLES.admin) {
          const apiKey = await BrowserExtensionApiKey.get({
            id: parseInt(id),
            user_id: user?.id,
          });
          if (!apiKey) {
            return response.status(403).json({ error: "Unauthorized" });
          }
        }

        const { success, error } = await BrowserExtensionApiKey.delete(id);
        if (!success) throw new Error(error);
        response.status(200).json({ success: true });
      } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Failed to revoke API key" });
      }
    }
  );
}

/**
 * Converts pages sent by the extension into documents injected as chat context.
 * The title and URL are kept in the content so the model can tell pages apart.
 * @param {{title?: string, url?: string, content?: string}[]} pages
 * @returns {{title: string, url: string, pageContent: string}[]}
 */
function pagesToContextDocuments(pages = []) {
  if (!Array.isArray(pages)) return [];
  return pages
    .slice(0, MAX_CONTEXT_PAGES)
    .map((page) => {
      const title = String(page?.title || "Untitled page");
      const url = String(page?.url || "");
      const content = String(page?.content || "").slice(0, MAX_PAGE_CHARACTERS);
      return {
        title,
        url,
        pageContent: content.trim()
          ? `Title: ${title}\nURL: ${url}\n\n${content}`
          : "",
      };
    })
    .filter((doc) => doc.pageContent);
}

/**
 * A panel that closes mid-run ends the agent before it replied, and the chat
 * handler still saves that turn. The reply without text is removed so the
 * thread in the app has no blank bubble and later messages do not see an
 * empty assistant turn in their history.
 * @param {import("@prisma/client").workspace_threads} thread
 */
async function dropUnansweredReply(thread) {
  const [chat] = await WorkspaceChats.where({ thread_id: thread.id }, 1, {
    id: "desc",
  });
  if (!chat || safeJsonParse(chat.response, {}).text) return;
  await WorkspaceChats.delete({ id: chat.id });
}

module.exports = { browserExtensionEndpoints };
