const { AgentSkillConfig } = require("../models/agentSkillConfig");
const { isConfigurableSkill } = require("../utils/agents/defaults");
const { reqBody, safeJsonParse } = require("../utils/http");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { validWorkspaceSlug } = require("../utils/middleware/validWorkspace");

/**
 * Global rows have a null workspaceId. Skills with no row use their built-in default.
 * @param {number|null} workspaceId
 */
async function listConfigs(response, workspaceId = null) {
  const rows = await AgentSkillConfig.where({ workspaceId });
  return response.status(200).json({
    configs: rows.map((row) => ({
      ...row,
      config: safeJsonParse(row.config, null),
    })),
  });
}

/**
 * @param {number|null} workspaceId
 */
async function updateConfig(request, response, workspaceId = null) {
  const { skill, enabled, config } = reqBody(request);
  if (!isConfigurableSkill(skill))
    return response.status(400).json({ error: "Unknown agent skill." });

  const { config: row, error } = await AgentSkillConfig.upsert({
    skill,
    workspaceId,
    enabled,
    config,
  });
  if (error) return response.status(400).json({ error });
  return response.status(200).json({
    config: { ...row, config: safeJsonParse(row.config, null) },
  });
}

/**
 * @param {number|null} workspaceId
 */
async function deleteConfig(request, response, workspaceId = null) {
  const { skill } = request.params;
  if (!isConfigurableSkill(skill))
    return response.status(400).json({ error: "Unknown agent skill." });

  const success = await AgentSkillConfig.delete({ skill, workspaceId });
  return response.status(success ? 200 : 500).json({ success });
}

function agentSkillConfigEndpoints(app) {
  if (!app) return;

  app.get(
    "/agent-skills/configs",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (_request, response) => {
      try {
        return await listConfigs(response);
      } catch (e) {
        console.error(e);
        return response.sendStatus(500);
      }
    }
  );

  app.post(
    "/agent-skills/configs",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        return await updateConfig(request, response);
      } catch (e) {
        console.error(e);
        return response.sendStatus(500);
      }
    }
  );

  app.delete(
    "/agent-skills/configs/:skill",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        return await deleteConfig(request, response);
      } catch (e) {
        console.error(e);
        return response.sendStatus(500);
      }
    }
  );

  app.get(
    "/workspaces/:slug/agent-skills/configs",
    [
      validatedRequest,
      flexUserRoleValid([ROLES.admin, ROLES.manager]),
      validWorkspaceSlug,
    ],
    async (_request, response) => {
      try {
        return await listConfigs(response, response.locals.workspace.id);
      } catch (e) {
        console.error(e);
        return response.sendStatus(500);
      }
    }
  );

  app.post(
    "/workspaces/:slug/agent-skills/configs",
    [
      validatedRequest,
      flexUserRoleValid([ROLES.admin, ROLES.manager]),
      validWorkspaceSlug,
    ],
    async (request, response) => {
      try {
        return await updateConfig(
          request,
          response,
          response.locals.workspace.id
        );
      } catch (e) {
        console.error(e);
        return response.sendStatus(500);
      }
    }
  );

  app.delete(
    "/workspaces/:slug/agent-skills/configs/:skill",
    [
      validatedRequest,
      flexUserRoleValid([ROLES.admin, ROLES.manager]),
      validWorkspaceSlug,
    ],
    async (request, response) => {
      try {
        return await deleteConfig(
          request,
          response,
          response.locals.workspace.id
        );
      } catch (e) {
        console.error(e);
        return response.sendStatus(500);
      }
    }
  );
}

module.exports = { agentSkillConfigEndpoints };
