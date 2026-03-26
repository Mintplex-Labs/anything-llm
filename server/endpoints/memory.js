const { Memory } = require("../models/memory");
const { userFromSession, reqBody } = require("../utils/http");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");

function memoryEndpoints(app) {
  if (!app) return;

  app.get(
    "/memories/:workspaceId",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const workspaceId = Number(request.params.workspaceId);
        const globalMemories = await Memory.globalForUser(user?.id);
        const workspaceMemories = await Memory.forUserWorkspace(
          user?.id,
          workspaceId
        );
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
    "/memories/:workspaceId",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const workspaceId = Number(request.params.workspaceId);
        const { content, scope = "workspace" } = reqBody(request);

        if (!content || !content.trim()) {
          response.status(400).json({ error: "Content is required." });
          return;
        }

        const { memory, message } = await Memory.create({
          userId: user?.id,
          workspaceId: scope === "global" ? null : workspaceId,
          scope,
          content: content.trim(),
        });

        if (!memory) {
          response.status(400).json({ error: message });
          return;
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
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const memoryId = Number(request.params.memoryId);
        const { content } = reqBody(request);

        if (!content || !content.trim()) {
          response.status(400).json({ error: "Content is required." });
          return;
        }

        const existing = await Memory.get({ id: memoryId });
        if (!existing || existing.userId !== user?.id) {
          response.status(404).json({ error: "Memory not found." });
          return;
        }

        const { memory, message } = await Memory.update(memoryId, {
          content: content.trim(),
        });

        if (!memory) {
          response.status(400).json({ error: message });
          return;
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
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const memoryId = Number(request.params.memoryId);

        const existing = await Memory.get({ id: memoryId });
        if (!existing || existing.userId !== user?.id) {
          response.status(404).json({ error: "Memory not found." });
          return;
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
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const memoryId = Number(request.params.memoryId);

        const existing = await Memory.get({ id: memoryId });
        if (!existing || existing.userId !== user?.id) {
          response.status(404).json({ error: "Memory not found." });
          return;
        }

        const { memory, message } = await Memory.promoteToGlobal(memoryId);
        if (!memory) {
          response.status(400).json({ error: message });
          return;
        }

        response.status(200).json({ memory });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/memories/clear/all",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        await Memory.deleteAllForUser(user?.id);
        response.status(200).json({ success: true });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );
}

module.exports = { memoryEndpoints };
