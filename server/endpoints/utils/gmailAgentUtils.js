const {
  isSingleUserMode,
} = require("../../utils/middleware/multiUserProtected");
const { validatedRequest } = require("../../utils/middleware/validatedRequest");
const { GmailBridge } = require("../../utils/agents/aibitat/plugins/gmail/lib");

function gmailAgentEndpoints(app) {
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
}

module.exports = { gmailAgentEndpoints };
