const { AgentSkillConfig } = require("../models/agentSkillConfig");
const { Workspace } = require("../models/workspace");
const { User } = require("../models/user");
const {
  agentSkillStates,
  isConfigurableSkill,
  maskSkillConfig,
} = require("../utils/agents/defaults");
const {
  reqBody,
  safeJsonParse,
  userFromSession,
  multiUserMode,
} = require("../utils/http");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { validWorkspaceSlug } = require("../utils/middleware/validWorkspace");
const { validCanModify } = require("../utils/helpers/admin");

/**
 * Format a row for the UI with its config parsed and secrets masked.
 * @param {import("../models/agentSkillConfig").AgentSkillConfigRow} row
 */
function presentRow(row) {
  return {
    ...row,
    config: maskSkillConfig(row.skill, safeJsonParse(row.config, null)),
  };
}

/**
 * Validate and look up the workspace or user an admin config targets.
 * Sends the error response and returns null when the target is invalid or missing.
 * @param {{workspaceId?: number|string|null, userId?: number|string|null}} ids
 * @returns {Promise<{workspaceId: number|null, userId: number|null}|null>}
 */
async function adminTarget(request, response, ids = {}) {
  let target;
  try {
    target = AgentSkillConfig.validations.target(ids);
  } catch (e) {
    response.status(400).json({ error: e.message });
    return null;
  }

  if (target.workspaceId) {
    const user = await userFromSession(request, response);
    const workspace = multiUserMode(response)
      ? await Workspace.getWithUser(user, { id: target.workspaceId })
      : await Workspace.get({ id: target.workspaceId });
    if (!workspace) {
      response.status(403).json({ error: "Workspace not found." });
      return null;
    }
  }

  if (target.userId) {
    const user = multiUserMode(response)
      ? await User.get({ id: target.userId })
      : null;
    if (!user) {
      response.status(404).json({ error: "User not found." });
      return null;
    }

    const { valid, error } = validCanModify(
      await userFromSession(request, response),
      user
    );
    if (!valid) {
      response.status(403).json({ error });
      return null;
    }
  }

  return { workspaceId: target.workspaceId, userId: target.userId };
}

/**
 * Personal configs only exist in multi-user mode, where every request has a user.
 * Sends the error response and returns null otherwise.
 * @returns {Promise<{userId: number, personal: true}|null>}
 */
async function personalTarget(request, response) {
  const user = multiUserMode(response)
    ? await userFromSession(request, response)
    : null;
  if (!user) {
    response
      .status(403)
      .json({ error: "Personal skill configs require multi-user mode." });
    return null;
  }
  return { userId: user.id, personal: true };
}

async function updateConfig(request, response, target) {
  const { skill, enabled, config } = reqBody(request);
  if (!isConfigurableSkill(skill))
    return response.status(400).json({ error: "Unknown agent skill." });

  const { config: row, error } = await AgentSkillConfig.upsert({
    skill,
    target,
    enabled,
    config,
  });
  if (error) return response.status(400).json({ error });
  return response.status(200).json({ config: presentRow(row) });
}

async function deleteConfig(request, response, target) {
  const { skill } = request.params;
  if (!isConfigurableSkill(skill))
    return response.status(400).json({ error: "Unknown agent skill." });

  const success = await AgentSkillConfig.delete({ skill, target });
  return response.status(success ? 200 : 500).json({ success });
}

function agentSkillConfigEndpoints(app) {
  if (!app) return;

  app.get(
    "/agent-skills/configs",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (_request, response) => {
      try {
        const rows = await AgentSkillConfig.where({ personal: false });
        return response.status(200).json({ configs: rows.map(presentRow) });
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
        const { workspaceId, userId } = reqBody(request);
        const target = await adminTarget(request, response, {
          workspaceId,
          userId,
        });
        if (!target) return;
        return await updateConfig(request, response, target);
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
        const { workspaceId, userId } = request.query;
        const target = await adminTarget(request, response, {
          workspaceId,
          userId,
        });
        if (!target) return;
        return await deleteConfig(request, response, target);
      } catch (e) {
        console.error(e);
        return response.sendStatus(500);
      }
    }
  );

  app.post(
    "/workspaces/:slug/agent-skills/personal",
    [validatedRequest, flexUserRoleValid([ROLES.all]), validWorkspaceSlug],
    async (request, response) => {
      try {
        const target = await personalTarget(request, response);
        if (!target) return;

        const { skill, config } = reqBody(request);
        const state = (
          await agentSkillStates({
            workspace: response.locals.workspace,
            user: { id: target.userId },
          })
        ).find((state) => state.skill === skill);
        if (!state?.available)
          return response
            .status(403)
            .json({ error: "This skill is not available to you." });
        if (config !== undefined && state.sharedConfig)
          return response
            .status(403)
            .json({ error: "This skill is configured by an admin." });

        return await updateConfig(request, response, target);
      } catch (e) {
        console.error(e);
        return response.sendStatus(500);
      }
    }
  );

  app.delete(
    "/agent-skills/personal/:skill",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      try {
        const target = await personalTarget(request, response);
        if (!target) return;
        return await deleteConfig(request, response, target);
      } catch (e) {
        console.error(e);
        return response.sendStatus(500);
      }
    }
  );

  app.get(
    "/workspaces/:slug/agent-skills",
    [validatedRequest, flexUserRoleValid([ROLES.all]), validWorkspaceSlug],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const canManage =
          !multiUserMode(response) ||
          [ROLES.admin, ROLES.manager].includes(user?.role);
        const states = await agentSkillStates({
          workspace: response.locals.workspace,
          user,
        });

        return response.status(200).json({
          skills: states
            .filter((state) => canManage || state.available)
            .map(({ sharedConfig, personalConfig, ...state }) => ({
              ...state,
              hasSharedConfig: !!sharedConfig,
              personalConfig: maskSkillConfig(state.skill, personalConfig),
            })),
        });
      } catch (e) {
        console.error(e);
        return response.sendStatus(500);
      }
    }
  );
}

module.exports = { agentSkillConfigEndpoints };
