const { Telemetry } = require("../../models/telemetry");
const { CollectorApi } = require("../../utils/collectorApi");
const {
  flexUserRoleValid,
  ROLES,
} = require("../../utils/middleware/multiUserProtected");
const { validatedRequest } = require("../../utils/middleware/validatedRequest");
const {
  isSupportedRepoProvider,
} = require("../../utils/middleware/isSupportedRepoProviders");

function extensionEndpoints(app) {
  if (!app) return;

  app.post(
    "/ext/:repo_platform/branches",
    [
      validatedRequest,
      flexUserRoleValid([ROLES.admin, ROLES.manager]),
      isSupportedRepoProvider,
    ],
    async (request, response) => {
      try {
        const { repo_platform } = request.params;
        const responseFromProcessor =
          await new CollectorApi().forwardExtensionRequest({
            endpoint: `/ext/${repo_platform}-repo/branches`,
            method: "POST",
            body: request.body,
          });
        response.status(200).json(responseFromProcessor);
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/ext/:repo_platform/repo",
    [
      validatedRequest,
      flexUserRoleValid([ROLES.admin, ROLES.manager]),
      isSupportedRepoProvider,
    ],
    async (request, response) => {
      try {
        const { repo_platform } = request.params;
        const responseFromProcessor =
          await new CollectorApi().forwardExtensionRequest({
            endpoint: `/ext/${repo_platform}-repo`,
            method: "POST",
            body: request.body,
          });
        await Telemetry.sendTelemetry("extension_invoked", {
          type: `${repo_platform}_repo`,
        });
        response.status(200).json(responseFromProcessor);
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/ext/youtube/transcript",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const responseFromProcessor =
          await new CollectorApi().forwardExtensionRequest({
            endpoint: "/ext/youtube-transcript",
            method: "POST",
            body: request.body,
          });
        await Telemetry.sendTelemetry("extension_invoked", {
          type: "youtube_transcript",
        });
        response.status(200).json(responseFromProcessor);
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/ext/confluence",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const responseFromProcessor =
          await new CollectorApi().forwardExtensionRequest({
            endpoint: "/ext/confluence",
            method: "POST",
            body: JSON.stringify(request.body),
          });
        await Telemetry.sendTelemetry("extension_invoked", {
          type: "confluence",
        });
        response.status(200).json(responseFromProcessor);
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );
  app.post(
    "/ext/website-depth",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const responseFromProcessor =
          await new CollectorApi().forwardExtensionRequest({
            endpoint: "/ext/website-depth",
            method: "POST",
            body: JSON.stringify(request.body),
          });
        await Telemetry.sendTelemetry("extension_invoked", {
          type: "website_depth",
        });
        response.status(200).json(responseFromProcessor);
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );
  app.post(
    "/ext/drupalwiki",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const responseFromProcessor =
          await new CollectorApi().forwardExtensionRequest({
            endpoint: "/ext/drupalwiki",
            method: "POST",
            body: JSON.stringify(request.body),
          });
        await Telemetry.sendTelemetry("extension_invoked", {
          type: "drupalwiki",
        });
        response.status(200).json(responseFromProcessor);
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/ext/obsidian/vault",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const responseFromProcessor =
          await new CollectorApi().forwardExtensionRequest({
            endpoint: "/ext/obsidian/vault",
            method: "POST",
            body: JSON.stringify(request.body),
          });
        await Telemetry.sendTelemetry("extension_invoked", {
          type: "obsidian_vault",
        });
        response.status(200).json(responseFromProcessor);
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/ext/webdav",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const responseFromProcessor =
          await new CollectorApi().forwardExtensionRequest({
            endpoint: "/ext/webdav",
            method: "POST",
            body: JSON.stringify(request.body),
          });
        await Telemetry.sendTelemetry("extension_invoked", {
          type: "webdav",
        });
        response.status(200).json(responseFromProcessor);
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/ext/webdav/test",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        console.log("WebDAV test request received:", { 
          url: request.body.url, 
          username: request.body.username,
          hasPassword: !!request.body.password
        });
        
        // Forward to collector with a 'test' action
        const responseFromProcessor = await new CollectorApi().forwardExtensionRequest({
          endpoint: "/ext/webdav/test",
          method: "POST",
          body: JSON.stringify(request.body),
        });
        
        console.log("WebDAV test response from collector:", responseFromProcessor);
        response.status(200).json(responseFromProcessor);
      } catch (e) {
        console.error("WebDAV test error:", e);
        response.status(500).json({ message: e.message || "WebDAV test failed." });
      }
    }
  );

  // WebDAV Settings endpoints
  app.get(
    "/ext/webdav/settings",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const { SystemSettings } = require("../../models/systemSettings");
        const settings = await SystemSettings.get({ label: "webdav_settings" });
        const parsedSettings = settings ? JSON.parse(settings.value) : {};
        
        // Don't return the password for security
        const { password, ...safeSettings } = parsedSettings;
        
        response.status(200).json({
          success: true,
          settings: safeSettings,
        });
      } catch (e) {
        console.error(e);
        response.status(500).json({ 
          success: false, 
          reason: e.message || "Failed to load WebDAV settings" 
        });
      }
    }
  );

  app.post(
    "/ext/webdav/settings",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const { SystemSettings } = require("../../models/systemSettings");
        const { url, username, password, path, recursive, fileTypes } = request.body;
        
        // Validate required fields
        if (!url || !username) {
          console.log("WebDAV settings validation failed:", { url: !!url, username: !!username });
          return response.status(400).json({
            success: false,
            reason: "URL and username are required",
          });
        }

        const settings = {
          url,
          username,
          password, // Store password for convenience (encrypted in database)
          path: path || "/",
          recursive: recursive !== undefined ? recursive : true,
          fileTypes: fileTypes || [],
        };

        await SystemSettings._updateSettings({
          webdav_settings: JSON.stringify(settings),
        });

        response.status(200).json({
          success: true,
        });
      } catch (e) {
        console.error(e);
        response.status(500).json({ 
          success: false, 
          reason: e.message || "Failed to save WebDAV settings" 
        });
      }
    }
  );
}

module.exports = { extensionEndpoints };
