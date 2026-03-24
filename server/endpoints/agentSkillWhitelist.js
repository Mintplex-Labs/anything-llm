const { AgentSkillWhitelist } = require("../models/agentSkillWhitelist");
const { reqBody, userFromSession } = require("../utils/http");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");

function agentSkillWhitelistEndpoints(app) {
  if (!app) return;

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
