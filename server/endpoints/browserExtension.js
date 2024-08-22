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
        response.status(200).json({
          connected: true,
          workspaces,
        });
      } catch (error) {
        console.error(error);
        response
          .status(500)
          .json({ connected: false, error: "Failed to fetch workspaces" });
      }
    }
  );

  app.post(
    "/browser-extension/disconnect",
    [validBrowserExtensionApiKey],
    async (request, response) => {
      try {
        const auth = request.header("Authorization");
        const bearerKey = auth ? auth.split(" ")[1] : null;
        const { success, error } =
          await BrowserExtensionApiKey.delete(bearerKey);
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

  app.post(
    "/browser-extension/upload-link",
    [validBrowserExtensionApiKey],
    async (request, response) => {
      try {
        const Collector = new CollectorApi();
        const { link = "" } = reqBody(request);
        const processingOnline = await Collector.online();

        if (!processingOnline) {
          response
            .status(500)
            .json({
              success: false,
              error: `Document processing API is not online. Link ${link} will not be processed automatically.`,
            })
            .end();
          return;
        }

        const { success, reason } = await Collector.processLink(link);
        if (!success) {
          response.status(500).json({ success: false, error: reason }).end();
          return;
        }
        await Telemetry.sendTelemetry("browser_extension_link_uploaded");
        response.status(200).json({ success: true, error: null });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
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

  app.post(
    "/browser-extension/api-keys/revoke",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { key } = reqBody(request);
        const { success, error } = await BrowserExtensionApiKey.delete(key);
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
