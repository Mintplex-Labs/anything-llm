const {
  isSingleUserMode,
} = require("../../utils/middleware/multiUserProtected");
const { validatedRequest } = require("../../utils/middleware/validatedRequest");
const { GmailBridge } = require("../../utils/agents/aibitat/plugins/gmail/lib");
const {
  GoogleCalendarBridge,
} = require("../../utils/agents/aibitat/plugins/google-calendar/lib");

function googleAgentSkillEndpoints(app) {
  if (!app) return;

  app.get(
    "/admin/agent-skills/gmail/status",
    [validatedRequest, isSingleUserMode],
    async (_request, response) => {
      try {
        const config = await GmailBridge.getConfig();

        const hasDeploymentId = !!config.deploymentId;
        const hasApiKey = !!config.apiKey;
        const isConfigured = hasDeploymentId && hasApiKey;

        const safeConfig = {
          deploymentId: config.deploymentId || "",
          apiKey: hasApiKey ? "********" : "",
        };

        return response.status(200).json({
          success: true,
          isConfigured,
          config: safeConfig,
        });
      } catch (e) {
        console.error("Gmail status error:", e);
        response.status(500).json({ success: false, error: e.message });
      }
    }
  );

  app.get(
    "/admin/agent-skills/google-calendar/status",
    [validatedRequest, isSingleUserMode],
    async (_request, response) => {
      try {
        const config = await GoogleCalendarBridge.getConfig();

        const hasDeploymentId = !!config.deploymentId;
        const hasApiKey = !!config.apiKey;
        const isConfigured = hasDeploymentId && hasApiKey;

        const safeConfig = {
          deploymentId: config.deploymentId || "",
          apiKey: hasApiKey ? "********" : "",
        };

        return response.status(200).json({
          success: true,
          isConfigured,
          config: safeConfig,
        });
      } catch (e) {
        console.error("Google Calendar status error:", e);
        response.status(500).json({ success: false, error: e.message });
      }
    }
  );
}

module.exports = { googleAgentSkillEndpoints };
