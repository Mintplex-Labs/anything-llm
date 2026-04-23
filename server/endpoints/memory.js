const { Memory } = require("../models/memory");
const { Workspace } = require("../models/workspace");
const { SystemSettings } = require("../models/systemSettings");
const { userFromSession, reqBody, multiUserMode } = require("../utils/http");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");

function ownerMatch(memory, user) {
  const memUserId = memory.userId ?? null;
  const reqUserId = user?.id ?? null;
  return memUserId === reqUserId;
}

async function memoryEnabled(_req, response, next) {
  const enabled =
    (await SystemSettings.getValueOrFallback(
      { label: "memory_enabled" },
      "off"
    )) === "on";
  if (!enabled)
    return response.status(403).json({ error: "Personalization is disabled." });
  next();
}

function memoryEndpoints(app) {
  if (!app) return;

  app.get(
    "/workspaces/:workspaceId/memories",
    [validatedRequest, flexUserRoleValid([ROLES.all]), memoryEnabled],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const workspaceId = Number(request.params.workspaceId);

        const workspace = multiUserMode(response)
          ? await Workspace.getWithUser(user, { id: workspaceId })
          : await Workspace.get({ id: workspaceId });
        if (!workspace) {
          return response.status(403).json({ error: "Invalid workspace." });
        }

        const [globalMemories, workspaceMemories] = await Promise.all([
          Memory.globalForUser(user?.id),
          Memory.forUserWorkspace(user?.id, workspaceId),
        ]);
        response.status(200).json({
          memories: { global: globalMemories, workspace: workspaceMemories },
        });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/workspaces/:workspaceId/memories",
    [validatedRequest, flexUserRoleValid([ROLES.all]), memoryEnabled],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const workspaceId = Number(request.params.workspaceId);
        const { content, scope = "workspace" } = reqBody(request);

        const workspace = multiUserMode(response)
          ? await Workspace.getWithUser(user, { id: workspaceId })
          : await Workspace.get({ id: workspaceId });
        if (!workspace) {
          return response.status(403).json({ error: "Invalid workspace." });
        }

        if (!content || !content.trim()) {
          return response.status(400).json({ error: "Content is required." });
        }

        const { memory, message } = await Memory.create({
          userId: user?.id,
          workspaceId: scope === "global" ? null : workspaceId,
          scope,
          content: content.trim(),
        });

        if (!memory) {
          return response.status(400).json({ error: message });
        }

        response.status(200).json({ memory });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.put(
    "/memories/:memoryId",
    [validatedRequest, flexUserRoleValid([ROLES.all]), memoryEnabled],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const memoryId = Number(request.params.memoryId);
        const { content } = reqBody(request);

        const existing = await Memory.get({ id: memoryId });
        if (!existing || !ownerMatch(existing, user)) {
          return response.status(404).json({ error: "Memory not found." });
        }

        if (!content || !content.trim()) {
          return response.status(400).json({ error: "Content is required." });
        }

        const { memory, message } = await Memory.update(memoryId, {
          content: content.trim(),
        });

        if (!memory) {
          return response.status(400).json({ error: message });
        }

        response.status(200).json({ memory });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/memories/:memoryId",
    [validatedRequest, flexUserRoleValid([ROLES.all]), memoryEnabled],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const memoryId = Number(request.params.memoryId);

        const existing = await Memory.get({ id: memoryId });
        if (!existing || !ownerMatch(existing, user)) {
          return response.status(404).json({ error: "Memory not found." });
        }

        await Memory.delete(memoryId);
        response.status(200).json({ success: true });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/memories/:memoryId/promote",
    [validatedRequest, flexUserRoleValid([ROLES.all]), memoryEnabled],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const memoryId = Number(request.params.memoryId);

        const existing = await Memory.get({ id: memoryId });
        if (!existing || !ownerMatch(existing, user)) {
          return response.status(404).json({ error: "Memory not found." });
        }

        const { memory, message } = await Memory.promoteToGlobal(memoryId);
        if (!memory) {
          return response.status(400).json({ error: message });
        }

        response.status(200).json({ memory });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/memories/:memoryId/demote",
    [validatedRequest, flexUserRoleValid([ROLES.all]), memoryEnabled],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const memoryId = Number(request.params.memoryId);
        const { workspaceId } = reqBody(request);

        const existing = await Memory.get({ id: memoryId });
        if (!existing || !ownerMatch(existing, user)) {
          return response.status(404).json({ error: "Memory not found." });
        }

        if (!workspaceId) {
          return response
            .status(400)
            .json({ error: "workspaceId is required." });
        }

        const targetWorkspace = multiUserMode(response)
          ? await Workspace.getWithUser(user, { id: Number(workspaceId) })
          : await Workspace.get({ id: Number(workspaceId) });
        if (!targetWorkspace) {
          return response.status(403).json({ error: "Invalid workspace." });
        }

        const { memory, message } = await Memory.demoteToWorkspace(
          memoryId,
          Number(workspaceId)
        );
        if (!memory) {
          return response.status(400).json({ error: message });
        }

        response.status(200).json({ memory });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );
}

module.exports = { memoryEndpoints };
