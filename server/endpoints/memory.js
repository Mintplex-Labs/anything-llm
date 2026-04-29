const { Memory } = require("../models/memory");
const { SystemSettings } = require("../models/systemSettings");
const { userFromSession, reqBody } = require("../utils/http");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { validWorkspaceSlug } = require("../utils/middleware/validWorkspace");

async function memoryFeatureEnabled(_req, response, next) {
  const enabled = await SystemSettings.memoriesEnabled();
  if (!enabled)
    return response.status(403).json({ error: "Personalization is disabled." });
  next();
}

// Loads the memory by :memoryId and, in multi-user mode, scopes the query to the requester's userId.
// A memory owned by another user returns null here and is indistinguishable from "not found" — 404 either way.
async function validateMemoryOwner(request, response, next) {
  try {
    const clause = { id: Number(request.params.memoryId) };
    if (response.locals.multiUserMode) {
      const user = await userFromSession(request, response);
      clause.userId = user?.id ?? null;
    }

    const memory = await Memory.get(clause);
    if (!memory)
      return response.status(404).json({ error: "Memory not found." });

    next();
  } catch (e) {
    console.error(e);
    return response.sendStatus(500);
  }
}

function memoryEndpoints(app) {
  if (!app) return;

  app.get(
    "/workspaces/:slug/memories",
    [
      validatedRequest,
      flexUserRoleValid([ROLES.all]),
      memoryFeatureEnabled,
      validWorkspaceSlug,
    ],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const workspace = response.locals.workspace;

        const [globalMemories, workspaceMemories] = await Promise.all([
          Memory.globalForUser(user?.id),
          Memory.forUserWorkspace(user?.id, workspace.id),
        ]);
        response.status(200).json({
          memories: { global: globalMemories, workspace: workspaceMemories },
        });
      } catch (e) {
        console.error(e);
        return response.sendStatus(500);
      }
    }
  );

  app.post(
    "/workspaces/:slug/memories",
    [
      validatedRequest,
      flexUserRoleValid([ROLES.all]),
      memoryFeatureEnabled,
      validWorkspaceSlug,
    ],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const workspace = response.locals.workspace;
        const { content, scope = "workspace" } = reqBody(request);

        if (!content || !content.trim()) {
          return response.status(400).json({ error: "Content is required." });
        }

        const { memory, message } = await Memory.create({
          userId: user?.id,
          workspaceId: scope === "global" ? null : workspace.id,
          scope,
          content: content.trim(),
        });

        if (!memory) {
          return response.status(400).json({ error: message });
        }

        response.status(200).json({ memory });
      } catch (e) {
        console.error(e);
        return response.sendStatus(500);
      }
    }
  );

  app.put(
    "/memories/:memoryId",
    [
      validatedRequest,
      flexUserRoleValid([ROLES.all]),
      memoryFeatureEnabled,
      validateMemoryOwner,
    ],
    async (request, response) => {
      try {
        const memoryId = Number(request.params.memoryId);
        const { content } = reqBody(request);

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
        return response.sendStatus(500);
      }
    }
  );

  app.delete(
    "/memories/:memoryId",
    [
      validatedRequest,
      flexUserRoleValid([ROLES.all]),
      memoryFeatureEnabled,
      validateMemoryOwner,
    ],
    async (request, response) => {
      try {
        const memoryId = Number(request.params.memoryId);

        await Memory.delete(memoryId);
        response.status(200).json({ success: true });
      } catch (e) {
        console.error(e);
        return response.sendStatus(500);
      }
    }
  );

  app.post(
    "/memories/:memoryId/promote",
    [
      validatedRequest,
      flexUserRoleValid([ROLES.all]),
      memoryFeatureEnabled,
      validateMemoryOwner,
    ],
    async (request, response) => {
      try {
        const memoryId = Number(request.params.memoryId);

        const { memory, message } = await Memory.promoteToGlobal(memoryId);
        if (!memory) {
          return response.status(400).json({ error: message });
        }

        response.status(200).json({ memory });
      } catch (e) {
        console.error(e);
        return response.sendStatus(500);
      }
    }
  );

  app.post(
    "/memories/:memoryId/demote/:slug",
    [
      validatedRequest,
      flexUserRoleValid([ROLES.all]),
      memoryFeatureEnabled,
      validateMemoryOwner,
      validWorkspaceSlug,
    ],
    async (request, response) => {
      try {
        const memoryId = Number(request.params.memoryId);
        const targetWorkspace = response.locals.workspace;

        const { memory, message } = await Memory.demoteToWorkspace(
          memoryId,
          targetWorkspace.id
        );
        if (!memory) {
          return response.status(400).json({ error: message });
        }

        response.status(200).json({ memory });
      } catch (e) {
        console.error(e);
        return response.sendStatus(500);
      }
    }
  );
}

module.exports = { memoryEndpoints };
