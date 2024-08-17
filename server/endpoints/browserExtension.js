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

const MAX_ACTIVE_REGISTRATIONS = 3;

function browserExtensionEndpoints(app) {
  if (!app) return;

  app.get(
    "/browser-extension/check",
    [validBrowserExtensionApiKey],
    async (request, response) => {
      try {
        const auth = request.header("Authorization");
        const bearerKey = auth ? auth.split(" ")[1] : null;
        const apiKey = await BrowserExtensionApiKey.get({ key: bearerKey });
        const workspaces = await Workspace.where();
        response.status(200).json({
          connected: true,
          workspaces,
          accepted: apiKey.accepted,
          verificationCode: apiKey.verificationCode,
        });
      } catch (error) {
        console.error(error);
        response
          .status(500)
          .json({ connected: false, error: "Failed to fetch workspaces" });
      }
    }
  );

  app.post("/browser-extension/register", async (request, response) => {
    try {
      const activeKeys = await BrowserExtensionApiKey.where({
        accepted: false,
      });
      if (activeKeys.length >= MAX_ACTIVE_REGISTRATIONS) {
        response.status(429).json({
          error: "Maximum number of active registrations reached",
        });
        return;
      }

      const { apiKey, error } = await BrowserExtensionApiKey.create();
      if (error) throw new Error(error);
      response.status(200).json({
        apiKey: apiKey.key,
        verificationCode: apiKey.verificationCode,
      });
    } catch (error) {
      console.error(error);
      response
        .status(500)
        .json({ error: "Failed to register browser extension" });
    }
  });

  app.post(
    "/browser-extension/unregister",
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
          .json({ error: "Failed to unregister browser extension" });
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

        const { failedToEmbed = [], errors = [] } = await Document.addDocuments(
          workspace,
          documents
        );

        if (failedToEmbed.length > 0) {
          response.status(500).json({ success: false, error: errors[0] });
          return;
        }

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
    "/browser-extension/api-keys/accept",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { key } = reqBody(request);
        const { success, apiKey, error } =
          await BrowserExtensionApiKey.accept(key);
        if (!success) throw new Error(error);
        response.status(200).json({ success: true, apiKey });
      } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Failed to accept API key" });
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
