const { Workspace } = require("../models/workspace");
const { BrowserExtensionApiKey } = require("../models/browserExtensionApiKey");
const { Document } = require("../models/documents");
const {
  validBrowserExtensionApiKey,
} = require("../utils/middleware/validBrowserExtensionApiKey");
const { CollectorApi } = require("../utils/collectorApi");
const { reqBody, multiUserMode, userFromSession } = require("../utils/http");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { Telemetry } = require("../models/telemetry");

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

module.exports = { browserExtensionEndpoints };
