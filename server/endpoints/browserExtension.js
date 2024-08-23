const { Workspace } = require("../models/workspace");
const { BrowserExtensionApiKey } = require("../models/browserExtensionApiKey");
const { Document } = require("../models/documents");
const {
  validBrowserExtensionApiKey,
} = require("../utils/middleware/validBrowserExtensionApiKey");
const { CollectorApi } = require("../utils/collectorApi");
const { reqBody } = require("../utils/http");
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
        const workspaces = await Workspace.where();
        const apiKeyId = request.apiKey.id;
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
    async (request, response) => {
      try {
        const apiKeyId = request.apiKey.id;
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
        const workspaces = await Workspace.where();
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
        const workspace = await Workspace.get({ id: parseInt(workspaceId) });
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
          [documents[0].location]
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
        const { workspaceId, textContent, metadata } = reqBody(request);
        const workspace = await Workspace.get({ id: workspaceId });
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
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const apiKeys = await BrowserExtensionApiKey.where();
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
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const activeKeys = await BrowserExtensionApiKey.where();
        const MAX_ACTIVE_REGISTRATIONS = 3;
        if (activeKeys.length >= MAX_ACTIVE_REGISTRATIONS) {
          response.status(429).json({
            error:
              "Maximum number of active API keys reached. Revoke existing keys before creating new ones.",
          });
          return;
        }

        const { apiKey, error } = await BrowserExtensionApiKey.create();
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
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { id } = request.params;
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
