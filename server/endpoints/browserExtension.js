const { Workspace } = require("../models/workspace");
const { BrowserExtensionApiKey } = require("../models/browserExtensionApiKey");
const { Document } = require("../models/documents");
const {
  validBrowserExtensionApiKey,
} = require("../utils/middleware/validBrowserExtensionApiKey");
const { CollectorApi } = require("../utils/collectorApi");
const { reqBody } = require("../utils/http");

function browserExtensionEndpoints(app) {
  if (!app) return;

  app.get(
    "/browser-extension/check",
    [validBrowserExtensionApiKey],
    async (request, response) => {
      try {
        const workspaces = await Workspace.where();
        response.status(200).json({ connected: true, workspaces });
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
      const { apiKey, error } = await BrowserExtensionApiKey.create();
      if (error) throw new Error(error);
      response.status(200).json({ apiKey: apiKey.key });
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

  // TODO: Fix this, it always returns "Failed to embed content"
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
}

module.exports = { browserExtensionEndpoints };
