const { AgentSkillWhitelist } = require("../models/agentSkillWhitelist");
const { reqBody, userFromSession } = require("../utils/http");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");

function agentSkillWhitelistEndpoints(app) {
  if (!app) return;

  app.get(
    "/agent-skills/filesystem-agent/is-available",
    [validatedRequest],
    async (_request, response) => {
      try {
        const filesystemTool = require("../utils/agents/aibitat/plugins/filesystem/lib");
        return response
          .status(200)
          .json({ available: filesystemTool.isToolAvailable() });
      } catch (e) {
        console.error(e);
        return response
          .status(500)
          .json({ available: false, error: e.message });
      }
    }
  );

  app.post(
    "/agent-skills/whitelist/add",
    [validatedRequest, flexUserRoleValid(ROLES.all)],
    async (request, response) => {
      try {
        const { skillName } = reqBody(request);
        if (!skillName) {
          response
            .status(400)
            .json({ success: false, error: "Missing skillName" });
          return;
        }

        const user = await userFromSession(request, response);
        if (!user && response.locals?.multiUserMode) {
          return response
            .status(401)
            .json({ success: false, error: "Unauthorized" });
        }

        const userId = user?.id || null;
        const { success, error } = await AgentSkillWhitelist.add(
          skillName,
          userId
        );
        return response.status(success ? 200 : 400).json({ success, error });
      } catch (e) {
        console.error(e);
        return response.status(500).json({ success: false, error: e.message });
      }
    }
  );
}

module.exports = { agentSkillWhitelistEndpoints };
